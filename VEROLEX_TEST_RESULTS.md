# VeroLex — test natijalari

Hujjat sanasi: 2026-yil 1-oktabr, 13:45–14:45, Asia/Tashkent.
Bajaruvchi: Claude Code (bulutli konteyner, Linux; Node 22.22.0; Playwright 1.56.1; Chromium 141).

## Dalil darajalari va statuslar

| Belgi | Ma'nosi |
|---|---|
| **D1** | Shu sessiyada bevosita bajarilgan va dalil fayli saqlangan |
| **D2** | Buyurtmachi bergan dastlabki audit kuzatuvi (`VeroLex_Audit_2026-10-01.md`, o'sha kuni). **Shu sessiyada qayta tekshirilmadi** |
| **D3** | Qidiruv indeksidagi bilvosita dalil (`audit/evidence/04_search_index.md`) |
| **D1L** | Shu sessiyada bevosita tekshirilgan, lekin foydalanuvchi bergan **sayt arxivida** (lokal nusxa, fayllar sanasi 2026-08-10). Production bilan bir xilligi tasdiqlanmagan (`audit/evidence/08_local_copy/`) |
| **PASS / FAIL** | Kutilgan natija bajarildi / bajarilmadi |
| **BLOCKED** | Kirish yoki vosita yo'qligi sababli bajarilmadi. Bu muvaffaqiyatsiz test emas |
| **REJA** | Hali yaratilmagan modul uchun qabul testi. Bajarilgan test emas |

**Asosiy cheklov.** Bu muhitning tarmoq siyosati `verolex.uz` va `www.verolex.uz` ga ulanishni bloklaydi: curl `CONNECT tunnel failed, response 403`, WebFetch `EGRESS_BLOCKED` qaytardi (`audit/evidence/00_session_env.txt`). Shu sababli jonli saytga oid barcha testlar (L-01–L-28) **BLOCKED**. Bu sayt nosozligi emas. Ular uchun tayyor va sinovdan o'tgan skriptlar `audit/evidence/scripts/` papkasida (T-09).

## 1. Shu sessiyada bajarilgan testlar (D1)

| ID | Test | Qadamlar | Kutilgan | Olingan | Vosita / sharoit | Natija | Dalil |
|---|---|---|---|---|---|---|---|
| T-01 | DOCX TZni to'liq o'qish | `word/document.xml` XML tahlili; 4 jadval katakma-katak o'qildi | 13 bo'lim, ilova va jadvallar o'qiladi | 13 bo'lim, ilova, 4 jadval, 62 band. Sarlavhada “черновик для согласования” | unzip, Python ElementTree | PASS | `audit/evidence/02_docx_structure.txt` |
| T-02 | PDF SEO taklifini o'qish | 5 sahifa rasm sifatida ochildi | Sahifa raqamlari bilan o'qiladi | 5 sahifa o'qildi. Kalit so'zlar ro'yxati ilova qilinmagan; “kafolatlangan o'tishlar” soni yo'q | Read (PDF → rasm) | PASS | `audit/evidence/03_pdf_pages.md` |
| T-03 | Repository inventarizatsiyasi | `git ls-tree`, `git log`; AGENTS.md qidirildi | Sayt kodi, stek, build va admin aniqlanadi | Faqat `README.md` (tijorat taklifi bo'yicha yo'riqnoma), 2 commit, AGENTS.md yo'q. **Sayt kodi bu repositoryda yo'q.** README'da NAP, STIR, “2020-yildan” va gmail manzili bor | git | PASS (kod yo'q) | `audit/evidence/01_repo_inventory.txt` |
| T-04 | Jonli saytga HTTP kirish | `curl https://verolex.uz/`, `/robots.txt`, `https://www.verolex.uz/` | HTTP javob olinadi | `CONNECT tunnel failed, response 403` (egress proxy) | curl, agent proxy | BLOCKED | `audit/evidence/00_session_env.txt` |
| T-05 | WebFetch orqali kirish | robots.txt va sitemap.xml so'raldi | Fayl matni olinadi | `EGRESS_BLOCKED: verolex.uz` | WebFetch | BLOCKED | `audit/evidence/00_session_env.txt` |
| T-06 | Qidiruv indeksidagi signal | `site:` va brend so'rovlari (5 ta) | Indeksdagi URL, xost va sarlavhalar yig'iladi | UZ sahifalar `www.` xostida, RU sahifalar wwwsiz; `/ru/` va `/ru/index.html` ikkalasi indeksda; EN natijasi chiqmadi; Yandex Xaritalarda “Веро Лекс — больше не работает” kartochkasi bor (tegishliligi noma'lum) | WebSearch (AQSh hududi) | PASS (dalil yig'ildi; bilvosita) | `audit/evidence/04_search_index.md` |
| T-07 | Taklif etilgan palitra kontrasti | WCAG 2.x nisbiy yorug'lik formulasi bilan 26 juftlik hisoblandi (matn va UI tokenlari) | Har juftlik uchun AA/AAA bahosi | Asosiy matn och fonda 14.09:1, oq matn to'q ko'k fonda 16.26:1 — PASS. **Oltin #AD8A4F och fonda 2.98:1 — katta matn uchun ham FAIL.** Oq fondagi oltin va oltin tugmadagi oq matn 3.22:1 — oddiy matn uchun FAIL. To'q ko'k fondagi oltin 5.05:1 — PASS. Muqobil #7A5E2E och fonda 5.60:1 — PASS | Node, `contrast.mjs` | PASS (hisob bajarildi); 4 juftlik FAIL | `audit/evidence/05_contrast.json` |
| T-08 | GA4 sharti reproduksiyasi | Dastlabki auditda iqtibos qilingan shart mantiqi qayta yaratildi | `hasGA4` qiymati aniqlanadi | Kuzatilgan shart bilan `false`; taklif etilgan tekshiruv bilan `true`; namunaviy `G-XXXXXXXXXX` va bo'sh qiymat rad etiladi | Node, `ga4_condition_repro.mjs` | PASS (A01 mantiqan tasdiqlandi). **Production fayli qayta yuklanmadi** | `audit/evidence/06_ga4_condition_repro.txt` |
| T-09 | Audit skriptlarining o'z testi | Sun'iy fixture saytda ataylab qo'yilgan 17 nuqson; lokal server 127.0.0.1 | Skriptlar barcha nuqsonni topadi va forma so'rovini serverga yubormaydi | **17/17 PASS**. Server hisoblagichi: GET bo'lmagan so'rov 0, `/api/` so'rovi 0 | Playwright Chromium 141, `selftest.mjs` | PASS | `audit/evidence/07_selftest_fixture.txt` |
| T-10 | Cross-browser vositalari | `/opt/pw-browsers` tekshirildi | Chromium, Firefox, WebKit | Faqat Chromium o'rnatilgan | — | BLOCKED (Firefox/WebKit) | `audit/evidence/00_session_env.txt` |

