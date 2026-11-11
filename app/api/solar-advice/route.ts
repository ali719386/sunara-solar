import { ApiError } from "@google/genai";
import { NextResponse } from "next/server";
import { currencies, inputLimits, type CurrencyCode, type TipKey } from "@/lib/solarConfig";
import { clamp } from "@/lib/solarCalc";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { baseConfig, gemini, GEMINI_MODEL, hasGeminiKey } from "@/lib/gemini";

export const runtime = "nodejs";

const SYSTEM_PROMPT =
  "You are a friendly solar advisor for SUNARA. Using ONLY the numbers given, write 3 short sentences: what system size suits this home, how much they save, and one practical tip for their location (California: time-of-use rates and batteries; Texas: summer AC peak; Florida: year round cooling and hurricane rated mounting; UK: low winter output so batteries help; Australia: low export payments so self consumption and batteries help; Pakistan: exported units earn less than grid units so daytime use saves most; India: ask about rooftop subsidy schemes; otherwise: confirm local rate and sun hours at the assessment). Do not invent numbers. No guarantees. Plain text only.";

const TIP_KEYS: TipKey[] = ["ca", "tx", "fl", "uk", "au", "pk", "in", "gen"];

// 10 requests per minute per IP.
const rateLimited = createRateLimiter(10);

const toNum = (v: unknown, min: number, max: number) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? clamp(n, min, max) : min;
};

type Facts = {
  location: string;
  currency: CurrencyCode;
  roofSqFt: number;
  bill: number;
  systemWatts: number;
  panels: number;
  newBill: number;
  yearlySavings: number;
  tip: TipKey;
};

/** Validates and clamps the request body; returns null when it is unusable. */
function parseBody(body: unknown): Facts | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const currency = b.currency as CurrencyCode;
  if (typeof currency !== "string" || !(currency in currencies)) return null;
  const tip = TIP_KEYS.includes(b.tip as TipKey) ? (b.tip as TipKey) : "gen";
  // Keep the place name short and free of control characters before it reaches the prompt.
  const location = typeof b.location === "string" ? b.location.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 60) : "";
  const billMax = currencies[currency].bill.max * 2;
  return {
    location: location || "an unspecified location",
    currency,
    roofSqFt: Math.round(toNum(b.roofSqFt, inputLimits.roof.min, inputLimits.roof.max)),
    bill: Math.round(toNum(b.bill, 0, billMax)),
    systemWatts: Math.round(toNum(b.systemWatts, 0, 200_000)),
    panels: Math.round(toNum(b.panels, 0, 500)),
    newBill: Math.round(toNum(b.newBill, 0, billMax)),
    yearlySavings: Math.round(toNum(b.yearlySavings, 0, billMax * 12)),
    tip,
  };
}

export async function POST(req: Request) {
  if (!hasGeminiKey()) {
    return NextResponse.json({ error: "AI advice is not configured" }, { status: 503 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let facts: Facts | null = null;
  try {
    facts = parseBody(await req.json());
  } catch {
    facts = null;
  }
  if (!facts) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const symbol = currencies[facts.currency].symbol;
  const userMessage = [
    `Location: ${facts.location}`,
    `Location tip key: ${facts.tip}`,
    `Currency: ${facts.currency} (symbol "${symbol.trim()}")`,
    `Roof area: ${facts.roofSqFt} sq ft`,
    `Current monthly bill: ${symbol}${facts.bill}`,
    `Recommended system: ${facts.systemWatts} W (${(facts.systemWatts / 1000).toFixed(1)} kW), ${facts.panels} panels of 400 W`,
    `Estimated new monthly bill: ${symbol}${facts.newBill}`,
    `Estimated yearly savings: ${symbol}${facts.yearlySavings}`,
  ].join("\n");

  try {
    const response = await gemini().models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        ...baseConfig,
        systemInstruction: SYSTEM_PROMPT,
        // Gemini's thinking tokens count toward this limit too; the prompt keeps the reply to 3 sentences.
        maxOutputTokens: 1024,
        // Stop when the visitor changes inputs (request aborted) or after 15 seconds.
        abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(15_000)]),
      },
    });
    const text = (response.text ?? "").replace(/\s+/g, " ").trim();
    if (!text) return NextResponse.json({ error: "No advice returned" }, { status: 502 });
    return NextResponse.json({ advice: text });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`solar-advice: Gemini API error ${error.status}`);
      if (error.status === 429) return NextResponse.json({ error: "AI is busy" }, { status: 429 });
    } else if (!req.signal.aborted) {
      console.error("solar-advice: request failed", error instanceof Error ? error.name : error);
    }
    return NextResponse.json({ error: "AI advice unavailable" }, { status: 502 });
  }
}
