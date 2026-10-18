/* Taklifnoma shablonlari.
   Yangi shablon qo'shish: pastdagi TPL obyektiga yangi kalit qo'shing (TEMPLATES.md ga qarang). */
(() => {
function star(cx, cy, R, r, n = 8) {
  const p = [];
  for (let i = 0; i < 2*n; i++) {
    const a = -Math.PI/2 + i*Math.PI/n, d = i % 2 ? r : R;
    p.push((cx + d*Math.cos(a)).toFixed(2) + ',' + (cy + d*Math.sin(a)).toFixed(2));
  }
  return p.join(' ');
}
const uri = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

/* ---------- naqshlar ---------- */
function girih(size, stroke, sw, extra = '', emboss) {
  const c = size/2, R = size*.27, r = size*.16, k = R*Math.SQRT1_2;
  const g = `<polygon points="${star(c,c,R,r)}"/><polygon points="${star(c,c,R*.5,r*.5)}"/>
    <path d="M${c} 0V${c-R}M${c} ${size}V${c+R}M0 ${c}H${c-R}M${size} ${c}H${c+R}M0 0L${c-k} ${c-k}M${size} 0L${c+k} ${c-k}M0 ${size}L${c-k} ${c+k}M${size} ${size}L${c+k} ${c+k}"/>
    ${[[0,0],[size,0],[0,size],[size,size]].map(([x,y]) => `<polygon points="${star(x,y,r*.9,r*.45)}"/>`).join('')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${emboss ? `<g fill="none" stroke="${emboss}" stroke-width="${sw*1.4}" transform="translate(1 1)">${g}</g>` : ''}
    <g fill="none" stroke="${stroke}" stroke-width="${sw}">${g}</g>${extra}</svg>`;
}
function suzaniTile(red, gold, green, bg) {
  const s = 180, c = 90;
  let petals = '';
  for (let i = 0; i < 12; i++) petals += `<ellipse cx="${c}" cy="${c-44}" rx="8" ry="15" transform="rotate(${i*30} ${c} ${c})" fill="${red}"/>`;
  const leaf = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="16" transform="rotate(${rot} ${x} ${y})" fill="${green}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    ${petals}<circle cx="${c}" cy="${c}" r="32" fill="${red}"/><circle cx="${c}" cy="${c}" r="22" fill="${bg}"/>
    <circle cx="${c}" cy="${c}" r="15" fill="${gold}"/><circle cx="${c}" cy="${c}" r="6" fill="${red}"/>
    ${leaf(14,14,45)}${leaf(166,14,-45)}${leaf(14,166,-45)}${leaf(166,166,45)}
    <circle cx="0" cy="0" r="10" fill="${red}"/><circle cx="180" cy="0" r="10" fill="${red}"/><circle cx="0" cy="180" r="10" fill="${red}"/><circle cx="180" cy="180" r="10" fill="${red}"/></svg>`;
}
function ikatTile(m, y, t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="150" viewBox="0 0 96 150">
    <defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="R" yChannelSelector="G"/></filter></defs>
    <g filter="url(#f)">
      <path d="M48 6L84 42L48 78L12 42Z" fill="${m}"/><path d="M48 22L68 42L48 62L28 42Z" fill="${y}"/><path d="M48 34L56 42L48 50L40 42Z" fill="${t}"/>
      <path d="M0 78L26 112L0 146ZM96 78L70 112L96 146Z" fill="${t}"/><path d="M48 92L64 114L48 136L32 114Z" fill="${y}"/>
      <path d="M0 0L14 0L0 18ZM96 0L82 0L96 18Z" fill="${t}"/>
    </g></svg>`;
}

function xivaTile(cobalt, turq) {
  const s = 80, sm = (x, y) => `<polygon points="${star(x,y,7,2.6,4)}" fill="${turq}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <g fill="none" stroke="${cobalt}" stroke-width="1.3">${[[0,0],[80,0],[0,80],[80,80],[40,40]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="40"/>`).join('')}
    <circle cx="40" cy="40" r="12"/></g>${sm(40,40)}${sm(40,0)}${sm(0,40)}${sm(80,40)}${sm(40,80)}</svg>`;
}
function bukharaTile(brick, turq) {
  const H = (x, y) => [0,8,16].map(d => `<rect x="${x+1}" y="${y+d+1}" width="22" height="6" rx="1"/>`).join('');
  const V = (x, y) => [0,8,16].map(d => `<rect x="${x+d+1}" y="${y+1}" width="6" height="22" rx="1"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <g fill="${brick}">${H(0,0)}${V(24,0)}${V(0,24)}${H(24,24)}</g><rect x="21" y="21" width="6" height="6" fill="${turq}" transform="rotate(45 24 24)"/></svg>`;
}

/* ---------- shablonlar ---------- */
const TPL = {
  ganch: {
    name: 'Ganch', desc: 'Oq ganch o‘ymakorligi, bo‘rtma naqsh va mis rang muhr',
    vars: {bg:'#EEE7DA',bg2:'#E1D5C1',panel:'rgba(255,252,246,.55)',paper:'#FBF7F0','l-ink':'#3B3128',ink:'#3B3128',soft:'#7C6B58',gold:'#A9824A',accent:'#8A5A2E','on-gold':'#FFFBF3','on-star':'#FFFBF3',line:'rgba(169,130,74,.45)',env:'#F4EEE3',env2:'#E2D6C2',seal:'#7A4A27',seal2:'#B97F4A',veil:'transparent'},
    pat: () => girih(84, 'rgba(120,92,55,.20)', 1, '', 'rgba(255,255,255,.75)'), size: '84px', op: 1, rose: 'star', fx: 'dust', fxc: ['#C9A46A','#E8D3A8','#FFFFFF']
  },
  samarqand: {
    name: 'Samarqand', desc: 'Lojuvard va oltin, Registon peshtoqlaridagi girih yulduzlari',
    vars: {bg:'#0F2552',bg2:'#081634',panel:'rgba(9,24,60,.6)',paper:'#F4EAD5','l-ink':'#0F2552',ink:'#F6ECD8',soft:'#A9C1E0',gold:'#D9B460',accent:'#45C1BC','on-gold':'#0B1C42','on-star':'#0B1C42',line:'rgba(217,180,96,.45)',env:'#17346F',env2:'#0C2153',seal:'#9C6C18',seal2:'#E6C36C',veil:'transparent'},
    pat: () => girih(96, 'rgba(217,180,96,.30)', 1, `<polygon points="${star(48,48,7,3.5)}" fill="rgba(69,193,188,.45)"/>`), size: '96px', op: 1, rose: 'star', fx: 'dust', fxc: ['#E6C36C','#FFF1C7','#45C1BC']
  },
  suzani: {
    name: 'Suzani', desc: 'Anor rang kashta gullari, Buxoro suzanisi ruhida',
    vars: {bg:'#F4E8D8',bg2:'#E8D4BC',panel:'rgba(255,250,242,.62)',paper:'#FFF8EE','l-ink':'#3A1D1A',ink:'#3A1D1A',soft:'#80594C',gold:'#B98327',accent:'#A3262A','on-gold':'#FFF8EE','on-star':'#FFF8EE',line:'rgba(163,38,42,.35)',env:'#F8EEE1',env2:'#E7D3BA',seal:'#861B20',seal2:'#D2493F',veil:'rgba(248,238,225,.8)'},
    pat: () => suzaniTile('#A3262A','#C08A2E','#5B6B3A','#F4E8D8'), size: '180px', op: .24, rose: 'suzani', fx: 'petal', fxc: ['#A3262A','#C9473F','#D99A3A']
  },
  atlas: {
    name: 'Atlas', desc: 'Xon atlas abrbandi: pushti, sariq va firuza ranglar',
    vars: {bg:'#2B0D2E',bg2:'#170619',panel:'rgba(36,9,40,.66)',paper:'#FBEFD9','l-ink':'#2B0D2E',ink:'#FCEFDB',soft:'#E9C3D6',gold:'#F1B53A',accent:'#EF3F8F','on-gold':'#2B0D2E','on-star':'#FFFFFF',line:'rgba(241,181,58,.45)',env:'#46144C',env2:'#2E0C33',seal:'#A87017',seal2:'#F3C552',veil:'rgba(70,20,76,.6)'},
    pat: () => ikatTile('#EF3F8F','#F1B53A','#1FA59A'), size: '96px 150px', op: .42, rose: 'ikat', fx: 'dust', fxc: ['#F1B53A','#EF3F8F','#1FA59A']
  },
  xiva: {
    name: 'Xiva', desc: 'Ichan qal’a koshinlari: kobalt, firuza va oq sir',
    vars: {bg:'#F1F5F4',bg2:'#D9E6E5',panel:'rgba(255,255,255,.62)',paper:'#FFFFFF','l-ink':'#12324A',ink:'#12324A',soft:'#4E6E80',gold:'#2C5AA0',accent:'#1B8C95','on-gold':'#FFFFFF','on-star':'#FFFFFF',line:'rgba(44,90,160,.4)',env:'#F7FAFA',env2:'#D6E4E4',seal:'#1F4C8F',seal2:'#4C86D1',veil:'rgba(247,250,250,.78)'},
    pat: () => xivaTile('#2C5AA0','#1B8C95'), size: '80px', op: .5, rose: 'star', fx: 'dust', fxc: ['#2C5AA0','#1B8C95','#9CC9D6']
  },
  buxoro: {
    name: 'Buxoro', desc: 'Pishiq g‘isht terish naqshi va firuza gumbaz ranglari',
    vars: {bg:'#EAD7BF',bg2:'#DBC1A2',panel:'rgba(250,240,226,.62)',paper:'#FBF3E7','l-ink':'#4A2817',ink:'#4A2817',soft:'#86624A',gold:'#9C5A2E',accent:'#23807C','on-gold':'#FBF3E7','on-star':'#FFFFFF',line:'rgba(156,90,46,.4)',env:'#F1E3CF',env2:'#DCC3A4',seal:'#7C3F1D',seal2:'#BE7A45',veil:'rgba(241,227,207,.8)'},
    pat: () => bukharaTile('#B06A3A','#23807C'), size: '48px', op: .32, rose: 'star', fx: 'dust', fxc: ['#C88A55','#23807C','#F4E3C8']
  },
  /* rasmli shablonlar: hero rasm (assets/img), matn rasmning bo'sh joyiga (box: x0,y0,x1,y1 ulushda) qo'yiladi */
  milliy: {
    name: 'Milliy', desc: 'Gilam yo‘lagi, anor gullari va milliy libosdagi kelin-kuyov',
    img: 'assets/img/milliy.webp', thumb: 'assets/img/milliy-s.webp', ar: '1536/2728', box: [.23,.235,.85,.495], nf: 10.5, bism: false,
    vars: {bg:'#FDFEF7',bg2:'#F2ECDF',panel:'rgba(255,255,255,.72)',paper:'#FFFDF6','l-ink':'#3A1F1C',ink:'#3A1F1C',soft:'#7D5A4E',gold:'#A9803A',accent:'#AE1F28','on-gold':'#FFFDF6','on-star':'#FFFFFF',line:'rgba(174,31,40,.3)',env:'#F8F3E8',env2:'#E9DFCD',seal:'#8E1C22',seal2:'#D2403A',veil:'rgba(248,243,232,.84)'},
    pat: () => girih(96, 'rgba(174,31,40,.10)', 1), size: '96px', op: 1, rose: 'suzani', fx: 'petal', fxc: ['#AE1F28','#D2403A','#C9473F']
  },
  gilam: {
    name: 'Gilam', desc: 'Qizil gilam, anor shoxi va akvarel uslubidagi kelin-kuyov',
    img: 'assets/img/gilam.webp', thumb: 'assets/img/gilam-s.webp', ar: '768/1376', box: [.28,.335,.79,.545], nf: 9.6, bism: false,
    vars: {bg:'#FAFBF6',bg2:'#EEEDE3',panel:'rgba(255,255,255,.72)',paper:'#FFFDF6','l-ink':'#3B1A18',ink:'#3B1A18',soft:'#6F5A4A',gold:'#B0873A',accent:'#9E1F24','on-gold':'#FFFDF6','on-star':'#FFFFFF',line:'rgba(158,31,36,.3)',env:'#F7F4EA',env2:'#E6DDCB',seal:'#861B20',seal2:'#C93A36',veil:'rgba(247,244,234,.84)'},
    pat: () => girih(96, 'rgba(158,31,36,.09)', 1), size: '96px', op: 1, rose: 'star', fx: 'petal', fxc: ['#9E1F24','#C93A36','#5B7A3A']
  },
  anor: {
    name: 'Anor bog‘i', desc: 'Oltin ravoq, anor novdalari va suzani gullari',
    img: 'assets/img/anor.webp', thumb: 'assets/img/anor-s.webp', ar: '768/1376', box: [.215,.185,.785,.535], nf: 11.5, bism: true,
    vars: {bg:'#FDF9E8',bg2:'#F2EAD2',panel:'rgba(255,253,244,.72)',paper:'#FFFCF0','l-ink':'#3A1D1A',ink:'#3A1D1A',soft:'#7E6046',gold:'#B08A3E',accent:'#B3262B','on-gold':'#FFFCF0','on-star':'#FFFFFF',line:'rgba(176,138,62,.45)',env:'#FAF3DE',env2:'#EADDBC',seal:'#8E1C22',seal2:'#D2493F',veil:'rgba(250,243,222,.84)'},
    pat: () => girih(96, 'rgba(176,138,62,.16)', 1), size: '96px', op: 1, rose: 'suzani', fx: 'petal', fxc: ['#B3262B','#D2493F','#C9A04A']
  },
  oydin: {
    name: 'Oydin kecha', desc: 'Lojuvard tun, hilol oy, Registon va atlas libos',
    img: 'assets/img/oydin.webp', thumb: 'assets/img/oydin-s.webp', ar: '768/1376', box: [.08,.22,.92,.535], nf: 12.5, bism: true,
    vars: {bg:'#131F42',bg2:'#0A1430',panel:'rgba(16,30,70,.66)',paper:'#F4EAD5','l-ink':'#13204A',ink:'#F6ECD8',soft:'#B4C6E6',gold:'#E3B94E',accent:'#E9408F','on-gold':'#0B1C42','on-star':'#FFFFFF',line:'rgba(227,185,78,.45)',env:'#1B3570',env2:'#0E2153',seal:'#9C6C18',seal2:'#E6C36C',veil:'rgba(27,53,112,.62)'},
    pat: () => girih(96, 'rgba(227,185,78,.16)', 1), size: '96px', op: 1, rose: 'ikat', fx: 'dust', fxc: ['#E3B94E','#FFF1C7','#E9408F']
  }
};
const patCache = {};
function applyVars(el, T, key) {
  for (const [k, v] of Object.entries(T.vars)) el.style.setProperty('--i-' + k, v);
  patCache[key] ??= uri(T.pat());
  el.style.setProperty('--i-pat', patCache[key]);
  el.style.setProperty('--i-pat-size', T.size);
  el.style.setProperty('--i-pat-op', T.op);
}


window.TAKLIFNOMA = {star, uri, TPL, applyVars};
})();
