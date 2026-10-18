(() => {
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2,'0');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const {star, TPL, applyVars} = window.TAKLIFNOMA;
$('#logo-star').setAttribute('points', star(0,0,14,9.5));

/* ---------- tadbir turlari ---------- */
const EVENTS = {
  nikoh: {label:'Nikoh to‘yi', pair:true, la:'Kuyov ismi', lb:'Kelin ismi', until:'To‘ygacha qoldi',
    text:(a,b)=>`Hayotimizdagi eng quvonchli kunlardan biri, farzandlarimiz ${a} va ${b}ning nikoh to‘yi tantanasiga sizni oilangiz bilan lutfan taklif etamiz.`},
  fotiha: {label:'Fotiha to‘yi', pair:true, la:'Kuyov ismi', lb:'Kelin ismi', until:'Fotihagacha qoldi',
    text:(a,b)=>`Farzandlarimiz ${a} va ${b}ning fotiha to‘yi munosabati bilan dasturxonimizga lutfan taklif etamiz. Duolaringiz biz uchun aziz.`},
  sunnat: {label:'Sunnat to‘yi', pair:false, la:'O‘g‘lingiz ismi', until:'To‘ygacha qoldi',
    text:a=>`O‘g‘limiz ${a}ning sunnat to‘yi munosabati bilan beriladigan bazmga sizni oilangiz bilan lutfan taklif etamiz.`},
  tavallud: {label:'Tavallud kuni', pair:false, la:'Tavallud egasi', until:'Bayramgacha qoldi',
    text:a=>`${a}ning tavallud ayyomini yaqinlar davrasida birga nishonlash uchun sizni taklif etamiz.`},
  osh: {label:'Nahorgi osh', pair:false, la:'Osh munosabati', ph:'O‘g‘limiz Jasurning uylanishi', until:'Oshgacha qoldi', hero:'Nahorgi osh',
    text:a=>`${a} munosabati bilan beriladigan nahorgi oshga sizni lutfan taklif etamiz.`}
};
const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
const WD = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];
const WDS = ['Du','Se','Ch','Pa','Ju','Sh','Ya'];

