/* "Oq muhr" shablonlari: bo'rtma oq konvert, mum muhr, tirnab ochiladigan sana, to'y dasturi.
   TPL dagi shablonda `lux: true` bo'lsa, app.js taklifnomani shu fayl orqali chizadi. */
(() => {
let uid = 0;
const rng = s => () => (s = s * 16807 % 2147483647) / 2147483647;
const svgURI = s => `url('data:image/svg+xml,${encodeURIComponent(s)}')`;
const f1 = n => +n.toFixed(1);

/* ---------- gul shakllari ----------
   Ikki rejim: 'h' bo'rtma uchun balandlik xaritasi (yorqinlik = balandlik), 'g' oltin chiziqli rasm. */
const STY = {
  h: {petal:'fill="#8E8E8E" stroke="#3E3E3E" stroke-width=".9"', petal2:'fill="#B4B4B4" stroke="#525252" stroke-width=".8"', core:'fill="#D6D6D6" stroke="#666" stroke-width=".7"',
      leaf:'fill="#868686" stroke="#444" stroke-width=".7"', vein:'fill="none" stroke="#4E4E4E" stroke-width=".8"', stem:'fill="none" stroke="#8A8A8A" stroke-linecap="round"',
      bloom:'fill="#A6A6A6" stroke="#4A4A4A" stroke-width=".6"', dot:'fill="#C4C4C4"'},
  g: {petal:'class="draw" pathLength="1" fill="none" stroke="var(--i-gold)" stroke-width=".9"', petal2:'class="draw" pathLength="1" fill="none" stroke="var(--i-gold)" stroke-width=".8"', core:'fill="var(--i-gold)" opacity=".55"',
      leaf:'class="draw" pathLength="1" fill="none" stroke="var(--i-gold)" stroke-width=".8"', vein:'class="draw" pathLength="1" fill="none" stroke="var(--i-gold)" stroke-width=".5"', stem:'class="draw" pathLength="1" fill="none" stroke="var(--i-gold)" stroke-linecap="round"',
      bloom:'class="draw" pathLength="1" fill="none" stroke="var(--i-gold)" stroke-width=".7"', dot:'fill="var(--i-gold)" opacity=".7"'}
};
const ell = (rx, ry) => `M${-rx} 0A${rx} ${ry} 0 1 0 ${rx} 0A${rx} ${ry} 0 1 0 ${-rx} 0Z`;
const at = (x, y, r = 0) => `transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)})"`;
function rose(m, x, y, r, rot = 0) {
  const S = STY[m];
  let s = '';
  for (let i = 0; i < 6; i++) s += `<path ${S.petal} d="${ell(r*.5, r*.42)}" ${at(x + r*.52*Math.cos((rot + i*60)*Math.PI/180), y + r*.52*Math.sin((rot + i*60)*Math.PI/180), rot + i*60 + 90)}/>`;
  for (let i = 0; i < 5; i++) s += `<path ${S.petal2} d="${ell(r*.34, r*.28)}" ${at(x + r*.3*Math.cos((rot + 36 + i*72)*Math.PI/180), y + r*.3*Math.sin((rot + 36 + i*72)*Math.PI/180), rot + i*72)}/>`;
  s += `<path ${S.core} d="${ell(r*.24, r*.22)}" ${at(x, y)}/>`;
  s += `<path ${S.vein} d="M${f1(x - r*.12)} ${f1(y)}a${f1(r*.12)} ${f1(r*.12)} 0 1 1 ${f1(r*.16)} ${f1(r*.06)}"/>`;
  return s;
}
function bloom(m, x, y, r, rot = 0) {
  const S = STY[m];
  let s = '';
  for (let i = 0; i < 5; i++) { const a = (rot + i*72)*Math.PI/180; s += `<path ${S.bloom} d="${ell(r*.42, r*.36)}" ${at(x + r*.5*Math.cos(a), y + r*.5*Math.sin(a), rot + i*72)}/>`; }
  return s + `<path ${S.core} d="${ell(r*.24, r*.24)}" ${at(x, y)}/>`;
}
function leaf(m, x, y, L, ang, w = .36) {
  const S = STY[m];
  return `<g ${at(x, y, ang)}><path ${S.leaf} d="M0 0C${f1(L*.25)} ${f1(-L*w)} ${f1(L*.72)} ${f1(-L*w*.8)} ${f1(L)} 0C${f1(L*.72)} ${f1(L*w*.8)} ${f1(L*.25)} ${f1(L*w)} 0 0Z"/><path ${S.vein} d="M${f1(L*.1)} 0Q${f1(L*.5)} ${f1(-L*.04)} ${f1(L*.86)} 0"/></g>`;
}
function stem(m, d, w) { return `<path ${STY[m].stem} stroke-width="${w}" d="${d}"/>`; }
function dots(m, x, y, n, R, r) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle ${STY[m].dot} cx="${f1(x + Math.cos(i*2.4)*R*(.4 + (i%3)*.3))}" cy="${f1(y + Math.sin(i*2.4)*R*(.4 + (i%3)*.3))}" r="${f1(r*(.7 + (i%2)*.5))}"/>`;
  return s;
}
/* novda: markazdan tashqariga egilgan poya, bo'yida barglar, uchida gul */
function sprig(m, rnd, x, y, len, ang, s) {
  const a = ang*Math.PI/180, bend = (rnd() - .5)*.7;
  const ex = x + Math.cos(a)*len, ey = y + Math.sin(a)*len;
  const mx = x + Math.cos(a + bend)*len*.55, my = y + Math.sin(a + bend)*len*.55;
  let o = stem(m, `M${f1(x)} ${f1(y)}Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}`, 1.3*s);
  for (let k = 1; k <= 3; k++) {
    const t = k/4.2, px = (1-t)*(1-t)*x + 2*(1-t)*t*mx + t*t*ex, py = (1-t)*(1-t)*y + 2*(1-t)*t*my + t*t*ey;
    o += leaf(m, px, py, (11 + rnd()*5)*s, ang + (k % 2 ? 48 : -48) + (rnd() - .5)*16);
  }
  const tip = rnd();
  o += tip < .45 ? bloom(m, ex, ey, (7 + rnd()*3)*s, rnd()*70) : tip < .8 ? dots(m, ex, ey, 7, 6*s, 1.5*s) : leaf(m, ex, ey, 12*s, ang);
  return o;
}
function bouquet(m, cx, cy, s, seed, spread = 360, dir = -90) {
  const rnd = rng(seed);
  let back = '', front = '';
  const n = spread >= 360 ? 12 : 8;
  for (let i = 0; i < n; i++) {
    const ang = spread >= 360 ? i*(360/n) + rnd()*14 : dir - spread/2 + i*(spread/(n - 1)) + (rnd() - .5)*10;
    back += sprig(m, rnd, cx + Math.cos(ang*Math.PI/180)*20*s, cy + Math.sin(ang*Math.PI/180)*14*s, (52 + rnd()*30)*s, ang, s);
  }
  for (let i = 0; i < 10; i++) {
    const ang = i*36 + rnd()*20;
    back += leaf(m, cx + Math.cos(ang*Math.PI/180)*24*s, cy + Math.sin(ang*Math.PI/180)*18*s, (22 + rnd()*10)*s, ang);
  }
  front += rose(m, cx - 34*s, cy + 10*s, 17*s, 20) + rose(m, cx + 34*s, cy + 8*s, 16*s, 50);
  front += bloom(m, cx - 18*s, cy - 24*s, 9*s, 10) + bloom(m, cx + 20*s, cy - 22*s, 8*s, 40) + bloom(m, cx, cy + 30*s, 8*s, 0);
  front += rose(m, cx, cy, 25*s, 0);
  front += dots(m, cx - 52*s, cy - 14*s, 6, 6*s, 1.6*s) + dots(m, cx + 54*s, cy - 10*s, 6, 6*s, 1.6*s);
  return back + front;
}
function vine(m, x, y0, y1, s, seed, flip) {
  const rnd = rng(seed), k = flip ? -1 : 1;
  let d = `M${x} ${y1}`, o = '';
  const steps = 6, h = (y1 - y0)/steps;
  for (let i = 0; i < steps; i++) d += `Q${f1(x + k*(i % 2 ? -10 : 10)*s)} ${f1(y1 - h*(i + .5))} ${x} ${f1(y1 - h*(i + 1))}`;
  o += stem(m, d, 1.4*s);
  for (let i = 0; i < 13; i++) {
    const y = y1 - (i + .6)*(y1 - y0)/13.5, side = i % 2 ? 1 : -1;
    o += leaf(m, x + side*2, y, (14 + rnd()*6)*s, side > 0 ? -38 - rnd()*20 : 218 + rnd()*20);
  }
  for (let i = 0; i < 5; i++) {
    const y = y0 + (i + .5)*(y1 - y0)/5, side = i % 2 ? 1 : -1;
    o += i === 2 ? rose(m, x + side*10*s, y, 15*s, i*30) : bloom(m, x + side*12*s, y, (8 + rnd()*2)*s, i*25);
    o += dots(m, x - side*14*s, y + 10*s, 5, 5*s, 1.4*s);
  }
  return o + bloom(m, x, y0 - 6*s, 7*s, 0) + dots(m, x, y0 - 18*s, 5, 5*s, 1.4*s);
}

/* ---------- bo'rtma (relyef) ---------- */
function emboss(w, h, body, o = {}) {
  const blur = o.blur ?? 1.15, sc = o.scale ?? 4.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><filter id="e" filterUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}" color-interpolation-filters="sRGB">
<feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="h"/>
<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/>
<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .05 0 0 0 0" result="na"/>
<feComposite in="h" in2="na" operator="arithmetic" k2="1" k3="1" result="hh"/>
<feGaussianBlur in="hh" stdDeviation="${blur}" result="b"/>
<feDiffuseLighting in="b" surfaceScale="${sc}" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="235" elevation="52"/></feDiffuseLighting>
<feComponentTransfer in="d"><feFuncR type="linear" slope=".62" intercept=".48"/><feFuncG type="linear" slope=".62" intercept=".472"/><feFuncB type="linear" slope=".62" intercept=".452"/>${o.alpha ? '' : '<feFuncA type="linear" slope="0" intercept="1"/>'}</feComponentTransfer>
${o.alpha ? '<feComposite in2="b" operator="in"/>' : ''}
</filter></defs><g filter="url(#e)"><rect width="${w}" height="${h}" fill="#000"/>${body}</g></svg>`;
}
const W = 400, Hh = 860, CY = .46;
let envURI;
function envDecor() {
  if (envURI) return envURI;
  const cy = Hh*CY;
  const body = bouquet('h', 200, 150, 1.4, 11, 330, -90) +
    vine('h', 50, cy - 150, cy + 330, 1.25, 23, false) + vine('h', 350, cy - 150, cy + 330, 1.25, 37, true) +
    bouquet('h', 200, 712, 1.45, 51, 360);
  return envURI = svgURI(emboss(W, Hh, body));
}

