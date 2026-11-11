// One-off: turns public/images/chatbot.png (icon + "AI CHAT" caption on white) into a
// trimmed, transparent 256x256 public/images/chatbot-icon.png for the chat widget.
// Run with: node scripts/prepare-chat-icon.mjs
import sharp from "sharp";

const SRC = "public/images/chatbot.png";
const OUT = "public/images/chatbot-icon.png";
const SIZE = 256;
const WHITE = 235; // channels above this count as background white

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const px = (x, y) => (y * w + x) * 4;
const isWhite = (i) => data[i] > WHITE && data[i + 1] > WHITE && data[i + 2] > WHITE;

// 1. Find the caption: the first fully white row band below the icon separates them.
const rowHasInk = (y) => {
  for (let x = 0; x < w; x++) if (!isWhite(px(x, y))) return true;
  return false;
};
let top = 0;
while (top < h && !rowHasInk(top)) top++;
let bottom = top;
while (bottom < h && rowHasInk(bottom)) bottom++; // icon ends at the first blank row after it
// Allow short gaps inside the icon (e.g. between antenna tips and the bubble).
for (let y = bottom; y < h; y++) {
  if (!rowHasInk(y)) continue;
  let gap = y - bottom;
  if (gap > 20) break; // a big gap means we reached the caption
  while (y < h && rowHasInk(y)) y++;
  bottom = y;
}

// 2. Flood fill the white background from the image edges, so white inside the face stays.
const bg = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1]);
for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y]);
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const k = y * w + x;
  if (bg[k] || !isWhite(px(x, y))) continue;
  bg[k] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// 3. Background becomes transparent; anti-aliased edge pixels next to it fade by lightness.
let left = w, right = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const k = y * w + x;
    const i = k * 4;
    if (bg[k] || y >= bottom) {
      data[i + 3] = 0;
      continue;
    }
    const nearBg = bg[k - 1] || bg[k + 1] || bg[k - w] || bg[k + w];
    if (nearBg) {
      const light = Math.min(data[i], data[i + 1], data[i + 2]);
      data[i + 3] = Math.max(0, Math.min(255, Math.round(((255 - light) / 90) * 255)));
    }
    if (data[i + 3] > 0) {
      left = Math.min(left, x);
      right = Math.max(right, x);
    }
  }
}

// 4. Crop to the icon, pad to a square and resize.
const cropW = right - left + 1;
const cropH = bottom - top;
const side = Math.max(cropW, cropH);
await sharp(data, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left, top, width: cropW, height: cropH })
  .extend({
    top: Math.floor((side - cropH) / 2),
    bottom: Math.ceil((side - cropH) / 2),
    left: Math.floor((side - cropW) / 2),
    right: Math.ceil((side - cropW) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .resize(SIZE, SIZE)
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`Wrote ${OUT} (${SIZE}x${SIZE}) from crop ${cropW}x${cropH} at ${left},${top}`);
