// Generates the illustrated placeholder photos used by the demo seed data.
// Run once: node scripts/generate-demo-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const W = 1200, H = 800;
const out = new URL('../public/demo/', import.meta.url);
mkdirSync(out, { recursive: true });

const skies = [
  ['#7fb4e6', '#dcecf9'],
  ['#f6a96b', '#fde3c3'],
  ['#5a7fb8', '#c7d9f0'],
  ['#8fc3d8', '#eef6f8'],
  ['#2c3e66', '#f0a46b'],
];

function frame(sky, body, ground = '#6f9a54') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe0f5"/><stop offset="1" stop-color="#4c7ea6"/></linearGradient>
  <linearGradient id="glassWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8"/><stop offset="1" stop-color="#f2b453"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<circle cx="1010" cy="140" r="60" fill="#fff6d8" opacity="0.85"/>
<g fill="#ffffff" opacity="0.7"><ellipse cx="220" cy="150" rx="90" ry="26"/><ellipse cx="290" cy="135" rx="70" ry="30"/><ellipse cx="760" cy="100" rx="80" ry="20"/></g>
<path d="M0 520 Q300 470 600 510 T1200 500 V800 H0Z" fill="#9db7a0" opacity="0.6"/>
<rect y="600" width="${W}" height="200" fill="${ground}"/>
<rect y="640" width="${W}" height="30" fill="#d8d2c4"/>
${body}
</svg>`;
}

const tree = (x, y, s = 1, c = '#3f7a3a') =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-7" y="0" width="14" height="60" fill="#6b4a2b"/><circle cy="-10" r="42" fill="${c}"/><circle cx="-26" cy="10" r="30" fill="${c}"/><circle cx="26" cy="10" r="30" fill="${c}"/></g>`;

function villa(wall, accent, sky) {
  return frame(sky, `
  ${tree(150, 540, 1.1)}${tree(1060, 545, 1.2, '#4b8a40')}
  <rect x="300" y="380" width="620" height="230" fill="${wall}"/>
  <rect x="300" y="250" width="380" height="140" fill="${wall}"/>
  <rect x="280" y="236" width="420" height="22" fill="${accent}"/>
  <rect x="280" y="366" width="660" height="22" fill="${accent}"/>
  <rect x="330" y="280" width="140" height="80" fill="url(#glass)"/>
  <rect x="500" y="280" width="150" height="80" fill="url(#glass)"/>
  <rect x="330" y="420" width="200" height="140" fill="url(#glassWarm)"/>
  <rect x="560" y="430" width="90" height="180" fill="#5b3a24"/>
  <rect x="690" y="420" width="200" height="140" fill="url(#glass)"/>
  <rect x="300" y="600" width="620" height="12" fill="#bfb6a3"/>
  <g stroke="#ffffff" stroke-width="4" opacity="0.6"><line x1="430" y1="420" x2="430" y2="560"/><line x1="790" y1="420" x2="790" y2="560"/></g>
  <rect x="940" y="520" width="170" height="90" fill="${accent}" opacity="0.85"/>`);
}

function apartment(wall, accent, sky) {
  let windows = '';
  for (let r = 0; r < 9; r++) for (let c = 0; c < 5; c++) {
    windows += `<rect x="${460 + c * 62}" y="${150 + r * 48}" width="44" height="30" fill="${(r + c) % 3 === 0 ? 'url(#glassWarm)' : 'url(#glass)'}"/>`;
  }
  return frame(sky, `
  <rect x="150" y="300" width="220" height="310" fill="#c9cfd8"/>
  <rect x="850" y="260" width="240" height="350" fill="#b8c2cf"/>
  ${[0,1,2,3,4,5].map(r => `<rect x="175" y="${330 + r * 45}" width="170" height="20" fill="#8ea6bf"/><rect x="875" y="${290 + r * 50}" width="190" height="22" fill="#8ea6bf"/>`).join('')}
  <rect x="440" y="120" width="330" height="490" fill="${wall}"/>
  <rect x="430" y="105" width="350" height="22" fill="${accent}"/>
  ${windows}
  <rect x="570" y="560" width="70" height="50" fill="#3b2f2a"/>
  ${tree(380, 560, 0.8)}${tree(820, 560, 0.8, '#4b8a40')}`);
}

function plot(sky) {
  return frame(sky, `
  <polygon points="250,610 950,610 1080,760 120,760" fill="#c9a874"/>
  <g stroke="#7a5a32" stroke-width="5">${[250, 425, 600, 775, 950].map(x => `<line x1="${x}" y1="560" x2="${x}" y2="612"/>`).join('')}</g>
  <line x1="250" y1="575" x2="950" y2="575" stroke="#7a5a32" stroke-width="3"/>
  <g transform="translate(600 470)"><rect x="-4" y="0" width="8" height="140" fill="#555"/><rect x="4" y="0" width="190" height="80" rx="6" fill="#0b1f3a"/><text x="99" y="35" font-family="Arial" font-weight="700" font-size="22" fill="#e3c26b" text-anchor="middle">PLOT FOR SALE</text><text x="99" y="62" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle">Possession Ready</text></g>
  ${tree(120, 545, 1)}${tree(1090, 550, 1.1, '#4b8a40')}`, '#7da35d');
}