## 2. Dastlabki audit kuzatuvlari (D2, qayta tekshirilmadi)

Quyidagilar dastlabki audit natijasi. Ular matritsadagi statuslar uchun asos bo'ldi, lekin har biri tarmoq ochilgach L-testlar bilan qayta tasdiqlanishi kerak.

| ID | Kuzatuv (2026-10-01, dastlabki audit) | Natija | Qayta test |
|---|---|---|---|
| P-01 | Bosh sahifa, kompaniya, blog/FAQ, aloqa va 9 xizmat yo'nalishi ko'rindi | PASS (mavjudlik) | L-01, L-02 |
| P-02 | Sitemapda 39 URL (13 sahifa turi × 3 til). 36 URL HTTP 200. UZ about/blog/contact HTTP kanalida 502 qaytardi, lekin brauzerda ochildi | PASS (36); 3 ta noaniq | L-01, L-03 |
| P-03 | Ushbu 36 HTML'da title va description noyob, bittadan H1, canonical, uz/ru/en/x-default hreflang. JSON-LD: Organization/LegalService, WebSite, WebPage, Service, BreadcrumbList, FAQPage | PASS | L-02, L-05, L-06 |
| P-04 | Telefon, email, Telegram, ijtimoiy profillar va xarita havolalari bor | PASS (mavjudlik) | L-17 |
| P-05 | Bosh sahifada UZ→RU→EN va blogda UZ→RU ishladi | PASS (qisman qamrov) | L-13 |
| P-06 | EN bosh sahifada bo'sh forma: “Please enter your name and phone number.” | PASS | L-15 |
| P-07 | Blog 18 savol-javobdan iborat; maqola URLlari, kategoriya va sana filtrlari yo'q | FAIL (TZ §5 bo'yicha) | L-01 |
| P-08 | Ommaviy navigatsiya va sitemapda topilmadi: jamoa profillari, keyslar, karyera, maxfiylik, obuna, qidiruv, PDF materiallar | FAIL (ommaviy qism) | L-01, L-09 |
| P-09 | UZ va EN bosh sahifada `info@verolex.uz`; RU bosh sahifa va ko'p RU/EN ichki sahifalarda `verolexadvisory@gmail.com` | FAIL | L-07, L-08 |
| P-10 | RU/EN sahifalarda o'zbekcha aria/alt matnlari (masalan, “Til tanlash”, “Adolat tarozisi”) | FAIL | L-18 |
| P-11 | Maxfiylik siyosatiga havola va cookie xabarnomasi kuzatilmadi | FAIL | L-02 |
| P-12 | Forma `novalidate`; `main.js` faqat ism va telefon bo'shligini tekshiradi | FAIL (yetarli emas) | L-15 |
| P-13 | Honeypot maydoni bor; captcha yo'q; server himoyasi noma'lum | Qisman | L-15, L-27 |
| P-14 | `analytics.js?v=8`: `GA4_ID = "G-N4Z7XF5GGK"`, `hasGA4` sharti `GA4_ID !== "G-N4Z7XF5GGK"` | FAIL | L-19 (+ T-08) |
| P-15 | EN bosh sahifa formasida input va textarea uchun `labels.length = 0` | FAIL | L-16 |
| P-16 | FAQ ochilganda `active` va `max-height` o'zgaradi, `aria-expanded` yo'q | FAIL | L-14 |
| P-17 | DOMda Google Ads `AW-17593861057` skripti; `ADS_LABEL` bo'sh | Ma'lumot, tekshiruv kerak | L-19, L-26 |