/* ---------- SVG bezaklar ---------- */
function archPath(x0, y0, x1, y1, sh) {
  const m = (x0+x1)/2, w = x1-x0, sp = y0+sh;
  return `M${x0} ${y1}V${sp}C${x0} ${y0+sh*.42} ${m-w*.2} ${y0+sh*.14} ${m} ${y0}C${m+w*.2} ${y0+sh*.14} ${x1} ${y0+sh*.42} ${x1} ${sp}V${y1}Z`;
}
function archSVG() {
  return `<svg viewBox="0 0 300 440" preserveAspectRatio="none" aria-hidden="true">
    <path d="${archPath(24,30,276,420,150)}" fill="var(--i-panel)" stroke="none"/>
    <path class="draw" pathLength="1" d="${archPath(10,10,290,432,166)}" fill="none" stroke="var(--i-gold)" stroke-width="1.4"/>
    <path class="draw" pathLength="1" d="${archPath(24,30,276,420,150)}" fill="none" stroke="var(--i-gold)" stroke-width=".7"/>
    <polygon points="${star(150,10,13,8)}" fill="var(--i-bg)" stroke="var(--i-gold)" stroke-width="1.2"/>
    <polygon points="${star(150,10,5,2.6)}" fill="var(--i-accent)"/>
    <path class="draw" pathLength="1" d="M10 396H290" fill="none" stroke="var(--i-gold)" stroke-width=".5"/>
    ${[40,75,110,150,190,225,260].map(x=>`<polygon points="${star(x,408,4,2)}" fill="var(--i-gold)" opacity=".7"/>`).join('')}
  </svg>`;
}
function divider() {
  return `<svg class="divider rv" viewBox="0 0 220 24" aria-hidden="true">
    <path class="draw" pathLength="1" d="M96 12H6" fill="none" stroke="var(--i-gold)" stroke-width="1"/>
    <path class="draw" pathLength="1" d="M124 12H214" fill="none" stroke="var(--i-gold)" stroke-width="1"/>
    <polygon class="draw" pathLength="1" points="${star(110,12,10,6)}" fill="none" stroke="var(--i-gold)" stroke-width="1"/>
    <circle cx="110" cy="12" r="2.4" fill="var(--i-accent)"/><circle cx="4" cy="12" r="2" fill="var(--i-gold)"/><circle cx="216" cy="12" r="2" fill="var(--i-gold)"/></svg>`;
}
function skyline() {
  const d = ['M0 128H280',
    'M30 128V48M44 128V48M27 48H47M30 48Q37 28 44 48M37 33V26',
    'M236 128V48M250 128V48M233 48H253M236 48Q243 28 250 48M243 33V26',
    'M62 128V92H84V128M62 92Q73 74 84 92', 'M196 128V92H218V128M196 92Q207 74 218 92',
    'M108 52V44H172V52', 'M110 44Q110 14 140 10Q170 14 170 44', 'M140 10V2',
    'M94 128V52H186V128', 'M114 128V88Q114 66 140 60Q166 66 166 88V128', 'M122 128V92Q122 76 140 72Q158 76 158 92V128'];
  return `<svg class="sky rv" viewBox="0 -4 280 136" aria-hidden="true"><g fill="none" stroke="var(--i-gold)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
    ${d.map(p=>`<path class="draw" pathLength="1" d="${p}"/>`).join('')}</g>
    <polygon points="${star(140,102,6,3)}" fill="var(--i-accent)"/></svg>`;
}
function rosette(kind) {
  if (kind === 'suzani') {
    let p = '';
    for (let i = 0; i < 12; i++) p += `<ellipse cx="0" cy="-30" rx="6" ry="11" transform="rotate(${i*30})" fill="var(--i-accent)" opacity=".9"/>`;
    return `<svg class="rosette" viewBox="-48 -48 96 96" aria-hidden="true">${p}<circle r="22" fill="var(--i-accent)"/><circle r="15" fill="var(--i-bg)"/><circle r="10" fill="var(--i-gold)"/><circle r="4" fill="var(--i-accent)"/>
      <circle class="draw" pathLength="1" r="44" fill="none" stroke="var(--i-gold)" stroke-width=".8"/></svg>`;
  }
  if (kind === 'ikat') {
    return `<svg class="rosette" viewBox="-48 -48 96 96" aria-hidden="true"><path d="M0-44L30 0L0 44L-30 0Z" fill="var(--i-accent)"/><path d="M0-28L19 0L0 28L-19 0Z" fill="var(--i-gold)"/><path d="M0-12L8 0L0 12L-8 0Z" fill="#1FA59A"/>
      <path class="draw" pathLength="1" d="M-46 0H-34M34 0H46" stroke="var(--i-gold)" stroke-width="1" fill="none"/></svg>`;
  }
  return `<svg class="rosette" viewBox="-48 -48 96 96" aria-hidden="true">
    <polygon class="draw" pathLength="1" points="${star(0,0,44,30)}" fill="none" stroke="var(--i-gold)" stroke-width="1"/>
    <polygon class="draw" pathLength="1" points="${star(0,0,30,20)}" fill="none" stroke="var(--i-gold)" stroke-width="1"/>
    <polygon points="${star(0,0,16,9)}" fill="var(--i-accent)"/><circle r="4" fill="var(--i-bg)"/>
    <circle class="draw" pathLength="1" r="47" fill="none" stroke="var(--i-gold)" stroke-width=".5"/></svg>`;
}
function sealSVG(initials) {
  const pts = [];
  for (let i = 0; i < 56; i++) {
    const a = i/56*Math.PI*2, r = 46*(1 + .035*Math.sin(i*2.7) + .025*Math.sin(i*5.3+1) + .02*Math.cos(i*1.3));
    pts.push((50+r*Math.cos(a)).toFixed(1) + ',' + (50+r*Math.sin(a)).toFixed(1));
  }
  const txt = initials ? `<text x="50" y="57" text-anchor="middle" font-family="Marcellus,Georgia,serif" font-size="${initials.length>2?17:21}" fill="rgba(0,0,0,.35)" transform="translate(.8 .8)">${esc(initials)}</text>
    <text x="50" y="57" text-anchor="middle" font-family="Marcellus,Georgia,serif" font-size="${initials.length>2?17:21}" fill="rgba(255,240,210,.85)">${esc(initials)}</text>` : '';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="sg" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="var(--i-seal2)"/><stop offset=".75" stop-color="var(--i-seal)"/></radialGradient></defs>
    <polygon points="${pts.join(' ')}" fill="url(#sg)"/>
    <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="2"/><circle cx="50" cy="50" r="33" fill="none" stroke="rgba(255,235,200,.35)" stroke-width="1" transform="translate(-.8 -.8)"/>
    <polygon points="${star(50,50,initials?29:24,initials?25:14)}" fill="none" stroke="rgba(255,235,200,.4)" stroke-width="1"/>
    ${txt}</svg>`;
}

/* ---------- ma'lumot ---------- */
function parseDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? {y:+m[1], m:+m[2], d:+m[3]} : null;
}
function calendar(dt) {
  const first = (new Date(dt.y, dt.m-1, 1).getDay() + 6) % 7, days = new Date(dt.y, dt.m, 0).getDate();
  let h = WDS.map(w => `<span class="wd">${w}</span>`).join('');
  for (let i = 0; i < first; i++) h += '<span></span>';
  for (let d = 1; d <= days; d++) {
    h += d === dt.d
      ? `<span class="on" style="--k:${d}"><svg class="dstar" viewBox="-14 -14 28 28" aria-hidden="true"><polygon class="draw" pathLength="1" points="${star(0,0,13,9.6)}"/></svg><b>${d}</b></span>`
      : `<span style="--k:${d}">${d}</span>`;
  }
  return `<div class="cal" role="grid" aria-label="${MONTHS[dt.m-1]} oyi taqvimi">${h}</div>`;
}
function cardInfo(raw) {
  const n = String(raw || '').replace(/\D/g, '');
  if (n.length < 16 || n.length > 19) return null;
  const brand = /^(8600|5614)/.test(n) ? 'Uzcard' : /^9860/.test(n) ? 'Humo' : /^4/.test(n) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'Mastercard' : '';
  return {n, brand, pretty: n.replace(/(\d{4})(?=\d)/g, '$1 ')};
}
function namesOf(d) {
  const E = EVENTS[d.e] || EVENTS.nikoh;
  return E.pair ? `${d.a || ''} & ${d.b || ''}` : (E.hero || d.a || '');
}
function inviteHTML(d, base) {
  const E = EVENTS[d.e] || EVENTS.nikoh, T = TPL[d.t] || TPL.ganch;
  const a = esc(d.a || 'Ism'), b = esc(d.b || 'Ism');
  const dt = parseDate(d.d), time = /^\d{2}:\d{2}$/.test(d.h || '') ? d.h : '';
  const names = E.pair ? `<span class="nm">${a}</span><span class="amp">&amp;</span><span class="nm">${b}</span>` : `<span class="nm">${E.hero || a}</span>`;
  const q = encodeURIComponent([d.v, d.ad].filter(Boolean).join(', '));
  const mapBtns = /^https?:\/\//i.test(d.m || '')
    ? `<a class="ibtn fill" href="${esc(d.m)}" target="_blank" rel="noopener">Xaritada ochish</a>`
    : `<a class="ibtn fill" href="https://yandex.uz/maps/?text=${q}" target="_blank" rel="noopener">Yandex xarita</a><a class="ibtn" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Google xarita</a>`;
  let gcal = '';
  if (dt && time) {
    const st = new Date(dt.y, dt.m-1, dt.d, +time.slice(0,2), +time.slice(3)), en = new Date(st.getTime() + 4*3600e3);
    const f = x => `${x.getFullYear()}${pad(x.getMonth()+1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
    gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(E.label + ': ' + namesOf(d))}&dates=${f(st)}/${f(en)}&location=${q}`;
  }
  const card = cardInfo(d.ck);
  const tel = (d.p || '').replace(/[^\d+]/g, '');
  const tgUser = (d.tg || '').replace(/^(https?:\/\/)?(t\.me\/)?@?/i, '');
  const tg = /^[A-Za-z0-9_]{4,32}$/.test(tgUser) ? `https://t.me/${tgUser}?text=${encodeURIComponent(`Assalomu alaykum! ${E.label} taklifnomasini oldim${d.g ? ` (${d.g})` : ''}. Albatta boraman.`)}` : '';
  const bism = `<div class="bism" lang="ar" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>`;
  const heroText = `<div class="eyebrow">${E.hero ? 'Taklifnoma' : E.label}</div>
        <h1 class="names">${names}</h1>
        ${E.hero && d.a ? `<div class="eyebrow">${a}</div>` : ''}
        ${dt ? `<div class="dateline">${pad(dt.d)} · ${pad(dt.m)} · ${dt.y}</div>` : ''}`;
  const hint = `<div class="scroll-hint rv"><span>Pastga suring</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></div>`;
  const [x0, y0, x1, y1] = T.box || [];
  const hero = T.img ? `
  <section class="sec ihero-sec">
    <div class="ihero rv" style="aspect-ratio:${T.ar}">
      <img src="${T.img}" alt="" decoding="async">
      <div class="ibox" style="left:${x0*100}%;top:${y0*100}%;width:${(x1-x0)*100}%;height:${(y1-y0)*100}%;--nf:${T.nf}">
        ${T.bism ? bism : ''}
        ${heroText}
      </div>
    </div>
    ${hint}
  </section>` : `
  <section class="sec hero">
    <div class="arch rv">${archSVG()}
      <div class="arch-in">
        ${bism}
        ${heroText}
      </div>
    </div>
    ${hint}
  </section>`;
  return `${hero}
  <section class="sec">
    ${divider()}
    <div class="eyebrow rv">Assalomu alaykum</div>
    <p class="greet rv">${d.g ? 'Hurmatli ' + esc(d.g) + '!' : 'Aziz mehmon!'}</p>
    <p class="lead rv">${E.text(a, b)}</p>
    ${d.x ? `<p class="note rv">${esc(d.x)}</p>` : ''}
  </section>
  ${dt ? `<section class="sec">
    <div class="panel rv">
      <div class="eyebrow">Tantana sanasi</div>
      <div class="month">${MONTHS[dt.m-1]}</div><div class="year">${dt.y}</div>
      ${calendar(dt)}
      <div class="weekday">${WD[new Date(dt.y, dt.m-1, dt.d).getDay()]}</div>
      ${time ? `<div class="timebig">${time}</div>` : ''}
    </div>
  </section>
  <section class="sec">
    <div class="eyebrow rv">${E.until}</div>
    <div class="cd rv" data-t="${new Date(dt.y, dt.m-1, dt.d, time ? +time.slice(0,2) : 0, time ? +time.slice(3) : 0).getTime()}">
      <div><b data-u="d">0</b><small>Kun</small></div><div><b data-u="h">0</b><small>Soat</small></div><div><b data-u="m">0</b><small>Daqiqa</small></div><div><b data-u="s">0</b><small>Soniya</small></div>
    </div>
  </section>` : ''}
  <section class="sec">
    ${skyline()}
    <div class="eyebrow rv">Manzil</div>
    ${d.v ? `<p class="venue rv">${esc(d.v)}</p>` : ''}
    ${d.ad ? `<p class="addr rv">${esc(d.ad)}</p>` : ''}
    ${(d.v || d.ad || d.m) ? `<div class="ibtns rv">${mapBtns}</div>` : ''}
  </section>
  ${(d.p || tg || gcal) ? `<section class="sec">
    <div class="panel rv">
      <div class="eyebrow">Javobingizni kutamiz</div>
      <div class="month" style="font-size:clamp(34px,10cqi,44px)">Tashrifingizni tasdiqlang</div>
      ${d.p ? `<p class="phone-n">${esc(d.p)}</p>` : ''}
      <div class="ibtns">
        ${tg ? `<a class="ibtn fill" href="${esc(tg)}" target="_blank" rel="noopener">Telegramda javob berish</a>` : ''}
        ${tel ? `<a class="ibtn${tg ? '' : ' fill'}" href="tel:${esc(tel)}">Qo‘ng‘iroq qilish</a>` : ''}
        ${gcal ? `<a class="ibtn" href="${gcal}" target="_blank" rel="noopener">Kalendarga qo‘shish</a>` : ''}
      </div>
    </div>
  </section>` : ''}
  ${card ? `<section class="sec">
    <div class="panel rv">
      <div class="eyebrow">To‘yona</div>
      <div class="month" style="font-size:clamp(34px,10cqi,44px)">Tabriklaringiz uchun</div>
      <p class="note">Tashrif buyurishning imkoni bo‘lmasa yoki to‘yona yo‘llamoqchi bo‘lsangiz, quyidagi kartaga o‘tkazishingiz mumkin.</p>
      <div class="card-n">${card.pretty}</div>
      ${(card.brand || d.cn) ? `<div class="card-m">${[card.brand, esc(d.cn || '')].filter(Boolean).join(' · ')}</div>` : ''}
      <button type="button" class="ibtn fill copy-card" data-card="${card.n}">Raqamni nusxalash</button>
    </div>
  </section>` : ''}
  <section class="sec end">
    <div class="rv">${rosette(T.rose)}</div>
    <div class="eyebrow rv">Hurmat bilan</div>
    ${d.f ? `<div class="family rv">${esc(d.f)}</div>` : ''}
    <p class="thanks rv">Sizni intizorlik bilan kutib qolamiz</p>
    ${base ? `<a class="made" href="${esc(base)}" target="_blank" rel="noopener">Taklifnoma orqali yaratildi</a>` : ''}
  </section>`;
}
function coverHTML(d) {
  const E = EVENTS[d.e] || EVENTS.nikoh;
  const ini = E.hero ? '' : E.pair ? ((d.a||' ')[0] + ' ' + (d.b||' ')[0]).trim().toUpperCase().replace(' ', '·') : (d.a||'')[0]?.toUpperCase() || '';
  return `<div class="cover"><div class="bgp"></div><div class="vig"></div>
    <div class="cov-in">
      <div class="cov-t">Taklifnomani ochish uchun muhrni bosing</div>
      <div class="env">
        <div class="back"></div>
        <div class="letter"><div class="eyebrow">${E.label}</div><div class="lnm">${esc(namesOf(d))}</div></div>
        <div class="front"></div>
        <div class="flap"><div class="fe"></div><div class="fa"></div><div class="fb"></div></div>
        <div class="cord l"></div><div class="cord r"></div>
        <button type="button" class="seal" aria-label="Taklifnomani ochish">${sealSVG(ini)}</button>
      </div>
    </div></div>`;
}

/* ---------- zarrachalar ---------- */
function startFX(canvas, T) {
  if (reduce) return () => {};
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2), raf, ps = [];
  const fit = () => { W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W*dpr; canvas.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
  const ro = new ResizeObserver(fit); ro.observe(canvas); fit();
  const petal = T.fx === 'petal';
  const mk = (x, y, burst) => {
    const a = Math.random()*Math.PI*2, sp = burst ? 1.5 + Math.random()*4 : 0;
    return {x: x ?? Math.random()*W, y: y ?? Math.random()*H, vx: burst ? Math.cos(a)*sp : (Math.random()-.5)*.2,
      vy: burst ? Math.sin(a)*sp - 1.5 : (petal ? .25 + Math.random()*.35 : -(.1 + Math.random()*.25)),
      r: petal ? 3 + Math.random()*3 : .8 + Math.random()*1.8, rot: Math.random()*6, vr: (Math.random()-.5)*.04,
      c: T.fxc[Math.floor(Math.random()*T.fxc.length)], tw: Math.random()*6, life: burst ? 1 : -1};
  };
  for (let i = 0; i < (petal ? 16 : 34); i++) ps.push(mk());
  const tick = () => {
    if (!canvas.isConnected) { ro.disconnect(); return; }
    ctx.clearRect(0, 0, W, H);
    ps = ps.filter(p => p.life === -1 || p.life > 0);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.tw += .04;
      if (p.life > 0) { p.vy += .05; p.vx *= .985; p.life -= .009; }
      else { if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10; if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; }
      ctx.globalAlpha = (p.life > 0 ? p.life : .35 + .35*Math.sin(p.tw)) * (petal ? .7 : 1);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      if (petal) { ctx.ellipse(p.x, p.y, p.r*.55, p.r, p.rot, 0, Math.PI*2); }
      else { ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); }
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  tick();
  canvas._burst = (x, y) => { for (let i = 0; i < 70; i++) ps.push(mk(x, y, true)); };
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

/* ---------- taklifnomani joylash ---------- */
function mount(wrap, d, opts = {}) {
  wrap._cleanup?.();
  const key = TPL[d.t] ? d.t : 'ganch', T = TPL[key];
  applyVars(wrap, T, key);
  const music = window.TAKLIFNOMA_MUSIC?.create(d.mu, d.mq);
  const musBtn = music ? `<button type="button" class="mus" aria-label="Musiqa" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path class="x" d="M3 3l18 18"/></svg></button>` : '';
  wrap.innerHTML = `<div class="bgp"></div><div class="vig"></div><div class="stage">${inviteHTML(d, opts.base)}</div><canvas class="fx"></canvas>${musBtn}${opts.cover ? coverHTML(d) : ''}`;
  const mb = wrap.querySelector('.mus');
  const setMus = on => { if (!mb) return; on ? music.start() : music.pause(); mb.classList.toggle('on', on); mb.setAttribute('aria-pressed', String(on)); mb.setAttribute('aria-label', on ? 'Musiqani to‘xtatish' : 'Musiqani yoqish'); };
  mb?.addEventListener('click', () => setMus(!music.playing));
  wrap.querySelector('.copy-card')?.addEventListener('click', e => {
    const btn = e.currentTarget, num = btn.dataset.card;
    const ok = () => { btn.textContent = 'Nusxalandi'; setTimeout(() => btn.textContent = 'Raqamni nusxalash', 1800); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents(wrap.querySelector('.card-n')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(num).then(ok, sel); } catch (err) { sel(); }
  });
  const stage = wrap.querySelector('.stage'), bgp = wrap.querySelector('.bgp'), hint = wrap.querySelector('.scroll-hint');
  const stopFX = startFX(wrap.querySelector('.fx'), T);
  const canAnim = 'IntersectionObserver' in window && !reduce;
  if (canAnim && !opts.instant) stage.classList.add('anim');
  let io;
  const observe = () => {
    if (!canAnim) return;
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {root: stage, threshold: .18, rootMargin: '0px 0px -6% 0px'});
    stage.querySelectorAll('.rv').forEach(el => io.observe(el));
  };
  const onScroll = () => {
    if (!reduce) bgp.style.backgroundPositionY = (-stage.scrollTop * .22) + 'px';
    if (hint) hint.style.opacity = stage.scrollTop > 40 ? 0 : '';
  };
  stage.addEventListener('scroll', onScroll, {passive: true});
  if (opts.scroll) stage.scrollTop = opts.scroll;
  const cd = stage.querySelector('.cd');
  let timer;
  if (cd) {
    const t = +cd.dataset.t;
    const upd = () => {
      let s = Math.max(0, Math.floor((t - Date.now())/1000));
      if (s === 0) { cd.outerHTML = '<p class="cd-done">Tantana kuni keldi. Tashrifingizdan xursandmiz!</p>'; clearInterval(timer); return; }
      const v = {d: Math.floor(s/86400), h: Math.floor(s%86400/3600), m: Math.floor(s%3600/60), s: s%60};
      cd.querySelectorAll('b').forEach(b => b.textContent = b.dataset.u === 'd' ? v.d : pad(v[b.dataset.u]));
    };
    upd(); timer = setInterval(upd, 1000);
  }
  const cover = wrap.querySelector('.cover');
  if (cover) {
    const env = cover.querySelector('.env'), seal = cover.querySelector('.seal');
    seal.addEventListener('click', () => {
      cover.classList.add('opening'); env.classList.add('open');
      if (music) setMus(true);
      const r = seal.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      wrap.querySelector('.fx')._burst?.(r.left - w.left + r.width/2, r.top - w.top + r.height/2);
      const step = reduce ? 0 : 1;
      setTimeout(() => env.classList.add('low'), 500*step);
      setTimeout(() => env.classList.add('rise'), 750*step);
      setTimeout(() => { cover.classList.add('gone'); observe(); opts.onOpen?.(); }, 2100*step);
      setTimeout(() => cover.remove(), 3300*step);
    }, {once: true});
  } else observe();
  wrap._cleanup = () => { io?.disconnect(); clearInterval(timer); stopFX(); music?.stop(); };
  return stage;
}

/* ---------- havola kodlash ---------- */
const b64u = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); };
const unb64u = s => { s = s.replace(/-/g,'+').replace(/_/g,'/'); const bin = atob(s + '==='.slice((s.length + 3) % 4)); return Uint8Array.from(bin, c => c.charCodeAt(0)); };
async function encode(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  if ('CompressionStream' in window) {
    try { const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer(); return 'z' + b64u(new Uint8Array(buf)); } catch (e) {}
  }
  return 'j' + b64u(bytes);
}
async function decode(code) {
  let bytes = unb64u(code.slice(1));
  if (code[0] === 'z') bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
  return JSON.parse(new TextDecoder().decode(bytes));
}
let BASE = '';
try { if (window.top === window.self && /^(https?|file):$/.test(location.protocol)) BASE = location.href.split('#')[0]; } catch (e) {}

