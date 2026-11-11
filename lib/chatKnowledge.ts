// Knowledge base for the SUNARA Assistant chatbot. Company facts are pulled from the same
// content the site renders (lib/content.ts, content/about.ts), so editing the site updates
// the bot. Do not add prices, package names or claims here that the site does not show.

import {
  benefits,
  contact,
  emi,
  faq,
  nav,
  packagesPage,
  process as steps,
  projectsPage,
  servicesPage,
  solutions,
  testimonials,
  unitsForKw,
  usdBillForKw,
} from "./content";
import { aboutContent } from "@/content/about";
import { publicEnv } from "./env";
import { solarConstants } from "./solarConfig";


const whatsappDisplay = `+${publicEnv.whatsapp}`;
const whatsappLink = `https://wa.me/${publicEnv.whatsapp}`;

const packages = [
  ...packagesPage.residential.map(
    (p) =>
      `- ${p.name} (${p.kw} kW, ${p.tag}${p.featured ? ", our recommended package" : ""}): ${p.for}. Generates about ${unitsForKw(p.kw)} kWh a month and covers monthly bills up to about ${"$"}${usdBillForKw(p.kw)}. Pricing: ${p.price || `${packagesPage.priceOnRequest} (${packagesPage.priceNote.toLowerCase()})`}. Includes: ${p.included.join(", ")}.`
  ),
  `- ${packagesPage.business.name}: ${packagesPage.business.text}. Includes: ${packagesPage.business.included.join(", ")}. Pricing: ${packagesPage.priceOnRequest}.`,
].join("\n");

const faqs = [...faq.items, ...servicesPage.faq.items].map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

const stories = testimonials.items
  .map((t) => `- ${t.name}, ${t.city} (${t.system}): bill went from ${t.before} to ${t.after}. "${t.quote}"`)
  .join("\n");

const hours = contact.openingHours.rows.map((r) => `${r.label}: ${r.value}`).join("; ");

const services = servicesPage.items
  .map((s) => `- ${s.title}: ${s.text}. Included: ${s.included.join(", ")}.`)
  .join("\n");

const stats = aboutContent.stats.map((s) => `${s.value}${s.suffix} ${s.label.toLowerCase()}`).join(", ");
const approvals = aboutContent.trust.approvals.filter((a) => a.show).map((a) => `${a.label} (${a.detail})`).join(", ");

const panelSqFt = Math.round(solarConstants.panelWatts / solarConstants.wattsPerSqFtOfPanel + 0.5);

export const companyKnowledge = `
# SUNARA (company facts from the website)

SUNARA designs, installs, monitors, cleans and repairs solar systems for homes, businesses and industry. ${aboutContent.hero.lead}
${aboutContent.story.text}
Offices: ${aboutContent.local.offices.map((o) => o.city).join(" and ")} (${aboutContent.local.offices[0]?.region}, Pakistan). Exact addresses are not listed on the site.
Figures shown on the site: ${stats}.
Approvals shown on the site: ${approvals}.
Warranty: ${benefits.warranty.value} ${benefits.warranty.label.toLowerCase()}, ${aboutContent.trust.warranty.text.toLowerCase()}. For a claim, the customer calls or messages SUNARA and SUNARA handles it with the manufacturer.
Equipment brands installed: ${aboutContent.trust.partners.map((p) => p.name).join(", ")} (${aboutContent.trust.partnersText.toLowerCase()}).
Solutions: ${solutions.items.map((s) => `${s.label} (${s.title.toLowerCase()})`).join("; ")}.
What sets SUNARA apart: ${aboutContent.comparison.rows.map((r) => r.feature.toLowerCase()).join("; ")}.

## Services
${services}
- Free roof assessment: SUNARA checks the roof, bill and goals and confirms the right system size before the customer commits. Book it on the contact page or on WhatsApp.
Why the team: ${servicesPage.why.items.map((i) => `${i.title} (${i.text.toLowerCase()})`).join("; ")}.

## The 4 step process
${steps.steps.map((s) => `${s.n}. ${s.title}: ${s.text}`).join("\n")}

## Packages (packages page)
${packages}
${packagesPage.note}. Final sizing is confirmed after a free roof assessment. The site lists no fixed prices; every package is a custom quote.

## Financing
${emi.text} Options: ${emi.chips.join(", ")}. ${emi.example.label}: about ${emi.example.value} ${emi.example.unit}, ${emi.example.note.toLowerCase()} (an example only, real plans depend on the bank and system).

## Customer stories (shown on the home page)
${stories}

## Projects page
Completed work includes: ${projectsPage.items.map((p) => `${p.title.toLowerCase()} (${p.type})`).join(", ")}.

## Contact
- WhatsApp: ${whatsappDisplay} (${whatsappLink})
- Opening hours: ${hours}
- Contact form: /contact (a solar advisor calls back within 24 hours to confirm a time for the free roof assessment)
- Perks: ${contact.form.perks.join(", ")}

## Website pages
${nav.links.map((l) => `- ${l.label}: ${l.href}`).join("\n")}
- Savings calculator: /#savings (enter location, bill and roof size for an estimate)
- FAQ: /#faq

## FAQ
${faqs}
`.trim();

export const solarEducation = `
# General solar knowledge

How panels work: solar cells turn sunlight into direct current (DC). An inverter converts it to alternating current (AC) for the home. Power is used first by appliances; any extra is exported to the grid (on-grid and hybrid) or stored in batteries (hybrid and off-grid).

Panel size: assume ${solarConstants.panelWatts} W panels, each about ${panelSqFt} sq ft. Roughly 60% of a roof is usable after edges, vents, water tanks and shade.

How many panels: monthly units (kWh) = bill / rate per unit. System size (W) = monthly kWh / (30 x sun hours x 0.8) x 1000. Panels = system watts / ${solarConstants.panelWatts}. Always use the estimate_solar tool for real numbers.

How savings are calculated: monthly production (kWh) = system kW x sun hours x 30 x 0.8. Savings = production x rate per unit, capped at the share of the bill solar can realistically remove (fixed charges and night use remain). Payback = system cost / yearly savings.

Net metering: extra daytime units go to the grid and are credited on the bill. In Pakistan, exported units usually earn less than the units bought from the grid, so using power in the daytime saves the most. SUNARA prepares the application and handles approval with the distribution company; timelines vary.

On-grid vs hybrid vs off-grid:
- On-grid: cheapest and best for savings. Switches off during an outage (load shedding) for safety.
- Hybrid: on-grid plus batteries, keeps selected appliances running during outages. Costs more.
- Off-grid: batteries only, for places with no reliable grid. Most expensive per unit.

Dust and heat: output drops on very hot days (panels lose a little efficiency as they heat up) and when panels are dusty. Regular cleaning and monitoring keep output up.

Pros of solar: lower electricity bills, net metering credits, low maintenance, long life (panels carry a 25 year performance warranty), cleaner energy, protection from rising tariffs.
Cons of solar: upfront cost, on-grid systems switch off during outages (a hybrid with batteries is needed for backup), roof space and shading limit system size, output drops in heat, dust and winter, batteries add cost and need replacing over time.
`.trim();

export const chatKnowledge = `${companyKnowledge}\n\n${solarEducation}`;