/* bo'rtma ravoq (taklif kartasi) */
function cuspPath(x0, x1, ys, y0, n) {
  const cx = (x0 + x1)/2, w = x1 - x0, pts = [];
  const bez = (p0, p1, p2, p3, t) => (1-t)**3*p0 + 3*(1-t)**2*t*p1 + 3*(1-t)*t*t*p2 + t**3*p3;
  for (let i = 0; i <= n; i++) { const t = i/n; pts.push([bez(x0, x0, cx - w*.2, cx, t), bez(ys, ys - (ys - y0)*.62, y0 + (ys - y0)*.16, y0, t)]); }
  for (let i = n - 1; i >= 0; i--) pts.push([2*cx - pts[i][0], pts[i][1]]);
  let d = `M${f1(x0)} ${Hc}V${f1(ys)}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i-1], [bx, by] = pts[i], r = Math.hypot(bx - ax, by - ay)*.56;
    d += `A${f1(r)} ${f1(r)} 0 0 1 ${f1(bx)} ${f1(by)}`;
  }
  return d + `V${Hc}`;
}
const Wc = 300, Hc = 200, PIL = 22;
function crownSVG() {
  const outer = cuspPath(PIL + 4, Wc - PIL - 4, 112, 8, 7);
  const inner = cuspPath(PIL + 16, Wc - PIL - 16, 118, 26, 7);
  let lat = '';
  for (let y = 4; y < Hc; y += 12) lat += `<path d="M${PIL/2} ${y}l5 6-5 6-5-6Z" fill="#B0B0B0"/><path d="M${Wc - PIL/2} ${y}l5 6-5 6-5-6Z" fill="#B0B0B0"/>`;
  const body = `<rect x="0" y="0" width="${PIL}" height="${Hc}" fill="#7A7A7A"/><rect x="${Wc - PIL}" y="0" width="${PIL}" height="${Hc}" fill="#7A7A7A"/>
    <rect x="3" y="0" width="${PIL - 6}" height="${Hc}" fill="#595959"/><rect x="${Wc - PIL + 3}" y="0" width="${PIL - 6}" height="${Hc}" fill="#595959"/>${lat}
    <path d="${outer}" fill="none" stroke="#9C9C9C" stroke-width="9"/><path d="${outer}" fill="none" stroke="#D2D2D2" stroke-width="2.4"/>
    <path d="${inner}" fill="none" stroke="#8A8A8A" stroke-width="3"/>
    <rect x="0" y="0" width="${PIL}" height="5" fill="#C8C8C8"/><rect x="${Wc - PIL}" y="0" width="${PIL}" height="5" fill="#C8C8C8"/>`;
  return svgURI(emboss(Wc, Hc, body, {blur: .9, scale: 3, alpha: true}));
}
function pilSVG() {
  const body = `<rect x="0" y="0" width="${PIL}" height="24" fill="#7A7A7A"/><rect x="3" y="0" width="${PIL - 6}" height="24" fill="#595959"/>
    <path d="M${PIL/2} 0l5 6-5 6-5-6Z" fill="#B0B0B0"/><path d="M${PIL/2} 12l5 6-5 6-5-6Z" fill="#B0B0B0"/>`;
  return svgURI(emboss(PIL, 24, body, {blur: .9, scale: 3, alpha: true}));
}
function baseSVG() {
  const body = `<rect x="0" y="0" width="${Wc}" height="26" fill="#000"/><rect x="0" y="0" width="${PIL}" height="26" fill="#7A7A7A"/><rect x="${Wc - PIL}" y="0" width="${PIL}" height="26" fill="#7A7A7A"/>
    <rect x="${PIL}" y="14" width="${Wc - 2*PIL}" height="5" fill="#9C9C9C"/><rect x="0" y="20" width="${Wc}" height="6" fill="#B4B4B4"/>`;
  return svgURI(emboss(Wc, 26, body, {blur: .9, scale: 3, alpha: true}));
}
let cardURIs;
const cardDecor = () => cardURIs ??= {crown: crownSVG(), pil: pilSVG(), base: baseSVG()};

/* ---------- oltin chiziqli rasmlar (to'y dasturi) ---------- */
const G = 'class="draw" pathLength="1" fill="none" stroke="var(--i-gold)" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"';
const small = (x, y) => bloom('g', x, y, 6) + leaf('g', x - 4, y + 2, 10, 160) + leaf('g', x + 4, y + 2, 10, 20);
const ICONS = {
  gate: () => `<path ${G} d="M24 96V46Q24 18 60 8Q96 18 96 46V96"/><path ${G} d="M32 96V48Q32 26 60 17Q88 26 88 48V96"/><path ${G} d="M60 22V96M45 60h6M69 60h6"/><path ${G} d="M60 8V2"/><path ${G} d="M18 96H102"/>${small(22, 92)}${small(98, 92)}`,
  rings: () => `<circle ${G} cx="48" cy="62" r="22"/><circle ${G} cx="72" cy="62" r="22"/><path ${G} d="M42 40l6-10 6 10-6 6Z"/><path ${G} d="M40 30l-4-4M56 30l4-4M48 26v-5"/>${small(28, 90)}${small(92, 90)}`,
  mihrab: () => `<path ${G} d="M26 96V50Q26 22 60 10Q94 22 94 50V96"/><path ${G} d="M36 96V54Q36 32 60 22Q84 32 84 54V96"/><path ${G} d="M60 22V38M53 38h14l-3 14h-8Z"/><path ${G} d="M56 52l4 6 4-6"/><path ${G} d="M42 96l6-14h24l6 14"/><path ${G} d="M20 96H100"/>`,
  tea: () => `<path ${G} d="M38 54Q30 84 50 90H70Q90 84 82 54Z"/><path ${G} d="M38 54H82M48 54Q50 44 60 44Q70 44 72 54M60 44V38"/><path ${G} d="M82 62Q98 60 96 72Q94 80 84 80"/><path ${G} d="M38 62L22 50l-2-6"/><path ${G} d="M88 96Q92 88 100 88H108Q114 88 116 96Z"/><path ${G} d="M14 96H118"/>`,
  doira: () => `<circle ${G} cx="60" cy="56" r="32"/><circle ${G} cx="60" cy="56" r="26"/>${[0,1,2,3,4,5,6,7].map(i => `<circle ${G} cx="${f1(60 + 29*Math.cos(i*Math.PI/4))}" cy="${f1(56 + 29*Math.sin(i*Math.PI/4))}" r="2.4"/>`).join('')}<path ${G} d="M48 56Q60 44 72 56Q60 68 48 56Z"/>${small(26, 94)}${small(94, 94)}`,
  cake: () => `<path ${G} d="M30 96V76H90V96M38 76V60H82V76M46 60V46H74V60"/><path ${G} d="M30 84Q45 90 60 84Q75 90 90 84M38 68Q49 72 60 68Q71 72 82 68"/><path ${G} d="M60 46V36"/><path ${G} d="M60 30q-4 4 0 6q4-2 0-6Z"/><path ${G} d="M22 96H98"/>`,
  fire: () => `${[0,1,2,3,4,5,6,7,8,9,10,11].map(i => { const a = i*Math.PI/6; return `<path ${G} d="M${f1(46 + 8*Math.cos(a))} ${f1(42 + 8*Math.sin(a))}L${f1(46 + 24*Math.cos(a))} ${f1(42 + 24*Math.sin(a))}"/>`; }).join('')}${[0,1,2,3,4,5,6,7].map(i => { const a = i*Math.PI/4 + .3; return `<path ${G} d="M${f1(84 + 5*Math.cos(a))} ${f1(62 + 5*Math.sin(a))}L${f1(84 + 15*Math.cos(a))} ${f1(62 + 15*Math.sin(a))}"/>`; }).join('')}<path ${G} d="M46 96Q50 70 46 66M84 96Q80 84 84 77"/>`
};
const ICON_KEYS = [['rings', /kelin|kuyov|uzuk/i], ['gate', /kutib|kelish|mehmon|ochil|qabul/i], ['mihrab', /nikoh|duo|namoz|xutba|fotiha|tilovat/i],
  ['tea', /ziyofat|dasturxon|osh|taom|kechki|non|choy/i], ['doira', /bazm|raqs|musiqa|konsert|doira|xonanda/i], ['cake', /tort|shirin/i], ['fire', /mushak|salyut|yakun|xayr|uzatish/i]];
const ICON_CYCLE = ['gate', 'rings', 'mihrab', 'tea', 'doira', 'cake'];
function pickIcon(label, i) { for (const [k, re] of ICON_KEYS) if (re.test(label)) return k; return ICON_CYCLE[i % ICON_CYCLE.length]; }
function parseProgram(s) {
  return String(s || '').split(/\n+/).map(l => l.trim()).filter(Boolean).slice(0, 12).map(l => {
    const m = /^(\d{1,2}[:.]\d{2})\s*[-–—:]?\s*(.*)$/.exec(l);
    return m ? {t: m[1].replace('.', ':'), l: m[2]} : {t: '', l};
  });
}

/* ---------- bezaklar ---------- */
function ornament(w = 200) {
  return `<svg class="lx-orn rv" viewBox="0 0 200 20" style="width:min(62%,${w}px)" aria-hidden="true"><path ${G} d="M84 10H8M116 10H192"/><path ${G} d="M100 2l8 8-8 8-8-8Z"/><path ${G} d="M84 10l6-4M84 10l6 4M116 10l-6-4M116 10l-6 4"/><circle cx="100" cy="10" r="2" fill="var(--i-gold)"/><circle cx="6" cy="10" r="1.6" fill="var(--i-gold)"/><circle cx="194" cy="10" r="1.6" fill="var(--i-gold)"/></svg>`;
}
function goldSprig(cls, seed) {
  return `<svg class="lx-sprig ${cls} rv" viewBox="0 0 160 170" aria-hidden="true">${bouquet('g', 80, 96, .78, seed, 150, -90)}</svg>`;
}
function sealSVG(a, b, id) {
  const pts = [];
  for (let i = 0; i < 64; i++) {
    const t = i/64*Math.PI*2, r = 46*(1 + .03*Math.sin(i*2.9) + .025*Math.sin(i*5.1 + 1) + .02*Math.cos(i*1.7));
    pts.push(f1(50 + r*Math.cos(t)) + ',' + f1(50 + r*Math.sin(t)));
  }
  const mono = b ? `<tspan>${a}</tspan><tspan font-size="15" dx="-1" dy="-2">&amp;</tspan><tspan dy="2">${b}</tspan>` : `<tspan>${a}</tspan>`;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs>
    <radialGradient id="w${id}" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3EFE8"/><stop offset="1" stop-color="#D9D1C4"/></radialGradient>
    <radialGradient id="p${id}" cx="60%" cy="66%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#EEE8DF"/><stop offset="1" stop-color="#E2DACD"/></radialGradient>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9C7434"/><stop offset=".45" stop-color="#E2C27E"/><stop offset=".7" stop-color="#B98D45"/><stop offset="1" stop-color="#8E672B"/></linearGradient></defs>
    <polygon points="${pts.join(' ')}" fill="url(#w${id})"/>
    <circle cx="50" cy="50" r="33" fill="url(#p${id})"/>
    <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(120,100,70,.28)" stroke-width="1.6" transform="translate(.7 .9)"/>
    <circle cx="50" cy="50" r="33" fill="none" stroke="#FFFFFF" stroke-width="1.2" transform="translate(-.6 -.7)"/>
    <text x="50" y="${b ? 60 : 62}" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="${b ? 27 : 34}" fill="rgba(90,70,40,.25)" transform="translate(.6 .8)">${mono}</text>
    <text x="50" y="${b ? 60 : 62}" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="${b ? 27 : 34}" fill="url(#g${id})">${mono}</text></svg>`;
}
const letters = (s, d0 = 0) => [...s].map((c, i) => c === ' ' ? ' ' : `<span style="--d:${d0 + i}">${c}</span>`).join('');