## 3. Jonli sayt testlari (L) — hammasi BLOCKED

Sabab: tarmoq siyosati (T-04, T-05). Har test uchun skript va qadamlar tayyor. “Skript” ustunida avtomatlashtirilgan qismi ko'rsatilgan.

| ID | Test | Qadamlar (qisqa) | Kutilgan natija | Skript | Natija |
|---|---|---|---|---|---|
| L-01 | Sitemap va robots inventari | robots → sitemap(lar) → har URL; ≤3 parallel, 400 ms kutish | Barcha URL 200; sitemap = canonical | `site_inventory.mjs` | BLOCKED |
| L-02 | Har URL metadata | title, description, H1, heading tartibi, canonical, robots, OG, GSC/Yandex tegi, matn uzunligi | Noyob, bo'sh emas; 1 ta H1 | `site_inventory.mjs` | BLOCKED |
| L-03 | Redirect va aliaslar | http/https × www/wwwsiz; `/index.html`, `/ru/index.html`, `/en/index.html`, `/ru`, `/en` | Har biri 1 qadamda kanonik URLga 301 | `site_inventory.mjs` | BLOCKED |
| L-04 | Haqiqiy 404 | `/__audit-404-check-<vaqt>.html` | HTTP 404 (soft-404 emas) | `site_inventory.mjs` | BLOCKED |
| L-05 | hreflang qaytish va x-default | Har alternate uchun teskari havola | Barchasi o'zaro bog'langan | `site_inventory.mjs` | BLOCKED |
| L-06 | JSON-LD | Parse, turlar, email/NAP ko'rinadigan matn bilan solishtiriladi | Xatosiz; NAP bir xil | `site_inventory.mjs` | BLOCKED |
| L-07 | Raw HTML va render qilingan DOM | title, H1 va email JS'dan keyin o'zgaradimi | O'zgarmaydi | `site_inventory.mjs` | BLOCKED |
| L-08 | NAP birxilligi | 39 URL × (raw, DOM, JSON-LD) email/telefon matritsasi | Bitta email, bitta telefon | `site_inventory.mjs` (`emailMatrix`) | BLOCKED |
| L-09 | Ichki havolalar | Buzilgan havolalar, sitemapda yo'q URLlar, kiruvchi havolasiz sahifalar, href'siz havolalar | 0 buzilgan; 0 orphan | `site_inventory.mjs` | BLOCKED |
| L-10 | Rasmlar | alt, width/height, loading | Hammasida alt; LCP'dan tashqarisi lazy | `site_inventory.mjs` | BLOCKED |
| L-11 | Viewportlar | 1440×900, 768×1024, 390×844, 360×800; skrinshot; overflow; kesilgan matn | Overflow 0 | `ui_checks.mjs` | BLOCKED |
| L-12 | Mobil menyu | Ochish, aria-expanded, Escape, yopiq menyuda yashirin fokus | aria-expanded almashadi; Escape yopadi; yashirin fokus 0 | `ui_checks.mjs` | BLOCKED |
| L-13 | Til almashtirish | Ichki sahifada UZ→RU→EN→UZ; back, forward, reload | Har qadamda shu sahifaning boshqa tildagi versiyasi | `ui_checks.mjs` | BLOCKED |
| L-14 | FAQ | Bosish, Enter; aria-expanded/controls; balandlik | Klaviatura bilan ochiladi; aria to'g'ri | `ui_checks.mjs` | BLOCKED |
| L-15 | Forma ssenariylari (mock) | S1 bo'sh; S2 faqat ism; S3 noto'g'ri telefon; S4 noto'g'ri email; S5 5000 belgi; S6 ikki marta bosish; S7 server 500. **Hamma so'rov ushlanadi** | Noto'g'ri qiymat rad etiladi; S6'da 1 so'rov; S7'da xato xabari | `ui_checks.mjs` | BLOCKED |
| L-16 | Forma accessible name | `labels`, aria-label, aria-labelledby, placeholder | Har maydon label'ga ega | `ui_checks.mjs` | BLOCKED |
| L-17 | tel/mailto/Telegram/xarita | Faqat href o'qiladi, bosilmaydi | To'g'ri raqam, manzil va profil | `ui_checks.mjs` | BLOCKED |
| L-18 | A11y matnlari va harakat | aria/alt/title/placeholder ro'yxati; RU/EN'da o'zbekcha marker; reduced-motion'da animatsiyalar | Tarjima qilinmagan matn 0; animatsiya 0 | `ui_checks.mjs` | BLOCKED |
| L-19 | Analitika | JS'dagi ID va shartlar; network hitlar (g/collect, Ads, Metrika) ushlanadi va **abort qilinadi**; payloadda PII yo'q | page_view hit bor; PII yo'q | `site_inventory.mjs` (`scriptFindings`, `analyticsAndBlockedRequests`) | BLOCKED |
| L-20 | Tezlik | Bosh sahifa, xizmat, aloqa; mobil va desktop; 3 marta, median; Lighthouse versiyasi va throttling yoziladi | REC-010 mezonlari | `npx lighthouse <url> --preset=desktop` (va mobil) | BLOCKED |
| L-21 | Firefox va WebKit | L-11–L-18 ni `--browser firefox` va `--browser webkit` bilan | Chromium bilan bir xil | `ui_checks.mjs` | BLOCKED (tarmoq + brauzer yo'q) |
| L-22 | Haqiqiy qurilmalar | iPhone Safari, Android Chrome — qo'lda. WebKit emulyatsiyasi Safari o'rnini bosmaydi | Menyu, forma va til ishlaydi | Qo'lda | BLOCKED |
| L-23 | Forma yetkazilishi | Faqat staging yoki alohida test kanali; productionga yuborilmaydi | Ariza test kanalga keladi; logda bor | Qo'lda | BLOCKED (staging yo'q) |
| L-24 | Admin panel | Rollar, draft, tillar, SEO maydonlari, media, menyu, arizalar, eksport | TZ §6.2 bajariladi | Qo'lda (demo) | BLOCKED (kirish yo'q) |
| L-25 | Backup tiklash | Stagingda tiklash | Tiklangan sayt ishlaydi | Qo'lda | BLOCKED |
| L-26 | GA4/Ads/GSC/Yandex hisoblari | O'qish huquqi bilan hisobotlar | Ma'lumot keladi; sitemap qabul qilingan | Qo'lda | BLOCKED |
| L-27 | Server xavfsizligi | **Faqat manba kodini o'qish**; productionga hujum yo'q | Yuqori xavfli topilma yo'q | Kod review | BLOCKED (kod yo'q) |
| L-28 | Open Graph | og:title, description, image, url, locale | Har sahifada to'liq | `site_inventory.mjs` | BLOCKED |

