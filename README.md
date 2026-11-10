# SUNARA - premium solar concept site

Next.js App Router · TypeScript · Tailwind CSS v4 · next/font · lucide-react. No animation library — motion uses CSS, IntersectionObserver and requestAnimationFrame.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
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

## Quote form

Front-end demo only - nothing is transmitted or stored. See the `TODO` in `components/QuoteForm.tsx` for API integration.

## Motion

- `html[data-motion="on|off"]` — set before paint from `localStorage` (`sunara-motion`) and `prefers-reduced-motion`, then managed by `MotionProvider`. "Off" collapses all animations/transitions to their final state.
- Theme: `html[data-theme]`, persisted in `localStorage` (`sunara-theme`), defaults to light.