/* ---------- konstruktor ---------- */
// Buyurtma tugmasi qayerga olib boradi (Telegram yoki Instagram havolasi)
const CONTACT = 'https://t.me/m0minov?text=' + encodeURIComponent('Assalomu alaykum! Online taklifnoma buyurtma qilmoqchiman.');
const KEY_LS = 'taklif-key';
const getKey = () => { try { return localStorage.getItem(KEY_LS) || ''; } catch (e) { return ''; } };
async function checkKey(key) {
  if (!/^https?:$/.test(location.protocol)) return true;
  try { const r = await fetch('/api/auth', {headers: {'x-key': key}}); return r.ok; } catch (e) { return true; }
}
function setAdmin(on) {
  document.querySelectorAll('.adm').forEach(el => el.hidden = !on);
  $('#gate').hidden = on;
  $('#openfull').hidden = !on;
}
const FIELDS = ['e','g','a','b','d','h','v','ad','m','p','tg','ck','cn','mu','mq','f','x'];
const SAMPLE = {t:'samarqand', e:'nikoh', a:'Jasur', b:'Madina', g:'', d:'2026-11-21', h:'18:00', v:'“Oqsaroy” to‘yxonasi', ad:'Toshkent sh., Yunusobod tumani, Amir Temur ko‘chasi, 108', m:'', p:'+998 90 123 45 67', tg:'', ck:'', cn:'', mu:'dutor', mq:'', f:'Karimovlar va Rahimovlar oilalari', x:''};
let state = {...SAMPLE};
try { const s = JSON.parse(localStorage.getItem('taklifnoma-draft') || 'null'); if (s && typeof s === 'object') state = {...SAMPLE, ...s}; } catch (e) {}

