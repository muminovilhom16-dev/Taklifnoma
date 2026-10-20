# Taklifnoma

O‘zbekcha online taklifnoma yaratuvchi sayt. Statik sayt: server ham, baza ham kerak emas.

## Tuzilma
- `index.html`: sahifa (konstruktor va taklifnoma)
- `public/assets/templates.js`: shablonlar reestri (naqshli, rasmli va “Oq muhr” kabi to‘liq sahnali shablonlar). Yangi shablon qo‘shish uchun `TEMPLATES.md` ga qarang.
- `public/assets/lux.js`: “Oq muhr” kabi to‘liq sahnali shablonlar (bo‘rtma konvert, tirnab ochiladigan sana, to‘y dasturi)
- `public/assets/app.js`: taklifnoma chizish, animatsiyalar, havola yaratish, to‘yona kartasi
- `public/assets/music.js`: musiqa (brauzerda sintez qilinadigan “Dutor kuyi” va “Nay sadosi”, yoki mezbonning mp3 havolasi)
- `public/assets/style.css`: dizayn

## Qanday ishlaydi
Barcha ma’lumot siqilib, havolaning `#` qismiga yoziladi. Shuning uchun har bir taklifnoma va har bir mehmon uchun (“Mehmon ismi” maydoni) alohida havola chiqadi. Mehmon Telegram orqali javob yozishi yoki qo‘ng‘iroq qilishi mumkin.

## Joylash
Netlify: app.netlify.com/drop sahifasiga `taklifnoma` papkasini yoki zip faylni tashlang.

## Cheklovlar va keyingi bosqich
- Havola uzun (~350 belgi). Qisqa havola (`sayt.uz/jasur-madina`), javoblarni bitta ro‘yxatga yig‘ish va to‘lov uchun backend kerak.
- Ma’lumot o‘zgarsa, yangi havola yaratiladi.

## Server qismi (Netlify Functions)

- `netlify/functions/api.mjs`: qisqa havola (`/api/invite`) va musiqa fayllari (`/api/music`, 5 MB gacha). Ma’lumot Netlify Blobs’da saqlanadi.
- Qisqa havola ko‘rinishi: `https://taklif-uz.netlify.app/#Ab3xK9p`. Server ishlamasa, konstruktor avvalgidek uzun havola yaratadi; eski uzun havolalar ham ishlayveradi.
