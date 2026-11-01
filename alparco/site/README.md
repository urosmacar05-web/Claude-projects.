# Al Parco – web stranica

Statički sajt (čisti HTML/CSS/JS, bez build koraka). Radi na bilo kom hostingu:
Netlify, Vercel, GitHub Pages, Cloudflare Pages ili običan cPanel hosting.

## Struktura

```
site/
├── index.html            Početna (hero, o nama, novo u ponudi, jelovnik, prostor, rezervacija, kontakt)
├── meni.html             Cijeli jelovnik po kategorijama
└── assets/
    ├── css/style.css     Svi stilovi (boje su na vrhu, u :root)
    ├── css/fonts.css     Lokalno hostovani fontovi (Playfair Display, Karla, Allura)
    ├── js/menu-data.js   ★ JELOVNIK – jedino mjesto za izmjenu jela i cijena
    ├── js/i18n.js        Engleski prevodi (srpski tekst je direktno u HTML-u)
    ├── js/main.js        Animacije, rezervacija, galerija, promjena jezika
    ├── img/jela/         Fotografije jela
    ├── img/prostor/      Fotografije enterijera
    └── fonts/
```

## Česte izmjene

**Dodati cijene:** u `assets/js/menu-data.js` promijenite `price: null` u npr. `price: "14,50 KM"`.
Cijena se automatski prikazuje na stranici jelovnika.

**Dodati / promijeniti jelo:** kopirajte jedan red u `menu-data.js`, upišite naziv i sastojke na
srpskom (`sr`) i engleskom (`en`). Za prikaz u karuselu na početnoj dodajte `img` i `featured: true`.

**Zamijeniti fotografije enterijera:** sačuvajte nove slike pod istim imenom u `assets/img/prostor/`
(`bar.webp`, `terasa.webp`, `salon.webp`, `lounge.webp`, `vino.webp`, `logo-zid.webp`).
Preporuka: WebP, širina 1600 px, kvalitet ~80.

**Rezervacije** otvaraju WhatsApp ka broju +387 57 344 744 (`PHONE_WA` na vrhu `main.js`).

**Pokretanje lokalno:** `python3 -m http.server` u ovom folderu, pa otvorite http://localhost:8000.

## Šta je ugrađeno

- Mobile-first dizajn, testiran na 390 px (iPhone) i 1440 px (desktop), bez horizontalnog skrola
- Animacije samo preko `transform`/`opacity` (glatko na telefonima), poštuje "smanjen pokret" u sistemu
- Sadržaj je vidljiv i bez JavaScripta (SEO)
- Srpski / engleski (pamti izbor; engleski se automatski nudi stranim posjetiocima)
- Status "Otvoreno sada / Zatvoreno" po sarajevskom vremenu
- Schema.org podaci za Google (restoran, adresa, radno vrijeme, telefon)
- Ukupna težina sajta ≈ 0,8 MB sa svim slikama i fontovima
