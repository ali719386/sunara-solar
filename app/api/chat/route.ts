import { ApiError, type Content, type FunctionCall, type FunctionDeclaration, type Part } from "@google/genai";
import { NextResponse } from "next/server";
import { chatKnowledge } from "@/lib/chatKnowledge";
import { CHAT_ERROR_SENTINEL, validateChatBody } from "@/lib/chatValidation";
import { baseConfig, gemini, GEMINI_MODEL, hasGeminiKey } from "@/lib/gemini";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { estimateFor, formatMoney } from "@/lib/solarCalc";
import { currencies, currencyCodes, type CurrencyCode } from "@/lib/solarConfig";

export const runtime = "nodejs";

// Gemini's thinking tokens count toward this limit too; the prompt keeps replies under 120 words.
const MAX_OUTPUT_TOKENS = 1500;
const TIMEOUT_MS = 15_000;
/** Give up early when Gemini has not started answering (or asked for the estimate tool) by then. */
const FIRST_TOKEN_MS = 8_000;
const MAX_TOOL_ROUNDS = 3;

const SYSTEM_PROMPT = `You are SUNARA Assistant, a friendly, concise solar advisor for SUNARA, a solar company in Pakistan.

Rules:
- Use ONLY the knowledge base below and the estimate_solar tool results for company facts. If something is not in the knowledge base (exact prices, stock, delivery dates, legal or tax advice), say you are not sure and offer the free roof assessment or WhatsApp.
- Never invent numbers, never guarantee savings, never promise subsidies or incentives.
- Talk about bills, savings and prices in US dollars (USD) unless the user clearly uses another currency.
- Stay on topic (solar, energy, SUNARA). Politely decline unrelated requests. Small talk such as "how are you" is fine: answer briefly and steer back to solar.
- Be honest about cons. Do not oversell.
- Ask at most one question at a time.
- For panel count or savings, ask for location, monthly bill and roof size (one at a time if missing), then call estimate_solar. Present the results as estimates and quote the exact numbers the tool returns, using its formatted values.
- Reply in the user's language and script: English, Urdu (Urdu script) or Roman Urdu. Respond naturally to greetings such as hello, hi, salam or assalam o alaikum in the same style.
- Keep answers under 120 words unless the user asks for detail. Use simple markdown only: **bold**, short "- " lists and [links](/path). No headings, no tables, no em dashes.
- When the user wants a quote, price, assessment or installation, offer to take their name, phone and location so the team can contact them on WhatsApp.

<knowledge_base>
${chatKnowledge}
</knowledge_base>`;

const ESTIMATE_TOOL: FunctionDeclaration = {
  name: "estimate_solar",
  description:
    "Estimate solar system size, panel count and savings for a home using SUNARA's savings calculator. Call it once you know the user's location, monthly bill and roof size. Returns exact figures to quote as estimates.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      location: { type: "string", description: "City, state or country, e.g. Lahore" },
      currency: { type: "string", enum: currencyCodes, description: "Currency of the bill. USD unless the user clearly uses another currency." },
      monthlyBill: { type: "number", description: "Average monthly electricity bill in that currency" },
      roofSqFt: { type: "number", description: "Roof area in square feet (300 to 6000)" },
      ratePerKwh: { type: "number", description: "Optional electricity rate per kWh, if the user gave it" },
      sunHours: { type: "number", description: "Optional peak sun hours per day, if the user gave it" },
    },
    required: ["location", "currency", "monthlyBill", "roofSqFt"],
  },
};

