# Yangi shablon qo‘shish

Barcha shablonlar `assets/templates.js` faylidagi `TPL` obyektida turadi. Yangi shablon uchun bitta kalit qo‘shish kifoya, konstruktor uni avtomatik ko‘rsatadi.

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
