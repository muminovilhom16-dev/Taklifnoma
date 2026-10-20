# Yangi shablon qo‘shish

Barcha shablonlar `public/assets/templates.js` faylidagi `TPL` obyektida turadi. Yangi shablon uchun bitta kalit qo‘shish kifoya, konstruktor uni avtomatik ko‘rsatadi.

```js
fargona: {
  name: 'Farg‘ona',                     // kartochkadagi nom
  desc: 'Rishton sopol naqshlari',      // qisqa tavsif
  vars: {                               // ranglar (hammasi majburiy)
    bg, bg2, panel, paper, 'l-ink', ink, soft, gold, accent,
    'on-gold', 'on-star', line, env, env2, seal, seal2, veil
  },
  pat: () => '<svg ...>',               // fon naqshi (takrorlanuvchi SVG plitka)
  size: '80px',                         // plitka o‘lchami
  op: .5,                               // fon naqshi shaffofligi
  rose: 'star' | 'suzani' | 'ikat',     // oxiridagi bezak
  fx: 'dust' | 'petal',                 // zarrachalar: oltin chang yoki gulbarg
  fxc: ['#hex', '#hex']                 // zarrachalar ranglari
}
```

Ranglar ma’nosi: `bg` fon, `ink` asosiy matn, `soft` ikkinchi darajali matn, `gold` chiziqlar va tugmalar, `accent` urg‘u (taqvimdagi yulduz), `env/env2` konvert, `seal/seal2` muhr, `veil` konvert ustidagi naqshni yumshatuvchi parda, `paper/l-ink` konvert ichidagi xat.

Muhim: kalit nomini keyin o‘zgartirmang. Yaratilgan havolalar shablonni shu kalit bo‘yicha topadi.

## Rasmli shablon (illyustratsiya bilan)

`milliy`, `gilam`, `anor`, `oydin` shablonlari tepada to‘liq rasm ko‘rsatadi, ism va sana esa rasmning bo‘sh joyiga matn bo‘lib tushadi.

1. Rasmni `public/assets/img/<kalit>.webp` (eni 768–900px) va kichik nusxasini `public/assets/img/<kalit>-s.webp` (eni 240px) qilib saqlang.
2. TPL ga `img`, `thumb`, `ar` (rasm eni/bo‘yi, masalan `'768/1376'`), `box` (matn joyi: `[x0, y0, x1, y1]`, 0–1 ulushda), `nf` (ism shrift o‘lchami, rasm enining % ida) va `bism` (bismilloh ko‘rsatilsinmi) qo‘shing.
3. `vars.bg` ni rasm qog‘ozi rangiga moslang, shunda rasm pastki qismi sahifaga qo‘shilib ketadi.

## To‘liq sahnali shablon (`lux: true`, masalan `oqmuhr`)

Bunday shablonni `public/assets/lux.js` chizadi: bo‘rtma oq konvert va mum muhr, ochilganda nur bilan ajraladigan qopqoqlar, rasmli hero, tirnab ochiladigan sana, bo‘rtma ravoqli taklif kartasi, oyat, to‘y dasturi (vaqt chizig‘i), qolgan vaqt va manzil rasmi.

TPL maydonlari: `img` va `ar` (hero rasm), `box` (rasmdagi matn joyi), `lamps` (fonar nuri: `[[chapdan %, tepadan %], ...]`, o‘ng tomoni avtomatik aks ettiriladi), `venue` (manzil bo‘limidagi rasm, ixtiyoriy).

Konstruktordagi “Kuyovning ota-onasi” (`pa`), “Kelinning ota-onasi” (`pb`) va “To‘y dasturi” (`pr`, har qatorda `18:00 Nomi`) maydonlari faqat shu shablonlarda ko‘rinadi. Dastur qatoridagi so‘zga qarab rasm tanlanadi (kutib olish: darvoza, kelin-kuyov: uzuklar, nikoh/duo: mehrob, ziyofat: choynak, bazm: doira, tort: tort, mushak: salyut).
