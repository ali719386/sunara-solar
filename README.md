# SUNARA - premium solar website

Marketing site for SUNARA: home, about, services, packages, projects and contact pages, a solar savings calculator for US homes, and the SUNARA Assistant chatbot.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · next/font · lucide-react · Google Gemini (`@google/genai`). Motion uses plain CSS, IntersectionObserver and requestAnimationFrame; there is no animation library.

Setup requirements (Node version, keys, accounts) are listed in [`requirements.txt`](requirements.txt).

## Run

```bash
npm install
cp .env.example .env.local   # then fill in the keys, see "Environment variables"
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` / `npm start` | Production build, then serve it |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint with the Next.js rules |
| `npm test` | Unit tests (Vitest) |

Do not run `npm run build` while `npm run dev` is running: both write to `.next` and the dev server breaks. Stop it first, or delete `.next` and restart it if it already happened.

The npm cache is pinned to `E:/dev-cache/npm` in `.npmrc`; Next telemetry is disabled in `.env`.

## Environment variables

Copy `.env.example` to `.env.local` for local work. On Vercel, set them under Project > Settings > Environment Variables (Production and Preview), then redeploy. `.env.local` is gitignored; never commit keys.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | Chatbot answers and the calculator's "AI Solar Advice" | Server only. https://aistudio.google.com/apikey. Without it both use built-in answers. The free tier allows very few requests; enable billing for real traffic. |
| `GEMINI_MODEL` | Optional | Defaults to `gemini-3.8-flash`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp buttons and chat links | Digits only, country code first. Defaults to the number in `lib/env.ts`. |
| `NEXT_PUBLIC_SITE_URL` | Structured data | No trailing slash. |
| `NEXT_PUBLIC_SOCIAL_*` | Footer social links | Facebook, Instagram, LinkedIn, YouTube. Empty ones are hidden. |
| `NLR_API_KEY` | Only `scripts/build-state-sun.mjs` | Free at https://developer.nlr.gov/signup/. The site itself never calls NLR, so Vercel does not need it. |

## Deploy

Pushing to `main` on GitHub (`ali719386/sunara-solar`) deploys to Vercel automatically. Live site: https://sunara-solar-tawny.vercel.app

Commits must not carry a `Co-Authored-By` trailer for an AI tool: Vercel Hobby blocks deployments whose commit authors are not team members.

## Project structure

| Path | Contents |
| --- | --- |
| `app/` | Pages (`/`, `about`, `services`, `packages`, `projects`, `contact`, `privacy`, `terms`), `layout.tsx`, `globals.css` |
| `app/api/chat/route.ts` | Chatbot API (Gemini, streaming) |
| `app/api/solar-advice/route.ts` | Calculator "AI Solar Advice" API (Gemini) |
| `components/` | All UI components |
| `lib/content.ts` | Site copy, figures, images, testimonials, packages, FAQ |
| `content/about.ts` | About page copy (story, founder, approvals, partners, team, offices) |
| `lib/solarConfig.ts`, `lib/solarCalc.ts`, `lib/usStates.ts`, `lib/stateSun.ts` | Calculator settings, maths and data |
| `lib/chat*.ts`, `lib/gemini.ts`, `lib/rateLimit.ts` | Chatbot logic |
| `scripts/` | One off scripts (chat icon, state sun data) |
| `public/images`, `public/videos` | Photos, icons and the benefits video |

## Content

Copy, figures, images and testimonials live in `lib/content.ts` and `content/about.ts`; edit them there, not in components. Prices and bills are shown in US dollars. Ratings, stats, approvals and testimonials are illustrative and marked `TODO` until they are confirmed with real company data. Avoid the em dash character in copy.

### Images (`public/images/`)

Pages use the `.webp` files referenced in `lib/content.ts` (for example `hero.webp`, `residential.webp`, `services-1-hero.webp`, `project-*.webp`). To swap a photo, replace the file and keep its name. `benefits.jpg` is also the poster for `public/videos/panels.mp4`.