/** Runs the shared calculator (same presets as the savings section). Arguments come from the model, so they are clamped. */
function runEstimate(input: unknown) {
  const i = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const currency = (typeof i.currency === "string" && i.currency.toUpperCase() in currencies
    ? i.currency.toUpperCase()
    : "USD") as CurrencyCode;
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);
  const e = estimateFor({
    location: typeof i.location === "string" ? i.location : "",
    currency,
    monthlyBill: n(i.monthlyBill),
    roofSqFt: n(i.roofSqFt),
    ratePerKwh: n(i.ratePerKwh) || undefined,
    sunHours: n(i.sunHours) || undefined,
  });
  const m = (v: number) => formatMoney(v, e.currency);
  return {
    systemWatts: e.systemWatts,
    systemKw: e.systemKw,
    panels: e.panels,
    panelWatts: 400,
    monthlySavings: m(e.monthlySavings),
    yearlySavings: m(e.yearlySavings),
    newBill: m(e.newBill),
    paybackYears: e.paybackYears,
    roofLimited: e.roofLimited,
    assumptions: `${e.presetUsed ? "Typical local" : "Default"} rate of ${e.ratePerKwh} ${e.currency} per kWh and ${e.sunHours} sun hours a day`,
  };
}

// 15 requests per minute per IP.
const rateLimited = createRateLimiter(15);

/** Lets the widget know whether the AI is configured, without exposing anything else. */
export function GET() {
  return NextResponse.json({ ai: hasGeminiKey() });
}

export async function POST(req: Request) {
  if (!hasGeminiKey()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "rate_limited", message: "I’m getting a lot of questions right now. Please try again in a minute." },
      { status: 429 }
    );
  }

  let messages: ReturnType<typeof validateChatBody> = null;
  try {
    messages = validateChatBody(await req.json());
  } catch {
    messages = null;
  }
  if (!messages) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  // Gemini calls the assistant role "model".
  const contents: Content[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Stop on whichever comes first: the visitor leaving (request aborted), the 15 second limit,
  // or no progress within FIRST_TOKEN_MS (so the widget answers locally instead of waiting).
  const stalled = new AbortController();
  const stallTimer = setTimeout(() => stalled.abort(), FIRST_TOKEN_MS);
  const signal = AbortSignal.any([req.signal, AbortSignal.timeout(TIMEOUT_MS), stalled.signal]);
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      const write = (text: string) => {
        if (!text) return;
        if (!sent) clearTimeout(stallTimer);
        sent = true;
        controller.enqueue(encoder.encode(text));
      };

      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const stream = await gemini().models.generateContentStream({
            model: GEMINI_MODEL,
            contents,
            config: {
              ...baseConfig,
              systemInstruction: SYSTEM_PROMPT,
              maxOutputTokens: MAX_OUTPUT_TOKENS,
              abortSignal: signal,
              // After the last allowed round, stop offering the tool so the model answers in text.
              ...(round < MAX_TOOL_ROUNDS ? { tools: [{ functionDeclarations: [ESTIMATE_TOOL] }] } : {}),
            },
          });

          // Keep every part the model sent (including thought signatures) so the tool round trip is valid.
          const modelParts: Part[] = [];
          const calls: FunctionCall[] = [];
          for await (const chunk of stream) {
            for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
              modelParts.push(part);
              if (part.functionCall) {
                // A tool call is progress too; the overall 15 second limit still applies.
                clearTimeout(stallTimer);
                calls.push(part.functionCall);
              } else if (part.text && !part.thought) write(part.text);
            }
          }

          if (!calls.length) break;
          if (sent) write("\n\n");
          contents.push({ role: "model", parts: modelParts });
          contents.push({
            role: "user",
            parts: calls.map((call) => ({
              functionResponse: {
                id: call.id,
                name: call.name,
                response:
                  call.name === ESTIMATE_TOOL.name ? { output: runEstimate(call.args) } : { error: `Unknown tool ${call.name}` },
              },
            })),
          });
        }
        if (!sent) write(CHAT_ERROR_SENTINEL);
      } catch (error) {
        if (error instanceof ApiError) console.error(`chat: Gemini API error ${error.status}`);
        else if (stalled.signal.aborted && !sent) console.error(`chat: Gemini did not start answering within ${FIRST_TOKEN_MS / 1000}s`);
        else if (!req.signal.aborted) console.error("chat: request failed", error instanceof Error ? error.name : error);
        if (!sent) write(CHAT_ERROR_SENTINEL);
        else write("\n\nSorry, I lost my connection there. You can ask again, or chat with our team on WhatsApp.");
      } finally {
        clearTimeout(stallTimer);
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
