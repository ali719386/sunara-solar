// Keyword based replies for SUNARA Assistant when the AI is not configured or unavailable.
// Facts come from the site content so they stay in line with the pages.

import { benefits, contact, emi, packagesPage, unitsForKw, usdBillForKw } from "./content";
import { formatMoney, type EstimateSummary } from "./solarCalc";

export type Lang = "en" | "roman" | "ur";
export type FallbackAction = "estimate" | "lead";
export type FallbackReply = { text: string; action?: FallbackAction };

type Copy = Record<Lang, string>;

const URDU_SCRIPT = /[؀-ۿ]/;
const ROMAN_URDU =
  /^(kya|kia|kiya|ky|kaise|kese|kaisay|kitne|kitna|kitni|hai|hain|hy|h|ka|ki|ke|ko|se|mein|yeh|ye|wo|hota|hoti|kaam|mujhe|mujhay|mera|meri|mere|aap|ap|bijli|chahiye|chahye|karna|krna|kr|karwana|lagwana|lagwani|batao|btao|bata|bataen|bataein|samjhao|kab|kahan|kyun|nahi|nahin|acha|achha|accha|theek|thik|sahi|shukriya|salam|assalam|aoa|qeemat|qimat|paisay|paise|bachat|ghar|chhat|haal|hal|kaisa|kaisi|kesa|kesi|ho|hoon|hun|theek|sab|ap|aj|kal)$/i;

/** English, Roman Urdu or Urdu script, based on the user's own message. */
export function detectLang(text: string): Lang {
  if (URDU_SCRIPT.test(text)) return "ur";
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  const roman = words.filter((w) => ROMAN_URDU.test(w)).length;
  return roman >= 1 && (roman >= 2 || words.length <= 3) ? "roman" : "en";
}

const has = (text: string, re: RegExp) => re.test(text);

const BUYING =
  /\b(quote|quotation|price|prices|pricing|cost|costs|rate list|assessment|survey|site visit|install|installation|installing|book|booking|buy|purchase|order|qeemat|qimat|kitne ka|kitnay ka|lagwana|lagwani|lagwa|lagwaen|lagwain|kharidna)\b|قیمت|انسٹال|لگوانا|سروے|کوٹیشن/i;

/** True when the user asks for a quote, assessment, price or installation. */
export function hasBuyingIntent(text: string) {
  return BUYING.test(text);
}

const WA = `+${contact.details.whatsapp}`;
const hours = contact.openingHours.rows.map((r) => `${r.label}: ${r.value}`).join(", ");
const pick = (copy: Copy, lang: Lang) => copy[lang];

