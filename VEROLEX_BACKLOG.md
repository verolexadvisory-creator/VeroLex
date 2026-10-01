# VeroLex — ishlar ro'yxati (backlog)

Sana: 2026-10-01, Asia/Tashkent. Har bandda talab ID'lari ko'rsatilgan (`VEROLEX_REQUIREMENTS_MATRIX.csv`). Takroriy bandlar birlashtirilgan.

**Muddat va narx.** Sayt kodi va admin panel ko'rilmagani uchun muddat va narx berilmaydi. Ular B-09 natijasidan keyin dasturchi bahosi bilan qo'shiladi.

**Ikki xil tartib:**
- **Nuqsonlar** (B-xx) og'irlik bo'yicha tartiblangan: P0 → P3.
- **Yangi majburiy modullar** (M-xx) **reliz tartibi** bo'yicha joylashtirilgan. Modul hali yo'qligi o'z-o'zidan nuqson yoki xavfsizlik muammosi emas. Ikkala ro'yxat §3dagi yagona reliz rejasida birlashadi.

**Rollar:**
- **Dasturchi** — sayt va admin panel.
- **Dizayner.**
- **SEO** — SEO ijrochisi.
- **VeroLex** — rahbariyat yoki kontent mas'uli.
- **Yurist** — VeroLex yuristi.
- **HR.**
- **QA** — test qiluvchi.

---

## P0

Tasdiqlangan P0 yo'q. Arxiv tekshiruvi (B-29) shuni ko'rsatdi: production'da `diagnostika.php` qolgan bo'lsa yoki `.env` web orqali ochilsa, bu holat P0 ga ko'tariladi. Quyidagi holatlardan biri aniqlansa, tegishli band darhol P0 ga ko'tariladi:
- B-03 tekshiruvida arizalar umuman yetib bormasa;
- kod tekshiruvida (B-19) SQL injection yoki XSS tasdiqlansa;
- CV yoki ariza ma'lumotlari ochiq URLda topilsa.

---

## P1

### B-01. GA4 yoqilish shartini tuzatish va hodisalarni tasdiqlash
- **Talablar:** TZ-059, REC-001, SEO-018.
- **Muammo va dalil:** D2 — `assets/js/analytics.js?v=8` faylida `GA4_ID = "G-N4Z7XF5GGK"`, lekin `hasGA4` sharti `GA4_ID !== "G-N4Z7XF5GGK"`. D1 — T-08: bunday shart har doim `false` beradi. Ehtimoliy sabab: namunaviy ID almashtirilganda solishtirish qatori ham o'zgargan.
- **Ta'siri:** shu kod yo'li orqali GA4 ma'lumoti yig'ilmaydi. Natijada SEO va reklama samarasini, arizalar manbasini o'lchab bo'lmaydi.
- **O'zgarish:**
  1. Shartni namunaviy qiymatni rad etuvchi tekshiruvga almashtirish: `!id || /^G-X+$/i.test(id)` bo'lsa o'chiq.
  2. `generate_lead` hodisasini faqat server muvaffaqiyatli javob berganda yuborish.
  3. `click_tel`, `click_telegram`, `click_email`, `language_switch` hodisalarini qo'shish.
  4. Parametrlarda ism, telefon, email va xabar matni bo'lmasligi kerak.
- **Saqlanadigan xulq:** mavjud Google Ads tegi va `?v=` kesh versiyalash. Fayl yangilanganda versiya raqami oshiriladi.
- **Fayllar:** `assets/js/analytics.js`, `assets/js/main.js` (forma success callback), barcha HTML'dagi `?v=`.
- **Bog'liqlik:** GA4 test property yoki DebugView kirishi (B-09); cookie qarori (B-07).
- **Mas'ul:** Dasturchi; tekshiradi — SEO.
- **Qabul mezoni:** DebugView'da `page_view` va test `generate_lead` (stagingda) ko'rinadi; network payloadda PII yo'q.
- **Qayta test:** L-19, T-08.
- **Arxiv tekshiruvi (D1L, 2026-10-01):** 2026-08-10 dagi arxivda shart to'g'ri yozilgan: `indexOf("G-") === 0 && indexOf("X") === -1`. Real ID `G-N4Z7XF5GGK` ham shu shartdan o'tadi. Eng oddiy tuzatish — shu shartni qaytarish, `GA4_ID` ga real ID yozish va `?v=8` ni `?v=9` ga oshirish.