/* ---------- taklifnoma ---------- */
function inviteHTML(d, P, U) {
  const {E, T, dt, time} = P, {esc, pad, MONTHS, WD} = U;
  const a = d.a || 'Ism', b = d.b || 'Ism';
  const names = E.pair
    ? `<span class="nm">${letters(esc(a))}</span><span class="amp">&amp;</span><span class="nm">${letters(esc(b), [...a].length + 2)}</span>`
    : `<span class="nm">${letters(esc(E.hero || a))}</span>`;
  const [x0, y0, x1, y1] = T.box;
  const hero = `<section class="sec lx-hero">
    <div class="lx-hi rv" style="--ar:${T.ar}">
      <img src="${T.img}" alt="" decoding="async">
      ${(T.lamps || []).map(([x, y], i) => `<i class="lx-lamp" style="left:${x}%;top:${y}%;--dl:${-i*.9}s"></i><i class="lx-lamp" style="left:${100 - x}%;top:${y}%;--dl:${-i*.9 - 1.6}s"></i>`).join('')}
      <div class="lx-ht" style="left:${x0*100}%;top:${y0*100}%;width:${(x1-x0)*100}%;height:${(y1-y0)*100}%">
        <div class="lx-w1">Xush kelibsiz</div>
        ${E.hero ? '' : `<div class="lx-w2">${E.label}</div>`}
        ${E.pair ? '<div class="lx-w1 sm">bayramiga</div>' : ''}
        <h1 class="lx-names">${names}</h1>
        ${E.hero && d.a ? `<div class="lx-w1 sm">${esc(d.a)}</div>` : ''}
      </div>
      <div class="lx-down"><span>Pastga suring</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></div>
    </div>
  </section>`;
  const date = dt ? `<section class="sec lx-date">
    <h2 class="lx-h rv">${E.pair || E.hero ? 'Bayram sanasi' : 'Sana'}</h2>
    <p class="lx-sub rv"><span>✦</span> Sanani ko‘rish uchun tirnang <span>✦</span></p>
    <div class="lx-scr rv">
      ${[['Kun', pad(dt.d)], ['Oy', MONTHS[dt.m-1]], ['Yil', dt.y]].map(([l, v]) => `<div class="lx-tile"><div class="lx-face"><b>${v}</b><canvas aria-hidden="true"></canvas><button type="button" class="lx-tap" aria-label="${l}ni ochish"></button></div><small>${l}</small></div>`).join('')}
    </div>
    <p class="lx-dmore">${WD[new Date(dt.y, dt.m-1, dt.d).getDay()]}${time ? ` · soat ${time}` : ''}</p>
  </section>` : '';
  const C = cardDecor();
  const par = (v, s) => v ? `<div class="lx-par">${esc(v)}ning ${s}</div>` : '';
  const card = `<section class="sec lx-inv">
    <div class="lx-card rv" style="--crown:${C.crown};--pil:${C.pil};--base:${C.base}">
      <div class="lx-crown"></div><i class="lx-pl l"></i><i class="lx-pl r"></i>
      <div class="lx-body">
        <div class="bism" lang="ar" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>
        <div class="lx-cap">${esc(E.label)}ga lutfan<br>taklif etamiz</div>
        <div class="lx-nm">${esc(E.hero || a)}</div>
        ${E.pair ? `${ornament(120)}${par(d.pa, 'o‘g‘li')}<div class="lx-and">va</div><div class="lx-nm">${esc(b)}</div>${ornament(120)}${par(d.pb, 'qizi')}` : (E.hero && d.a ? `<div class="lx-par">${esc(d.a)}</div>` : par(d.pa, d.e === 'sunnat' ? 'o‘g‘li' : 'farzandi'))}
      </div>
      <div class="lx-base"></div>
    </div>
    ${goldSprig('l', 5)}
    <p class="lx-greet rv">${d.g ? 'Hurmatli ' + esc(d.g) + '!' : 'Aziz mehmonlar!'}</p>
    <p class="lead rv">${E.text(esc(a), esc(b))}</p>
    ${d.x ? `<p class="note rv">${esc(d.x)}</p>` : ''}
  </section>`;
  const ayat = E.pair ? `<section class="sec lx-ayat">
    ${ornament()}
    <div class="lx-ar rv" lang="ar" dir="rtl">وَخَلَقْنَاكُمْ أَزْوَاجًا</div>
    <p class="lx-tr rv">«Va sizlarni juft-juft qilib yaratdik»</p>
    <small class="lx-ref rv">Naba surasi, 8-oyat</small>
  </section>` : '';
  const prog = parseProgram(d.pr);
  const tl = prog.length ? `<section class="sec lx-tl">
    <h2 class="lx-h rv">To‘y dasturi</h2>
    ${ornament()}
    <div class="lx-tll">
      <i class="lx-line" aria-hidden="true"><i></i></i>
      <svg class="lx-fin t" viewBox="0 0 20 30" aria-hidden="true"><path d="M10 0l4 9-4 6-4-6Z M10 15v15" fill="none" stroke="var(--i-gold)" stroke-width="1"/><circle cx="10" cy="9" r="1.8" fill="var(--i-gold)"/></svg>
      ${prog.map((p, i) => `<div class="lx-ti ${i % 2 ? 'r' : 'l'}">
        <div class="lx-tt rv">${p.t ? `<b>${esc(p.t)}</b>` : ''}<span>${esc(p.l)}</span></div>
        <svg class="lx-ic rv" viewBox="0 0 120 100" aria-hidden="true">${ICONS[pickIcon(p.l, i)]()}</svg>
        <i class="lx-dot rv"></i>
      </div>`).join('')}
      <svg class="lx-fin b" viewBox="0 0 20 30" aria-hidden="true"><path d="M10 0v15 M10 15l4 9-4 6-4-6Z" fill="none" stroke="var(--i-gold)" stroke-width="1"/><circle cx="10" cy="21" r="1.8" fill="var(--i-gold)"/></svg>
    </div>
  </section>` : '';
  const cd = dt ? `<section class="sec lx-cds">
    <h2 class="lx-h rv">${E.until}</h2>
    ${ornament()}
    <div class="cd lx-cd rv" data-t="${P.cdT}">
      <div><b data-u="d">0</b><small>Kun</small></div><i>:</i><div><b data-u="h">00</b><small>Soat</small></div><i>:</i><div><b data-u="m">00</b><small>Daqiqa</small></div><i>:</i><div><b data-u="s">00</b><small>Soniya</small></div>
    </div>
  </section>` : '';
  const loc = `<section class="sec lx-loc">
    ${goldSprig('r', 9)}
    <h2 class="lx-h rv">Manzil</h2>
    ${ornament()}
    ${d.v ? `<p class="lx-venue rv">${esc(d.v)}</p>` : ''}
    ${d.ad ? `<p class="lx-addr rv">${esc(d.ad)}</p>` : ''}
    ${(d.v || d.ad || d.m) ? `<div class="ibtns rv">${P.mapBtns}</div>` : ''}
    ${T.venue ? `<div class="lx-vimg rv"><img src="${T.venue}" alt="" loading="lazy" decoding="async"></div>` : ''}
  </section>`;
  return hero + date + card + ayat + tl + cd + loc + P.rsvp + P.gift + P.end;
}

