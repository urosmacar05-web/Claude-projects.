/* =========================================================
   AL PARCO — interakcije (bez biblioteka, ~lagano za telefone)
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const MENU = window.AP_MENU || [];
  const EN = window.AP_EN || {};
  const STR = window.AP_STR || { sr: {}, en: {} };
  const PHONE_WA = "38757344744";
  const TZ = "Europe/Sarajevo";
  const OPEN_H = 7, CLOSE_H = 23;

  /* ---------------- JEZIK ---------------- */
  const SR_LANGS = ["sr", "bs", "hr", "sh", "cnr", "me"];
  function initialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "sr" || q === "en") return q;
    try { const s = localStorage.getItem("ap-lang"); if (s) return s; } catch (e) {}
    const nav = (navigator.language || "sr").slice(0, 2).toLowerCase();
    return SR_LANGS.includes(nav) ? "sr" : "en";
  }
  let lang = initialLang();
  const t = (k) => (STR[lang] && STR[lang][k]) || STR.sr[k] || k;
  const L = (obj) => obj[lang] || obj.sr;

  function applyLang(next, persist) {
    lang = next;
    root.lang = lang === "en" ? "en" : "sr-Latn";
    $$("[data-i18n]").forEach((el) => {
      if (el.dataset.sr === undefined) el.dataset.sr = el.innerHTML;
      const en = EN[el.dataset.i18n];
      el.innerHTML = lang === "en" && en ? en : el.dataset.sr;
    });
    $$("[data-i18n-ph]").forEach((el) => {
      if (el.dataset.srPh === undefined) el.dataset.srPh = el.placeholder;
      const en = EN[el.dataset.i18nPh];
      el.placeholder = lang === "en" && en ? en : el.dataset.srPh;
    });
    $$("[data-i18n-aria]").forEach((el) => {
      if (el.dataset.srAria === undefined) el.dataset.srAria = el.getAttribute("aria-label");
      const en = EN[el.dataset.i18nAria];
      el.setAttribute("aria-label", lang === "en" && en ? en : el.dataset.srAria);
    });
    $$(".lang-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    if (persist) { try { localStorage.setItem("ap-lang", lang); } catch (e) {} }
    document.dispatchEvent(new CustomEvent("ap:lang"));
  }
  $$(".lang-switch button").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.lang !== lang) applyLang(b.dataset.lang, true);
  }));

  /* ---------------- VRIJEME (Sarajevo) ---------------- */
  function sarajevoNow() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const o = {}; parts.forEach((p) => (o[p.type] = p.value));
    return { date: `${o.year}-${o.month}-${o.day}`, h: +o.hour, m: +o.minute };
  }

  function updateOpenStatus() {
    const el = $(".open-status"); if (!el) return;
    const { h } = sarajevoNow();
    const open = h >= OPEN_H && h < CLOSE_H;
    el.classList.toggle("is-closed", !open);
    $(".open-text", el).textContent = open ? t("open") : t("closed");
  }

  /* ---------------- HEADER ---------------- */
  const header = $(".site-header");
  const hero = $(".hero, .mp-hero");
  let lastY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY;
    const heroH = hero ? hero.offsetHeight : 400;
    header.classList.toggle("is-solid", y > 40);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (!document.body.classList.contains("menu-open")) {
      if (goingDown && y > heroH * .6) header.classList.add("is-hidden");
      else if (goingUp || y < 120) header.classList.remove("is-hidden");
    }
    lastY = y;
    parallax();
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });

  /* ---------------- MOBILNI MENI ---------------- */
  const burger = $(".burger");
  const mm = $("#mobile-menu");
  function setMenu(open) {
    if (!mm) return;
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    header.classList.remove("is-hidden");
    header.classList.toggle("is-solid", open || scrollY > 40);
    if (open) {
      mm.hidden = false;
      requestAnimationFrame(() => mm.classList.add("is-open"));
      setTimeout(() => { const a = $("a", mm); a && a.focus({ preventScroll: true }); }, 350);
    } else {
      mm.classList.remove("is-open");
      setTimeout(() => { if (!mm.classList.contains("is-open")) mm.hidden = true; }, 450);
    }
  }
  if (burger && mm) {
    burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
    $$("a", mm).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); burger.focus(); }
    });
    matchMedia("(min-width: 1024px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------------- OTKRIVANJE NA SKROL ---------------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }) : null;
  function observeReveals(scope = document) {
    $$(".reveal, .stagger, .img-reveal, .carousel, .mp-reveal", scope).forEach((el) => {
      if (el.classList.contains("is-in")) return;
      if (io && !reduceMotion) io.observe(el); else el.classList.add("is-in");
    });
  }

  // pauziraj beskonačne animacije van ekrana (štedi bateriju)
  if ("IntersectionObserver" in window) {
    const pauseIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle("is-paused", !en.isIntersecting));
    });
    $$(".badge-rotate, .marquee").forEach((el) => pauseIO.observe(el));
  }

  /* ---------------- PARALAKSA (samo desktop) ---------------- */
  const parEls = finePointer && !reduceMotion ? $$("[data-parallax]") : [];
  function parallax() {
    if (!parEls.length) return;
    const vh = innerHeight;
    parEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const k = parseFloat(el.dataset.parallax) || 0.05;
      const off = (r.top + r.height / 2 - vh / 2) * -k;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    });
  }

  /* ---------------- TAČKA NA LUKU (hero) ---------------- */
  function animateArcDot() {
    const dot = $(".hero-arc-dot"), path = $("#arcPath");
    if (!dot || !path || getComputedStyle(dot).display === "none") return;
    const svg = path.ownerSVGElement;
    const total = path.getTotalLength();
    const target = 0.5, dur = reduceMotion ? 0 : 2400, start = performance.now() + 300;
    const ease = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    function place(f) {
      const p = path.getPointAtLength(total * f);
      const m = svg.getScreenCTM(); const box = hero.getBoundingClientRect();
      const x = m.a * p.x + m.c * p.y + m.e - box.left;
      const y = m.b * p.x + m.d * p.y + m.f - box.top;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    function frame(now) {
      const k = dur ? Math.min(1, Math.max(0, (now - start) / dur)) : 1;
      dot.style.opacity = k > 0.05 ? 1 : 0;
      place(ease(k) * target);
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    addEventListener("resize", () => place(target), { passive: true });
  }

  /* ---------------- IZDVOJENA JELA (karusel) ---------------- */
  function renderFeatured() {
    const track = $("#featTrack"); if (!track) return;
    const items = MENU.flatMap((c) => c.items).filter((i) => i.featured && i.img);
    track.innerHTML = items.map((it, i) => {
      const [name, desc] = L(it);
      return `<li class="dish-card">
        <figure class="dish-img"><img src="${it.img}" width="304" height="304" loading="lazy" decoding="async" alt="${name}"></figure>
        <span class="dish-num">${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}</span>
        <h3>${name}</h3><p>${desc}</p></li>`;
    }).join("");
    updateCarousel();
  }
  const carousel = $(".carousel");
  const bar = $(".carousel-progress span");
  function updateCarousel() {
    if (!carousel) return;
    const max = carousel.scrollWidth - carousel.clientWidth;
    const p = max > 0 ? carousel.scrollLeft / max : 1;
    const vis = carousel.scrollWidth ? carousel.clientWidth / carousel.scrollWidth : 1;
    if (bar) bar.style.transform = `translateX(${(p * (1 - vis) / vis) * 100}%) scaleX(1)`, bar.style.width = `${vis * 100}%`;
    $$(".carousel-nav [data-dir]").forEach((b) => {
      b.disabled = b.dataset.dir === "-1" ? carousel.scrollLeft < 8 : carousel.scrollLeft > max - 8;
    });
  }
  if (carousel) {
    let cTick = false;
    carousel.addEventListener("scroll", () => { if (!cTick) { requestAnimationFrame(() => { updateCarousel(); cTick = false; }); cTick = true; } }, { passive: true });
    addEventListener("resize", updateCarousel, { passive: true });
    $$(".carousel-nav [data-dir]").forEach((b) => b.addEventListener("click", () => {
      const card = $(".dish-card", carousel);
      const step = card ? card.getBoundingClientRect().width + 24 : 300;
      carousel.scrollBy({ left: step * +b.dataset.dir * (innerWidth > 1024 ? 2 : 1), behavior: reduceMotion ? "auto" : "smooth" });
    }));
    // povlačenje mišem na desktopu
    if (finePointer) {
      let down = false, sx = 0, sl = 0, moved = false;
      carousel.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = carousel.scrollLeft; carousel.style.scrollSnapType = "none"; });
      addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; carousel.scrollLeft = sl - dx; });
      addEventListener("pointerup", () => { if (!down) return; down = false; carousel.style.scrollSnapType = ""; });
      carousel.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
      carousel.addEventListener("dragstart", (e) => e.preventDefault());
    }
  }

  /* ---------------- JELOVNIK TEASER (tabovi) ---------------- */
  let activeTab = 1;
  function renderTeaser() {
    const tabs = $("#mtTabs"), card = $("#mtCard"); if (!tabs || !card) return;
    const cats = MENU.filter((c) => c.id !== "novo");
    tabs.innerHTML = cats.map((c, i) => `<button type="button" class="mt-tab" role="tab" id="mt-tab-${c.id}" aria-controls="mtCard" aria-selected="${i === activeTab}" tabindex="${i === activeTab ? 0 : -1}" data-i="${i}">${L(c)}</button>`).join("");
    const show = (i) => {
      activeTab = i;
      const c = cats[i];
      $$(".mt-tab", tabs).forEach((b, j) => { b.setAttribute("aria-selected", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
      card.setAttribute("aria-labelledby", `mt-tab-${c.id}`);
      card.innerHTML = `<div class="mt-card-head"><h3>${L(c)}</h3><span>${c.items.length} ${c.items.length === 1 ? t("dish") : t("items")}</span></div>
        <ul class="mt-list">${c.items.slice(0, 5).map((it) => { const [n, d] = L(it); return `<li><strong>${n}</strong>${d ? `<small>${d}</small>` : ""}</li>`; }).join("")}</ul>`;
    };
    $$(".mt-tab", tabs).forEach((b) => {
      b.addEventListener("click", () => { show(+b.dataset.i); if (innerWidth < 1024) b.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" }); });
      if (finePointer) b.addEventListener("mouseenter", () => { if (+b.dataset.i !== activeTab) show(+b.dataset.i); });
    });
    tabs.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in keys)) return; e.preventDefault();
      const n = (activeTab + keys[e.key] + cats.length) % cats.length; show(n); $$(".mt-tab", tabs)[n].focus();
    });
    show(activeTab);
  }

  /* ---------------- GALERIJA / LIGHTBOX ---------------- */
  const lb = $("#lightbox");
  if (lb && typeof lb.showModal === "function") {
    const btns = $$(".g-btn");
    const img = $("img", lb), cap = $("figcaption", lb);
    let idx = 0;
    const show = (i) => {
      idx = (i + btns.length) % btns.length;
      const src = $("img", btns[idx]);
      img.src = src.currentSrc || src.src; img.alt = src.alt;
      cap.textContent = $(".g-cap", btns[idx]).textContent;
      img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    };
    btns.forEach((b, i) => b.addEventListener("click", () => { show(i); lb.showModal(); document.body.style.overflow = "hidden"; }));
    lb.addEventListener("close", () => { document.body.style.overflow = ""; btns[idx].focus(); });
    $(".lb-close", lb).addEventListener("click", () => lb.close());
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") show(idx + 1); if (e.key === "ArrowLeft") show(idx - 1); });
    let tx = null;
    lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------------- REZERVACIJA → WhatsApp ---------------- */
  const form = $("#resForm");
  function fillTimes() {
    const sel = $("#f-time"), dateEl = $("#f-date"); if (!sel) return;
    const prev = sel.value;
    const now = sarajevoNow();
    const isToday = dateEl.value === now.date;
    const minMinutes = isToday ? now.h * 60 + now.m + 30 : 0;
    let html = `<option value="">${t("chooseTime")}</option>`, any = false;
    for (let m = OPEN_H * 60; m <= (CLOSE_H - 1) * 60; m += 30) {
      if (m < minMinutes) continue;
      const v = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      html += `<option value="${v}"${v === prev ? " selected" : ""}>${v}</option>`; any = true;
    }
    if (!any) html = `<option value="">${t("noTimes")}</option>`;
    sel.innerHTML = html;
  }
  function setErr(id, msg) {
    const f = $("#" + id).closest(".field");
    f.classList.toggle("has-error", !!msg);
    $("#" + id).setAttribute("aria-invalid", msg ? "true" : "false");
    $("#e-" + id.slice(2)).textContent = msg || "";
  }
  function validate() {
    const now = sarajevoNow();
    const d = $("#f-date").value, tm = $("#f-time").value, n = $("#f-name").value.trim(), ph = $("#f-phone").value.trim();
    const errs = {
      "f-date": !d ? t("errDate") : d < now.date ? t("errDatePast") : "",
      "f-time": !tm ? t("errTime") : "",
      "f-name": n.length < 2 ? t("errName") : "",
      "f-phone": ph && !/^[+\d][\d\s/().-]{5,}$/.test(ph) ? t("errPhone") : ""
    };
    Object.entries(errs).forEach(([k, v]) => setErr(k, v));
    return Object.keys(errs).find((k) => errs[k]);
  }
  if (form) {
    const dateEl = $("#f-date");
    const today = sarajevoNow().date;
    dateEl.min = today; dateEl.value = today;
    fillTimes();
    // ako za danas više nema termina, ponudi sutra
    if (!$("#f-time").options[$("#f-time").options.length - 1].value) {
      const d = new Date(today + "T12:00:00"); d.setDate(d.getDate() + 1);
      dateEl.value = d.toISOString().slice(0, 10); fillTimes();
    }
    dateEl.addEventListener("change", () => { fillTimes(); setErr("f-date", ""); });
    ["f-time", "f-name", "f-phone"].forEach((id) => $("#" + id).addEventListener("input", () => {
      if ($("#" + id).closest(".field").classList.contains("has-error")) setErr(id, "");
    }));
    const out = $("#f-guests");
    let guests = 2;
    const setGuests = (g) => {
      guests = Math.min(20, Math.max(1, g)); out.value = guests; out.textContent = guests;
      out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump");
      $$(".stepper .step").forEach((b) => (b.disabled = (b.dataset.step === "-1" && guests <= 1) || (b.dataset.step === "1" && guests >= 20)));
    };
    $$(".stepper .step").forEach((b) => b.addEventListener("click", () => setGuests(guests + +b.dataset.step)));
    setGuests(2);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bad = validate();
      if (bad) { $("#" + bad).focus(); return; }
      const d = new Date($("#f-date").value + "T12:00:00");
      const dateTxt = new Intl.DateTimeFormat(t("locale"), { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
      const lines = [
        t("waHello"), "",
        `${t("waDate")}: ${dateTxt}`,
        `${t("waTime")}: ${$("#f-time").value}`,
        `${t("waGuests")}: ${guests}`,
        `${t("waName")}: ${$("#f-name").value.trim()}`
      ];
      const ph = $("#f-phone").value.trim(); if (ph) lines.push(`${t("waPhone")}: ${ph}`);
      const note = $("#f-note").value.trim(); if (note) lines.push(`${t("waNote")}: ${note}`);
      lines.push("", t("waThanks"));
      const url = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(lines.join("\n"))}`;
      $("#resWaLink").href = url;
      const ok = $("#resSuccess"); ok.hidden = false; ok.focus();
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------------- MAPA (učitaj tek kad se približi) ---------------- */
  const mapFrame = $(".map-wrap iframe[data-src]");
  if (mapFrame) {
    const load = () => { mapFrame.src = mapFrame.dataset.src; mapFrame.removeAttribute("data-src"); };
    if ("IntersectionObserver" in window) {
      const mio = new IntersectionObserver((en) => { if (en[0].isIntersecting) { load(); mio.disconnect(); } }, { rootMargin: "400px" });
      mio.observe(mapFrame);
    } else load();
  }

  /* ---------------- MOBILNA TRAKA ---------------- */
  const mbar = $(".mobile-bar");
  if (mbar && "IntersectionObserver" in window) {
    const state = { hero: true, hide: false };
    const sync = () => {
      const show = !state.hero && !state.hide;
      mbar.classList.toggle("is-visible", show);
      mbar.setAttribute("aria-hidden", String(!show));
      $$("a", mbar).forEach((a) => (a.tabIndex = show ? 0 : -1));
    };
    const targets = new Map();
    const bio = new IntersectionObserver((entries) => {
      entries.forEach((en) => targets.set(en.target, en.isIntersecting));
      state.hero = hero ? !!targets.get(hero) : false;
      state.hide = $$("#rezervacija, .site-footer").some((el) => targets.get(el));
      sync();
    }, { threshold: 0 });
    [hero, $("#rezervacija"), $(".site-footer")].filter(Boolean).forEach((el) => bio.observe(el));
  }

  /* ---------------- AKTIVNI LINK U NAVIGACIJI ---------------- */
  if ("IntersectionObserver" in window) {
    const links = $$(".main-nav a[href^='#']");
    const map = new Map(links.map((a) => [$(a.getAttribute("href")), a]).filter(([s]) => s));
    const nio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const a = map.get(en.target); if (!a) return;
        if (en.isIntersecting) { links.forEach((l) => l.classList.remove("is-active")); a.classList.add("is-active"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, s) => nio.observe(s));
  }

  /* ---------------- STRANICA JELOVNIKA ---------------- */
  function renderMenuPage() {
    const body = $("#mpBody"), nav = $("#catNav"); if (!body || !nav) return;
    nav.innerHTML = MENU.map((c) => `<a href="#${c.id}">${L(c)}</a>`).join("");
    body.innerHTML = MENU.map((c, ci) => `
      <section class="mp-cat" id="${c.id}" aria-labelledby="h-${c.id}">
        <div class="mp-cat-head reveal">
          <span class="mp-cat-num">${String(ci + 1).padStart(2, "0")}</span>
          <h2 id="h-${c.id}">${L(c)}</h2>
          ${c.note ? `<span class="mp-cat-note">${L(c.note)}</span>` : ""}
        </div>
        <ul class="mp-items">
          ${c.items.map((it) => {
            const [n, d] = L(it);
            return `<li class="mp-item reveal${it.img ? " has-img" : ""}">
              ${it.img ? `<span class="mp-thumb"><img src="${it.img}" width="304" height="304" loading="lazy" decoding="async" alt="${n}"></span>` : ""}
              <h3>${n}</h3>
              ${it.price ? `<span class="mp-price">${it.price}</span>` : "<span></span>"}
              ${d ? `<p>${d}</p>` : ""}
            </li>`;
          }).join("")}
        </ul>
      </section>`).join("");
    observeReveals(body);

    const links = $$("a", nav);
    links.forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = $(a.getAttribute("href"));
      history.replaceState(null, "", a.getAttribute("href"));
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }));
    const setActive = (id) => links.forEach((a) => {
      const on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) { a.setAttribute("aria-current", "true"); const inner = nav; const r = a.offsetLeft - inner.clientWidth / 2 + a.clientWidth / 2; inner.scrollTo({ left: r, behavior: reduceMotion ? "auto" : "smooth" }); }
      else a.removeAttribute("aria-current");
    });
    if ("IntersectionObserver" in window) {
      const sio = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
      }, { rootMargin: "-30% 0px -60% 0px" });
      $$(".mp-cat", body).forEach((s) => sio.observe(s));
    }
    if (location.hash && $(location.hash)) setTimeout(() => $(location.hash).scrollIntoView(), 60);
  }

  /* ---------------- POKRETANJE ---------------- */
  function rerenderDynamic() {
    renderFeatured();
    renderTeaser();
    if ($("#mpBody")) { renderMenuPage(); }
    updateOpenStatus();
    if (form) fillTimes();
    observeReveals();
  }
  document.addEventListener("ap:lang", rerenderDynamic);

  applyLang(lang, false);          // pokreće i rerenderDynamic
  $$(".year").forEach((y) => (y.textContent = new Date().getFullYear()));
  setInterval(updateOpenStatus, 60000);
  onScroll();

  // Hero koreografija kreće kad su fontovi spremni (max 700 ms čekanja)
  const go = () => { if (root.classList.contains("is-loaded")) return; root.classList.add("is-loaded"); animateArcDot(); };
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(() => requestAnimationFrame(go));
  } else go();
})();