### Tarmoq ochilgach ishga tushirish

```bash
cd audit/evidence/scripts
npm install                      # playwright 1.56.1
npx playwright install chromium firefox webkit   # agar brauzerlar yo'q bo'lsa
node selftest.mjs                # skriptlarni avval fixture'da tekshirish
node site_inventory.mjs --base https://verolex.uz --out ../live --concurrency 2 --delay 400
node ui_checks.mjs --base https://verolex.uz --out ../live --browser chromium
node ui_checks.mjs --base https://verolex.uz --out ../live --browser firefox
node ui_checks.mjs --base https://verolex.uz --out ../live --browser webkit
```

Natijalar `audit/evidence/live/` papkasiga yoziladi: `inventory.json`, `.csv`, `_summary.md`, `ui_checks_*.json`, skrinshotlar. Skriptlar forma yubormaydi va analitika hitlarini abort qiladi. Shunga qaramay, avval staging bo'lsa, o'sha yerda ishga tushirish ma'qul.

## 4. Yangi modullar uchun qabul testlari (REJA)

Bu modullar hali yaratilmagan. Quyidagi testlar ular tayyor bo'lgach stagingda bajariladi. Hech biri bajarilgan deb hisoblanmaydi.

| ID | Modul | Test | Kutilgan natija |
|---|---|---|---|
| Q-01 | Vakansiyalar | Ro'yxat 3 tilda ochiladi; har kartada lavozim, yo'nalish, shahar, format, bandlik turi va “Batafsil” | Hammasi bor; 360 px'da kesilmaydi |
| Q-02 | Vakansiyalar | Batafsil sahifa: vazifalar, talablar, tajriba, tillar, sharoit, format, e'lon sanasi; muddat va haq faqat to'ldirilgan bo'lsa | Bo'sh maydon sarlavhasi chiqmaydi |
| Q-03 | Vakansiya arizasi | Bo'sh majburiy maydon; noto'g'ri email; noto'g'ri telefon | Frontend va backend rad etadi; xabar shu tilda |
| Q-04 | Vakansiya arizasi | CV: .exe, nomi .pdf qilib o'zgartirilgan .exe, 10.1 MB PDF, 9 MB DOCX | Birinchi uchtasi rad etiladi (serverda ham), oxirgisi qabul qilinadi |
| Q-05 | CV maxfiyligi | Yuklangan CV URLini avtorizatsiyasiz va muharrir akkaunti bilan ochish | 401/403; sitemap va media kutubxonasida yo'q |
| Q-06 | Ariza holatlari | Mock 200, 500, timeout; ikki marta bosish | Kutish holati; success faqat 200 + yozuv ID bilan; 500'da xato; 1 ta yozuv |
| Q-07 | Vakansiya hayot sikli | draft → published → closed → archived | Draft ko'rinmaydi; closed'da “Qabul yopilgan”, forma yo'q, POST 4xx; archived ro'yxatda yo'q, URL 410 yoki tushuntirish |
| Q-08 | Bo'sh holat | Ochiq vakansiya 0 ta | Tushunarli bo'sh holat matni; umumiy CV taklifi faqat sozlangan bo'lsa |
| Q-09 | Jamoa kartasi | Har kartada F.I.Sh., foto, “Lavozimi” va “Mutaxassisligi” alohida | Ikkala maydon alohida; foto yo'q bo'lsa monogramma |
| Q-10 | Xodim profili | O'z URLi; bio, ta'lim, tajriba, tillar, xizmatlar, korporativ aloqa | Barcha to'ldirilgan maydonlar chiqadi; Person schema matnga mos |
| Q-11 | Xodim↔xizmat | Profildan xizmatga, xizmatdan profilga havola | Ikki tomonga ishlaydi |
| Q-12 | Til almashish | RU profilda EN tugmasini bosish | Shu xodimning EN profili; tarjima bo'lmasa EN jamoa sahifasi va izoh, 404 emas |
| Q-13 | Admin | Tartibni o'zgartirish, yashirish, foto almashtirish | O'zgarish 3 tilda aks etadi; yashirilgan profil 404 yoki 410 va sitemapdan chiqadi |
| Q-14 | Maqom va maxfiylik | Maqomi kiritilmagan xodim | “Advokat” yozuvi chiqmaydi; shaxsiy telefon/email maydoni ommaga chiqmaydi |
| Q-15 | Hamkorlar | Bosh sahifa bloki va to'liq sahifa | Mahalliy va xorijiy guruh to'g'ri; yakunlangan hamkorlik “Avval hamkorlik qilganmiz” deb belgilangan |
| Q-16 | Hamkor maydonlari | Munosabat turi “mijoz” | “Hamkor” deb ko'rsatilmaydi |
| Q-17 | Logolar | Turli nisbatdagi 6 logo; buzilgan rasm URLi; 360 px | Proporsiya saqlanadi; nom ko'rinadi; grid buzilmaydi |
| Q-18 | Filtr | Geografiya va holat filtri | To'g'ri natija; filtrli URL noindex |
| Q-19 | Ruxsat | “Logo ruxsati: yo'q” | Kompaniya nashr qilinmaydi; ichki qayd ommaviy HTMLda yo'q |
| Q-20 | Admin | Hamkor qo'shish, logo almashtirish, tartiblash, yashirish | 3 tilda aks etadi |