function coverHTML(d, E, esc) {
  const id = ++uid;
  const ini = s => esc((s || '').trim().charAt(0).toUpperCase());
  const a = E.hero ? 'T' : ini(d.a), b = E.pair ? ini(d.b) : '';
  const rnd = rng(1000 + id);
  let sp = '';
  for (let i = 0; i < 16; i++) {
    const zone = i % 4, x = [50, 13, 87, 50][zone] + (rnd() - .5)*[48, 14, 14, 50][zone], y = [16, 52, 52, 80][zone] + (rnd() - .5)*[18, 46, 46, 18][zone];
    sp += `<i style="left:${f1(x)}%;top:${f1(y)}%;--dl:${f1(-rnd()*4)}s;--sz:${f1(5 + rnd()*7)}px"></i>`;
  }
  return `<div class="cover lx-cover" style="--env:${envDecor()}">
    <div class="lx-f lx-l"></div><div class="lx-f lx-r"></div>
    <div class="lx-fw b"><div class="lx-f lx-b"></div></div>
    <div class="lx-fw t"><div class="lx-f lx-t"></div></div>
    <div class="lx-sp" aria-hidden="true">${sp}</div>
    <div class="lx-glow" aria-hidden="true"><i></i></div>
    <button type="button" class="seal lx-seal" aria-label="Taklifnomani ochish">${sealSVG(a, b, id)}</button>
    <div class="lx-hint">Ochish uchun muhrni bosing</div>
  </div>`;
}