### B-02. Rasmiy emailni tanlash va hamma joyda birxillashtirish
- **Talablar:** TZ-020, TZ-056, TZ-002.
- **Muammo va dalil:** D2 — UZ va EN bosh sahifada `info@verolex.uz`; RU bosh sahifa va ko'p RU/EN ichki sahifalarda `verolexadvisory@gmail.com`. D3 — snippetlarda gmail. D1 — README blankida gmail.
- **Ta'siri:** mijoz ishonchiga, NAP izchilligiga va lokal SEO'ga ta'sir qiladi. Agar qutilardan biri o'qilmasa, murojaat yo'qolishi mumkin.
- **O'zgarish:**
  1. VeroLex bitta rasmiy manzilni tanlaydi. Tavsiya — domen manzili, agar u xat qabul qilsa.
  2. HTML matn, `mailto:`, tarjima lug'ati (JS), JSON-LD `email`, footer va aloqa sahifasi yangilanadi.
  3. Ikkinchi manzil yo'naltirish (forward) sifatida saqlanadi.
- **Saqlanadigan xulq:** telefon, manzil va Telegram o'zgarmaydi.
- **Fayllar:** 39 HTML; i18n lug'ati (agar JS ichida bo'lsa); JSON-LD bloklari.
- **Bog'liqlik:** VeroLex qarori. Domen pochtasi tanlansa, MX va qabul qilish testi.
- **Mas'ul:** VeroLex (qaror); Dasturchi.
- **Qabul mezoni:** L-08 matritsasida raw HTML, render qilingan DOM va JSON-LD'da bitta email; test xati tanlangan qutiga keladi.
- **Qayta test:** L-07, L-08, L-06.

### B-03. Forma yetkazilishini xavfsiz tekshirish
- **Talablar:** TZ-068, REC-011, TZ-008.
- **Muammo va dalil:** D0 — arizalar Telegram, CRM yoki emailga yetib borishi tasdiqlanmagan. Productionga test ariza yuborish taqiqlangan.
- **Ta'siri:** yetib bormasa, sayt asosiy vazifasini — murojaat qabul qilishni — bajarmaydi (P0 ga ko'tariladi).
- **O'zgarish:**
  1. Noindex va parol bilan himoyalangan staging yoki alohida test kanalini (test Telegram chat yoki test email) sozlash.
  2. End-to-end yuborish va yetkazish xatosini sinash.
  3. Yetkazish muvaffaqiyatsiz bo'lsa, foydalanuvchiga xato ko'rsatish va logga yozish.
- **Saqlanadigan xulq:** production kanali va mavjud honeypot.
- **Fayllar:** forma backend endpointi; konfiguratsiya (sirlar repositoryga kiritilmaydi).
- **Bog'liqlik:** B-09.
- **Mas'ul:** Dasturchi; VeroLex test kanalini beradi.
- **Qabul mezoni:** test ariza test kanalda va server logida bor. Kanal o'chirilganda foydalanuvchi “yuborildi” xabarini ko'rmaydi.
- **Qayta test:** L-23, L-15 (S7).