function buildBuilder() {
  $('#f-e').innerHTML = Object.entries(EVENTS).map(([k, E]) => `<option value="${k}">${E.label}</option>`).join('');
  $('#tpls').innerHTML = Object.entries(TPL).map(([k, T]) => `<button type="button" class="tpl" data-k="${k}" aria-pressed="false"><div class="sw" data-sw="${k}">${T.thumb ? `<img src="${T.thumb}" alt="" loading="lazy">` : '<div class="bgp"></div><div class="se"></div><div class="ss"></div>'}</div><b>${T.name}</b><small>${T.desc}</small></button>`).join('');
  document.querySelectorAll('[data-sw]').forEach(el => applyVars(el, TPL[el.dataset.sw], el.dataset.sw));
  document.querySelectorAll('.tpl').forEach(b => b.addEventListener('click', () => { state.t = b.dataset.k; syncTpl(); changed(true); }));
  FIELDS.forEach(k => { const el = $('#f-' + k); el.value = state[k] || ''; el.addEventListener('input', () => { state[k] = el.value.trim(); if (k === 'e') syncLabels(); if (k === 'mu' || k === 'ck') syncExtras(); changed(); }); });
  $('#f-file').addEventListener('change', uploadMusic);
  syncTpl(); syncLabels(); syncExtras();
  let opened = false;
  const pv = $('#pv');
  const render = (cover) => mount(pv, state, {cover, base: BASE, scroll: cover ? 0 : pv.querySelector('.stage')?.scrollTop, onOpen: () => opened = true});
  render(true);
  let t;
  window.__changed = (now) => { clearTimeout(t); t = setTimeout(() => { if (!opened && pv.querySelector('.cover')) render(true); else { opened = true; mount(pv, state, {base: BASE, scroll: pv.querySelector('.stage')?.scrollTop, instant: true}); } }, now ? 0 : 280); };
  $('#replay').addEventListener('click', () => { opened = false; render(true); });
  $('#openfull').addEventListener('click', () => { $('#full').hidden = false; document.body.style.overflow = 'hidden'; mount($('#fullwrap'), state, {cover: true, base: BASE}); });
  $('#closefull').addEventListener('click', () => { $('#fullwrap')._cleanup?.(); $('#fullwrap').innerHTML = ''; $('#full').hidden = true; document.body.style.overflow = ''; });
  $('#form').addEventListener('submit', async e => { e.preventDefault(); await generate(); });
  $('#order').href = CONTACT || '#'; $('#order').hidden = !CONTACT;
  $('#demo').addEventListener('click', () => $('#openfull').click());
  $('#login').addEventListener('click', async () => {
    const k = $('#key').value.trim();
    $('#key-st').textContent = 'Tekshirilmoqda…';
    if (await checkKey(k)) { try { localStorage.setItem(KEY_LS, k); } catch (e) {} $('#key-st').textContent = ''; setAdmin(true); }
    else $('#key-st').textContent = 'Parol noto‘g‘ri.';
  });
  setAdmin(false);
  checkKey(getKey()).then(setAdmin);
  $('#copy').addEventListener('click', () => {
    const url = $('#link').textContent, btn = $('#copy');
    const done = () => { btn.textContent = 'Nusxalandi'; setTimeout(() => btn.textContent = 'Nusxa olish', 1800); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents($('#link')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Belgilandi, nusxa oling'; };
    try { navigator.clipboard.writeText(url).then(done, sel); } catch (e) { sel(); }
  });
}
function syncTpl() { document.querySelectorAll('.tpl').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === state.t))); }
function syncLabels() {
  const E = EVENTS[state.e] || EVENTS.nikoh;
  $('#l-a').textContent = E.la; $('#f-a').placeholder = E.ph || '';
  $('#w-b').hidden = !E.pair; $('#l-b').textContent = E.lb || '';
}
function syncExtras() {
  $('#w-mq').hidden = state.mu !== 'f';
  if (state.mu === 'f' && !$('#mq-st').textContent) $('#mq-st').textContent = state.mq ? 'Fayl yuklangan. Boshqasini tanlash mumkin.' : '';
  const n = (state.ck || '').replace(/\D/g, '');
  $('#ck-err').hidden = !n || !!cardInfo(n);
}
function changed(now) {
  try { localStorage.setItem('taklifnoma-draft', JSON.stringify(state)); } catch (e) {}
  $('#result').hidden = true;
  window.__changed?.(now);
}
async function uploadMusic(e) {
  const file = e.target.files[0], st = $('#mq-st');
  if (!file) return;
  if (file.size > 5*1024*1024) { st.textContent = 'Fayl 5 MB dan katta. Qisqaroq yoki siqilgan mp3 tanlang.'; e.target.value = ''; return; }
  st.textContent = 'Yuklanmoqda…';
  try {
    const r = await fetch('/api/music', {method: 'POST', headers: {'content-type': file.type || 'application/octet-stream', 'x-key': getKey()}, body: file});
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.id) throw new Error(j.error || 'Yuklab bo‘lmadi');
    state.mq = j.id; $('#f-mq').value = j.id;
    st.textContent = `“${file.name}” yuklandi.`;
    changed(true);
  } catch (err) { st.textContent = (err.message || 'Yuklab bo‘lmadi') + '. Qaytadan urinib ko‘ring.'; e.target.value = ''; }
}
let saved = {key: '', id: ''};
async function saveShort(data) {
  const key = JSON.stringify(data);
  if (saved.key === key) return saved.id;
  try {
    const r = await fetch('/api/invite', {method: 'POST', headers: {'content-type': 'application/json', 'x-key': getKey()}, body: key});
    const j = await r.json();
    if (r.ok && /^[A-Za-z0-9]{7}$/.test(j.id || '')) { saved = {key, id: j.id}; return j.id; }
  } catch (e) {}
  return '';
}
async function generate() {
  const E = EVENTS[state.e] || EVENTS.nikoh, data = {t: state.t};
  FIELDS.forEach(k => { if (state[k] && (k !== 'b' || E.pair)) data[k] = state[k]; });
  if (data.mu === 'f' && !data.mq) delete data.mu;
  const btn = $('#gen'), label = btn.textContent;
  btn.disabled = true; btn.textContent = 'Havola tayyorlanmoqda…';
  const code = (BASE && /^https?:$/.test(location.protocol) && await saveShort(data)) || await encode(data);
  btn.disabled = false; btn.textContent = label;
  const base = BASE || 'https://sizning-saytingiz.uz/';
  const url = base + '#' + code;
  $('#link').textContent = url;
  $('#go').href = url; $('#go').hidden = !BASE;
  $('#hostnote').hidden = !!BASE;
  const who = state.g ? `Hurmatli ${state.g}, ` : '';
  $('#tg').href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(who + E.label.toLowerCase() + 'ga taklifnoma: ' + namesOf(state))}`;
  const qr = $('#qr'); qr.innerHTML = '';
  if (window.QRCode) { try { new QRCode(qr, {text: url, width: 132, height: 132, colorDark: '#10183A', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.M}); } catch (e) { qr.hidden = true; } } else qr.hidden = true;
  $('#result').hidden = false;
  $('#result').scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'nearest'});
}

/* ---------- ishga tushirish ---------- */
async function load(h) {
  if (/^[A-Za-z0-9]{7}$/.test(h)) {
    const r = await fetch('/api/invite/' + h);
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }
  return decode(h);
}
async function boot() {
  const h = location.hash.slice(1);
  if (/^[zj][A-Za-z0-9_-]{16,}$/.test(h) || /^[A-Za-z0-9]{7}$/.test(h)) {
    $('#app').hidden = true;
    try {
      const d = await load(h);
      $('#app').hidden = true; $('#solo').hidden = false; document.body.classList.add('solo');
      document.title = `${(EVENTS[d.e] || EVENTS.nikoh).label} · ${namesOf(d)}`;
      mount($('#solowrap'), d, {cover: true, base: BASE});
      return;
    } catch (e) { $('#app').hidden = false; const el = $('#err'); el.hidden = false; el.textContent = 'Bu taklifnoma havolasi buzilgan yoki to‘liq nusxalanmagan. Havolani yuborgan odamdan uni qaytadan so‘rang.'; }
  }
  buildBuilder();
}
addEventListener('hashchange', () => location.reload());
boot();
})();
