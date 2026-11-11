import { describe, expect, it } from "vitest";
import { detectLang, estimateText, fallbackReply, hasBuyingIntent, isSmallTalk } from "./chatFallback";
import { estimateFor } from "./solarCalc";

describe("detectLang", () => {
  it("detects English, Roman Urdu and Urdu script", () => {
    expect(detectLang("How many panels do I need?")).toBe("en");
    expect(detectLang("Mujhe kitne panels chahiye?")).toBe("roman");
    expect(detectLang("مجھے کتنے پینل چاہئیں؟")).toBe("ur");
  });
});

describe("fallbackReply", () => {
  it("answers greetings in the same style and language", () => {
    expect(fallbackReply("hello").text).toMatch(/^Hello!/);
    expect(fallbackReply("Good morning").text).toMatch(/^Hello!/);
    expect(fallbackReply("Assalam o alaikum").text).toMatch(/^Wa alaikum assalam/);
    expect(fallbackReply("السلام علیکم").text).toMatch(/^وعلیکم السلام/);
  });

  it("starts the estimate flow for panel and savings questions", () => {
    expect(fallbackReply("How many panels do I need?").action).toBe("estimate");
    expect(fallbackReply("How much can I save?").action).toBe("estimate");
    expect(fallbackReply("Mujhe kitne panels chahiye?")).toMatchObject({ action: "estimate" });
    expect(fallbackReply("Mujhe kitne panels chahiye?").text).toMatch(/Zaroor/);
  });

  it("covers the quick reply topics", () => {
    expect(fallbackReply("Pros and cons of solar").text).toMatch(/\*\*Pros\*\*[\s\S]*\*\*Cons\*\*/);
    expect(fallbackReply("Net metering explained").text).toMatch(/credited on your bill/);
    expect(fallbackReply("Installment options").text).toMatch(/12 to 36 months/);
    expect(fallbackReply("Book a free assessment").action).toBe("lead");
  });

  it("answers hours, contact, financing and grid questions from site content", () => {
    expect(fallbackReply("What are your opening hours?").text).toMatch(/Monday to Friday: 9:00 am to 6:00 pm/);
    expect(fallbackReply("What is your whatsapp number?").text).toMatch(/\+923057707321/);
    expect(fallbackReply("on-grid or hybrid?").text).toMatch(/On-grid/);
    expect(fallbackReply("How long does installation take?").text).toMatch(/one to three days/);
  });

  it("answers general panel questions instead of opening the estimate form", () => {
    const en = fallbackReply("tell me about solar panels");
    expect(en.action).toBeUndefined();
    expect(en.text).toMatch(/turn sunlight into electricity/);

    const roman = fallbackReply("solar panel ka kaam kiya h");
    expect(roman.action).toBeUndefined();
    expect(roman.text).toMatch(/^Solar panels dhoop/);
    expect(detectLang("solar panel ka kaam kiya h")).toBe("roman");

    expect(fallbackReply("what is an inverter?").action).toBeUndefined();
    expect(fallbackReply("How many panels for my home?").action).toBe("estimate");
    expect(fallbackReply("what size system do I need").action).toBe("estimate");
  });

  it("acknowledges short replies like ok instead of saying it is not sure", () => {
    expect(fallbackReply("ok").text).toMatch(/^Great!/);
    expect(fallbackReply("Okay.").text).toMatch(/^Great!/);
    expect(fallbackReply("theek hai").text).toMatch(/^Theek hai!/);
    expect(fallbackReply("ٹھیک ہے").text).toMatch(/^ٹھیک ہے!/);
  });

  it("answers how are you small talk in the same language", () => {
    expect(fallbackReply("kia haal h").text).toMatch(/^Main bilkul theek hoon/);
    expect(fallbackReply("kya haal hai").text).toMatch(/^Main bilkul theek hoon/);
    expect(fallbackReply("aap kaise ho?").text).toMatch(/^Main bilkul theek hoon/);
    expect(fallbackReply("How are you?").text).toMatch(/^I’m doing well/);
    expect(fallbackReply("کیا حال ہے").text).toMatch(/^میں بالکل ٹھیک ہوں/);
  });

  it("asks again for short unclear messages instead of saying it is not sure", () => {
    expect(fallbackReply("sia h").text).toMatch(/^Maaf kijiye, main samajh nahi paya/);
    expect(fallbackReply("asdf").text).toMatch(/^Sorry, I didn’t quite catch that/);
  });

  it("never quotes a price and offers the lead form instead", () => {
    const r = fallbackReply("What is the price of a 5 kW system?");
    expect(r.action).toBe("lead");
    expect(r.text).toMatch(/custom quote/);
  });

  it("falls back to a helpful default with WhatsApp", () => {
    const r = fallbackReply("Who won the cricket match?");
    expect(r.action).toBeUndefined();
    expect(r.text).toMatch(/WhatsApp/);
  });

  it("uses no em dashes in any reply", () => {
    const inputs = ["hi", "salam", "panels", "pros", "net metering", "hybrid", "emi", "warranty", "cleaning", "hours", "contact", "packages", "price", "quote", "random"];
    for (const i of inputs) expect(fallbackReply(i).text).not.toMatch(/—/);
  });
});

describe("isSmallTalk", () => {
  it("spots messages that are only greetings, how are you, thanks or ok", () => {
    for (const t of ["hi", "Hello!", "salam", "Assalam o alaikum", "kia haal h", "hi, how are you?", "thanks", "ok", "السلام علیکم", "کیا حال ہے؟"]) {
      expect(isSmallTalk(t)).toBe(true);
    }
  });

  it("sends real questions to the AI, even when they start with a greeting", () => {
    for (const t of ["salam! net metering kya hai?", "hi, how many panels do I need?", "what is net metering", "ok so what about batteries", "سولر پینل کیا ہے"]) {
      expect(isSmallTalk(t)).toBe(false);
    }
  });
});

describe("hasBuyingIntent", () => {
  it("spots quotes, prices, assessments and installation requests", () => {
    expect(hasBuyingIntent("Can I get a quote?")).toBe(true);
    expect(hasBuyingIntent("I want to install solar")).toBe(true);
    expect(hasBuyingIntent("solar lagwana hai")).toBe(true);
    expect(hasBuyingIntent("Installment options")).toBe(false);
    expect(hasBuyingIntent("What is net metering?")).toBe(false);
  });
});

describe("estimateText", () => {
  it("quotes the calculator numbers for the offline estimate form", () => {
    const e = estimateFor({ location: "Lahore", currency: "PKR", monthlyBill: 40000, roofSqFt: 1500 });
    const text = estimateText(e);
    expect(text).toContain(`${e.systemKw} kW`);
    expect(text).toContain(`${e.panels} panels`);
    expect(text).toMatch(/Rs [\d,]+/);
    expect(text).toMatch(/estimates only/i);
  });
});
