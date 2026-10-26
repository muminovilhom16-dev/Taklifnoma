/* Taklifnoma API (Netlify Functions + Netlify Blobs).
   POST /api/invite        taklifnoma ma'lumotini saqlaydi, qisqa id qaytaradi
   GET  /api/invite/:id    saqlangan taklifnoma
   POST /api/music         mp3/m4a/ogg fayl (5 MB gacha), id qaytaradi
   GET  /api/music/:id     faylni beradi (Range so'rovlari bilan, iPhone uchun shart)
   GET  /api/auth          x-key sarlavhasidagi parolni tekshiradi
   GET  /api/hidden        yashirilgan shablonlar ro'yxati
   POST /api/hidden        {hidden: ['kalit', ...]} ro'yxatni saqlaydi
   Netlify'da TAKLIF_KEY o'zgaruvchisi qo'yilsa, yozish (POST) faqat shu parol bilan ishlaydi. */
import { getStore } from '@netlify/blobs';

const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const newId = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => ABC[b % ABC.length]).join('');
const MAX_INVITE = 16 * 1024, MAX_MUSIC = 5 * 1024 * 1024;
const KEYS = ['t','e','a','b','g','d','h','v','ad','m','p','tg','ck','cn','mu','mq','f','x'];
const authed = req => { const k = process.env.TAKLIF_KEY; return !k || req.headers.get('x-key') === k; };
const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json; charset=utf-8', ...extra}});

function audioType(b) {
  const s = String.fromCharCode(...b.subarray(0, 12));
  if (s.startsWith('ID3') || (b[0] === 0xFF && (b[1] & 0xE0) === 0xE0)) return 'audio/mpeg';
  if (s.slice(4, 8) === 'ftyp') return 'audio/mp4';
  if (s.startsWith('OggS')) return 'audio/ogg';
  return '';
}

async function readLimited(req, max) {
  const len = +req.headers.get('content-length') || 0;
  if (len > max) return null;
  const buf = new Uint8Array(await req.arrayBuffer());
  return buf.length > max ? null : buf;
}

export default async (req) => {
  const url = new URL(req.url);
  const [, , kind, id] = url.pathname.split('/');
  const invites = getStore({name: 'invites', consistency: 'strong'});
  const music = getStore({name: 'music', consistency: 'strong'});
  const settings = getStore({name: 'settings', consistency: 'strong'});

  if (kind === 'auth') return authed(req) ? json({ok: true}) : json({error: 'Parol noto‘g‘ri'}, 401);
  if (req.method === 'POST' && !authed(req)) return json({error: 'Parol noto‘g‘ri'}, 401);
  if (kind === 'hidden' && req.method === 'GET') {
    const d = await settings.get('hidden', {type: 'json'});
    return json({hidden: Array.isArray(d) ? d : []}, 200, {'cache-control': 'no-store'});
  }
  if (kind === 'hidden' && req.method === 'POST') {
    let d;
    try { d = await req.json(); } catch { return json({error: 'Noto‘g‘ri ma’lumot'}, 400); }
    const list = Array.isArray(d?.hidden) ? d.hidden : null;
    if (!list || list.length > 50 || !list.every(k => typeof k === 'string' && /^[a-z0-9]{2,24}$/.test(k))) return json({error: 'Noto‘g‘ri ma’lumot'}, 400);
    await settings.setJSON('hidden', [...new Set(list)]);
    return json({ok: true});
  }
  if (kind === 'invite' && req.method === 'POST' && !id) {
    const buf = await readLimited(req, MAX_INVITE);
    if (!buf) return json({error: 'Juda katta'}, 413);
    let d;
    try { d = JSON.parse(new TextDecoder().decode(buf)); } catch { return json({error: 'Noto‘g‘ri ma’lumot'}, 400); }
    if (!d || typeof d !== 'object' || Array.isArray(d)) return json({error: 'Noto‘g‘ri ma’lumot'}, 400);
    const clean = {};
    for (const k of KEYS) if (typeof d[k] === 'string' && d[k]) clean[k] = d[k].slice(0, 1200);
    let key = newId(7);
    while (await invites.getMetadata(key)) key = newId(7);
    await invites.setJSON(key, clean, {metadata: {at: Date.now()}});
    return json({id: key}, 201);
  }
  if (kind === 'invite' && req.method === 'GET' && /^[A-Za-z0-9]{7}$/.test(id || '')) {
    const d = await invites.get(id, {type: 'json'});
    return d ? json(d, 200, {'cache-control': 'public, max-age=300'}) : json({error: 'Topilmadi'}, 404);
  }

  if (kind === 'music' && req.method === 'POST' && !id) {
    const buf = await readLimited(req, MAX_MUSIC);
    if (!buf) return json({error: 'Fayl 5 MB dan katta'}, 413);
    const type = audioType(buf);
    if (!type) return json({error: 'Faqat mp3, m4a yoki ogg fayl yuklang'}, 415);
    const key = newId(10);
    await music.set(key, buf, {metadata: {type, size: buf.length, at: Date.now()}});
    return json({id: key}, 201);
  }
  if (kind === 'music' && (req.method === 'GET' || req.method === 'HEAD') && /^[A-Za-z0-9]{10}$/.test(id || '')) {
    const r = await music.getWithMetadata(id, {type: 'arrayBuffer'});
    if (!r) return new Response('Topilmadi', {status: 404});
    const all = new Uint8Array(r.data), size = all.length;
    const h = {'content-type': r.metadata?.type || 'audio/mpeg', 'accept-ranges': 'bytes', 'cache-control': 'public, max-age=31536000, immutable'};
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range') || '');
    if (m) {
      let start = m[1] === '' ? Math.max(0, size - +m[2]) : +m[1];
      let end = m[1] !== '' && m[2] !== '' ? Math.min(+m[2], size - 1) : size - 1;
      if (start >= size || start > end) return new Response(null, {status: 416, headers: {...h, 'content-range': `bytes */${size}`}});
      return new Response(req.method === 'HEAD' ? null : all.subarray(start, end + 1), {status: 206, headers: {...h, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': String(end - start + 1)}});
    }
    return new Response(req.method === 'HEAD' ? null : all, {headers: {...h, 'content-length': String(size)}});
  }
  return json({error: 'Topilmadi'}, 404);
};

export const config = { path: '/api/*' };