/* ---------- jonlantirish ---------- */
function openCover(wrap, cover, onOpen, reduce) {
  const seal = cover.querySelector('.lx-seal');
  wrap.classList.add('lx-pre');
  seal.addEventListener('click', () => {
    const k = reduce ? 0 : 1;
    cover.classList.add('opening');
    const r = seal.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    onOpen.start?.(r.left - w.left + r.width/2, r.top - w.top + r.height/2);
    setTimeout(() => cover.classList.add('part'), 420*k);
    setTimeout(() => { wrap.classList.remove('lx-pre'); cover.classList.add('gone'); onOpen.done(); }, 1500*k);
    setTimeout(() => cover.remove(), 2900*k);
  }, {once: true});
}

function initScratch(stage, burst) {
  const sec = stage.querySelector('.lx-date');
  if (!sec) return;
  const tiles = [...sec.querySelectorAll('.lx-face')];
  let left = tiles.length;
  tiles.forEach((face, ti) => {
    const cv = face.querySelector('canvas'), ctx = cv.getContext('2d'), btn = face.querySelector('.lx-tap');
    let w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2), down = false, last = null, moves = 0, done = false;
    const paint = () => {
      w = cv.clientWidth; h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w*dpr; cv.height = h*dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#F7F1E6'); g.addColorStop(.35, '#E6D3AE'); g.addColorStop(.55, '#FBF6EC'); g.addColorStop(.8, '#D9C196'); g.addColorStop(1, '#F1E6D0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const rr = rng(77 + ti*13);
      for (let i = 0; i < 160; i++) { ctx.fillStyle = `rgba(255,255,255,${(.2 + rr()*.6).toFixed(2)})`; ctx.fillRect(rr()*w, rr()*h, 1.2, 1.2); }
      for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(150,115,60,${(.08 + rr()*.15).toFixed(2)})`; ctx.fillRect(rr()*w, rr()*h, 1, 1); }
      const s = ctx.createRadialGradient(w*.3, h*.25, 0, w*.3, h*.25, w*.7);
      s.addColorStop(0, 'rgba(255,255,255,.75)'); s.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = s; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(160,125,70,.55)'; ctx.font = `${Math.round(h*.2)}px Georgia,serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✦', w/2, h/2);
    };
    const reveal = () => {
      if (done) return; done = true;
      face.classList.add('done'); btn.remove();
      const r = face.getBoundingClientRect(), sr = stage.parentElement.getBoundingClientRect();
      burst?.(r.left - sr.left + r.width/2, r.top - sr.top + r.height/2, 26);
      if (--left === 0) sec.classList.add('all');
    };
    const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = Math.max(18, w*.22); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(...(last || [x, y])); ctx.lineTo(x, y); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      last = [x, y];
      if (++moves % 6 === 0) {
        const px = ctx.getImageData(0, 0, cv.width, cv.height).data;
        let clear = 0, n = 0;
        for (let i = 3; i < px.length; i += 4*23) { n++; if (px[i] < 40) clear++; }
        if (clear/n > .45) reveal();
      }
    };
    cv.addEventListener('pointerdown', e => { if (done) return; down = true; last = null; cv.setPointerCapture?.(e.pointerId); face.classList.add('touch'); scratch(...pos(e)); });
    cv.addEventListener('pointermove', e => { if (down && !done) scratch(...pos(e)); });
    const up = () => { down = false; last = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    btn.addEventListener('click', reveal);
    new ResizeObserver(() => { if (!done && cv.clientWidth && cv.clientWidth !== w) paint(); }).observe(cv);
  });
}

function init(wrap, stage, reduce, burst) {
  initScratch(stage, burst);
  const tll = stage.querySelector('.lx-tll');
  const hi = stage.querySelector('.lx-hi img');
  let raf = 0;
  const upd = () => {
    raf = 0;
    const sr = stage.getBoundingClientRect();
    if (tll) {
      const r = tll.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (sr.top + sr.height*.62 - r.top)/r.height));
      tll.style.setProperty('--p', p.toFixed(4));
    }
    if (hi && !reduce) hi.style.setProperty('--sy', Math.min(stage.scrollTop, sr.height)*.18 + 'px');
  };
  stage.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, {passive: true});
  upd();
  if (reduce && tll) tll.style.setProperty('--p', 1);
}

window.TAKLIFNOMA_LUX = {inviteHTML, coverHTML, openCover, init, envDecor};
})();
