(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const PHONE_WA = '38260086745';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Fleet data ---------------- */
  const FLEET = [
    { id: 'skoda-octavia', brand: 'Škoda', model: 'Octavia', fuel: 'diesel', gear: 'manual', seats: 5,
      imgs: ['octavia-front', 'octavia-side', 'octavia-rear', 'octavia-interior-front'] },
    { id: 'vw-sharan', brand: 'Volkswagen', model: 'Sharan', fuel: 'diesel', gear: 'automatic', seats: 7,
      imgs: ['sharan-front-side', 'sharan-rear-side', 'sharan-rear', 'sharan-interior-front', 'sharan-interior-seats'] },
    { id: 'vw-touran-automatic', brand: 'Volkswagen', model: 'Touran', fuel: 'diesel', gear: 'automatic', seats: 7, extra: '2.0 TDI',
      imgs: ['touran-front-side', 'touran-rear', 'touran-side', 'touran-interior-front', 'touran-interior-seats'] },
    { id: 'vw-touran-manual', brand: 'Volkswagen', model: 'Touran', fuel: 'diesel', gear: 'manual',
      imgs: ['touran-front-side', 'touran-front', 'touran-side', 'touran-interior-dashboard'] },
    { id: 'vw-golf-plus-automatic', brand: 'Volkswagen', model: 'Golf Plus', fuel: 'diesel', gear: 'automatic', seats: 5,
      imgs: ['golf-plus-front-side', 'golf-plus-rear-side', 'golf-plus-interior-front', 'golf-plus-interior-rear'] },
    { id: 'vw-golf-plus-manual', brand: 'Volkswagen', model: 'Golf Plus', fuel: 'diesel', gear: 'manual', seats: 5,
      imgs: ['golf-plus-rear-side', 'golf-plus-side', 'golf-plus-rear', 'golf-plus-interior-front'] },
    { id: 'vw-polo', brand: 'Volkswagen', model: 'Polo', fuel: 'petrol', gear: 'manual', seats: 5,
      imgs: ['polo-front', 'polo-back', 'polo-interior-dashboard', 'polo-interior-seats'] },
    { id: 'peugeot-208', brand: 'Peugeot', model: '208', fuel: 'diesel', gear: 'manual', seats: 5,
      imgs: ['208-front-side', '208-rear-side', '208-interior-dashboard', '208-interior-side'] },
    { id: 'peugeot-107', brand: 'Peugeot', model: '107', fuel: 'petrol', gear: 'automatic', seats: 4,
      imgs: ['107-front-side', '107-rear-side', '107-interior-front', '107-interior-rear-seats'] },
  ];
  const src = (car, name) => `img/${car.id}/${name}.webp`;

  /* ---------------- i18n ---------------- */
  const I18N = {
    me: {
      'skip': 'Preskoči na sadržaj',
      'nav.fleet': 'Flota', 'nav.why': 'Zašto mi', 'nav.how': 'Kako funkcioniše', 'nav.contact': 'Kontakt', 'nav.call': 'Pozovite',
      'hero.pill': 'Iznajmljivanje vozila · Crna Gora',
      'hero.t1': 'Crna Gora počinje', 'hero.t2': 'iza volana.',
      'hero.lead': 'Od Kotora do Durmitora, vozilo za svaki put. Izaberite auto, javite datume i krenite. Rezervacija traje par minuta, pozivom ili porukom.',
      'book.car': 'Vozilo', 'book.from': 'Preuzimanje', 'book.to': 'Vraćanje', 'book.go': 'Provjeri dostupnost',
      'book.note': 'Šaljemo upit na WhatsApp. Odgovaramo brzo.',
      'book.err': 'Datum vraćanja mora biti poslije datuma preuzimanja.',
      'book.open': 'WhatsApp se nije otvorio? Kliknite ovdje.',
      'book.msg': 'Zdravo! Zanima me {car} od {from} do {to}. Da li je dostupno i koja je cijena?',
      'trust.cars': 'vozila', 'trust.gear': 'Automatik i manuelni', 'trust.seats': 'Do 7 sjedišta', 'trust.fuel': 'Dizel i benzin',
      'fleet.eyebrow': 'Naša flota',
      'fleet.title': 'Izaberite vozilo <span class="hl">za vaš put</span>',
      'fleet.lead': 'Kliknite na vozilo da vidite sve fotografije i rezervišete ga direktno.',
      'filter.all': 'Sva vozila', 'filter.auto': 'Automatik', 'filter.manual': 'Manuelni', 'filter.diesel': 'Dizel', 'filter.petrol': 'Benzin', 'filter.seven': '7 sjedišta',
      'spec.diesel': 'Dizel', 'spec.petrol': 'Benzin', 'spec.manual': 'Manuelni', 'spec.automatic': 'Automatik', 'spec.seats': 'sjedišta',
      'tag.seven': '7 sjedišta',
      'price.request': 'Cijena na upit', 'car.more': 'Detalji',
      'why.eyebrow': 'Zašto mi', 'why.title': 'Manje papira, <span class="hl">više puta</span>',
      'why.f1t': 'Brza rezervacija', 'why.f1d': 'Jedan poziv ili poruka na WhatsApp i Viber. Bez dugih formulara i čekanja.',
      'why.f2t': 'Automatik ili manuelni', 'why.f2d': 'Birajte mjenjač koji vam odgovara. U floti imamo oba tipa, na dizel i benzin.',
      'why.f3t': 'Do 7 sjedišta', 'why.f3d': 'Prostrani VW Sharan i Touran za porodice i grupe, sa dosta mjesta za prtljag.',
      'why.f4t': 'Lična usluga', 'why.f4d': 'Razgovarate direktno sa nama. Uvijek dostupni za pitanja prije, tokom i poslije najma.',
      'how.eyebrow': 'Kako funkcioniše', 'how.title': 'Tri koraka <span class="hl">do ključeva</span>',
      'how.s1t': 'Izaberite vozilo', 'how.s1d': 'Pregledajte flotu i pronađite automobil koji odgovara vašem putovanju.',
      'how.s2t': 'Pozovite ili pišite', 'how.s2d': 'Javite nam datume i vozilo. Potvrđujemo dostupnost i cijenu odmah.',
      'how.s3t': 'Uživajte u vožnji', 'how.s3d': 'Preuzmite ključeve i istražite Crnu Goru, od obale do planina.',
      'cta.eyebrow': 'Rezervacije', 'cta.title': 'Spremni za <span class="hl">put?</span>',
      'cta.lead': 'Pozovite nas ili pošaljite poruku. Odgovaramo brzo, na crnogorskom i engleskom.',
      'cta.call': 'Pozovite', 'cta.copy': 'Kopiraj', 'cta.copied': 'Kopirano',
      'gallery.book': 'Rezerviši na WhatsApp',
      'footer.loc': 'Crna Gora', 'footer.rights': 'Sva prava zadržana.',
      'wa.msg': 'Zdravo! Zanima me iznajmljivanje vozila {car}. Da li je dostupno za datume: ',
      'title': 'Rent a car Crna Gora',
    },
    en: {
      'skip': 'Skip to content',
      'nav.fleet': 'Fleet', 'nav.why': 'Why us', 'nav.how': 'How it works', 'nav.contact': 'Contact', 'nav.call': 'Call us',
      'hero.pill': 'Car rental · Montenegro',
      'hero.t1': 'Montenegro starts', 'hero.t2': 'behind the wheel.',
      'hero.lead': 'From Kotor to Durmitor, a car for every road. Pick a car, send your dates and go. Booking takes a few minutes, by phone or message.',
      'book.car': 'Car', 'book.from': 'Pick-up', 'book.to': 'Return', 'book.go': 'Check availability',
      'book.note': 'We send your request via WhatsApp. We reply fast.',
      'book.err': 'The return date must be after the pick-up date.',
      'book.open': 'WhatsApp did not open? Click here.',
      'book.msg': 'Hello! I am interested in the {car} from {from} to {to}. Is it available, and what is the price?',
      'trust.cars': 'cars', 'trust.gear': 'Automatic & manual', 'trust.seats': 'Up to 7 seats', 'trust.fuel': 'Diesel & petrol',
      'fleet.eyebrow': 'Our fleet',
      'fleet.title': 'Choose a car <span class="hl">for your trip</span>',
      'fleet.lead': 'Tap any car to see all photos and book it directly.',
      'filter.all': 'All cars', 'filter.auto': 'Automatic', 'filter.manual': 'Manual', 'filter.diesel': 'Diesel', 'filter.petrol': 'Petrol', 'filter.seven': '7 seats',
      'spec.diesel': 'Diesel', 'spec.petrol': 'Petrol', 'spec.manual': 'Manual', 'spec.automatic': 'Automatic', 'spec.seats': 'seats',
      'tag.seven': '7 seats',
      'price.request': 'Price on request', 'car.more': 'Details',
      'why.eyebrow': 'Why us', 'why.title': 'Less paperwork, <span class="hl">more road</span>',
      'why.f1t': 'Fast booking', 'why.f1d': 'One call or a message on WhatsApp or Viber. No long forms, no waiting.',
      'why.f2t': 'Automatic or manual', 'why.f2d': 'Pick the gearbox you prefer. Our fleet has both, in diesel and petrol.',
      'why.f3t': 'Up to 7 seats', 'why.f3d': 'Spacious VW Sharan and Touran for families and groups, with plenty of luggage room.',
      'why.f4t': 'Personal service', 'why.f4d': 'You talk to us directly. Always available for questions before, during and after your rental.',
      'how.eyebrow': 'How it works', 'how.title': 'Three steps <span class="hl">to the keys</span>',
      'how.s1t': 'Choose a car', 'how.s1d': 'Browse the fleet and find the car that fits your trip.',
      'how.s2t': 'Call or message', 'how.s2d': 'Tell us your dates and car. We confirm availability and price right away.',
      'how.s3t': 'Enjoy the drive', 'how.s3d': 'Pick up the keys and explore Montenegro, from the coast to the mountains.',
      'cta.eyebrow': 'Bookings', 'cta.title': 'Ready for the <span class="hl">road?</span>',
      'cta.lead': 'Call us or send a message. We reply fast, in Montenegrin and English.',
      'cta.call': 'Call us', 'cta.copy': 'Copy', 'cta.copied': 'Copied',
      'gallery.book': 'Book on WhatsApp',
      'footer.loc': 'Montenegro', 'footer.rights': 'All rights reserved.',
      'wa.msg': 'Hello! I am interested in renting the {car}. Is it available for these dates: ',
      'title': 'Rent a car Crna Gora',
    },
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  };
  let lang = store.get('lang') === 'en' ? 'en' : 'me';
  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.me[k] || k;

  function applyLang() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'sr-ME';
    document.title = t('title');
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('.lang__btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    renderFleet();
    fillBookSelect();
    if (gallery.open && currentCar) fillGallerySide(currentCar);
  }

  /* ---------------- Icons ---------------- */
  const ICON = {
    fuel: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17M2 22h14M15 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3M7 7h4"/></svg>',
    gear: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v10M12 7v10M18 7v5H6"/></svg>',
    seats: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    engine: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h2V7h5V5h4v2h2l2 3h2v6h-2l-2 3H8l-2-3H4z"/></svg>',
    arrow: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  const specsHTML = (car) => [
    `<li>${ICON.fuel}${t('spec.' + car.fuel)}</li>`,
    `<li>${ICON.gear}${t('spec.' + car.gear)}</li>`,
    car.seats ? `<li>${ICON.seats}${car.seats} ${t('spec.seats')}</li>` : '',
    car.extra ? `<li>${ICON.engine}${car.extra}</li>` : '',
  ].join('');

  /* ---------------- Fleet render ---------------- */
  const grid = document.getElementById('fleetGrid');
  let activeFilter = 'all';
  const cardTimers = new Map();

  function matches(car, f) {
    switch (f) {
      case 'automatic': case 'manual': return car.gear === f;
      case 'diesel': case 'petrol': return car.fuel === f;
      case 'seven': return car.seats === 7;
      default: return true;
    }
  }

  function renderFleet() {
    cardTimers.forEach((id) => clearInterval(id));
    cardTimers.clear();
    grid.innerHTML = FLEET.map((car, i) => {
      const name = `${car.brand} ${car.model}`;
      const tag = car.seats === 7 ? `<span class="car__tag">${t('tag.seven')}</span>` : '';
      return `
      <li class="car reveal${matches(car, activeFilter) ? '' : ' is-hidden'}" data-i="${i}" style="--d:${(i % 3) * 0.08}s">
        <button type="button" class="car__btn" aria-label="${name}, ${t('spec.' + car.fuel)}, ${t('spec.' + car.gear)}">
          <div class="car__media">
            ${car.imgs.map((n, k) => `<img src="${src(car, n)}" alt="" loading="lazy" decoding="async"${k === 0 ? ' class="is-active"' : ''}>`).join('')}
            ${tag}
            <div class="car__dots" aria-hidden="true">${car.imgs.map((_, k) => `<span${k === 0 ? ' class="is-active"' : ''}></span>`).join('')}</div>
          </div>
          <div class="car__body">
            <p class="car__brand">${car.brand}</p>
            <h3 class="car__name">${car.model}</h3>
            <ul class="specs">${specsHTML(car)}</ul>
            <div class="car__foot">
              <span class="car__price">${t('price.request')}</span>
              <span class="car__more">${t('car.more')} ${ICON.arrow}</span>
            </div>
          </div>
        </button>
      </li>`;
    }).join('');

    grid.querySelectorAll('.car').forEach((li) => {
      li.querySelector('.car__btn').addEventListener('click', () => openGallery(FLEET[+li.dataset.i], 0));
      revealObserver.observe(li);
      cardObserver.observe(li);
    });
  }

  /* Card slideshows: run only while visible, staggered */
  function startCard(li) {
    if (reduceMotion || cardTimers.has(li)) return;
    const imgs = li.querySelectorAll('.car__media img');
    const dots = li.querySelectorAll('.car__dots span');
    if (imgs.length < 2) return;
    let idx = [...imgs].findIndex((im) => im.classList.contains('is-active'));
    const delay = 3400 + (+li.dataset.i % 4) * 450;
    const id = setInterval(() => {
      imgs[idx].classList.remove('is-active'); dots[idx].classList.remove('is-active');
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add('is-active'); dots[idx].classList.add('is-active');
    }, delay);
    cardTimers.set(li, id);
  }
  function stopCard(li) { clearInterval(cardTimers.get(li)); cardTimers.delete(li); }

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? startCard(e.target) : stopCard(e.target)));
  }, { threshold: 0.25 });

  /* Filters */
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter;
      document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      grid.querySelectorAll('.car').forEach((li) => {
        const show = matches(FLEET[+li.dataset.i], activeFilter);
        li.classList.toggle('is-hidden', !show);
        if (show) { li.classList.remove('is-in'); requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add('is-in'))); }
      });
    });
  });

  /* ---------------- Hero slideshow ---------------- */
  (function hero() {
    const imgs = document.querySelectorAll('#heroSlides img');
    const thumbs = document.querySelectorAll('#heroThumbs button');
    const DUR = 5500;
    let i = 0, timer = null;
    document.documentElement.style.setProperty('--hero-dur', DUR + 'ms');
    const show = (n) => {
      i = n;
      imgs.forEach((im, k) => {
        if (k === n) { im.classList.remove('is-active'); void im.offsetWidth; im.classList.add('is-active'); }
        else im.classList.remove('is-active');
      });
      thumbs.forEach((b, k) => {
        b.setAttribute('aria-current', String(k === n));
        b.classList.remove('is-running');
        if (k === n && !reduceMotion) { void b.offsetWidth; b.classList.add('is-running'); }
      });
    };
    const start = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => show((i + 1) % imgs.length), DUR); };
    thumbs.forEach((b, k) => b.addEventListener('click', () => { show(k); start(); }));
    document.addEventListener('visibilitychange', () => { clearInterval(timer); if (!document.hidden) start(); });
    show(0); start();
  })();

  /* ---------------- Booking bar ---------------- */
  const bookForm = document.getElementById('bookForm');
  const bookCar = document.getElementById('bookCar');
  const bookFrom = document.getElementById('bookFrom');
  const bookTo = document.getElementById('bookTo');
  const bookNote = document.getElementById('bookNote');
  const carLabel = (c) => `${c.brand} ${c.model} · ${t('spec.' + c.fuel)} · ${t('spec.' + c.gear)}${c.seats === 7 ? ' · 7' : ''}`;
  function fillBookSelect() {
    const v = bookCar.value || '0';
    bookCar.innerHTML = FLEET.map((c, k) => `<option value="${k}">${carLabel(c)}</option>`).join('');
    bookCar.value = v;
  }
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const today = new Date();
  const plus = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  bookFrom.min = iso(today); bookTo.min = iso(today);
  bookFrom.value = iso(plus(1)); bookTo.value = iso(plus(4));
  bookFrom.addEventListener('change', () => {
    bookTo.min = bookFrom.value;
    if (bookTo.value <= bookFrom.value) { const d = new Date(bookFrom.value); d.setDate(d.getDate() + 3); bookTo.value = iso(d); }
  });
  const fmt = (v) => v.split('-').reverse().join('.');
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    bookNote.classList.remove('is-error');
    if (!bookFrom.value || !bookTo.value || bookTo.value <= bookFrom.value) {
      bookNote.textContent = t('book.err'); bookNote.classList.add('is-error'); bookTo.focus(); return;
    }
    const car = FLEET[+bookCar.value];
    const msg = t('book.msg').replace('{car}', `${car.brand} ${car.model} (${t('spec.' + car.fuel)}, ${t('spec.' + car.gear)})`)
      .replace('{from}', fmt(bookFrom.value)).replace('{to}', fmt(bookTo.value));
    const url = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(msg)}`;
    bookNote.innerHTML = '';
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = t('book.open');
    a.style.color = 'var(--accent-2)'; a.style.textDecoration = 'underline';
    bookNote.appendChild(a);
    a.click();
  });

  /* Copy phone */
  const copyBtn = document.getElementById('copyPhone');
  copyBtn.addEventListener('click', () => {
    const done = () => { copyBtn.textContent = t('cta.copied'); setTimeout(() => { copyBtn.textContent = t('cta.copy'); }, 1800); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('phoneText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText('+382 60 086 745').then(done, fallback); } catch { fallback(); }
  });

  /* ---------------- Gallery ---------------- */
  const gallery = document.getElementById('gallery');
  const gImg = document.getElementById('galleryImg');
  const gThumbs = document.getElementById('galleryThumbs');
  const gCount = document.getElementById('galleryCount');
  let currentCar = null, gIdx = 0, lastFocus = null;

  function fillGallerySide(car) {
    const name = `${car.brand} ${car.model}`;
    document.getElementById('galleryBrand').textContent = car.brand;
    document.getElementById('galleryTitle').textContent = car.model;
    document.getElementById('gallerySpecs').innerHTML = specsHTML(car);
    const msg = t('wa.msg').replace('{car}', `${name} (${t('spec.' + car.fuel)}, ${t('spec.' + car.gear)})`);
    document.getElementById('galleryWa').href = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(msg)}`;
    gallery.querySelector('.gallery__price').textContent = t('price.request');
  }

  function showGalleryImg(n) {
    const car = currentCar;
    gIdx = (n + car.imgs.length) % car.imgs.length;
    gImg.src = src(car, car.imgs[gIdx]);
    gImg.alt = `${car.brand} ${car.model} — ${gIdx + 1}/${car.imgs.length}`;
    gImg.style.animation = 'none'; void gImg.offsetWidth; gImg.style.animation = '';
    gCount.textContent = `${gIdx + 1} / ${car.imgs.length}`;
    gThumbs.querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-current', String(k === gIdx)));
  }

  function openGallery(car, n) {
    currentCar = car; lastFocus = document.activeElement;
    fillGallerySide(car);
    gThumbs.innerHTML = car.imgs.map((im, k) =>
      `<button type="button" aria-label="${k + 1}"><img src="${src(car, im)}" alt="" loading="lazy"></button>`).join('');
    gThumbs.querySelectorAll('button').forEach((b, k) => b.addEventListener('click', () => showGalleryImg(k)));
    showGalleryImg(n);
    gallery.showModal();
    document.body.style.overflow = 'hidden';
  }
  function closeGallery() { gallery.close(); }
  gallery.addEventListener('close', () => { document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); });
  gallery.addEventListener('click', (e) => { if (e.target === gallery) closeGallery(); });
  document.getElementById('galleryClose').addEventListener('click', closeGallery);
  document.getElementById('galleryPrev').addEventListener('click', () => showGalleryImg(gIdx - 1));
  document.getElementById('galleryNext').addEventListener('click', () => showGalleryImg(gIdx + 1));
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showGalleryImg(gIdx - 1);
    if (e.key === 'ArrowRight') showGalleryImg(gIdx + 1);
  });
  // swipe
  let sx = null;
  const stage = gallery.querySelector('.gallery__stage');
  stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) showGalleryImg(gIdx + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---------------- Reveal on scroll ---------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, k) => {
    if (!el.style.getPropertyValue('--d') && el.closest('.hero')) el.style.setProperty('--d', `${k * 0.1}s`);
    revealObserver.observe(el);
  });

  /* ---------------- Nav + FAB ---------------- */
  const nav = document.getElementById('nav');
  const fab = document.querySelector('.fab');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    fab.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Feature spotlight follows pointer */
  document.querySelectorAll('.feature').forEach((f) => {
    f.addEventListener('pointermove', (e) => {
      const r = f.getBoundingClientRect();
      f.style.setProperty('--mx', `${e.clientX - r.left}px`);
      f.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* Language toggle */
  document.querySelectorAll('.lang__btn').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set('lang', lang); applyLang();
  }));

  document.getElementById('year').textContent = new Date().getFullYear();
  applyLang();
})();
