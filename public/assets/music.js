/* Taklifnoma musiqasi.
   O'rnatilgan kuylar brauzerda WebAudio orqali sintez qilinadi (fayl yo'q, mualliflik huquqi muammosi yo'q).
   'f' turida mezbon yuklagan fayl (/api/music/:id), eski 'url' turida mp3 havolasi ijro etiladi. */
(() => {
const TRACKS = {
  dutor: {name: 'Dutor kuyi'},
  nay: {name: 'Nay sadosi'}
};

// D hijoz ladiga yaqin tovushqator (Hz)
const N = {D3:146.83, Eb3:155.56, Fs3:185.00, G3:196.00, A3:220.00, Bb3:233.08, C4:261.63, D4:293.66, Eb4:311.13, Fs4:369.99, G4:392.00, A4:440.00, D2:73.42, A2:110.00};
const DUTOR = [
  ['D4',1],['A3',1],['Bb3',1],['A3',1],['G3',1],['Fs3',1],['G3',2],
  ['A3',1],['Bb3',1],['C4',1],['Bb3',1],['A3',2],['A3',2],
  ['D4',1],['Eb4',1],['Fs4',1],['G4',1],['Fs4',1],['Eb4',1],['D4',2],
  ['C4',1],['Bb3',1],['A3',1],['G3',1],['Fs3',1],['Eb3',1],['D3',2]
];
const NAY = [['A3',2],['Bb3',1],['A3',1],['G3',2],['Fs3',2],['G3',1],['A3',1],['Bb3',2],['A3',4],
  ['D4',2],['C4',1],['Bb3',1],['A3',2],['G3',2],['Fs3',1],['G3',1],['Eb3',2],['D3',4]];

function impulse(ctx, sec) {
  const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random()*2 - 1) * Math.pow(1 - i/len, 2.6); }
  return b;
}
// Karplus-Strong: tortilgan tor tovushi
const pluckCache = {};
function pluck(ctx, f, dur = 1.8, bright = .5) {
  const key = f + ':' + bright;
  if (pluckCache[key]) return pluckCache[key];
  const sr = ctx.sampleRate, len = Math.floor(sr*dur), p = Math.max(2, Math.round(sr/f));
  const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0), ring = new Float32Array(p);
  for (let i = 0; i < p; i++) ring[i] = Math.random()*2 - 1;
  let idx = 0, prev = 0;
  for (let i = 0; i < len; i++) {
    const cur = ring[idx], nxt = ring[(idx + 1) % p];
    const v = (cur + nxt) * .5 * .996;
    ring[idx] = v * bright + prev * (1 - bright); prev = ring[idx];
    d[i] = cur; idx = (idx + 1) % p;
  }
  return (pluckCache[key] = b);
}

function synth(kind) {
  let ctx, master, timer, next = 0, step = 0, on = false;
  const seq = kind === 'nay' ? NAY : DUTOR, beat = kind === 'nay' ? .42 : .2;
  const setup = () => {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const rev = ctx.createConvolver(); rev.buffer = impulse(ctx, kind === 'nay' ? 3.2 : 2.2);
    const wet = ctx.createGain(); wet.gain.value = kind === 'nay' ? .45 : .3;
    master.connect(ctx.destination); master.connect(rev); rev.connect(wet); wet.connect(ctx.destination);
  };
  const playNote = (name, t, len) => {
    const f = N[name];
    if (kind === 'nay') {
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f*2;
      lfo.frequency.value = 5.2; lg.gain.value = f*.006; lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      lp.type = 'lowpass'; lp.frequency.value = 1800;
      const d = len*beat;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .18); g.gain.setValueAtTime(.14, t + d*.7); g.gain.exponentialRampToValueAtTime(.001, t + d + .5);
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(master);
      [o, o2, lfo].forEach(x => { x.start(t); x.stop(t + d + .6); });
    } else {
      const s = ctx.createBufferSource(), g = ctx.createGain();
      s.buffer = pluck(ctx, f, 1.6, .55); g.gain.value = .34;
      s.connect(g); g.connect(master); s.start(t);
    }
  };
  const drone = (t) => {
    if (kind === 'nay') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = N.D2*2; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + 1); g.gain.linearRampToValueAtTime(0, t + 7.5);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 8);
    } else {
      [N.D2, N.A2].forEach((f, i) => { const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = pluck(ctx, f, 2.2, .35); g.gain.value = .22; s.connect(g); g.connect(master); s.start(t + i*.02); });
    }
  };
  const tick = () => {
    while (next < ctx.currentTime + .6) {
      const [name, len] = seq[step % seq.length];
      if (step % seq.length === 0 || (kind !== 'nay' && step % 4 === 0)) drone(next);
      playNote(name, next, len);
      next += len*beat; step++;
    }
  };
  return {
    start() {
      if (!ctx) setup();
      ctx.resume?.();
      on = true; next = ctx.currentTime + .1;
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(.9, ctx.currentTime + 1.5);
      clearInterval(timer); timer = setInterval(tick, 150); tick();
    },
    pause() { if (!ctx) return; on = false; clearInterval(timer); master.gain.linearRampToValueAtTime(0, ctx.currentTime + .4); },
    stop() { clearInterval(timer); on = false; try { ctx?.close(); } catch (e) {} ctx = null; },
    get playing() { return on; }
  };
}

function fromUrl(url) {
  const a = new Audio(); a.src = url; a.loop = true; a.preload = 'none'; a.volume = .8;
  let on = false;
  return {
    start() { on = true; a.play().catch(() => { on = false; }); },
    pause() { on = false; a.pause(); },
    stop() { on = false; a.pause(); a.removeAttribute('src'); a.load(); },
    get playing() { return on; }
  };
}

window.TAKLIFNOMA_MUSIC = {
  TRACKS,
  create(kind, url) {
    if (TRACKS[kind] && (window.AudioContext || window.webkitAudioContext)) return synth(kind);
    if (kind === 'f' && /^[A-Za-z0-9]{10}$/.test(url || '')) return fromUrl('/api/music/' + url);
    if (kind === 'url' && /^https:\/\//i.test(url || '')) return fromUrl(url);
    return null;
  }
};
})();
