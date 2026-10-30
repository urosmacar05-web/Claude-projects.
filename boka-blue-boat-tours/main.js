(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WA_NUMBER = "38260086745";
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ================= i18n ================= */
  const I18N = window.I18N || { en: {} };
  const en = I18N.en;
  $$("[data-i18n]").forEach(el => { en[el.dataset.i18n] ??= el.textContent.trim(); });
  $$("[data-i18n-html]").forEach(el => { en[el.dataset.i18nHtml] ??= el.innerHTML.trim(); });
  $$("[data-i18n-ph]").forEach(el => { en[el.dataset.i18nPh] ??= el.getAttribute("placeholder"); });

  const LANG_CODES = { en: "EN", me: "ME", de: "DE", ru: "RU" };
  let lang = "en";
  const t = key => (I18N[lang] && I18N[lang][key] != null ? I18N[lang][key] : en[key]);
  const money = n => (lang === "en" ? `€${n}` : `${n} €`);

  function applyLang(next) {
    lang = I18N[next] ? next : "en";
    document.documentElement.lang = t("htmlLang");
    document.title = t("meta.title");
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", t(el.dataset.i18nPh)); });
    $$("[data-price]").forEach(el => { el.textContent = money(el.dataset.price); });
    $(".lang-current").textContent = LANG_CODES[lang];
    $$("[data-set-lang]").forEach(b => b.setAttribute("aria-current", b.dataset.setLang === lang ? "true" : "false"));
    setSlideName(current, false);
    updateTotal();
    store.set("bbt-lang", lang);
  }

  function initialLang() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl && I18N[fromUrl]) return fromUrl;
    const saved = store.get("bbt-lang");
    if (saved && I18N[saved]) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    if (nav.startsWith("de")) return "de";
    if (nav.startsWith("ru")) return "ru";
    if (/^(sr|hr|bs|cnr|me)/.test(nav)) return "me";
    return "en";
  }

  /* language menu */
  const langWrap = $("[data-lang-switcher]");
  const langBtn = $(".lang-btn", langWrap);
  const langMenu = $(".lang-menu", langWrap);
  function setLangMenu(open) {
    langMenu.hidden = !open;
    langBtn.setAttribute("aria-expanded", String(open));
    if (open) $("[aria-current='true']", langMenu)?.focus();
  }
  langBtn.addEventListener("click", () => setLangMenu(langMenu.hidden));
  langMenu.addEventListener("click", e => {
    const b = e.target.closest("[data-set-lang]");
    if (!b) return;
    applyLang(b.dataset.setLang);
    setLangMenu(false);
    langBtn.focus();
  });
  document.addEventListener("click", e => { if (!langWrap.contains(e.target)) setLangMenu(false); });
  langWrap.addEventListener("keydown", e => {
    if (e.key === "Escape") { setLangMenu(false); langBtn.focus(); }
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !langMenu.hidden) {
      e.preventDefault();
      const items = $$("button", langMenu);
      const i = items.indexOf(document.activeElement);
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
    }
  });

  /* ================= Header + mobile menu ================= */
  const header = $(".site-header");
  const menuBtn = $(".menu-btn");
  const mobileMenu = $("#mobile-menu");
  function setMenu(open) {
    mobileMenu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
    updateBar();
  }
  menuBtn.addEventListener("click", () => setMenu(mobileMenu.hidden));
  mobileMenu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !mobileMenu.hidden) { setMenu(false); menuBtn.focus(); } });
  window.matchMedia("(min-width: 960px)").addEventListener("change", e => { if (e.matches) setMenu(false); });

  /* ================= Hero slideshow ================= */
  const hero = $(".hero");
  const slides = $$(".slide", hero);
  const backdrops = $$(".hero-backdrop-layer", hero);
  const dots = $$(".dot", hero);
  const slideNum = $(".slide-num", hero);
  const slideName = $("[data-slide-name]", hero);
  const SLIDE_MS = 6500;
  let current = 0, timer = null, heroVisible = true;

  hero.style.setProperty("--slide-ms", SLIDE_MS + "ms");

  function loadSlide(i) {
    const img = $("img", slides[i]);
    if (img && img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); }
  }

  function setSlideName(i, animate = true) {
    const names = t("slides") || en.slides;
    if (!animate || reduceMotion) { slideName.textContent = names[i]; return; }
    slideName.classList.add("is-swapping");
    setTimeout(() => { slideName.textContent = names[i]; slideName.classList.remove("is-swapping"); }, 300);
  }

  function goTo(i) {
    if (i === current) return;
    loadSlide(i);
    loadSlide((i + 1) % slides.length);
    const prev = slides[current];
    slides.forEach(s => s.classList.remove("was-active"));
    prev.classList.remove("is-active");
    prev.classList.add("was-active");
    slides[i].classList.add("is-active");
    setTimeout(() => prev.classList.remove("was-active"), 1900);
    backdrops.forEach((b, k) => b.classList.toggle("is-active", k === i));
    dots.forEach((d, k) => {
      d.classList.toggle("is-active", k === i);
      if (k === i) { d.setAttribute("aria-current", "true"); void d.offsetWidth; } else d.removeAttribute("aria-current");
    });
    slideNum.textContent = String(i + 1).padStart(2, "0");
    current = i;
    setSlideName(i);
  }

  const next = () => goTo((current + 1) % slides.length);
  function play() {
    stop();
    if (reduceMotion || !heroVisible || document.hidden) return;
    hero.classList.remove("is-paused");
    timer = setInterval(next, SLIDE_MS);
  }
  function stop() { clearInterval(timer); timer = null; hero.classList.add("is-paused"); }

  dots.forEach((d, i) => d.addEventListener("click", () => { goTo(i); play(); }));

  if (reduceMotion) hero.classList.add("no-autoplay");
  // Fetch the remaining hero images only after the page has finished loading
  window.addEventListener("load", () => { loadSlide(1); setTimeout(() => slides.forEach((_, i) => loadSlide(i)), 1500); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; heroVisible ? play() : stop(); }, { threshold: 0.15 }).observe(hero);

  /* ================= Scroll reveals ================= */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-in"));
  }

  /* ================= Scroll-driven bits (header, route line, booking bar) ================= */
  const routeList = $(".route-list");
  const routeFill = $(".route-line-fill");
  const bookBar = $(".book-bar");
  const bookSection = $("#book");
  const footer = $(".site-footer");
  let lastY = window.scrollY, ticking = false, bookInView = false;

  new IntersectionObserver(entries => {
    entries.forEach(e => { e.target.dataset.inview = e.isIntersecting ? "1" : ""; });
    bookInView = bookSection.dataset.inview === "1" || footer.dataset.inview === "1";
    updateBar();
  }, { threshold: 0.05 }).observe(bookSection);
  new IntersectionObserver(([e]) => { footer.dataset.inview = e.isIntersecting ? "1" : ""; bookInView = bookSection.dataset.inview === "1" || e.isIntersecting; updateBar(); }).observe(footer);

  function updateBar() {
    const show = window.scrollY > window.innerHeight * 0.8 && !bookInView && mobileMenu.hidden;
    bookBar.classList.toggle("is-visible", show);
  }

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (goingDown && y > window.innerHeight && mobileMenu.hidden && langMenu.hidden) header.classList.add("is-hidden");
    else if (goingUp || y < window.innerHeight) header.classList.remove("is-hidden");
    lastY = y;

    if (!reduceMotion) {
      const r = routeList.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
        routeFill.style.setProperty("--p", p.toFixed(4));
      }
    } else {
      routeFill.style.setProperty("--p", "1");
    }
    updateBar();
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ================= Gallery ================= */
  const track = $(".gallery-track");
  const gPrev = $("[data-gallery-prev]");
  const gNext = $("[data-gallery-next]");
  const step = () => { const li = $("li", track); return li ? li.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : 300; };
  const updateGalleryBtns = () => {
    gPrev.disabled = track.scrollLeft < 8;
    gNext.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
  };
  gPrev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
  gNext.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
  track.addEventListener("scroll", () => requestAnimationFrame(updateGalleryBtns), { passive: true });
  updateGalleryBtns();

  /* ================= Booking form ================= */
  const form = $("#book-form");
  const PRICES = { t1: 50, t2: 30, t3: 130 };
  const TOUR_EN = { t1: "Blue Cave Tour (3 h)", t2: "Perast & Lady of the Rock Tour (1 h 30 min)", t3: "Private boat" };
  const LANG_NAMES = { en: "English", me: "Crnogorski", de: "Deutsch", ru: "Русский" };
  const dateInput = $("#f-date");
  const nameInput = $("#f-name");
  const guestsInput = $("#f-guests");
  const hoursInput = $("#f-hours");
  const totalEl = $("[data-total]");

  const pad = n => String(n).padStart(2, "0");
  const today = new Date();
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const tourValue = () => (form.querySelector("input[name=tour]:checked") || {}).value || "t1";
  const clampInput = inp => {
    const min = +inp.min || 1, max = +inp.max || 99;
    let v = parseInt(inp.value, 10);
    if (isNaN(v)) v = min;
    inp.value = Math.min(max, Math.max(min, v));
    return +inp.value;
  };

  function updateTotal() {
    if (!form) return;
    const tour = tourValue();
    const isPrivate = tour === "t3";
    $$("[data-shared-only]", form).forEach(el => { el.hidden = isPrivate; });
    $$("[data-private-only]", form).forEach(el => { el.hidden = !isPrivate; });
    const total = isPrivate ? PRICES.t3 * clampInput(hoursInput) : PRICES[tour] * clampInput(guestsInput);
    totalEl.textContent = money(total);
    return total;
  }

  form.addEventListener("change", updateTotal);
  form.addEventListener("input", e => {
    if (e.target === guestsInput || e.target === hoursInput) { if (e.target.value !== "") updateTotal(); }
    if (e.target === dateInput || e.target === nameInput) setError(e.target, false);
  });
  $$("[data-step]", form).forEach(b => b.addEventListener("click", () => {
    const inp = document.getElementById(b.dataset.target);
    inp.value = clampInput(inp) + Number(b.dataset.step);
    clampInput(inp);
    updateTotal();
  }));

  $$("[data-book-tour]").forEach(a => a.addEventListener("click", () => {
    const radio = form.querySelector(`input[name=tour][value="${a.dataset.bookTour}"]`);
    if (radio) { radio.checked = true; updateTotal(); }
  }));

  function setError(input, on) {
    const err = document.getElementById(input.getAttribute("aria-describedby"));
    input.setAttribute("aria-invalid", on ? "true" : "false");
    if (err) err.hidden = !on;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const badDate = !dateInput.value;
    const badName = !nameInput.value.trim();
    setError(dateInput, badDate);
    setError(nameInput, badName);
    if (badDate || badName) { (badDate ? dateInput : nameInput).focus(); return; }

    const tour = tourValue();
    const total = updateTotal();
    const lines = [
      "Hello Boka Blue Boat Tours! I'd like to book:",
      "",
      `Tour: ${TOUR_EN[tour]}`,
      `Date: ${dateInput.value.split("-").reverse().join(".")}`,
      tour === "t3" ? `Hours: ${hoursInput.value}` : `Departure: ${$("#f-time").value}`,
      `Guests: ${guestsInput.value}`,
      `Name: ${nameInput.value.trim()}`
    ];
    const note = $("#f-note").value.trim();
    if (note) lines.push(`Message: ${note}`);
    lines.push(`Estimated total: €${total}`);
    if (lang !== "en") lines.push(`(Language: ${LANG_NAMES[lang]})`);

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    const win = window.open(url, "_blank", "noopener");
    if (!win) location.href = url;
  });

  /* ================= Misc ================= */
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

  applyLang(initialLang());
  updateTotal();
})();
