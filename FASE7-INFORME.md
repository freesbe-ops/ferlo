# Fase 7 — Informe de proves (Lighthouse · Responsive · Formulari E2E)

**Data:** 2026-11-08
**Branca:** `main` @ `0c6b3d5`
**Entorn:** macOS, Chrome 158 headless, Lighthouse 13.6.0, Playwright 1.65.0 (Chromium 158)
**Servidor de referència:** build de producció (`pnpm build` + `pnpm preview` → `http://localhost:4173`)

---

## 0. Nota metodològica (important)

S'han fet **dues tandes** de Lighthouse:

| Tanda | Servidor | Perf mòbil (Home) | Vàlid? |
|-------|----------|-------------------|--------|
| 1 | `pnpm dev` (:5173) | 55–59 | ❌ No — Vite serveix ~40 mòduls ES sense minificar (1,9 MB de JS de `react-dom.development.js`) |
| 2 | `pnpm preview` (:4173) | 90–94 | ✅ Sí — és el bundle real que es desplegarà |

**Tots els números d'aquest informe són de la tanda 2 (producció).** Els de la tanda 1 només serveixen per descartar un fals positiu: no indiquen cap problema real.

---

## 1. Lighthouse — 16 informes (8 rutes × 2 modes)

Llindars del roadmap: **Perf ≥ 90 · A11y ≥ 95 · BP ≥ 90 · SEO ≥ 95**

| Ruta | Mode | Perf | A11y | BP | SEO | LCP (sim.) | LCP (real) | TBT | CLS |
|------|------|------|------|----|-----|-----------|-----------|-----|-----|
| `/es` | mobile | 🟢 **94** | 🟡 96 | 🟢 100 | 🟢 100 | 2,98 s | 0,18 s | 81 ms | 0,003 |
| `/es` | desktop | 🟢 **100** | 🟡 96 | 🟢 100 | 🟢 100 | 0,59 s | 0,16 s | 0 ms | 0,044 |
| `/es/servicios/reformas-integrales` | mobile | 🔴 **85** | 🟡 96 | 🟢 100 | 🟢 100 | 4,36 s | 0,42 s | 33 ms | 0,000 |
| `/es/servicios/reformas-integrales` | desktop | 🟢 **99** | 🟡 96 | 🟢 100 | 🟢 100 | 0,96 s | 0,39 s | 0 ms | 0,003 |
| `/es/servicios/cocinas` | mobile | 🔴 **84** | 🟡 96 | 🟢 100 | 🟢 100 | 4,50 s | 0,39 s | 36 ms | 0,000 |
| `/es/servicios/cocinas` | desktop | 🟢 **99** | 🟡 96 | 🟢 100 | 🟢 100 | 0,97 s | 0,41 s | 0 ms | 0,003 |
| `/es/servicios/banos` | mobile | 🔴 **85** | 🟡 96 | 🟢 100 | 🟢 100 | 4,37 s | 0,40 s | 33 ms | 0,000 |
| `/es/servicios/banos` | desktop | 🟢 **99** | 🟡 96 | 🟢 100 | 🟢 100 | 0,86 s | 0,42 s | 0 ms | 0,003 |
| `/ca` | mobile | 🟡 **90** | 🟡 96 | 🟢 100 | 🟢 100 | 3,01 s | 0,16 s | 64 ms | 🔴 **0,129** |
| `/ca` | desktop | 🟢 **99** | 🟡 96 | 🟢 100 | 🟢 100 | 0,61 s | 0,14 s | 0 ms | 0,063 |
| `/ca/serveis/reformes-integrals` | mobile | 🔴 **85** | 🟡 96 | 🟢 100 | 🟢 100 | 4,39 s | 0,42 s | 28 ms | 0,042 |
| `/ca/serveis/reformes-integrals` | desktop | 🟢 **99** | 🟡 96 | 🟢 100 | 🟢 100 | 0,96 s | 0,40 s | 0 ms | 0,019 |
| `/ca/serveis/cuines` | mobile | 🔴 **84** | 🟡 96 | 🟢 100 | 🟢 100 | 4,53 s | 0,42 s | 31 ms | 0,042 |
| `/ca/serveis/cuines` | desktop | 🟢 **99** | 🟡 96 | 🟢 100 | 🟢 100 | 0,94 s | 0,43 s | 0 ms | 0,011 |
| `/ca/serveis/banys` | mobile | 🔴 **85** | 🟡 96 | 🟢 100 | 🟢 100 | 4,35 s | 0,39 s | 31 ms | 0,042 |
| `/ca/serveis/banys` | desktop | 🟢 **99** | 🟡 96 | 🟢 100 | 🟢 100 | 0,94 s | 0,40 s | 0 ms | 0,008 |