The home hero hides the "SOLAR" lettering behind the roof with `heroRoofClip` in `lib/content.ts`, a polygon traced for `hero.webp` (1672 × 941). If the hero photo changes, re-trace it at about 1440 px wide.

## Solar savings calculator (home page, `#savings`)

- **Location:** a dropdown of the 50 US states and DC (`components/LocationCombobox.tsx`). Picking a state sets USD, that state's rate per kWh and average monthly bill, and its sun hours. Every value stays editable. Other places can still be typed.
- **State data:** `lib/usStates.ts`. Rate and bill are EIA 2024 residential averages (Table 5A, https://www.eia.gov/electricity/sales_revenue_price/). Sun hours are NREL based annual averages (Unbound Solar's table). Update when EIA publishes a newer year.
- **Sun intensity card:** `components/StateSunIntensity.tsx` shows the state's yearly peak sun hours on a US wide meter, a level (Excellent, Good, Fair, Low) and a month by month chart for its largest city. The monthly data is bundled in `lib/stateSun.ts`, so nothing is fetched at runtime. Regenerate it with `node scripts/build-state-sun.mjs` (needs `NLR_API_KEY`); it uses OpenStreetMap Nominatim for locations and NLR (formerly NREL) PVWatts v8 / NSRDB for sun data.
- **Maths:** `lib/solarCalc.ts` (`calculateSolar`), settings and constants in `lib/solarConfig.ts`. All figures are estimates.
- **Results:** system size, roof panel visual, monthly and yearly savings, CO2 avoided, bill offset, before and after bars.
- **AI advice:** `app/api/solar-advice/route.ts` asks Gemini for 3 sentences built only from the numbers. 10 requests per minute per IP. Falls back to built-in text.
- **CTAs:** "Get a Free Quote" opens `/contact` with city and message prefilled; "Chat on WhatsApp" sends a prefilled summary.

## SUNARA Assistant chatbot

- **Launcher:** `components/ChatWidget.tsx`, mounted in `app/layout.tsx`. One floating dock holds the assistant (left) and WhatsApp (right) on every page. The panel (`components/ChatPanel.tsx`) loads only when first opened.
- **API:** `app/api/chat/route.ts` streams Gemini answers and can call an `estimate_solar` tool backed by `lib/solarCalc.ts`. 15 requests per minute per IP, 15 second limit, 8 seconds to the first words. `GET /api/chat` reports whether the AI is configured.
- **Knowledge:** `lib/chatKnowledge.ts` is built from `lib/content.ts` and `content/about.ts`, so editing site copy updates the bot. Answers stay in USD unless the visitor uses another currency.
- **Offline replies:** `lib/chatFallback.ts` answers in English, Roman Urdu or Urdu when the key is missing or Gemini fails. Greetings and small talk are always answered locally and instantly.
- **Chats:** several conversations per visit (New chat keeps the old ones, the chats button reopens or deletes them), up to 10 in sessionStorage (`lib/chatStore.ts`).
- **Leads:** a buying question shows a short form that opens WhatsApp with the visitor's name, phone and location. Nothing is stored on the server.
- **Icon:** `public/images/chatbot-icon.png`, generated from `chatbot.png` by `node scripts/prepare-chat-icon.mjs`.

## Forms

The quote and contact forms are front end only: nothing is sent or stored yet. See the `TODO` notes in `components/QuoteForm.tsx` and `components/ContactForm.tsx` before launch.

## Theme, motion and performance

- **Theme:** `html[data-theme]`, saved in `localStorage` (`sunara-theme`), light by default, switched by the toggle in the navbar.
- **Motion:** `html[data-motion]` follows the device's reduced motion setting (set before paint in `app/layout.tsx`, then kept in sync by `MotionProvider`). With reduced motion, animations jump to their final state.
- **Scrolling:** backdrop blurs on fixed elements are kept light (blur only, no saturate) and there are no blurs over images, because heavy blurs cause scroll stutter. Scroll handlers run in `requestAnimationFrame` and never measure layout.

## Tests

`npm test` runs the Vitest suites in `lib/*.test.ts`: calculator maths, US state data and search, chat request validation, the offline responder and the chat store. They make no network calls.