const replies = {
  greeting: {
    en: "Hi, welcome to SUNARA! I can help with solar panels, savings and your free roof assessment. What would you like to know?",
    roman: "Wa alaikum assalam! SUNARA mein khush aamdeed. Main solar panels, bachat aur free roof assessment ke baare mein madad kar sakta hoon. Aap kya jaanna chahte hain?",
    ur: "وعلیکم السلام! SUNARA میں خوش آمدید۔ میں سولر پینلز، بچت اور مفت چھت کے جائزے کے بارے میں مدد کر سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟",
  },
  hello: {
    en: "Hello! I’m the SUNARA Assistant. Ask me about panels, savings, net metering or booking a free roof assessment.",
    roman: "Hello! Main SUNARA Assistant hoon. Panels, bachat, net metering ya free roof assessment ke baare mein poochiye.",
    ur: "ہیلو! میں SUNARA اسسٹنٹ ہوں۔ پینلز، بچت، نیٹ میٹرنگ یا مفت چھت کے جائزے کے بارے میں پوچھیں۔",
  },
  thanks: {
    en: "You’re welcome! Anything else about solar I can help with?",
    roman: "Koi baat nahi! Solar ke baare mein kuch aur poochna ho to batayein.",
    ur: "کوئی بات نہیں! سولر کے بارے میں کچھ اور پوچھنا ہو تو بتائیں۔",
  },
  estimate: {
    en: "Happy to estimate that. Share your location, average monthly bill and roof size in the short form below, and I’ll work out the system size, panel count and savings.",
    roman: "Zaroor. Neeche form mein apni location, mahana bill aur chhat ka size likhein, main system size, panels aur bachat ka andaza bata dunga.",
    ur: "ضرور۔ نیچے فارم میں اپنی لوکیشن، ماہانہ بل اور چھت کا سائز لکھیں، میں سسٹم سائز، پینلز اور بچت کا اندازہ بتا دوں گا۔",
  },
  pros: {
    en: "**Pros**\n- Lower electricity bills\n- Net metering credits for extra units\n- Low maintenance and long life (25 year panel performance warranty)\n- Cleaner energy and protection from rising tariffs\n\n**Cons**\n- Upfront cost (financing can help)\n- On-grid systems switch off during outages; backup needs a hybrid system with batteries\n- Roof space and shade limit system size\n- Output drops in heat, dust and winter, and batteries add cost",
    roman: "**Fayde**\n- Bijli ka bill kam\n- Extra units par net metering credit\n- Kam maintenance, lambi umar (25 saal panel performance warranty)\n- Saaf energy aur barhte tariff se bachao\n\n**Nuqsan**\n- Shuru ka kharcha (installment se asaan)\n- On-grid system load shedding mein band ho jata hai; backup ke liye hybrid aur battery chahiye\n- Chhat ki jagah aur saya size ko mehdood karte hain\n- Garmi, dhool aur sardi mein output kam, battery ka kharcha alag",
    ur: "**فائدے**\n- بجلی کا بل کم\n- اضافی یونٹس پر نیٹ میٹرنگ کریڈٹ\n- کم دیکھ بھال اور لمبی عمر (25 سال پینل پرفارمنس وارنٹی)\n- صاف توانائی اور بڑھتے ٹیرف سے بچاؤ\n\n**نقصانات**\n- شروع کی لاگت (قسطوں سے آسان)\n- آن گرڈ سسٹم لوڈ شیڈنگ میں بند ہو جاتا ہے؛ بیک اپ کے لیے ہائبرڈ اور بیٹری چاہیے\n- چھت کی جگہ اور سایہ سائز محدود کرتے ہیں\n- گرمی، دھول اور سردی میں پیداوار کم، بیٹری کی لاگت الگ",
  },
  netMetering: {
    en: "With net metering, extra daytime units go to the grid and are credited on your bill. Exported units usually earn less than the units you buy, so using power in the daytime saves the most. SUNARA prepares the application and handles approval with your distribution company; timelines vary.",
    roman: "Net metering mein din ke extra units grid ko jaate hain aur bill par credit milta hai. Export units ka rate aam tor par kam hota hai, is liye din mein bijli istemal karna sab se zyada bachat deta hai. Application aur approval SUNARA khud handle karta hai; waqt mukhtalif hota hai.",
    ur: "نیٹ میٹرنگ میں دن کے اضافی یونٹس گرڈ کو جاتے ہیں اور بل پر کریڈٹ ملتا ہے۔ ایکسپورٹ یونٹس کا ریٹ عموماً کم ہوتا ہے، اس لیے دن میں بجلی استعمال کرنا سب سے زیادہ بچت دیتا ہے۔ درخواست اور منظوری SUNARA خود سنبھالتا ہے؛ وقت مختلف ہوتا ہے۔",
  },
  gridTypes: {
    en: "- **On-grid:** cheapest and best for savings, but switches off during load shedding for safety.\n- **Hybrid:** adds batteries so selected appliances keep running in outages.\n- **Off-grid:** batteries only, for places with no reliable grid.\nWe recommend one after checking your usage and outage hours.",
    roman: "- **On-grid:** sab se sasta aur bachat ke liye behtareen, lekin load shedding mein band ho jata hai.\n- **Hybrid:** battery ke saath, outage mein zaroori appliances chalte rehte hain.\n- **Off-grid:** sirf battery, jahan grid bharosemand na ho.\nAap ki usage aur load shedding dekh kar hum mashwara dete hain.",
    ur: "- **آن گرڈ:** سب سے سستا اور بچت کے لیے بہترین، لیکن لوڈ شیڈنگ میں بند ہو جاتا ہے۔\n- **ہائبرڈ:** بیٹری کے ساتھ، بجلی جانے پر ضروری آلات چلتے رہتے ہیں۔\n- **آف گرڈ:** صرف بیٹری، جہاں گرڈ قابلِ اعتماد نہ ہو۔\nآپ کے استعمال اور لوڈ شیڈنگ کو دیکھ کر ہم مشورہ دیتے ہیں۔",
  },
  financing: {
    en: `${emi.text} Options include ${emi.chips.join(", ").toLowerCase()}. Exact plans depend on the bank and your system, so we confirm them with your quote.`,
    roman: "Aap 12 se 36 mahine ki installments mein partner banks ke zariye solar lagwa sakte hain. 0% markup options, bank financing aur net metering paperwork shamil hai. Asal plan bank aur system par munhasir hai.",
    ur: "آپ 12 سے 36 ماہ کی قسطوں میں پارٹنر بینکوں کے ذریعے سولر لگوا سکتے ہیں۔ 0% مارک اپ آپشنز، بینک فنانسنگ اور نیٹ میٹرنگ کے کاغذات شامل ہیں۔ اصل پلان بینک اور سسٹم پر منحصر ہے۔",
  },
  warranty: {
    en: `Panels come with a ${benefits.warranty.value} performance warranty, backed by the manufacturer. To claim, just call or message us and we handle it with the manufacturer for you.`,
    roman: "Panels par 25 saal ki performance warranty hai jo manufacturer deta hai. Claim ke liye bas humein call ya message karein, baqi hum khud karte hain.",
    ur: "پینلز پر 25 سال کی پرفارمنس وارنٹی ہے جو مینوفیکچرر دیتا ہے۔ کلیم کے لیے بس ہمیں کال یا میسج کریں، باقی ہم خود کرتے ہیں۔",
  },
  maintenance: {
    en: "Solar needs little upkeep. Dust lowers output, so many systems benefit from cleaning every one to three months. Our maintenance visits include cleaning, wiring and inverter checks and a performance report, and we service systems from other installers too.",
    roman: "Solar ki dekh bhaal kam hai. Dhool se output kam hota hai, is liye aksar har 1 se 3 mahine safai faydemand hai. Hamari visit mein safai, wiring aur inverter check aur performance report shamil hai.",
    ur: "سولر کو کم دیکھ بھال چاہیے۔ دھول سے پیداوار کم ہوتی ہے، اس لیے اکثر ہر 1 سے 3 ماہ صفائی فائدہ مند ہے۔ ہماری وزٹ میں صفائی، وائرنگ اور انورٹر چیک اور کارکردگی رپورٹ شامل ہے۔",
  },
  installTime: {
    en: "Most home systems take one to three days to install once the design is approved. Larger projects are phased on an agreed timeline.",
    roman: "Design approve hone ke baad aksar ghar ke systems 1 se 3 din mein lag jaate hain. Bare projects tay shuda timeline par hote hain.",
    ur: "ڈیزائن منظور ہونے کے بعد اکثر گھریلو سسٹم 1 سے 3 دن میں لگ جاتے ہیں۔ بڑے منصوبے طے شدہ ٹائم لائن پر ہوتے ہیں۔",
  },
  hours: {
    en: `Our opening hours: ${hours}. You can also message us on WhatsApp at ${WA}.`,
    roman: `Hamare auqat: Monday se Friday 9 am se 6 pm, Saturday 10 am se 4 pm, Sunday band. WhatsApp: ${WA}.`,
    ur: `ہمارے اوقات: پیر سے جمعہ صبح 9 سے شام 6، ہفتہ صبح 10 سے شام 4، اتوار بند۔ واٹس ایپ: ${WA}`,
  },
  contact: {
    en: `You can reach SUNARA on WhatsApp at ${WA}, or send a message through the [contact page](/contact) and an advisor will call you back within 24 hours. We have offices in Faisalabad and Lahore.`,
    roman: `SUNARA se WhatsApp par ${WA} par rabta karein, ya [contact page](/contact) se message bhejein, advisor 24 ghante mein call karega. Hamare offices Faisalabad aur Lahore mein hain.`,
    ur: `SUNARA سے واٹس ایپ ${WA} پر رابطہ کریں، یا [contact page](/contact) سے پیغام بھیجیں، مشیر 24 گھنٹے میں کال کرے گا۔ ہمارے دفاتر فیصل آباد اور لاہور میں ہیں۔`,
  },
  packages: {
    en: `Our packages:\n${packagesPage.residential.map((p) => `- **${p.name}** (${p.kw} kW): about ${unitsForKw(p.kw)} kWh a month, for bills up to about $${usdBillForKw(p.kw)}`).join("\n")}\n- **Commercial** systems from ${packagesPage.business.kw} kW\nPricing is a custom quote after a free roof assessment. See the [packages page](/packages).`,
    roman: `Hamare packages: ${packagesPage.residential.map((p) => `${p.name} (${p.kw} kW)`).join(", ")} aur commercial ${packagesPage.business.kw} kW se. Qeemat free roof assessment ke baad custom quote hoti hai. [Packages page](/packages) dekhein.`,
    ur: `ہمارے پیکجز: ${packagesPage.residential.map((p) => `${p.name} (${p.kw} kW)`).join("، ")} اور کمرشل ${packagesPage.business.kw} kW سے۔ قیمت مفت چھت کے جائزے کے بعد کسٹم کوٹ ہوتی ہے۔ [Packages page](/packages) دیکھیں۔`,
  },
  price: {
    en: "Prices depend on your roof, usage and equipment, so every system gets a custom quote after a free roof assessment. I can pass your details to our team so they can contact you.",
    roman: "Qeemat aap ki chhat, usage aur equipment par munhasir hai, is liye free roof assessment ke baad custom quote milti hai. Main aap ki details team tak pohncha sakta hoon.",
    ur: "قیمت آپ کی چھت، استعمال اور آلات پر منحصر ہے، اس لیے مفت چھت کے جائزے کے بعد کسٹم کوٹ ملتی ہے۔ میں آپ کی تفصیلات ٹیم تک پہنچا سکتا ہوں۔",
  },
  lead: {
    en: "Great, let’s book your free roof assessment. Share your name, phone and location below and I’ll open WhatsApp with your details ready to send.",
    roman: "Behtareen, aap ka free roof assessment book karte hain. Neeche naam, phone aur location likhein, main WhatsApp par aap ki details tayyar kar dunga.",
    ur: "بہترین، آپ کا مفت چھت کا جائزہ بک کرتے ہیں۔ نیچے نام، فون اور لوکیشن لکھیں، میں واٹس ایپ پر آپ کی تفصیلات تیار کر دوں گا۔",
  },
  howItWorks: {
    en: "Solar panels turn sunlight into DC power, and an inverter converts it to AC for your home. Your appliances use it first, and extra units go to the grid for bill credit (or into batteries on a hybrid system). That’s how solar cuts the units you buy.",
    roman: "Solar panels dhoop ko DC bijli mein badalte hain aur inverter use AC mein. Ghar ke appliances pehle yeh bijli use karte hain, extra units grid ko jaate hain aur bill par credit milta hai (hybrid mein battery mein). Is tarah grid se kam units khareedne parte hain.",
    ur: "سولر پینلز دھوپ کو ڈی سی بجلی میں بدلتے ہیں اور انورٹر اسے اے سی میں۔ گھر کے آلات پہلے یہ بجلی استعمال کرتے ہیں، اضافی یونٹس گرڈ کو جاتے ہیں اور بل پر کریڈٹ ملتا ہے۔ اس طرح گرڈ سے کم یونٹس خریدنے پڑتے ہیں۔",
  },
  aboutPanels: {
    en: "Solar panels turn sunlight into electricity. An inverter converts that power for your home, your appliances use it first, and extra units go to the grid for bill credit (or into batteries on a hybrid system). We install 400 W panels, each about 21 sq ft, with a 25 year performance warranty. Want me to estimate how many your home needs?",
    roman: "Solar panels dhoop se bijli banate hain. Inverter is bijli ko ghar ke liye tayyar karta hai, appliances pehle yahi bijli use karte hain, aur extra units grid ko ja kar bill par credit dete hain (hybrid mein battery mein jaate hain). Hum 400 W panels lagate hain, har panel takreeban 21 sq ft ka, 25 saal performance warranty ke saath. Kya main andaza lagaun ke aap ke ghar ko kitne panels chahiye?",
    ur: "سولر پینلز دھوپ سے بجلی بناتے ہیں۔ انورٹر اس بجلی کو گھر کے لیے تیار کرتا ہے، آلات پہلے یہی بجلی استعمال کرتے ہیں، اور اضافی یونٹس گرڈ کو جا کر بل پر کریڈٹ دیتے ہیں۔ ہم 400 واٹ کے پینلز لگاتے ہیں، ہر پینل تقریباً 21 مربع فٹ کا، 25 سال کی پرفارمنس وارنٹی کے ساتھ۔ کیا میں اندازہ لگاؤں کہ آپ کے گھر کو کتنے پینلز چاہئیں؟",
  },
  howAreYou: {
    en: "I’m doing well, thanks for asking! How can I help with solar today? I can size a system, explain savings or book your free roof assessment.",
    roman: "Main bilkul theek hoon, poochne ka shukriya! Aap batayein, solar ke baare mein kya madad karun? Main system size, bachat ya free roof assessment mein madad kar sakta hoon.",
    ur: "میں بالکل ٹھیک ہوں، پوچھنے کا شکریہ! بتائیں، سولر کے بارے میں کیا مدد کروں؟ میں سسٹم سائز، بچت یا مفت چھت کے جائزے میں مدد کر سکتا ہوں۔",
  },
  unclear: {
    en: "Sorry, I didn’t quite catch that. Could you say it another way? You can ask about panels, savings, net metering or a free roof assessment.",
    roman: "Maaf kijiye, main samajh nahi paya. Kya aap dobara likh sakte hain? Aap panels, bachat, net metering ya free roof assessment ke baare mein pooch sakte hain.",
    ur: "معاف کیجیے، میں سمجھ نہیں پایا۔ کیا آپ دوبارہ لکھ سکتے ہیں؟ آپ پینلز، بچت، نیٹ میٹرنگ یا مفت چھت کے جائزے کے بارے میں پوچھ سکتے ہیں۔",
  },
  ack: {
    en: "Great! Is there anything else I can help with, like net metering, installments or booking a free roof assessment?",
    roman: "Theek hai! Kuch aur jaanna ho to batayein, jaise net metering, installments ya free roof assessment.",
    ur: "ٹھیک ہے! کچھ اور جاننا ہو تو بتائیں، جیسے نیٹ میٹرنگ، قسطیں یا مفت چھت کا جائزہ۔",
  },
  fallback: {
    en: `I’m not sure about that one. I can help with panel sizing, savings, net metering, packages, financing and booking a free roof assessment. For anything else, our team is on WhatsApp at ${WA}.`,
    roman: `Is baare mein mujhe yaqeen nahi. Main panels, bachat, net metering, packages, installments aur free roof assessment mein madad kar sakta hoon. Baqi sawalat ke liye WhatsApp ${WA} par rabta karein.`,
    ur: `اس بارے میں مجھے یقین نہیں۔ میں پینلز، بچت، نیٹ میٹرنگ، پیکجز، قسطوں اور مفت چھت کے جائزے میں مدد کر سکتا ہوں۔ باقی سوالات کے لیے واٹس ایپ ${WA} پر رابطہ کریں۔`,
  },
} satisfies Record<string, Copy>;