**Resum d'eixos**

| Eix | Objectiu | Resultat | Estat |
|-----|----------|----------|-------|
| Performance (desktop) | ≥ 90 | 99–100 a totes les rutes | ✅ |
| Performance (mobile) | ≥ 90 | Home 90–94 · **landings 84–85** | ❌ 6/8 rutes |
| Accessibility | ≥ 95 | 96 a les 16 | ✅ (amb marge 1 punt) |
| Best Practices | ≥ 90 | 100 a les 16 | ✅ |
| SEO | ≥ 95 | 100 a les 16 | ✅ |

Informes JSON originals: `/tmp/fase7/lhprod/*.json` (producció) i `/tmp/fase7/lh/*.json` (dev, descartats).

### Verificació SEO addicional (fora de Lighthouse)

Comprovat a les 8 rutes + pàgines legals + 404:

- `<title>`, `meta description`, `canonical` i `hreflang` (`es`, `ca`, `x-default`) **correctes i coherents** a totes les rutes.
- `hreflang` de les landings apunta al slug de l'altre idioma, no a la home (`/es/servicios/cocinas` ↔ `/ca/serveis/cuines`). ✅
- `<html lang>` correcte (`es`/`ca`). ✅
- **0 imatges sense atribut `alt`** a les 8 rutes. ✅
- 404: `noindex, follow` + `canonical` a la home de l'idioma. ✅
- `public/sitemap.xml`: **14 URLs**, les mateixes rutes canonicalitzades. ✅
- **0 errors de consola / `pageerror`** a les 12 rutes provades. ✅

---

## 2. Issues únics (repetits a totes les rutes)

### 🔴 Crític — bloqueja l'objectiu de Perf mòbil

**P1 · LCP simulat de 4,3–4,5 s a les landings (mòbil)**

És l'**únic** audit amb pes que falla: `largest-contentful-paint` score 0,4 (pes 25) → arrossega la nota de 99 a 84.

Diagnòstic (de `lcp-breakdown-insight`):

```
timeToFirstByte .......... 8,8 ms      ← servidor perfecte
elementRenderDelay ...... 422 ms       ← 100% del cost real
```

L'element LCP **no és una imatge**, és el paràgraf `<p class="landing-hero-lead">` (la imatge `hero.webp` ja té `fetchpriority="high"`). El `elementRenderDelay` és el temps de **pintar text que depèn de JavaScript**: baixar `index.js` (98 KB) + `Seo.js` (27 KB) + `Reformes.js` (9 KB), hidratar React i aplicar el web font.

Lantern (la simulació de Lighthouse) multiplica aquests 422 ms de main thread pel factor de throttling 4G+4×CPU i els converteix en 4,4 s. La correlació és exacta: 422 ms observats → 4.419 ms simulats.

> **LCP real mesurat al navegador: 0,39–0,43 s.** El rendiment real és bo; el que falla és l'arquitectura CSR (tot el contingut neix dins d'un bundle JS).

**Top 3 offenders per ruta (mòbil):**

