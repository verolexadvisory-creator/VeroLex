# Sayt arxivi (lokal nusxa) bo'yicha tekshiruv

| | |
|---|---|
| Sana | 2026-10-01, 17:55–18:40 Asia/Tashkent |
| Manba | Foydalanuvchi yuklagan `verolex-sayt_8_1.zip` (67 fayl, fayllar sanasi 2026-08-10, `?v=8`) |
| Dalil darajasi | **D1L** — shu sessiyada bevosita tekshirildi, lekin **lokal nusxada**. Bu nusxa production bilan bir xilligi tasdiqlanmagan |
| Sharoit | Statik fayllar `http-server` bilan 127.0.0.1:8090 da ochildi. Sahifalardagi `https://verolex.uz` manzili test uchun lokal manzilga almashtirildi. `send.php` alohida PHP serverda tokensiz sinaldi. `.env` lokal nusxaga **ko'chirilmadi** va uning qiymatlari o'qilmadi yoki yozilmadi. Tashqi so'rovlar (Google Fonts, xarita, analitika) bloklangan |
| Vositalar | `site_inventory.mjs`, `ui_checks.mjs` (Playwright, Chromium 141), PHP 8 |

## Arxiv va production orasidagi farq

Dastlabki audit (D2) bugun jonli saytda boshqa holatni ko'rgan. Demak, arxivdan keyin production qo'lda o'zgartirilgan.

| Joy | Arxiv (2026-08-10) | Production (D2, 2026-10-01) |
|---|---|---|
| `analytics.js` GA4 | `GA4_ID = "G-XXXXXXXXXX"`; shart: `indexOf("G-") === 0 && indexOf("X") === -1` — to'g'ri yozilgan | `GA4_ID = "G-N4Z7XF5GGK"`; shart: `GA4_ID !== "G-N4Z7XF5GGK"` — har doim `false` |
| Email | Barcha 39 sahifada, JSON-LD'da va README'da faqat `verolexadvisory@gmail.com` | UZ va EN bosh sahifada `info@verolex.uz`, qolganlarida gmail |

**Xulosa.** Arxivdagi GA4 sharti real ID bilan ham to'g'ri ishlaydi: `G-N4Z7XF5GGK` ichida “X” harfi yo'q. B-01 bo'yicha eng oddiy tuzatish — arxivdagi shartni qaytarib, `GA4_ID` ga real ID'ni yozish.

## Natijalar