## 5. Sayt arxivi bo'yicha testlar (D1L, 2026-10-01 17:55–18:40)

Foydalanuvchi `verolex-sayt_8_1.zip` arxivini yukladi. Arxiv 67 fayldan iborat: 39 ta HTML sahifa, `send.php`, `diagnostika.php`, `.htaccess`, `.env`. Sahifalar lokal serverda ochildi, `send.php` esa PHP serverda tokensiz sinaldi. `.env` lokal nusxaga ko'chirilmadi, uning qiymatlari o'qilmadi va yozilmadi. To'liq natijalar: `audit/evidence/08_local_copy/README.md`.

**Muhim.** Arxiv production'dan farq qiladi: GA4 kodi va email boshqacha (LC-01 izohi). Shuning uchun quyidagi L-testlar lokal nusxada **qisman** bajarildi. Production uchun ular BLOCKED bo'lib qoladi.

| L-test | Lokal natija (LC) | Natija |
|---|---|---|
| L-01 Sitemap va robots | 39 URL, barchasi 200; robots.txt to'g'ri; sitemapdagi `loc` canonical bilan bir xil | PASS (lokal) |
| L-02 Metadata | Title va description noyob, har sahifada bitta H1, meta keywords yo'q. Heading darajasi o'tkazib yuborilgan: barcha sahifalarda `h2→h4`, aloqa sahifalarida `h1→h3` | PASS / FAIL (heading) |
| L-03 Aliaslar | `index.html` va `/` ikkalasi ham 200 qaytaradi; menyu `index.html` ga olib boradi; `.htaccess` da `index.html` uchun 301 yo'q (kod). HTTPS va www qoidalari kodda bor, production'da tekshirilmadi | FAIL (alias) |
| L-04 404 | Lokal serverda 404; `.htaccess` da `ErrorDocument 404 /index.html` (alohida 404 sahifasi yo'q) | Qisman |
| L-05 hreflang | O'zaro bog'langan, x-default bor | PASS (lokal) |
| L-06 JSON-LD | Xatosiz; NAP va email ko'rinadigan matnga mos | PASS (lokal) |
| L-07 Raw va DOM | JS title, H1 va emailni o'zgartirmaydi | PASS (lokal) |
| L-08 NAP | Arxivda bitta email (gmail) va bitta telefon | PASS (arxivda); production — FAIL (D2) |
| L-09 Havolalar | Buzilgan havola yo'q. “Xizmatlar” ota-bandi `href="#"`, pastki havolalar haqiqiy | PASS |
| L-10 Rasmlar | Alt matni yo'q rasm — 0; `width`/`height` va `lazy` bor | PASS |
| L-11 Viewportlar | 1440, 768, 390 va 360 px'da overflow 0, kesilgan matn 0 | PASS |
| L-12 Mobil menyu | `aria-expanded` yo'q; Escape yopadi; yopiq menyuda yashirin fokus 0 | Qisman |
| L-13 Til almashtirish | Har sahifada to'g'ri ishlaydi; back, forward va reload ishlaydi | PASS |
| L-14 FAQ | `<button>`, Enter bilan ochiladi; `aria-expanded` yo'q | Qisman |
| L-15 Forma (mock) | Bo'sh forma rad etiladi (3 tilda xabar). Noto'g'ri telefon va email brauzerdan o'tib ketadi. Ikki marta bosishda 1 so'rov. 500 xatoda xato xabari chiqadi | Qisman |
| L-15b `send.php` | Validatsiya, honeypot va rate limit (5/daqiqa → 429) ishlaydi | PASS |
| L-16 Label | `<label>` bor, lekin `for`/`id` bilan bog'lanmagan | FAIL |
| L-17 Havolalar | tel:, mailto:, Telegram, 5 ta ijtimoiy tarmoq, Google xarita iframe — README'dagi ro'yxatga mos | PASS |
| L-18 A11y matnlari | RU/EN'da “Til tanlash”, “Yopish”, “Menyu”, “Adolat tarozisi” o'zbekcha qolgan. Reduced-motion hurmat qilinadi | FAIL (lokalizatsiya) |
| L-19 Analitika | Arxivda GA4 namunaviy ID bilan o'chiq, lekin sharti to'g'ri yozilgan; Ads `AW-17593861057`, `ADS_LABEL` bo'sh; Metrika yo'q | Kod tekshirildi |
| L-28 Open Graph | Barcha sahifalarda to'liq; Twitter card ham bor | PASS (lokal) |
| L-24 Admin | Arxivda admin panel yoki CMS yo'q | FAIL (TZ §6.2) |
| L-27 Xavfsizlik (kod) | `send.php` — xavf past. `diagnostika.php` parolsiz web root'da; arxivda haqiqiy `.env` | FAIL (REC-017) |

Qo'shimcha kuzatuvlar:
- **LC-14:** bosh sahifalarda 2,9 soniyalik intro animatsiya kontentni yopadi.
- **LC-17:** saytda “24/7”, “100% onlayn” va “2020-yildan” da'volari bor.
- **LC-18:** haqiqiy jamoa guruh surati bor.
- **LC-20:** 2 ta shrift oilasi ishlatilgan, ular Google Fonts'dan yuklanadi.
- **LC-21:** 9 xil yo'nalish uchun 9 xil aksent rangi bor.

Ishlatilgan vositalar va tuzatishlar:
- `site_inventory.mjs` va `ui_checks.mjs` (Chromium 141), PHP 8.
- Arxiv tekshiruvi skriptlardagi 4 ta selektor kamchiligini ko'rsatdi: tugma ko'rinishidagi til tanlagich, `role="status"` xabari, FAQ javob konteyneri, matn tugunlaridan email ajratish. Shuningdek, intro animatsiyasi tugashini kutish (`--settle`) qo'shildi. Tuzatishlardan keyin selftest yana **17/17 PASS**.