function commercial(wall, sky) {
  let glass = '';
  for (let c = 0; c < 8; c++) glass += `<rect x="${250 + c * 88}" y="210" width="76" height="300" fill="url(#glass)"/>`;
  return frame(sky, `
  <rect x="230" y="180" width="740" height="430" fill="${wall}"/>
  ${glass}
  <rect x="230" y="510" width="740" height="16" fill="#0b1f3a"/>
  <rect x="230" y="526" width="740" height="84" fill="#e8e2d6"/>
  ${[0,1,2,3].map(i => `<rect x="${260 + i * 180}" y="540" width="150" height="70" fill="url(#glassWarm)"/>`).join('')}
  <rect x="470" y="140" width="260" height="50" fill="#0b1f3a"/>
  <text x="600" y="174" font-family="Arial" font-weight="700" font-size="26" fill="#e3c26b" text-anchor="middle">BUSINESS CENTRE</text>`, '#8a8f8a');
}

function farmhouse(wall, sky) {
  return frame(sky, `
  ${tree(120, 520, 1.3)}${tree(260, 540, 1)}${tree(1000, 520, 1.3, '#4b8a40')}${tree(1120, 545, 1)}
  <polygon points="380,360 600,230 820,360" fill="#8a3d2b"/>
  <rect x="400" y="360" width="400" height="250" fill="${wall}"/>
  <rect x="440" y="400" width="90" height="80" fill="url(#glassWarm)"/>
  <rect x="670" y="400" width="90" height="80" fill="url(#glassWarm)"/>
  <rect x="560" y="470" width="80" height="140" fill="#5b3a24"/>
  <rect x="380" y="600" width="440" height="12" fill="#a99f8c"/>
  <ellipse cx="900" cy="690" rx="140" ry="28" fill="#5fa8d3" opacity="0.8"/>`, '#5f9446');
}

function interior(wall, sofa) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f5"/><stop offset="1" stop-color="#eaf5fb"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="${wall}"/>
<rect y="560" width="${W}" height="240" fill="#b98d5f"/>
<g stroke="#a27a50" stroke-width="3">${[0,1,2,3,4,5,6].map(i => `<line x1="${i * 200}" y1="560" x2="${i * 200 - 80}" y2="800"/>`).join('')}</g>
<rect x="700" y="110" width="380" height="330" fill="url(#win)" stroke="#ffffff" stroke-width="14"/>
<line x1="890" y1="110" x2="890" y2="440" stroke="#ffffff" stroke-width="10"/>
<rect x="160" y="150" width="240" height="160" fill="#e3c26b" stroke="#0b1f3a" stroke-width="10"/>
<path d="M190 280 L250 210 L300 260 L340 220 L380 280Z" fill="#0b1f3a" opacity="0.7"/>
<rect x="120" y="430" width="560" height="140" rx="30" fill="${sofa}"/>
<rect x="100" y="400" width="80" height="170" rx="30" fill="${sofa}"/>
<rect x="620" y="400" width="80" height="170" rx="30" fill="${sofa}"/>
<rect x="190" y="380" width="200" height="80" rx="20" fill="${sofa}" opacity="0.8"/>
<rect x="410" y="380" width="200" height="80" rx="20" fill="${sofa}" opacity="0.8"/>
<ellipse cx="400" cy="680" rx="250" ry="40" fill="#e9dcc6"/>
<rect x="310" y="610" width="180" height="20" fill="#3b2f2a"/>
<rect x="900" y="470" width="20" height="120" fill="#3b2f2a"/><ellipse cx="910" cy="460" rx="60" ry="30" fill="#f4e3b5"/>
${tree(1080, 520, 0.7, '#4b8a40')}
</svg>`;
}

const files = {
  'villa-1.svg': villa('#f2efe8', '#0b1f3a', skies[0]),
  'villa-2.svg': villa('#e9e1d3', '#7a5a32', skies[1]),
  'villa-3.svg': villa('#ffffff', '#3a3f47', skies[3]),
  'apartment-1.svg': apartment('#e8e4dc', '#0b1f3a', skies[2]),
  'apartment-2.svg': apartment('#d9d4cb', '#c9a227', skies[4]),
  'plot-1.svg': plot(skies[0]),
  'plot-2.svg': plot(skies[1]),
  'commercial-1.svg': commercial('#d9dde3', skies[3]),
  'farmhouse-1.svg': farmhouse('#f3ead8', skies[1]),
  'interior-1.svg': interior('#efe8dc', '#0b1f3a'),
  'interior-2.svg': interior('#e4ebef', '#8a6d4b'),
  'interior-3.svg': interior('#f4efe6', '#4a6b5a'),
};

for (const [name, svg] of Object.entries(files)) writeFileSync(new URL(name, out), svg);
console.log(`Wrote ${Object.keys(files).length} images to public/demo`);