| ID | Tekshiruv | Natija | Holat |
|---|---|---|---|
| LC-01 | 39 sitemap URL | Barchasi 200; title va description noyob (takror 0); har sahifada bitta H1; canonical o'ziga ishora qiladi; hreflang uz/ru/en/x-default o'zaro bog'langan; JSON-LD xatosiz (LegalService/Organization, WebSite, WebPage, BreadcrumbList, Service, FAQPage); alt'siz rasm 0 | PASS |
| LC-02 | Open Graph va Twitter | og:title, og:description, og:image, og:url, og:type, og:locale va `twitter:card=summary_large_image` bor | PASS |
| LC-03 | Tasdiqlash teglari va Metrika | Google Search Console va Yandex tasdiqlash meta teglari, `yandex_….html` fayli bor. **Yandex Metrika yo'q** | GSC/Yandex PASS; Metrika — yo'q |
| LC-04 | `/index.html` aliasi | Canonical va hreflang `/`, `/ru/`, `/en/` ga ishora qiladi. Lekin menyu, logo va til tugmalari `index.html` ga olib boradi (masalan, `/ru/index.html`). `.htaccess` da `index.html → /` 301 yo'q. Bu D3'dagi `/ru/` va `/ru/index.html` dublikatining sababi | FAIL |
| LC-05 | `.htaccess` | HTTPS va `www → wwwsiz` 301 qoidalari, `.env` ni yopish, xavfsizlik sarlavhalari va kesh bor. Indeksdagi `www.` URLlar (D3) bu fayl production'da ishlamayotganini (masalan, server Nginx) yoki eski indeksni bildirishi mumkin — jonli tekshiruv kerak | Kod PASS; production noma'lum |
| LC-06 | 404 | `ErrorDocument 404 /index.html` — 404 holatida bosh sahifa ko'rsatiladi. Status 404 saqlanadi, lekin foydalanuvchi sahifa topilmaganini tushunmaydi | Takomillashtirish |
| LC-07 | Heading tartibi | 39 sahifaning hammasida `h2→h4` (xizmat kartalari) o'tkazib yuborilgan; aloqa sahifalarida `h1→h3` | FAIL (kichik) |
| LC-08 | Forma label | `<label>` ko'rinadi, lekin `for`/`id` bilan bog'lanmagan: `labels.length = 0`, accessible name faqat placeholder'dan. A08 ning ildiz sababi | FAIL |
| LC-09 | Forma (brauzer, mock) | Bo'sh forma va faqat ism — shu tilda xabar chiqadi (UZ/RU/EN), so'rov yuborilmaydi. Noto'g'ri telefon “abc” va email “test@” brauzerdan o'tib ketadi. Ikki marta bosishda 1 ta so'rov ketadi (tugma o'chiriladi). Server 500 qaytarsa, xato xabari chiqadi | Qisman |
| LC-10 | `send.php` (server) | Validatsiya, honeypot, rate limit va strip_tags bor (`send_php_test.txt`). Validatsiya xatosi foydalanuvchiga umumiy “Xatolik” bo'lib ko'rinadi | Qisman PASS |
| LC-11 | Mobil menyu | `#burger` tugmasida `aria-expanded` va `aria-controls` yo'q. Escape drawer'ni yopadi (kod). Yopiq holatda yashirin havolalarga fokus tushmaydi | Qisman |
| LC-12 | FAQ | Savollar `<button>` — klaviatura (Enter) bilan ochiladi. `aria-expanded` va `aria-controls` yo'q | Qisman |
| LC-13 | RU/EN yordamchi matnlar | `aria-label`: “Til tanlash”, “Yopish”, “Menyu”, “Adolat tarozisi” — RU va EN sahifalarda ham o'zbekcha | FAIL |
| LC-14 | Intro animatsiya | 3 ta bosh sahifada (UZ/RU/EN) kontentni **2,9 soniya** butunlay yopib turuvchi intro bor (`vl-extra.js`, `#vlIntro`). `prefers-reduced-motion` bo'lsa o'tkazib yuboriladi. Har tashrifda qaytariladi | Takomillashtirish (UX/LCP; NEW-006) |
| LC-15 | Til almashtirish | Har sahifada shu sahifaning boshqa tildagi versiyasiga o'tadi (UZ→RU→EN→UZ); back, forward va reload to'g'ri. Bosh sahifada `index.html` shakliga o'tadi (LC-04) | PASS |
| LC-16 | Maxfiylik siyosati va cookie | Arxivda yo'q (faqat FAQ'da mijoz ma'lumotlari maxfiyligi haqida savol bor) | FAIL |
| LC-17 | Marketing da'volari | Bosh sahifa statistikasi: “9 amaliyot yo'nalishi”, “24/7 tezkor maslahat”, “3 til”, “100% onlayn”; matnda “2020-yildan beri” | Tasdiq kerak (REC-007) |
| LC-18 | Jamoa surati | `assets/img/team.webp` (1092×1120) — ofisda olingan haqiqiy guruh surati, alt matni bor. Individual portretlar yo'q | Foydalanish mumkin (NEW-005) |
| LC-19 | Layout | 4 viewportda (1440/768/390/360) gorizontal overflow 0, kesilgan matn 0. 14 px dan kichik matnli element: sahifada 7–12 ta (statistika izohlari va meta) | PASS / kuzatish |
| LC-20 | Shriftlar | Google Fonts: Cormorant Garamond (serif) + Manrope (sans), `subset=cyrillic` — 2 oila. Tashqi manbadan yuklanadi | PASS (self-host — taklif) |
| LC-21 | Ranglar | 9 xizmat yo'nalishining har biri o'z aksent rangiga ega (`vl-extra.css`): oltin, zumrad, mis, binafsha va boshqalar. Bu NEW-001 dagi “cheklangan oltin aksent” yo'nalishiga zid | Redizaynda qayta ko'rish |
| LC-22 | Xavfsizlik | (a) **Arxivda haqiqiy `.env` bor**: Telegram bot tokeni, chat ID va webhook. Faylning o'zidagi izohga ko'ra token avval skrinshotda ochiq ko'ringan. (b) `diagnostika.php` web root'da va parolsiz: `?run=1&send=1` bilan istalgan odam bot orqali sinov xabari yubora oladi; sahifa token uzunligi va oxirgi 3 belgisini, server yo'llarini ko'rsatadi. (c) `robots.txt` maxfiy yo'llarni sanab o'tadi | **P1 (xavfsizlik)** |

## Tasdiqlab bo'lmaganlar

Quyidagilarni lokal nusxada tekshirib bo'lmaydi:
- production'dagi redirectlar, HTTPS va www yo'nalishi;
- `diagnostika.php` serverda bor-yo'qligi;
- arizaning Telegramga haqiqatan yetib borishi;
- jonli analitika;
- tezlik (Lighthouse).