### B-04. Forma validatsiyasi va holatlari
- **Talablar:** TZ-028.
- **Muammo va dalil:** D2 — forma `novalidate`; `main.js` faqat ism va telefon bo'shligini tekshiradi; telefon va email formati tekshirilmaydi; server tekshiruvi noma'lum.
- **Ta'siri:** noto'g'ri raqam bilan kelgan ariza bo'yicha mijozga qayta bog'lanib bo'lmaydi; spam ko'payadi.
- **O'zgarish:**
  1. Frontend: telefon `+998` va xalqaro formatda, kamida 9 raqam.
  2. Email formati (maydon bo'lsa); uzunlik chegaralari (ism ≤ 100, xabar ≤ 2000 — taklif).
  3. `aria-invalid` va 3 tilli xabarlar.
  4. Yuborish vaqtida tugma `disabled` va `aria-busy`; ikki marta bosilganda bitta so'rov ketadi.
  5. Backendda ham xuddi shu qoidalar tekshiriladi; 4xx va 5xx holatlar uchun tushunarli xabar.
- **Saqlanadigan xulq:** mavjud bo'sh maydon xabarlari (UZ/RU/EN) va honeypot.
- **Fayllar:** `assets/js/main.js`, forma backendi, tarjima lug'ati.
- **Bog'liqlik:** B-05 bilan birga bajariladi.
- **Mas'ul:** Dasturchi.
- **Qabul mezoni:** L-15: S3 va S4 rad etiladi; S6'da 1 so'rov; S7'da xato xabari; backend noto'g'ri qiymatni 422 bilan rad etadi.
- **Qayta test:** L-15.

### B-05. Forma maydonlariga label va accessible name
- **Talablar:** REC-003, TZ-044.
- **Muammo va dalil:** D2 — EN bosh sahifa formasida `labels.length = 0`.
- **Ta'siri:** screen reader foydalanuvchisi maydon nomini eshitmaydi; placeholder yozish boshlanganda yo'qoladi.
- **O'zgarish:**
  1. Har maydonga ko'rinadigan `<label for>` va shu tilda matn.
  2. Xato xabarlari `aria-describedby` bilan bog'lanadi.
  3. Honeypot `aria-hidden` va `tabindex=-1` bilan qoladi.
- **Saqlanadigan xulq:** forma joylashuvi; yangi dizaynda label ko'rinadi.
- **Fayllar:** forma bor barcha HTML'lar (kamida bosh sahifa va aloqa × 3 til).
- **Bog'liqlik:** B-04.
- **Mas'ul:** Dasturchi.
- **Qabul mezoni:** L-16: barcha maydonlarda `accessibleNameSource = label`.
- **Qayta test:** L-16; screen reader bilan qo'lda tekshirish (NVDA yoki VoiceOver).

### B-06. Spam himoyasi bo'yicha qaror
- **Talablar:** TZ-029.
- **Muammo va dalil:** D2 — honeypot bor, captcha yo'q. DOCX captcha talab qiladi. Server himoyasi noma'lum.
- **Ta'siri:** spam arizalar, Telegram yoki CRM kanalini to'ldirib yuborish xavfi.
- **O'zgarish:** variantni VeroLex tasdiqlaydi.
  - (a) DOCX bo'yicha captcha.
  - (b) Muqobil: server tomonda honeypot, vaqt tokeni va IP bo'yicha rate limit (masalan, 5 ariza / 10 daqiqa — taklif).
  - (b) tanlansa, bu TZdan farq sifatida yoziladi. Honeypot captcha bilan bir xil deb hisoblanmaydi.
- **Saqlanadigan xulq:** foydalanuvchi uchun oddiy forma.
- **Bog'liqlik:** B-09 (kod).
- **Mas'ul:** VeroLex (qaror); Dasturchi.
- **Qabul mezoni:** stagingda bot ssenariysi (honeypot to'ldirilgan, 1 soniyada yuborilgan, ketma-ket 20 ta) rad etiladi; oddiy ariza o'tadi.
- **Qayta test:** L-15, L-23.

### B-07. Maxfiylik siyosati, forma oldidagi axborot va cookie xabarnomasi
- **Talablar:** TZ-023, TZ-024, REC-015.
- **Muammo va dalil:** D2 — navigatsiya va formalarda maxfiylik havolasi va cookie xabarnomasi yo'q. Sahifada Google Ads skripti bor.
- **Ta'siri:** shaxsiy ma'lumotlar (ism, telefon, kelajakda CV) to'planadi. Huquqiy talablarga moslikni yurist baholashi kerak; bu audit huquqiy xulosa bermaydi.
- **O'zgarish:**
  1. Yurist 3 tilda siyosat matnini tayyorlaydi: qaysi ma'lumot, maqsad, saqlash joyi va muddati, uchinchi shaxslar (Telegram, Google), so'rov tartibi.
  2. Footerda va har forma tagida havola.
  3. Cookie xabarnomasi. Rozilik kerakmi va analitika undan oldin yuklanadimi — yurist qaroriga ko'ra.
- **Saqlanadigan xulq:** formaning qisqaligi.
- **Bog'liqlik:** Yurist; B-01 (analitika rejimi).
- **Mas'ul:** Yurist; Dasturchi.
- **Qabul mezoni:** siyosat sahifasi 3 tilda, sitemapda; har formada havola; cookie bloki 3 tilda va yurist tanlagan rejimda.
- **Qayta test:** L-02, L-18, L-19.

### B-08. Kanonik xost va `/index.html` aliaslari
- **Talablar:** REC-005, REC-006, TZ-048, TZ-054.
- **Muammo va dalil:** D3 — UZ sahifalari `www.verolex.uz` xostida, RU sahifalari `verolex.uz` xostida indekslangan; `/ru/` va `/ru/index.html` alohida natija bo'lib chiqdi. D2 — HTTP kanalida aynan UZ about/blog/contact 502 bergan; bog'liqligi isbotlanmagan.
- **Ta'siri:** indeks signallari bo'linadi va dublikatlar paydo bo'ladi; ba'zi variantlarda xato javob qaytishi mumkin.
- **O'zgarish:**
  1. L-03 bilan joriy holatni o'lchash.
  2. Bitta xostni tanlash. Tavsiya: hozirgi canonical va sitemapda qaysi xost bo'lsa, o'sha.
  3. Qolgan xost va `http://` dan 1 qadamli 301.
  4. `/index.html` → katalog URL (yoki aksincha) 301.
  5. Canonical, hreflang, sitemap va ichki havolalarni bir shaklga keltirish.
  6. GSC'da tekshirish.
- **Saqlanadigan xulq:** mavjud 39 URL va hreflang juftliklari.
- **Fayllar:** server konfiguratsiyasi (nginx/Apache/hosting panel), HTML'dagi canonical va hreflang, `sitemap.xml`.
- **Bog'liqlik:** hosting kirishi (B-09).
- **Mas'ul:** Dasturchi; tekshiradi — SEO.
- **Qabul mezoni:** L-03: barcha variantlar 1 qadamda kanonik URLga 301; L-05 xatosiz; www va wwwsiz versiyalarda 502 yo'q.
- **Qayta test:** L-03, L-05, L-01; GSC URL Inspection.
- **Sabab topildi (D1L):** canonical va hreflang `/`, `/ru/`, `/en/` ga ishora qiladi, lekin menyu, logo va `main.js` dagi til almashtirish `index.html` ga olib boradi. `.htaccess` da `index.html` uchun 301 yo'q. Tuzatish: ichki havolalarni `./` (yoki `/ru/`) ga o'zgartirish, `main.js` da `index.html` o'rniga katalog URL ishlatish, `.htaccess` ga `RewriteRule ^(ru/|en/)?index\.html$ /$1 [R=301,L]` qo'shish. www va HTTPS qoidalari arxivdagi `.htaccess` da bor, shuning uchun production server konfiguratsiyasi tekshiriladi.

### B-09. Kirishlar, manba kodi va arxitektura qarori uchun materiallar
- **Talablar:** TZ-026, TZ-045, TZ-063, TZ-005, TZ-036, SEO-002, SEO-007, REC-012, NEW-029.
- **Muammo va dalil:** D1 — bu repositoryda sayt kodi yo'q. D0 — admin panel, stek, hosting va backup noma'lum. PDF izohiga ko'ra ijrochi saytni CMS talabiga mos emas deb hisoblaydi.
- **Ta'siri:** yangi modullar (jamoa, hamkorlar, vakansiyalar) uchun “kengaytirish yoki yangi backend” qarorini dalil bilan qabul qilib bo'lmaydi. Natijada takroriy ish va ortiqcha xarajat xavfi bor.
- **O'zgarish:** pudratchidan va VeroLex'dan quyidagilar olinadi:
  1. Manba kodi (VeroLex nazoratidagi yopiq repository);
  2. Deploy va build yo'riqnomasi;
  3. Admin demo yoki test akkauntlari (administrator va muharrir);
  4. Staging;
  5. Hosting va domen egaligi;
  6. Backup jadvali;
  7. GA4, GSC, Yandex.Webmaster/Metrika va Ads'ga o'qish huquqi.

  Sirlar hisobotga yoki repositoryga yozilmaydi.
- **Saqlanadigan xulq:** production o'zgarmaydi; faqat o'qish.
- **Mas'ul:** VeroLex rahbariyati.
- **Qabul mezoni:** VEROLEX_AUDIT.md §9dagi kirishlar ro'yxati “berildi” holatida.
- **Qayta test:** L-24, L-25, L-26, L-27.
- **Arxiv tekshiruvi (D1L):**
  - Yuklangan arxivda admin panel yoki CMS **yo'q**. Sayt statik HTML va `i18n.js` dan iborat, forma uchun `send.php` ishlatiladi. Matnni o'zgartirish uchun HTML va `i18n.js` ni qo'lda tahrirlash kerak (README §6).
  - Shuning uchun REDESIGN_TZ'dagi A varianti (“mavjud admin panelni kengaytirish”) qo'llanmaydi. Tanlov B varianti (individual backend va admin) yoki C varianti (faqat TZ rasman o'zgartirilsa) o'rtasida.
  - Production'da arxivda yo'q admin panel mavjud emasligini pudratchidan yozma tasdiqlatish kerak.

### B-10. Google Ads konversiya yo'lini aniqlash
- **Talablar:** REC-002.
- **Muammo va dalil:** D2 — `ADS_LABEL` bo'sh; DOMda `AW-17593861057`.
- **Ta'siri:** konversiya GA4 importi orqali hisoblanmasa, Ads optimallashtirishi signalsiz qoladi. Hozircha bu tasdiqlanmagan.
- **O'zgarish:**
  1. Ads hisobida konversiya manbasini aniqlash.
  2. GA4 importi bo'lsa — B-01 yetarli. Bevosita label bo'lsa — label qo'shiladi.
- **Bog'liqlik:** B-01, B-09.
- **Mas'ul:** SEO yoki Ads mas'uli; Dasturchi.
- **Qabul mezoni:** test konversiya Ads'da qayd etilgan.
- **Qayta test:** L-19, L-26.

### B-11. Google Search Console va Yandex.Webmaster
- **Talablar:** SEO-021, TZ-054, SEO-024.
- **Muammo va dalil:** D0 — tasdiqlash va sitemap qabul qilinishi noma'lum. D3 — EN sahifalari qidiruv natijasida ko'rinmadi.
- **O'zgarish:**
  1. Mulk VeroLex akkauntida bo'ladi (domen darajasida).
  2. Sitemap yuboriladi.
  3. Indeks hisobotlari va EN sahifalar holati olinadi.
  4. B-08dan keyin qayta tekshiriladi.
- **Mas'ul:** VeroLex; SEO.
- **Qabul mezoni:** sitemap holati “Success”; indeksdagi sahifalar soni hisobotda.
- **Qayta test:** L-26.

### B-12. SEO shartnomasini aniqlashtirish
- **Talablar:** SEO-001, SEO-008, SEO-009, SEO-010, SEO-012, SEO-014, SEO-019, SEO-020, SEO-026.
- **Muammo va dalil:** D1 — PDF'da kalit so'zlar ro'yxati, kafolatlangan o'tishlar soni, matnlar soni, KPI va boshlang'ich holat yo'q; til va hudud — faqat RU va O'zbekiston; texnik tuzatishlar buyurtmachi zimmasida.
- **Ta'siri:** 24 mln so'mlik xizmat natijasini o'lchab va qabul qilib bo'lmaydi.
- **O'zgarish:** shartnomaga quyidagilar yoziladi:
  - KPI va boshlang'ich holat;
  - so'rovlar ro'yxati va ular qaysi URLga tegishli ekani;
  - oylik matnlar soni va kim tekshirishi;
  - hisobot shabloni;
  - linkbuilding mezonlari;
  - AI optimizatsiyasi natijalari;
  - UZ/EN qamrovi (kerak bo'lsa alohida);
  - rollar: kim topshiriq yozadi, kim bajaradi, kim qayta tekshiradi.
- **Mas'ul:** VeroLex rahbariyati; SEO.
- **Qabul mezoni:** shartnoma ilovasida yuqoridagi bandlarning har biri bor.

### B-29. Maxfiy sozlamalar xavfsizligi (arxiv tekshiruvi)
- **Talablar:** REC-017, TZ-049.
- **Muammo va dalil (D1L):**
  - Audit uchun yuborilgan arxivda haqiqiy `.env` fayli bor: Telegram bot tokeni, chat ID va webhook. Faylning o'zidagi izohga ko'ra, token avval skrinshotda ochiq ko'ringan.
  - `diagnostika.php` web root'da parolsiz turibdi. `?run=1&send=1` orqali istalgan odam bot nomidan sinov xabarlarini yubora oladi. Sahifa token uzunligi va oxirgi 3 belgisini ham ko'rsatadi.
  - `robots.txt` bu yo'llarni sanab o'tadi.
- **Ta'siri:** token qo'lga tushsa, bot nomidan xabar yuborish va kelgan arizalarni (shaxsiy ma'lumotlarni) o'qish mumkin bo'ladi. Diagnostika sahifasi esa spam yuborish uchun ishlatilishi mumkin.
- **O'zgarish:**
  1. BotFather → `/mybots` → Revoke token, yangi tokenni faqat serverdagi `.env` ga yozish.
  2. `diagnostika.php` ni serverdan o'chirish.
  3. `.env` ni `public_html` dan tashqariga ko'chirish.
  4. `robots.txt` dan maxfiy yo'llarni olib tashlash. Ular `.htaccess` orqali yopiladi.
  5. Arxivlarni `.env` siz yuborish va eski nusxalarni o'chirish.
- **Saqlanadigan xulq:** forma Telegramga ariza yuborishda davom etadi.
- **Mas'ul:** VeroLex (token); Dasturchi.
- **Qabul mezoni:** eski token ishlamaydi; `https://verolex.uz/.env` 403/404 qaytaradi; `https://verolex.uz/diagnostika.php?run=1` 404 qaytaradi; test ariza staging yoki test kanalga keladi.
- **Qayta test:** L-27 va jonli HTTP tekshiruvi (tarmoq ruxsati kerak).

---

## P2

| ID | Talablar | Muammo va dalil | O'zgarish | Saqlanadi | Bog'liqlik | Mas'ul | Qabul mezoni / qayta test |
|---|---|---|---|---|---|---|---|
| B-13 | TZ-002 | D2: RU/EN'da o'zbekcha aria/alt (“Til tanlash”, “Adolat tarozisi”) | Barcha yordamchi matnlarni 3 tilli lug'atga chiqarish; dekorativ rasmga `alt=""` | Mavjud tarjimalar | — | Dasturchi; VeroLex | L-18: RU/EN'da o'zbekcha marker 0 |
| B-14 | REC-004 | D2: FAQ'da `aria-expanded` yo'q; D1L: mobil `#burger` tugmasida ham yo'q | `<button aria-expanded aria-controls>` yoki `<details>`; Enter va Space | FAQPage schema, savol matnlari, URL | — | Dasturchi | L-14 PASS |
| B-15 | REC-007, REC-008, NEW-016 | D2, D3: “2020-yildan”, “10+ yil”, “24/7”, “100% onlayn”, “bepul”, “yetakchi” | Har da'voni tasdiqlash yoki o'zgartirish; FAQ'ga muallif yurist, sana va lex.uz havolasi | Tasdiqlangan da'volar | Yurist | VeroLex; Yurist | Da'volar ro'yxati imzolangan; har FAQ'da sana |
| B-16 | REC-009, SEO-017 | D3: Yandex Xaritalarda “Веро Лекс — больше не работает” | Kartochka egasini aniqlash; o'z kartochkalarini (Yandex, Google, 2GIS) tasdiqlash; NAP sayt bilan bir xil | — | B-02 | VeroLex; SEO | Har platformada 1 ta tasdiqlangan kartochka |
| B-17 | SEO-023 | D0: OG holati noma'lum | og:title, og:description, og:image (1200×630), og:url, og:locale (uz_UZ, ru_RU, en_US) | Title va description | — | Dasturchi; SEO | L-28 PASS |
| B-18 | TZ-025, TZ-043, TZ-051, TZ-052, REC-010 | D0: mobil, cross-browser va tezlik o'lchanmagan | L-11–L-22; o'lchash sharoitini yozma kelishish; topilgan muammolar alohida bandga | — | Tarmoq, qurilmalar | QA | Har brauzer va qurilmada PASS; Lighthouse 3 marta median, versiya bilan |
| B-19 | TZ-049, TZ-050, TZ-046 | D0: kod, backup va hosting ko'rilmagan | Kodni o'qib tekshirish (parametrlashgan so'rovlar, ekranlash, CSRF, CSP, fayl yuklash); backup jadvali va tiklash testi | Production'ga hujum yo'q | B-09 | Mustaqil dasturchi; hosting admini | Kod tekshiruvi hisobotida yuqori xavfli topilma yo'q; tiklash testi dalili |
| B-20 | TZ-003, TZ-001 | D2: til almashtirish faqat bosh sahifa va blogda tekshirilgan | 13 sahifa turi × 3 til regressiyasi; mobil menyudagi til tugmasi | URL sxemasi | — | QA | L-13 barcha sahifalarda PASS |
| B-21 | TZ-011 | D2: 9 yo'nalish; DOCX misollari boshqa | Yakuniy ro'yxatni tasdiqlash | 9 sahifa va URLlari | — | VeroLex | Ro'yxat = sayt |
| B-22 | TZ-041 | D1: logo PDF'da bor, brendbuk berilmagan | Logo SVG, ranglar va mavjud brendbukni berish | Logotip | — | VeroLex | Fayllar dizaynerda |
| B-23 | TZ-061, TZ-062 | D0: tarjima va nashr mas'uli yo'q | Har til uchun mas'ul va tasdiqlovchi; 3 oylik kontent kalendari | — | — | VeroLex | Mas'ullar va kalendar yozma |
| B-24 | TZ-027, TZ-035, TZ-037–TZ-040 | D0: admin funksiyalari ko'rilmagan | Demo orqali tekshirish; yetishmagan funksiyalar M-02ga | — | B-09 | Dasturchi; VeroLex | L-24 ro'yxatining har bandi PASS yoki M-02 ga kiritilgan |
| B-25 | TZ-054, TZ-055, TZ-056, SEO-004, SEO-015 | D2: fayllar bor. D1L: sitemap, robots va JSON-LD to'g'ri; 39 sahifada `h2→h4`, aloqa sahifalarida `h1→h3` | L-01, L-02, L-06, L-09 natijalari bo'yicha tuzatish | Mavjud schema turlari | B-02, B-08 | Dasturchi; SEO | Sitemap = canonical; JSON-LD xatosiz; heading daraja tashlab ketmaydi |

| B-30 | REC-018, NEW-006 | D1L: bosh sahifalarda har tashrifda kontentni 2,9 s yopuvchi intro | Introni olib tashlash (yoki sessiyada bir marta va ≤1 s) | reduced-motion qo'llovi | — | Dasturchi | Bosh sahifa kontenti darhol ko'rinadi; LCP o'lchovi yaxshilangan |

## P3

| ID | Talablar | Ish | Mas'ul |
|---|---|---|---|
| B-26 | TZ-021, TZ-022 | Xarita iframe'iga title va lazy; matnli fallback; ijtimoiy havolalarga `rel=noopener`; LinkedIn bor-yo'qligini aniqlash | Dasturchi; VeroLex |
| B-27 | TZ-006, TZ-034, SEO-006, TZ-010, SEO-005 | Ixtiyoriy: avtomatik til taklifi, ko'rishlar statistikasi, meta keywords maydoni, reytinglar bloki (faqat tasdiqlangan bo'lsa), 400 belgili matn talabi (sifat birinchi o'rinda) | VeroLex qaroriga ko'ra |
| B-31 | REC-019 | 3 tilda alohida 404 sahifasi; `ErrorDocument` shu sahifaga | Dasturchi |
| B-28 | TZ-069, TZ-047, TZ-065, TZ-066 | Rekvizitlarni footerga chiqarish (tasdiqlansa); domen egaligi va muddati; kafolat va SLA | VeroLex |

---

## Yangi majburiy modullar (reliz tartibida)

Har modul `VEROLEX_REDESIGN_TZ.md`dagi spetsifikatsiyaga asoslanadi. Qabul testlari `VEROLEX_TEST_RESULTS.md` §4da (Q-01–Q-20, REJA).

| ID | Modul | Talablar | Bog'liqlik | Mas'ul | Qabul mezoni |
|---|---|---|---|---|---|
| M-01 | Dizayn tizimi, menyu, shablonlar (desktop va mobil) | NEW-001–NEW-008, REC-013, TZ-042, SEO-016 | B-22 (logo); M-11 (haqiqiy matnlar) | Dizayner | Tokenlar va komponentlar kutubxonasi; 13 shablonning desktop va mobil maketlari 3 tilda tasdiqlangan; kontrast AA; NEW-008 bo'yicha bazaviy inventar olingan |
| M-02 | Umumiy kontent modeli va admin kengaytmasi (xodim, hamkor, vakansiya, ariza, material; 3 til; SEO maydonlari; nashr holati; rollar, shu jumladan HR) | NEW-029, TZ-026, TZ-005, TZ-036, REC-014 | B-09 (arxitektura qarori) | Dasturchi | Bitta model va admin pattern hamma modulda; takroriy modul yo'q; stagingda demo |
| M-03 | Biz haqimizda → Kompaniya | NEW-016 (DOCX §5 “О компании”: tarix, missiya, qadriyatlar — shu bandga birlashtirilgan) | M-01, M-11 | Dasturchi; VeroLex | NEW-016 mezoni |
| M-04 | Biz haqimizda → Jamoa va individual profillar | NEW-017–NEW-021, TZ-058, NEW-005 | M-01, M-02, M-11 (foto, ma'lumot) | Dasturchi; Dizayner | Q-09–Q-14 PASS |
| M-05 | Hamkorlar: bosh sahifa bloki va to'liq sahifa | NEW-022–NEW-028 | M-01, M-02, M-11 (logo va ruxsat) | Dasturchi; Dizayner | Q-15–Q-20 PASS |
| M-06 | Vakansiyalar, ariza va CV qabul qilish | NEW-009–NEW-015, TZ-018, REC-014, REC-015, REC-016 | M-02, B-07 (siyosat), REC-011 (staging) | Dasturchi; HR; Yurist | Q-01–Q-08 PASS; CV ochiq URLda yo'q |
| M-07 | Yangiliklar, Legal Alerts va tahlil (FAQ saqlanadi) | TZ-007, TZ-015, TZ-016, TZ-017, TZ-033, TZ-057 | M-02, B-23 | Dasturchi; VeroLex | Material sahifasi, filtr va Article schema; bosh sahifa bloki |
| M-08 | Keyslar | TZ-013, TZ-014 | M-02; mijozlardan oshkor qilish ruxsati | Dasturchi; VeroLex | Faqat ruxsat berilgan keyslar; xizmatlarga bog'langan |
| M-09 | Qidiruv, filtrlar, PDF materiallar | TZ-030, TZ-031, TZ-032 | M-04, M-07 | Dasturchi | Qidiruv 3 tilda; natija sahifasi noindex |
| M-10 | Email obunasi | TZ-009 | Servis tanlovi; B-07 | Dasturchi; VeroLex | Double opt-in; obunadan chiqish |
| M-11 | Kontent yig'ish (birinchi kundan parallel) | NEW-030, TZ-061, TZ-069 | — | VeroLex; HR | `VEROLEX_CONTENT_CHECKLIST.md` majburiy maydonlari “bor” |

---

## 3. Yagona reliz rejasi

| Reliz | Mazmuni | Bandlar | Chiqish sharti |
|---|---|---|---|
| **Reliz-1** — kirishlar, qarorlar va tezkor tuzatishlar (joriy saytda) | **Birinchi navbatda B-29 (token va diagnostika)**; kirishlar va kod; email qarori; spam, cookie va SEO shartnomasi qarorlari; kontent yig'ish boshlanadi; joriy saytdagi P1 tuzatishlar | B-29, B-09, B-12, M-11 (start), B-02, B-01, B-04, B-05, B-06, B-07, B-08, B-10, B-11, B-03 (staging bo'lgach), B-13, B-14 | P1 bandlar qabul mezoni bajarilgan; L-01–L-19 qayta o'tkazilgan |
| **Reliz-2** — dizayn | Dizayn tizimi, menyu, shablonlar; arxitektura qarori; URL saqlash rejasi | M-01, M-02 (dizayn hujjati), NEW-008 | Maketlar tasdiqlangan; 301 rejasi (kerak bo'lsa) |
| **Reliz-3** — yangi bo'limlar (buyurtmachi talabi) | Kompaniya, Jamoa, Hamkorlar, Vakansiyalar; yangi dizaynni barcha mavjud sahifalarga qo'llash | M-02, M-03, M-04, M-05, M-06 | Q-01–Q-20 PASS; NEW-008 inventar farqi toza |
| **Reliz-4** | Yangiliklar va Legal Alerts, keyslar, obuna | M-07, M-08, M-10 | Tegishli testlar PASS |
| **Reliz-5** | Qidiruv, filtrlar, PDF | M-09 | Tegishli testlar PASS |
| **Doimiy** | SEO ishlari, kontent nashri, QA regressiyasi | B-15–B-25, SEO-xxx | Oylik hisobot |

Kontent kelmagan modul (masalan, tasdiqlangan logolarsiz hamkorlar) kod tomondan tayyor bo'lishi mumkin. Lekin u faqat haqiqiy ma'lumot bilan nashr qilinadi.
