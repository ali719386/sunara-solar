# SUNARA - premium solar concept site

Next.js App Router · TypeScript · Tailwind CSS v4 · next/font · lucide-react. No animation library — motion uses CSS, IntersectionObserver and requestAnimationFrame.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
npm run lint
npm test
```

npm cache is pinned to `E:/dev-cache/npm` via `.npmrc`; Next telemetry is disabled in `.env`.

## Required images (`public/images/`)

| File | Notes |
| --- | --- |
| `hero.jpg` | **1672 × 941**, full rooftop photo. The roof mask depends on this exact image. |
| `residential.jpg` | Stone home with rooftop solar (from `Home.png`). |
| `commercial.jpg` | Office building with solar carports (from `office .png`). |
| `industry.jpg` | Warehouse with a large roof array (from `Industry.png`). |
| `benefits.jpg` | Tall crop of the hero photo; poster for `public/videos/panels.mp4`. |

To swap a photo, replace the file with the same name.

### Roof mask

`heroRoofClip` in `lib/content.ts` is the starting polygon. After adding `hero.jpg`, open the site at ~1440px and adjust the points so the roof edge in the foreground layer sits exactly on the photographed roof edge. Alternatively, export a transparent PNG cutout of the roof and replace the clipped `<Image>` in `components/Hero.tsx` with it.

## Content

All copy, figures, currency, images and testimonials live in `lib/content.ts`. Figures, ratings and testimonials are illustrative.

## Solar savings calculator (`#savings`)

- `lib/solarConfig.ts`: location presets, currencies, bill ranges, cost per watt and constants. All figures are estimates; edit them there.
- `lib/solarCalc.ts`: pure calculation (`calculateSolar`), tested in `lib/solarCalc.test.ts` (`npm test`).
- `components/SolarCalculator.tsx`: the UI. "Get a Free Quote" opens `/contact` with city and message prefilled.
- `app/api/solar-advice/route.ts`: server route that asks Google Gemini for 3 sentences of advice. Rate limited to 10 requests per minute per IP (in memory, per server instance).

Set `GEMINI_API_KEY` (from https://aistudio.google.com/apikey) in `.env.local` for local dev, and in Vercel under Project > Settings > Environment Variables (Production and Preview) for deploys. It is read on the server only. Without a key, the calculator shows built-in advice text built from the same numbers.

## SUNARA Assistant chatbot

- `components/ChatWidget.tsx`: floating launcher, mounted in `app/layout.tsx`. The panel (`components/ChatPanel.tsx`) loads only when first needed.
- `app/api/chat/route.ts`: streams answers from Google Gemini (`GEMINI_MODEL`, default `gemini-3.8-flash`, client in `lib/gemini.ts`) with an `estimate_solar` tool backed by `lib/solarCalc.ts`. 15 requests per minute per IP (in memory), 15 second timeout. `GET /api/chat` reports whether the AI is configured.
- `lib/chatKnowledge.ts`: knowledge base built from `lib/content.ts` and `content/about.ts`, so editing site copy updates the bot.
- `lib/chatFallback.ts`: keyword replies (English, Roman Urdu, Urdu) used when `GEMINI_API_KEY` is missing or the API fails.
- Several chats per visit: `+` (New chat) starts a fresh one and keeps the old, the chats button lists them to reopen or delete. Up to 10 are kept in sessionStorage (`lib/chatStore.ts`).
- Lead capture opens WhatsApp with the visitor’s name, phone and location. Nothing is stored on the server.
- Icon: `public/images/chatbot-icon.png` is generated from `public/images/chatbot.png` with `node scripts/prepare-chat-icon.mjs`.

## Quote form

Front-end demo only - nothing is transmitted or stored. See the `TODO` in `components/QuoteForm.tsx` for API integration.

## Motion

- `html[data-motion="on|off"]` - set before paint from `localStorage` (`sunara-motion`) and `prefers-reduced-motion`, then managed by `MotionProvider`. "Off" collapses all animations/transitions to their final state.
- Theme: `html[data-theme]`, persisted in `localStorage` (`sunara-theme`), defaults to light.
