/* Buyurtma landing sahifasi: shablonlar galereyasi, scroll sahnasi va Telegram havolalari. */
(() => {
const TG = 'https://t.me/m0minov';
const tgUrl = msg => TG + '?text=' + encodeURIComponent(msg);
const {TPL, star} = window.TAKLIFNOMA;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hoverable = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Ko'rsatish tartibi: avval eng ko'p yoqadiganlari
const ORDER = ['oqmuhr','samarqand','milliy','anor','oydin','gilam','ganch','suzani','atlas','xiva','buxoro'];
const CAT = k => TPL[k].lux ? ['lux', 'Premium'] : TPL[k].img ? ['rasm', 'Rasmli'] : ['naqsh', 'Naqshli'];
const orderMsg = k => `Assalomu alaykum! “${TPL[k].name}” shablonida taklifnoma buyurtma qilmoqchiman.`;

$$('.logo-star').forEach(p => p.setAttribute('points', star(0, 0, 13, 6.8)));
$$('.tg-link[data-msg]').forEach(a => a.href = tgUrl(a.dataset.msg));
$('#yr').textContent = new Date().getFullYear();

/* ---------- nomlar lentasi ---------- */
const starSvg = `<svg viewBox="-12 -12 24 24" aria-hidden="true"><polygon points="${star(0, 0, 11, 5)}" fill="currentColor"/></svg>`;
const names = ORDER.map(k => `<span>${starSvg}${TPL[k].name}</span>`).join('');
$('#strip').innerHTML = names + names;

/* ---------- shablonlar ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#grid').innerHTML = ORDER.map((k, i) => {
  const T = TPL[k], [c, cl] = CAT(k);
  return `<article class="card glass rv" data-k="${k}" data-c="${c}" style="--d:${(i % 4) * .08}s;--r:${[-2, 1.5, -1, 2][i % 4]}deg">
    <div class="thumb" role="button" tabindex="0" aria-label="${esc(T.name)} namunasini ko‘rish">
      <span class="tag ${c === 'lux' ? 'lux' : ''}">${cl}</span>
      <img src="assets/landing/v/${k}.webp" alt="${esc(T.name)} shabloni" loading="lazy" decoding="async">
      <span class="play-ic" aria-hidden="true"></span>
    </div>
    <h3>${esc(T.name)}</h3><p>${esc(T.desc)}</p>
    <div class="row">
      <button class="pill ghost" data-view>Ko‘rish</button>
      <a class="pill dark" href="${tgUrl(orderMsg(k))}" target="_blank" rel="noopener">Buyurtma</a>
    </div></article>`;
}).join('');

$$('.card').forEach(card => {
  const k = card.dataset.k, th = card.querySelector('.thumb');
  const open = () => openModal(k);
  th.addEventListener('click', open);
  th.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  card.querySelector('[data-view]').addEventListener('click', open);
  if (!hoverable || reduce) return;
  let v;
  th.addEventListener('pointerenter', () => {
    if (!v) { v = Object.assign(document.createElement('video'), {src: `assets/landing/v/${k}.mp4`, muted: true, loop: true, playsInline: true}); th.insertBefore(v, th.querySelector('.play-ic')); }
    v.currentTime = 0; v.play().then(() => card.classList.add('play'), () => {});
  });
  th.addEventListener('pointerleave', () => { card.classList.remove('play'); v?.pause(); });
});

$$('.chip').forEach(ch => ch.addEventListener('click', () => {
  const f = ch.dataset.f;
  $$('.chip').forEach(c => c.setAttribute('aria-selected', String(c === ch)));
  $$('.card').forEach(card => card.classList.toggle('gone', f !== 'all' && card.dataset.c !== f));
}));

/* ---------- modal ---------- */
const modal = $('#modal'), mv = $('#m-v');
let lastFocus;
function openModal(k) {
  const T = TPL[k];
  lastFocus = document.activeElement;
  $('#m-name').textContent = T.name;
  $('#m-desc').textContent = T.desc;
  $('#m-cat').textContent = CAT(k)[1] + ' shablon';
  $('#m-order').href = tgUrl(orderMsg(k));
  mv.poster = `assets/landing/v/${k}.webp`;
  mv.src = `assets/landing/v/${k}.mp4`;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  mv.play().catch(() => {});
  modal.querySelector('.m-x').focus();
}
function closeModal() {
  mv.pause(); mv.removeAttribute('src'); mv.load();
  modal.hidden = true; document.body.style.overflow = '';
  lastFocus?.focus();
}
modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

/* ---------- paydo bo'lish ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px', threshold: .08});
$$('.rv').forEach(el => el.closest('.hero') ? requestAnimationFrame(() => el.classList.add('in')) : io.observe(el));
// Hero matnlari ketma-ket chiqadi
$$('.hero .rv').forEach((el, i) => el.style.setProperty('--d', (.25 + i * .12) + 's'));

/* ---------- scroll: nav, hero, sahna ---------- */
const nav = $('#nav'), fab = $('.fab'), hero = $('#hero'), story = $('#jarayon'), pin = story.querySelector('.story-pin');
const words = $$('.bigw'), steps = $$('.st'), dots = $$('.st-dots i'), sv = $('.scr-v');
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
let svOn = false, lastStep = -1, ticking = false;

function frame() {
  ticking = false;
  const y = scrollY, vh = innerHeight;
  nav.classList.toggle('on', y > 30);
  fab.classList.toggle('on', y > vh * .7);
  if (reduce) return;
  hero.style.setProperty('--hp', clamp(y / vh).toFixed(4));

  const r = story.getBoundingClientRect(), total = r.height - vh;
  const p = clamp(-r.top / total);
  const near = r.top < vh && r.bottom > 0;
  if (near !== svOn) { svOn = near; if (near) { sv.preload = 'auto'; sv.play().catch(() => {}); } else sv.pause(); }
  if (!near) return;
  const s = p * 3;                                   // 0..3: uch bosqich
  words.forEach((w, i) => {
    const d = s - i - .5;                            // -0.5..0.5 o'z bosqichida
    const o = i === 0 && d < 0 ? 1 : i === 2 && d > 0 ? 1 : clamp(1 - Math.abs(d) * 1.9);
    const x = i === 0 && d < 0 ? 0 : i === 2 && d > 0 ? 0 : -d * 70;
    w.style.opacity = o.toFixed(3);
    w.style.transform = `translate3d(${x.toFixed(2)}vw,0,0) scale(${(1 - Math.abs(d) * .12).toFixed(3)})`;
  });
  const st = Math.min(2, Math.floor(s));
  if (st !== lastStep) { lastStep = st; steps.forEach((e, i) => e.classList.toggle('on', i === st)); dots.forEach((e, i) => e.classList.toggle('on', i === st)); }
  pin.style.setProperty('--f', (1 - ease(clamp((s - .55) / .6))).toFixed(4));      // kartalar yig'iladi
  const c = clamp((s - 1.05) / .7);                                                   // chat xabarlari
  pin.style.setProperty('--c', (s < 2.2 ? ease(clamp((s - 1) / .25)) : 1 - ease(clamp((s - 2.2) / .35))).toFixed(4));
  pin.classList.toggle('c1', c > .05 && s < 2.25); pin.classList.toggle('c2', c > .45 && s < 2.25); pin.classList.toggle('c3', c > .85 && s < 2.25);
  pin.style.setProperty('--sh', ease(clamp((s - 2.15) / .45)).toFixed(4));           // havola chiqadi
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
addEventListener('scroll', onScroll, {passive: true});
addEventListener('resize', onScroll);
frame();
if (reduce) { steps.forEach(e => e.classList.add('on')); sv.preload = 'metadata'; }
})();