| Ruta | #1 | #2 | #3 |
|------|----|----|----|
| `/es`, `/ca` (Home) | `elementRenderDelay` 1,4 s (main thread) | `gtag.js` 310 KB / 65 ms de main thread | `unused-javascript` 177 KB |
| Landings (6 rutes) | `elementRenderDelay` 422–433 ms | `gtag.js` 310 KB / 65 ms de main thread | `unused-javascript` 140 KB (gtag) + 41 KB (app) |

**Suggeriments de fix (per a Fase 8, NO aplicats — ordre d'impacte):**

1. **Pre-renderitzar (SSG/prerender) les landings** — elimina de cop el `elementRenderDelay` perquè l'HTML conté el `<h1>`/`<p>`. És el fix de fons. Vite + `vite-plugin-ssg`/`react-snap` o passar a Vite SSR.
2. **Self-host del woff2 de Montserrat** (+ `preload` + `font-display: swap`) — treu 2 RTT a `fonts.googleapis.com` → `fonts.gstatic.com` abans del primer pintat de text (avui 43 ms → 161 ms → 228 ms en cascada).
3. **Carregar `gtag.js` diferit** (`requestIdleCallback`) o amb `defer` després del primer pintat — són 310 KB i 65 ms de main thread que no aporten res al LCP.
4. *(descartat per prova)* Afegir `loading="lazy"` + `width/height` a les imatges del slider (`antes.webp` 129 KB + `despres.webp` 180 KB, avui **eager**): provat en un build de diagnòstic → Perf 85, LCP simulat 4.419 ms, **sense canvi**. No és el coll d'ampolla, però sí que és una millora legítima de bytes inicials (recomanada igualment, cost zero).

### 🟡 Mitjà

**P2 · CLS 0,129 a `/ca` mòbil** (llindar bo: < 0,1)

Causa identificada a `cls-culprits-insight`: **"Web font loaded"** sobre el `<h1>` (`Obres que transformen espais.`), 0,068 + 0,061 = 0,129. El fallback de `Montserrat` té mètriques diferents i, en carregar el woff2, el títol es re-maqueta.
Fix: `preload` del woff2 + `@font-face` amb `size-adjust`/`ascent-override` sobre el fallback (o `font-display: optional`). Mateix fix que P1-2.
*Nota: a `/es` el mateix h1 només fa 0,003 — depèn de la longitud del text català. És real, no soroll.*

**P3 · A11y — `label-content-name-mismatch` (WCAG 2.5.3)** — 6 rutes (les 3 landings × 2 idiomes)

```html
<a aria-label="WhatsApp" …>692 586 863</a>   <!-- peu de pàgina -->
```

L'`aria-label` sobreescriu el text visible: un lector de pantalla diu "WhatsApp" però l'usuari veu un número, i **control per veu no pot activar l'enllaç dient el número que veu**. Fix d'una línia (invisible): `aria-label="WhatsApp: 692 586 863"` o eliminar l'`aria-label`.
Ubicacions: `src/pages/Reformes.tsx:767`, `src/pages/Cuines.tsx:687`, `src/pages/Banys.tsx:770`.

**P4 · A11y — `color-contrast`** — 16/16 rutes, 9 variants

| Element | Color / fons | Ràtio | Necessari |
|---------|--------------|-------|-----------|
| Text "WhatsApp" a la nav (mòbil) | `#25D366` / `#e0dcd8` | **1,45** | 4,5 |
| Text "WhatsApp" a la nav (desktop) | `#25D366` / `#fdfcfc` | **1,93** | 4,5 |
| Telèfon del peu `692 586 863` | `#25D366` / `#ffffff` | **1,98** | 4,5 |
| `em` destacat dels h1/h2 landings | `#A89685` / `#f7f4f1` | **2,38–2,6** | 3,0 |
| Números de temporada `01–04` | `#A89685` / `#ffffff` | **2,85** | 4,5 |
| Eyebrow del hero | `#847261` / `#f7f4f1` | **4,2** | 4,5 |

Fix: enfosquir el taupe clar per a text (`#A89685` → `#7A6A5B` per a `<em>`) i no usar el verd WhatsApp com a color de text (usar-lo només com a fons d'icona o acompanyar-lo d'un to fosc). **Cosmètic-visual → V2** segons l'abast d'aquesta fase.

### ⚪ Cosmètic / V2

**P5 · `image-delivery-insight`: 125 KB estalviables** — `despues.webp` (180 KB) i `antes.webp` (129 KB) es mostren a 370×250 però el fitxer és 1049×710. **No tocar: són placeholders de Fase 5.**

**P6 · `render-blocking-insight`: 152 ms** — `index.css` (3,2 KB). Cost negligible.

**P7 · `unused-javascript`: 177 KB** — 140 KB són de `gtag.js`. Mateix fix que P1-3.

---

## 3. Responsive manual — 8 rutes × 4 mides

Dispositius: **iPhone 12** 390×844 · **iPhone 12 landscape** 844×390 · **iPad** 820×1180 · **Desktop** 1440×900.
Captures: [`screenshots/`](./screenshots) (32 rutes×mida + 4 del CookieBanner + 7 del formulari).

### Overflow horitzontal: ✅ 0 de 32

```
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```
Verificat a les 32 combinacions: **`scrollW === clientW` exacte a totes**. Cap ruta té scroll horitzontal.

> Nota: el detector d'elements fora de viewport marca 2–6 nodes per pàgina, però són **falsos positius controlats** (no generen scroll, `overflow-x: clip` a `html`/`body`):
> - el marquee de `CarouselBar` (span de 3.624 px amb `animation: translateX`),
> - el honeypot `.ct-hp` a `left: -9999px` (tècnica intencionada).

### Header / MobileNav

| Comprovació | Resultat |
|-------------|----------|
| Header visible i dins del viewport (32/32) | ✅ |
| Header trencat o desbordat | ✅ 0 casos |
| Menú hamburguesa (390×390 px) obre i tanca (`aria-expanded` true→false) | ✅ 8/8 rutes |
| Barra inferior flotant amb 4 ítems (Servicios · Sobre · Presupuesto · WhatsApp) | ✅ |
| A 844×390 i 820×1180 es mostra el **header d'escriptori** complet (nav + CTA "Pide presupuesto") | ✅ per disseny (breakpoint a 768 px), sense desbordament |

### Grids

| Element | iPhone 12 | iPhone landscape | iPad | Desktop |
|---------|-----------|------------------|------|---------|
| `svc-grid` (serveis Home) | 1 | 2 | 2 | 3 |
| `wy-grid` (benefits) | 1 | 2 | 2 | **4** ✅ |
| `landing-benefits-grid` | 1 | 2 | 2 | **4** ✅ |
| `testimonials-grid` | 1 | 1 | 2 | 3 |
| `footer-grid` | **1** ✅ | 2 | 2 | **4** ✅ |
| `ct-field-row` (formulari) | 1 | 1 | 1 | 2 |

Tots els grids compleixen l'esperat (2 col a iPad, 4 col a desktop on toca, 1 col al footer mòbil).

### Slider abans/després (Reformes + Banys, ES i CA = 4 rutes × 4 mides = 16 proves)

| Comprovació | Resultat |
|-------------|----------|
| `role="slider"` present | ✅ 16/16 |
| **Teclat**: `ArrowRight` 50→55, `ArrowLeft` 55→50 | ✅ 16/16 |
| **Touch** (CDP `Input.dispatchTouchEvent`, drag 50% → 20%) | ✅ 12/12 mòbil+iPad |
| `aria-valuenow`/`aria-valuemin`/`aria-valuemax` actualitzats | ✅ |
| `touch-action: none` al track (evita scroll accidental) | ✅ |

### CookieBanner

| Mida | Barra dins viewport | Botons visibles i clicables | Click descarta | Consent desat |
|------|--------------------|-----------------------------|----------------|---------------|
| 390×844 | ✅ (292 px d'alt, apilat) | ✅ 2/2 | ✅ | `necessary` |
| 844×390 | ✅ (163 px) | ✅ 2/2 | ✅ | `necessary` |
| 820×1180 | ✅ | ✅ 2/2 | ✅ | `necessary` |
| 1440×900 | ✅ | ✅ 2/2 | ✅ | `necessary` |

### Selector d'idioma

| Mida | Home `ES→CA` | Landing `cocinas ES→/ca/serveis/cuines` | Landing `banys CA→/es/servicios/banos` |
|------|--------------|------------------------------------------|----------------------------------------|
| iPhone 12 | ✅ | ✅ | ✅ |
| iPhone 12 landscape | ✅ | ✅ | ✅ |
| iPad | ✅ | ✅ | ✅ |
| Desktop | ✅ | ✅ | ✅ |

Navegació **localitzada** correcta (no cau a la home): el selector de landing porta al slug equivalent de l'altre idioma.

### Captures

| Ruta | iPhone 12 | iPhone landscape | iPad | Desktop |
|------|-----------|------------------|------|---------|
| `/es` | [png](./screenshots/es-home-iphone12.png) | [png](./screenshots/es-home-iphone12-landscape.png) | [png](./screenshots/es-home-ipad.png) | [png](./screenshots/es-home-desktop.png) |
| `/es/servicios/reformas-integrales` | [png](./screenshots/es-reformas-iphone12.png) | [png](./screenshots/es-reformas-iphone12-landscape.png) | [png](./screenshots/es-reformas-ipad.png) | [png](./screenshots/es-reformas-desktop.png) |
| `/es/servicios/cocinas` | [png](./screenshots/es-cocinas-iphone12.png) | [png](./screenshots/es-cocinas-iphone12-landscape.png) | [png](./screenshots/es-cocinas-ipad.png) | [png](./screenshots/es-cocinas-desktop.png) |
| `/es/servicios/banos` | [png](./screenshots/es-banos-iphone12.png) | [png](./screenshots/es-banos-iphone12-landscape.png) | [png](./screenshots/es-banos-ipad.png) | [png](./screenshots/es-banos-desktop.png) |
| `/ca` | [png](./screenshots/ca-home-iphone12.png) | [png](./screenshots/ca-home-iphone12-landscape.png) | [png](./screenshots/ca-home-ipad.png) | [png](./screenshots/ca-home-desktop.png) |
| `/ca/serveis/reformes-integrals` | [png](./screenshots/ca-reformes-iphone12.png) | [png](./screenshots/ca-reformes-iphone12-landscape.png) | [png](./screenshots/ca-reformes-ipad.png) | [png](./screenshots/ca-reformes-desktop.png) |
| `/ca/serveis/cuines` | [png](./screenshots/ca-cuines-iphone12.png) | [png](./screenshots/ca-cuines-iphone12-landscape.png) | [png](./screenshots/ca-cuines-ipad.png) | [png](./screenshots/ca-cuines-desktop.png) |
| `/ca/serveis/banys` | [png](./screenshots/ca-banys-iphone12.png) | [png](./screenshots/ca-banys-iphone12-landscape.png) | [png](./screenshots/ca-banys-ipad.png) | [png](./screenshots/ca-banys-desktop.png) |

CookieBanner: [iPhone 12](./screenshots/cookiebanner-iphone12.png) · [landscape](./screenshots/cookiebanner-iphone12-landscape.png) · [iPad](./screenshots/cookiebanner-ipad.png) · [desktop](./screenshots/cookiebanner-desktop.png)

---

## 4. Formulari E2E

### Pre-check

| Punt | Resultat |
|------|----------|
| Endpoint Apps Script a `src/App.tsx:73` | ✅ `https://script.google.com/macros/s/AKfycbxI5llz39CkCAhf3GcKGl5WkCXAuBtvesn-srXs-27yfHhiz4tSYa9KWR_B63F3Es7q/exec` |
| Honeypot | ✅ `name="website"`, `id="ct-website"`, dins `.ct-hp` (`left:-9999px`, `aria-hidden`, `tabIndex={-1}`) — verificat a `src/App.tsx:743` |
| POST `Content-Type: text/plain` (CORS simple, sense preflight) | ✅ |
| Timeout de 10 s amb `AbortController` | ✅ |

### Test 1 — Enviament vàlid ✅

Dades: `TEST Fase 7` · `600 000 000` · `test-fase7@example.com` · `Tordera` · `Reformas integrales` · `Test automàtic Fase 7 — ignorar`

| Verificació | Resultat |
|-------------|----------|
| POST real a `script.google.com/…/exec` | ✅ 1 request `POST` |
| Resposta HTTP | ✅ **302** (Apps Script redirect → execució OK) |
| Missatge d'èxit `contacte.form_sent_title` | ✅ `"¡Solicitud enviada!"` |
| Temps fins a l'èxit | 2.413 ms |
| Evidència | [form-test1-success.png](./screenshots/form-test1-success.png) |

> ⚠️ **Pendent de verificació manual (no accessible des d'aquí):** confirmar la fila nova al Google Sheet *"Leads FERLO"* i la recepció del correu a `oriolmartinezpa@gmail.com` + `reformasferlo@outlook.es`. El navegador confirma que Apps Script ha acceptat i executat la petició; el contingut del Sheet i del correu no es pot comprovar des del client.

### Test 2 — Honeypot ✅

Formulari complet + `#ct-website` = `http://spam.example`.

| Verificació | Resultat |
|-------------|----------|
| **Requests a `script.google.com`** | ✅ **0** (cap POST) |
| Missatge d'èxit mostrat (per enganyar el bot) | ✅ |
| Fila al Sheet / correu | Ha de ser 0 (conseqüència directa de 0 requests) |

Evidència: [form-test2-honeypot.png](./screenshots/form-test2-honeypot.png)
Codi: `src/App.tsx:187-195` — el `return` anticipat evita `trackFormLead` i el POST.

### Test 3 — Validació client ✅ (amb 1 reserva)

| Cas | Resultat | Missatge |
|-----|----------|----------|
| Email `foo@` (ES) | ✅ rebutjat, 0 POST | `email.validity.valid === false` |
| Sense nom (ES) | ✅ rebutjat, 0 POST | `nom.validity.valid === false` |
| Email `foo@` (CA) | ✅ rebutjat | `email.validity.valid === false` |
| Missatge en l'idioma actiu | 🟡 **Parcial** — veure reserva | |

Evidències: [test3 email invàlid](./screenshots/form-test3-email-invalid.png) · [test3 sense nom](./screenshots/form-test3-no-name.png) · [test3 email invàlid CA](./screenshots/form-test3-email-invalid-ca.png)

> 🟡 **Reserva (gap de i18n, no bloquejant):** la validació és nativa (`required` + `type="email"`), així que el text del tooltip el posa **el navegador en el seu propi idioma**, no en l'idioma de la web. Amb el navegador en anglès i la web en català, el missatge és `"Please enter a part following '@'"`. Reproductible amb `locale: es-ES`, `ca-ES` i `en-US`: el text no canvia perquè Chrome ignora `<html lang>` per als missatges de validació.
> El missatge **propi de la web** (`contacte.form_error`) sí que es localitza correctament (test 4). Per tancar-ho caldria `onInvalid` + `setCustomValidity` amb 2 claus noves a `locales/*.json` → **fora d'abast (locales és NO TOCAR)**. Recomanat per a Fase 9.

### Test 4 — Error de xarxa + reintent ✅

| Pas | Resultat |
|-----|----------|
| `context.setOffline(true)` → enviar | ✅ `net::ERR_INTERNET_DISCONNECTED` (2 intents: `fetch` + reintent `no-cors`) |
| Missatge `contacte.form_error` mostrat | ✅ `role="alert"`, text complet amb el telèfon de WhatsApp |
| Formulari conservat (no es perd el que s'ha escrit) | ✅ |
| `setOffline(false)` → reintentar | ✅ èxit (`¡Solicitud enviada!`), HTTP 302 |

Evidències: [form-test4-offline-error.png](./screenshots/form-test4-offline-error.png) · [form-test4-retry-success.png](./screenshots/form-test4-retry-success.png)

---

## 5. Checklist final

### Lighthouse
- [x] 8 rutes × 2 modes = **16 informes generats**
- [x] Taula de resultats impresa
- [x] Issues únics identificats (**no arreglats**, segons l'abast)
- [x] Recomanació fix immediat vs V2

### Responsive
- [x] **0 overflow horitzontal** a totes les rutes i mides (32/32)
- [x] Header/MobileNav funciona a totes les mides
- [x] Slider usable amb touch a mobile (12/12) i amb teclat (16/16)
- [x] CookieBanner usable a mobile
- [x] **32 screenshots** (8 rutes × 4 mides) + 4 del CookieBanner + 7 del formulari

### Formulari
- [x] Test 1: enviament OK (UI + HTTP 302) — ⏳ fila al Sheet i correus: **verificació manual pendent**
- [x] Test 2: honeypot bloqueja (0 requests)
- [x] Test 3: validació client OK (🟡 missatges natius en idioma del navegador)
- [x] Test 4: error de xarxa es mostra i el reintent funciona

---

## 6. Recomanació

**Estat: 🟡 llest per deploy amb 1 excepció condicional.**

| Criteri | Estat |
|---------|-------|
| Funcionalitat (formulari, i18n, navegació, slider, cookies) | ✅ Sense cap bug funcional |
| Responsive (390 → 1440 px) | ✅ Sense overflow, cap layout trencat |
| Accessibilitat, Best Practices, SEO | ✅ Per sobre de llindar (96 / 100 / 100) |
| Performance escriptori | ✅ 99–100 |
| **Performance mòbil landings** | ❌ **84–85 < 90** |

**Cal arreglar abans de tancar la fase** (només si el llindar «Perf ≥ 90» és contractual per a mòbil):

1. **P1 — LCP landings mòbil** → pre-renderitzar les landings (fix de fons a Fase 8) i, mentrestant, self-host + `preload` del woff2 de Montserrat i `gtag.js` diferit. *Mesura de referència: LCP real 0,39–0,43 s; el dèficit és 100% de la simulació sobre el render delay de JS.*
2. **P2 — CLS 0,129 a `/ca` mòbil** → mateix fix de font (`size-adjust`/`preload`).
3. **P3 — `aria-label="WhatsApp"` sobre el telèfon** (6 rutes) → 1 línia per fitxer, invisible, puja A11y i compleix WCAG 2.5.3.

**A V2 / Fase 9** (no bloqueja): P4 contrastos de color, P5 compressió d'imatges placeholders, P7 `gtag` dead code, i missatges de validació traduïts (Test 3).

**Sense regressions detectades:** no s'ha modificat cap fitxer de `src/` en aquesta fase (el build de diagnòstic del punt P1-4 es va revertir; `git status` net excepte `screenshots/`).

---

## Annex — Com reproduir

```bash
pnpm build && pnpm preview --port 4173        # servidor de referència

# Lighthouse, 1 ruta
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
npx lighthouse http://localhost:4173/es/servicios/cocinas \
  --output=json --output-path=/tmp/lh-cocinas-mobile.json \
  --form-factor=mobile --screenEmulation.mobile=true \
  --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet

# Lighthouse, escriptori
npx lighthouse http://localhost:4173/es/servicios/cocinas \
  --output=json --output-path=/tmp/lh-cocinas-desktop.json \
  --preset=desktop --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet
```

Els scripts de Playwright emprats (responsive, formulari, comprovació d'idioma) són a `/tmp/fase7/*.cjs` i no s'han afegit al repo.
