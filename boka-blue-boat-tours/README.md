# Boka Blue Boat Tours — website

Static site (HTML/CSS/JS, no build step). Languages: English, Crnogorski, Deutsch, Русский.

## Deploy
- **Netlify:** drag this whole folder onto https://app.netlify.com/drop (or onto your existing site's "Deploys" tab).
- Any other host: upload all files as they are.

## Editing
- Text (English): `index.html`. Other languages: `i18n.js` (same keys).
- Prices: `data-price="…"` in `index.html` and `PRICES` in `main.js`.
- Email: `bokablueboattours@gmail.com` in `index.html` (contact list, footer, FAQ, structured data) and `a6` in `i18n.js`.
- WhatsApp number: `WA_NUMBER` in `main.js` and the `wa.me/38260086745` links in `index.html`.
- Photos: `assets/img/` (WebP; `-sm` = phone size, `-blur` = loading placeholder).

## Hero video (later)
Replace one `<figure class="slide">` in the hero with a muted, looping `<video playsinline>` (≈2–4 MB MP4) and keep a photo as its `poster`.