const SALAM = /\b(salam|salaam|assalam|asalam|aoa|slam)\b|السلام|سلام/i;
const GREETING = /^(hi+|hello+|hey+|hiya|yo|good (morning|afternoon|evening)|greetings|howdy)\b|آداب|ہیلو/i;
/** Short acknowledgements such as "ok" or "theek hai". */
/** "How are you" small talk, in English, Roman Urdu and Urdu. */
const HOW_ARE_YOU =
  /\b(how (are|r) (you|u)|how'?s it going|how do you do|ki?y?a+ ha+l|kesy? ho|kaise ho|kaisay ho|kese ho|kaise hain|kaisay hain|kese hain|kya scene|sab theek|sab thik|aa?p kaise)\b|کیا حال|کیسے ہیں|کیسے ہو|آپ کیسے/i;
const ACK =
  /^(ok+|okay|k+|hmm+|cool|nice|great|alright|fine|got it|sure|done|perfect|theek|theek hai|thik|thik hai|acha|achha|accha|acha ji|sahi|ji|g|haan|han)[.!]*$|^(ٹھیک|اچھا|جی)( ہے)?[۔!]*$/i;
/** Sizing questions: "how many panels", "kitne panels chahiye", "what size system". */
const SIZING =
  /\b(how many|kitne|kitnay|kitni|what size|which size|system size|size of|kw|kilowatt|estimate|calculate|enough panels)\b|کتنے/;
const SOLAR_TOPIC = /\b(solar|panels?|inverter|plates?)\b|سولر|پینل/;

/** Picks a local reply for the user's latest message. */
// Words that make up greetings, "how are you", thanks and "ok" in English and Roman Urdu.
const SMALL_TALK_WORDS = new Set(
  (
    "hi hii hiii hello helo hey heya hiya yo salam salaam slam assalam asalam assalamu assalamualaikum aoa o u alaikum alaykum " +
    "walaikum wa good morning afternoon evening there sunara assistant bot sir bhai bro dear " +
    "how are r you doing whats up sup kia kya ky haal hal h hai hy he aap ap kaise kese kaisay ho hain hon sab theek thik " +
    "ok okay okk k kk fine great nice cool alright sure thanks thank thx shukriya shukria jazakallah acha achha accha ji g haan han"
  ).split(" ")
);
const URDU_SMALL_TALK = /^(السلام|وعلیکم|علیکم|سلام|ہیلو|آداب|کیا|حال|ہے|ہیں|آپ|کیسے|شکریہ|ٹھیک|اچھا|جی|\s|[؟!۔،.?!,])+$/;

/**
 * True when the whole message is only a greeting, "how are you", thanks or "ok". Those get an
 * instant local reply instead of waiting for the AI. "salam! net metering kya hai?" is not small talk.
 */
export function isSmallTalk(input: string) {
  const text = input.trim().toLowerCase();
  if (!text || text.length > 60) return false;
  if (URDU_SMALL_TALK.test(text)) return true;
  if (URDU_SCRIPT.test(text)) return false;
  const words = text.replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  return words.length > 0 && words.length <= 8 && words.every((w) => SMALL_TALK_WORDS.has(w));
}

export function fallbackReply(input: string): FallbackReply {
  const text = input.trim().toLowerCase();
  const lang = detectLang(input);
  const r = (key: keyof typeof replies, action?: FallbackAction): FallbackReply => ({ text: pick(replies[key], lang), action });

  if (!text) return r("fallback");
  const short = text.split(/\s+/).length <= 6;

  if (SALAM.test(text) && short) return r("greeting");
  if (GREETING.test(text) && short) return r("hello");
  if (has(text, /\b(thanks|thank you|thx|shukriya|shukria|jazakallah)\b|شکریہ/)) return r("thanks");

  if (HOW_ARE_YOU.test(text)) return r("howAreYou");
  if (ACK.test(text)) return r("ack");

  // Price first, so "price of a 5 kW system" is not treated as a sizing question.
  if (has(text, /\b(price|prices|pricing|cost|costs|qeemat|qimat|kitne ka|kitnay ka|rate list)\b|قیمت/)) return r("price", "lead");
  // Only sizing questions open the estimate form; "tell me about panels" is answered instead.
  if (has(text, SIZING)) return r("estimate", "estimate");
  if (has(text, /\b(save|saving|savings|bachat|bill kam|kitna bachega|payback)\b|بچت/)) return r("estimate", "estimate");
  if (has(text, /\b(pros?|cons?|advantages?|disadvantages?|benefits?|drawbacks?|fayde|faida|nuqsan|nuksan)\b|فائد|نقصان/)) return r("pros");
  if (has(text, /\b(net ?meter(ing)?|export|credit)\b|نیٹ میٹر/)) return r("netMetering");
  if (has(text, /\b(on-?grid|off-?grid|hybrid|battery|batteries|load ?shedding|outage|backup)\b|لوڈ شیڈنگ|بیٹری|ہائبرڈ/)) return r("gridTypes");
  if (has(text, /\b(installments?|emi|financ\w*|loan|bank|markup|qist|qistain|aqsaat)\b|قسط/)) return r("financing");
  if (has(text, /\b(warrant\w*|guarantee|claim)\b|وارنٹی/)) return r("warranty");
  if (has(text, /\b(maintenance|maintain|clean\w*|dust|safai|repair|fault)\b|صفائی|مرمت/)) return r("maintenance");
  if (has(text, /\b(how long|kitne din|days|timeline)\b/)) return r("installTime");
  if (has(text, /\b(hours|timing|timings|open|closed|auqat|sunday|saturday)\b|اوقات/)) return r("hours");
  if (has(text, /\b(packages?|starter|family|premium|commercial)\b|پیکج/)) return r("packages");
  if (has(text, /\b(how (does|do) (solar|it|panels?) work|how solar|work|works|kaam|kam karta|kaise chalta)\b|کام/) && has(text, SOLAR_TOPIC))
    return r("howItWorks");
  if (hasBuyingIntent(text)) return r("lead", "lead");
  if (has(text, /\b(contact|phone|call|whatsapp|address|office|location|where)\b|رابطہ|فون/)) return r("contact");
  // Any other question about panels or solar in general.
  if (has(text, SOLAR_TOPIC)) return r("aboutPanels");
  if (SALAM.test(text)) return r("greeting");
  if (GREETING.test(text)) return r("hello");
  if (text.split(/\s+/).length <= 3) return r("unclear");
  return r("fallback");
}

/** Chat text for an estimate made by the offline form. */
export function estimateText(e: EstimateSummary, lang: Lang = "en") {
  const m = (n: number) => formatMoney(n, e.currency);
  if (lang === "ur" || lang === "roman") {
    return [
      `${e.location || "Aap ki location"} ke liye andaza:`,
      `- System: **${e.systemKw} kW** (${e.panels} panels, 400 W)`,
      `- Mahana bachat: about **${m(e.monthlySavings)}**, saalana **${m(e.yearlySavings)}**`,
      `- Naya bill: about ${m(e.newBill)} / mahina`,
      e.paybackYears > 0 ? `- Payback: about ${e.paybackYears} saal` : "",
      e.roofLimited ? "Chhat ka size system ko mehdood karta hai, is liye bachat juzvi hai." : "",
      "Yeh sirf andaza hai; free roof assessment mein asal figures confirm hoti hain.",
    ].filter(Boolean).join("\n");
  }
  return [
    `Estimate for ${e.location || "your home"}:`,
    `- System: **${e.systemKw} kW** (${e.panels} panels of 400 W)`,
    `- Savings: about **${m(e.monthlySavings)}** a month, **${m(e.yearlySavings)}** a year`,
    `- New bill: about ${m(e.newBill)} a month`,
    e.paybackYears > 0 ? `- Payback: about ${e.paybackYears} years` : "",
    e.roofLimited ? "Your roof size limits the system, so savings are partial." : "",
    "These are estimates only. A free roof assessment confirms the exact figures.",
  ].filter(Boolean).join("\n");
}
