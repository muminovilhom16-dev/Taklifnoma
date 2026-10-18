# Taklifnoma

O‘zbekcha online taklifnoma yaratuvchi sayt. Statik sayt: server ham, baza ham kerak emas.

## Tuzilma
- `index.html`: sahifa (konstruktor va taklifnoma)
- `assets/templates.js`: shablonlar reestri (6 ta: Ganch, Samarqand, Suzani, Atlas, Xiva, Buxoro). Yangi shablon qo‘shish uchun `TEMPLATES.md` ga qarang.
- `assets/app.js`: taklifnoma chizish, animatsiyalar, havola yaratish
- `assets/style.css`: dizayn

## Qanday ishlaydi
Barcha ma’lumot siqilib, havolaning `#` qismiga yoziladi. Shuning uchun har bir taklifnoma va har bir mehmon uchun (“Mehmon ismi” maydoni) alohida havola chiqadi. Mehmon Telegram orqali javob yozishi yoki qo‘ng‘iroq qilishi mumkin.

## Joylash
Netlify: app.netlify.com/drop sahifasiga `taklifnoma` papkasini yoki zip faylni tashlang.

## Cheklovlar va keyingi bosqich
- Havola uzun (~350 belgi). Qisqa havola (`sayt.uz/jasur-madina`), javoblarni bitta ro‘yxatga yig‘ish va to‘lov uchun backend kerak.
- Ma’lumot o‘zgarsa, yangi havola yaratiladi.
