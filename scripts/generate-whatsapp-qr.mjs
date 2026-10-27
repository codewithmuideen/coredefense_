#!/usr/bin/env node
// Builds the branded WhatsApp QR code: rounded data dots, brand-blue finder "eyes" and a WhatsApp badge in
// the centre. Error correction level H keeps the code scannable with the centre covered.
//
//   node scripts/generate-whatsapp-qr.mjs
//
// Re-run whenever the WhatsApp number in lib/contact.ts changes.

import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

const NUMBER = "447460082168";

// Bare link keeps the code small (fewer modules) so it scans easily even at footer size.
const URL = `https://wa.me/${NUMBER}`;
const OUT = path.join(process.cwd(), "public", "images", "brand", "whatsapp-qr.svg");

const INK = "#0B1220";
const BLUE = "#1E6AFF";
const GREEN = "#25D366";
const QUIET = 3; // quiet-zone modules around the code

const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
const size = qr.modules.size;
const dark = (r, c) => qr.modules.get(r, c) === 1;
const total = size + QUIET * 2;

// The three 7x7 finder patterns are drawn separately as rounded eyes.
const inFinder = (r, c) =>
  (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

// Clear a square in the middle for the badge (well inside what level H can recover).
const badgeModules = Math.round(size * 0.22) | 1;
const badgeStart = Math.floor((size - badgeModules) / 2);
const inBadge = (r, c) =>
  r >= badgeStart - 1 && r < badgeStart + badgeModules + 1 && c >= badgeStart - 1 && c < badgeStart + badgeModules + 1;

const dots = [];
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (!dark(r, c) || inFinder(r, c) || inBadge(r, c)) continue;
    dots.push(`<circle cx="${c + QUIET + 0.5}" cy="${r + QUIET + 0.5}" r="0.44"/>`);
  }
}

function eye(r, c) {
  const x = c + QUIET;
  const y = r + QUIET;
  return [
    `<rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" rx="1.9" fill="none" stroke="${INK}" stroke-width="1"/>`,
    `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="0.9" fill="${BLUE}"/>`,
  ].join("");
}

const cx = total / 2;
const badgeR = (badgeModules + 1) / 2;
// WhatsApp glyph (24x24 path), scaled into the badge.
const glyph =
  "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.45-9.43a9.38 9.38 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.44-9.44 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.8.7.7 5.78.7 12.04c0 2 .52 3.95 1.52 5.67L.6 23.6l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.34-11.35 0-3.03-1.18-5.88-3.31-8.03z";
const glyphScale = (badgeR * 1.25) / 24;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" role="img" aria-label="WhatsApp QR code for CoreDefense, +44 7460 082168">
<rect width="${total}" height="${total}" rx="2.4" fill="#FFFFFF"/>
<g fill="${INK}">${dots.join("")}</g>
${eye(0, 0)}${eye(0, size - 7)}${eye(size - 7, 0)}
<circle cx="${cx}" cy="${cx}" r="${badgeR}" fill="${GREEN}" stroke="#FFFFFF" stroke-width="0.6"/>
<g transform="translate(${cx - 12 * glyphScale} ${cx - 12 * glyphScale}) scale(${glyphScale})"><path fill="#FFFFFF" d="${glyph}"/></g>
</svg>
`;

fs.writeFileSync(OUT, svg);
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${size}x${size} modules) for ${URL}`);
