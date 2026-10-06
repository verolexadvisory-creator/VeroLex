# VeroLex Advisory — veb-sayt

Toshkentdagi yuridik konsalting firmasi uchun 3 tilli (oʻzbek / rus / ingliz) sayt.
Har bir til **alohida manzilda** joylashgan — bu Google va Yandex uchun muhim.

## 00. Korporativ dizayn va yangi bo'limlar (2026-10, v10)

| # | O'zgarish |
|---|---|
| 1 | Yangi uslub qatlami `assets/css/vl-corporate.css`: vazmin to'q ko'k + iliq och fon, cheklangan oltin aksent, to'g'ri burchaklar; 9 xizmat uchun alohida ranglar o'rniga yagona aksent; harakatlanuvchi lenta va katta dekorativ belgilar olib tashlandi |
| 2 | Shriftlar: sarlavhalar uchun Source Serif 4 (vazmin, kirill bilan), matn uchun Manrope |
| 3 | Bosh sahifa: tarozi tasviri o'rniga jamoaning haqiqiy surati; SEO uchun H1 — "Toshkentda biznes uchun yuridik xizmatlar" (RU/EN mos) |
| 4 | "Biz haqimizda": **Rahbariyat va jamoa** bo'limi (rahbar uchun katta karta, xodimlar uchun lavozim va mutaxassislik alohida ko'rinadigan kartalar) va **Biz bilan ishlayotgan va ishlagan kompaniyalar** bo'limi (bizga ishonch bildirgan kompaniyalar / hamkorlar, mahalliy / xorijiy, amaldagi / avvalgi). Bosh sahifada ham qisqa bloklar |
| 5 | Email hamma joyda `info@verolex.uz`; LinkedIn — kompaniya sahifasi `https://www.linkedin.com/company/144922984/` |
| 6 | SEO: Organization JSON-LD'ga `contactPoint`, `foundingDate`, LinkedIn; jamoa a'zolari uchun `Person` (ma'lumot kiritilganda); `sitemap.xml` da `lastmod` |
| 7 | Kompyuterda faylni to'g'ridan-to'g'ri ochganda (`file://`) ham havolalar ishlaydi |

### Jamoa va hamkorlarni qo'shish

Ma'lumot repodagi `site-data/team.json` va `site-data/partners.json` fayllarida. To'ldirilgach, `python3 tools/build_site.py site` buyrug'i sahifalarni qayta yig'adi (bosh sahifa va "Biz haqimizda", 3 tilda).
- Jamoa portretlari jamoa suratidan tayyorlangan: `assets/img/team/p1.webp`–`p4.webp` (`site-data/jamoa_portretlar_1-4.png` dagi 1–4 raqamlar).
- Hamkor logolari `assets/img/partners/` papkasiga qo'yiladi; logo bo'lmasa kompaniya nomi ko'rsatiladi.
- Ma'lumot kiritilmaguncha jamoa bo'limida umumiy jamoa surati, hamkorlar bo'limi esa umuman ko'rsatilmaydi (bo'sh blok chiqmaydi).

## 0. 2026-10 takomillashtirish (audit natijalari bo'yicha)

Matnlar, dizayn va URLlar o'zgarmadi. Faqat audit (`VEROLEX_BACKLOG.md`) da topilgan nuqsonlar tuzatildi.

| # | O'zgarish | Fayllar | Audit bandi |
|---|---|---|---|
| 1 | GA4 yoqilish sharti xavfsiz qilindi va `G-N4Z7XF5GGK` kiritildi (ID production'dan olingan; GA4 hisobida tasdiqlang) | `assets/js/analytics.js` | B-01 |
| 2 | Forma: label'lar inputlarga `for`/`id` bilan bog'landi; `autocomplete` qo'shildi | 6 sahifa (bosh, aloqa × 3 til) | B-05 |
| 3 | Forma: brauzerda ism, telefon (9–15 raqam) va email tekshiruvi; maydon ostida 3 tilli xato matni; server xato kodiga mos xabar (`validation`, `rate`); takroriy yuborishdan himoya | `assets/js/main.js`, `assets/js/i18n.js`, `assets/css/vl-extra.css` | B-04 |
| 4 | `send.php`: telefon qoidasi brauzer bilan bir xil (9–15 raqam) | `send.php` | B-04 |
| 5 | Bosh sahifa havolalari `index.html` o'rniga `./` (canonical bilan bir xil); til tugmasi `/ru/`, `/en/` ga o'tadi; `.htaccess` da `index.html` → katalog 301 | 39 sahifa, `main.js`, `.htaccess` | B-08, REC-006 |
| 6 | Mobil menyu: `aria-expanded`/`aria-controls`, ochilganda fokus menyuga, yopilganda tugmaga qaytadi; "Xizmatlar" pastki menyusi ham | 39 sahifa, `main.js` | B-14 |
| 7 | FAQ: `aria-expanded`/`aria-controls` | `main.js` | B-14 |
| 8 | Desktop "Xizmatlar" menyusi klaviatura bilan ochiladi; ota-band bosh sahifadagi xizmatlar bo'limiga olib boradi (`href="#"` o'rniga) | 39 sahifa, `vl-extra.css` | LC-09 |
| 9 | Klaviatura fokusi har qanday fonda ko'rinadi (ikki qavatli halqa) | `vl-extra.css` | TZ-044 |
| 10 | RU/EN sahifalarda o'zbekcha qolgan `aria-label` lar tarjima qilindi | 26 sahifa | B-13 |
| 11 | Sarlavha ierarxiyasi: `h4` → `h3`, aloqa sahifasida `h3` → `h2`; ko'rinish CSS orqali saqlandi | 39 sahifa, CSS | B-25 |
| 12 | Bosh sahifadagi 2,9 soniyalik intro animatsiya olib tashlandi | 3 bosh sahifa | B-30 |
| 13 | Alohida 3 tilli 404 sahifasi (`noindex`) | `404.html`, `.htaccess` | B-31 |
| 14 | `diagnostika.php` olib tashlandi va `.htaccess` da yopildi; `robots.txt` maxfiy yo'llarni sanamaydi | `.htaccess`, `robots.txt` | B-29 |
| 15 | Kesh versiyasi `?v=8` → `?v=9` | 39 sahifa | — |
| 16 | **Maxfiylik siyosati** sahifasi (3 tilda): qanday ma'lumot to'planadi, maqsad, kimga uzatiladi (Telegram, Google — rozilik bilan), saqlash, huquqlar, cookie. Footerda va har forma ostida havola | `privacy.html`, `ru/`, `en/` | B-07 |
| 17 | **Cookie banneri** (Google Consent Mode v2): rozilik berilmaguncha analitika va reklama cookie'lari yozilmaydi; tanlov maxfiylik sahifasidan o'zgartiriladi | `assets/js/analytics.js`, CSS | B-07 |
| 18 | **"Vakansiyalar"** menyuda (barcha sahifalarda) va alohida sahifa (3 tilda): ochiq vakansiya yo'q holati, rezyume email orqali | `careers.html`, `ru/`, `en/`, 45 sahifa | NEW-009 |
| 19 | Header o'rta kengliklarda (1081–1340 px) bir qatorda qoladi; menyu yozuvlari bo'linmaydi | `vl-extra.css` | NEW-007 |
| 20 | `sitemap.xml` — 45 URL (yangi 6 sahifa hreflang bilan) | `sitemap.xml` | — |

**Joylashdan oldin (majburiy):**
1. BotFather'da Telegram bot tokenini almashtiring (Revoke) va yangisini faqat serverdagi `.env` ga yozing. `.env` ni hech kimga yubormang.
2. Serverdagi eski `diagnostika.php` ni o'chiring.
3. Barcha fayllarni `public_html` ga yuklang (`.htaccess` va `404.html` ham).
4. GA4 DebugView'da `page_view` kelayotganini va forma yuborilganda `generate_lead` hodisasi kelishini tekshiring.

**Hali qilinmagan — sizdan ma'lumot kerak:**
- *Jamoa sahifasi:* har xodimning to'liq ismi, lavozimi, mutaxassisligi, portreti va nashrga roziligi (`VEROLEX_CONTENT_CHECKLIST.md` §2).
- *Hamkorlar sahifasi:* kompaniya nomlari, mamlakati, mijoz/hamkor turi, holati va logoni ko'rsatishga ruxsat (§4).
- *Vakansiyalar:* ochiq vakansiya paydo bo'lsa — matni (§3). Sahifa tayyor, faqat e'lon qo'shiladi.
- *Yandex Metrika:* hisoblagich raqami (Yandex Metrika kabinetida yaratiladi).
- *Maxfiylik siyosati:* matn saytning haqiqiy ishlashi asosida yozildi. Yuristingiz bir marta o'qib tasdiqlashi tavsiya etiladi.
- *Admin panel va yangi dizayn:* `VEROLEX_REDESIGN_TZ.md` bo'yicha alohida bosqich.

---

## Tarkibi

```
index.html … it-park.html        13 ta oʻzbekcha sahifa (asosiy)
ru/                              13 ta ruscha sahifa
en/                              13 ta inglizcha sahifa
send.php                         Forma backendi (Telegram + ixtiyoriy Google Sheets)
404.html                         3 tilli "sahifa topilmadi" sahifasi
.htaccess                        HTTPS, xavfsizlik, siqish, kesh
.env.example                     Maxfiy sozlamalar namunasi
robots.txt, sitemap.xml          SEO
yandex_4fa26d….html              Yandex Webmaster tasdiqlash fayli (oʻchirmang)
assets/css/style.css             Dizayn tizimi
assets/css/vl-extra.css          Ranglar, animatsiyalar, komponentlar
assets/js/main.js                Til, forma, animatsiyalar
assets/js/vl-extra.js            Skroll indikatori, "yuqoriga" tugmasi, kirish animatsiyasi
assets/js/i18n.js                Barcha 3 til matnlari
assets/img/                      Logo, favicon, jamoa surati, og-cover
```

---

## 1. Telegram botni ulash (majburiy)

Forma toʻldirilganda xabar Telegram botga keladi. Buning uchun **token** va **chat ID** kerak.

### Bot token olish
1. Telegramda **@BotFather** ni oching.
2. `/newbot` buyrugʻini yuboring, bot nomi va useridni kiriting.
3. BotFather token beradi, masalan `8123456789:AAH...xyz`.

### Chat ID olish
1. Yangi botingizga Telegramda **`/start`** bosing va istalgan xabar yozing.
   *(Bu qadam majburiy — bot faqat oʻziga avval yozgan akkauntga xabar yubora oladi.)*
2. Brauzerda oching: `https://api.telegram.org/botTOKEN/getUpdates`
3. `"chat":{"id":123456789` qismidagi raqamni oling.
   - Guruhga yuborish uchun botni guruhga qoʻshing; ID manfiy boʻladi (`-1001234567890`).

### Qiymatlarni joylash
`.env.example` faylini `.env` deb nusxalang va toʻldiring:

```
TELEGRAM_BOT_TOKEN=8123456789:AAH...xyz
TELEGRAM_CHAT_ID=123456789
```

`.env` ni **sayt ildizidan bitta yuqoridagi** papkaga qoʻying (`public_html` yonida) —
shunda u brauzerdan umuman koʻrinmaydi. Iloji boʻlmasa sayt ildizining oʻziga qoʻying,
`.htaccess` uni yopadi. `send.php` ikkala joyni ham, server muhit oʻzgaruvchilarini ham
avtomatik tekshiradi.

> **Diqqat:** tokenni hech kimga yubormang va git repozitoriyga qoʻshmang.

### Tekshirish
`diagnostika.php` xavfsizlik sababli paketdan olib tashlandi: u parolsiz ishlardi va sinov xabarini istalgan kishi yubora olardi. `.htaccess` bu faylni serverda qolib ketgan bo'lsa ham yopadi. Forma ishlashini tekshirish uchun saytdagi formani bir marta to'ldiring va xabar Telegramga kelganini ko'ring.

### Xatolik kodlari

| Javob | Maʼnosi | Yechim |
|-------|---------|--------|
| `config` | token yoki chat ID yoʻq | `.env` ni toʻldiring |
| `validation` | ism qisqa yoki telefon toʻliq emas | maydonlarni toʻldiring |
| `telegram` | Telegram qabul qilmadi | chat ID notoʻgʻri yoki botga `/start` bosilmagan |
| `rate` | daqiqasiga 5 tadan koʻp murojaat | bir daqiqa kuting |
| `method` | soʻrov POST emas | faylni toʻgʻridan-toʻgʻri ochganda chiqadi |

Xabarga ism, telefon, email, matn bilan birga **qaysi sahifadan** va **qaysi tilda**
murojaat kelgani ham qoʻshiladi.

---

## 2. Hostingga joylash

- Hosting **PHP** ni qoʻllab-quvvatlashi kerak (forma uchun). cPanel, Beget, Ahost va h.k. mos.
- Barcha fayllarni `public_html` (yoki `www`) papkasiga **papka tuzilmasini saqlagan holda** yuklang —
  `ru/` va `en/` papkalari ham koʻchirilishi shart.
- `.htaccess` Apache uchun. Nginx boʻlsa, HTTPS/www yoʻnaltirish va `.env` ni yopishni
  hosting panelidan sozlang.
- Domen boshqa boʻlsa, `sitemap.xml`, `robots.txt` va sahifalardagi `verolex.uz` ni almashtiring.

Lokal koʻrish (forma faqat PHP serverda ishlaydi):
```
php -S localhost:8000
```

---

## 3. SEO — nima qilingan va keyin nima qilish kerak

### Tayyor holatda

- **Har til alohida manzilda:** `/`, `/ru/`, `/en/`. Ilgari matn JavaScript bilan almashardi
  va qidiruv tizimlari faqat oʻzbekchani koʻrardi. Endi 39 ta sahifa indeksga tushadi.
- **hreflang** — har sahifada uz/ru/en va `x-default` bogʻlanishlari.
- **canonical** — har sahifada oʻzining yagona manzili.
- **Sarlavha va tavsif** — 39 ta noyob, kalit soʻzlar va "Toshkent" bilan.
- **Structured data (JSON-LD):** `LegalService`, `WebSite`, `WebPage`, `BreadcrumbList`,
  yoʻnalish sahifalarida `Service`, savol-javobli sahifalarda `FAQPage`.
  Tashkilot maʼlumotlariga aniq geolokatsiya (41.3213243, 69.2777646) va 5 ta
  ijtimoiy tarmoq sahifasi kiritilgan.
- **Open Graph va Twitter Card** — havola ulashilganda `assets/img/og-cover.jpg` koʻrinadi.
- **sitemap.xml** — 39 ta manzil, har birida hreflang bogʻlanishlari.
- **robots.txt** — Yandex uchun alohida blok, tizim fayllari yopilgan.
- **Tezlik:** logotip `fetchpriority="high"`, qolgan rasmlar `loading="lazy"`,
  rasmlarga `width`/`height` (sahifa sakramasligi uchun), `.htaccess` da siqish va kesh.

### Eski saytdan meros qilib olingan sozlamalar

Joriy `verolex.uz` tekshirilib, quyidagilar yangi saytga koʻchirildi — bularsiz
reyting nolga tushardi:

- **Google Search Console** tasdiqlash kodi (`QIF9knV5…`) — 39 ta sahifaga qoʻyildi.
- **Yandex Webmaster** tasdiqlash kodi — yangi kod (`4fa26d3ed99a23ba`) 39 ta sahifaga
  meta teg sifatida qoʻyildi va qoʻshimcha ravishda `yandex_4fa26d3ed99a23ba.html`
  tasdiqlash fayli yaratildi (Yandex ikkala usulni ham qabul qiladi).
  Eski kod (`537d913e…`) almashtirildi — agar u hali ham kerak boʻlsa, ayting.
- **Manzil tuzilmasi** eski sayt bilan bir xil qilindi: `mehnat-huquqi.html` va
  `litsenziya-va-ruxsatnomalar.html` (defis bilan, pastki chiziq emas).
- **301 yoʻnaltirishlar** (`.htaccess`): olib tashlangan `ekologiya-huquqi.html`,
  pastki chiziqli eski nomlar va `contact-handler.php` yangi manzillarga yoʻnaltiriladi.

### Siz qilishingiz kerak

1. **Google Search Console** va **Yandex Webmaster** ga kirib, yangi
   `https://verolex.uz/sitemap.xml` ni qayta yuboring (39 ta manzil, ilgari 22 ta edi).
2. **Yandex Webmaster** da mintaqa sifatida **Toshkent** ni belgilang — Yandex uchun
   bu mahalliy reytingga sezilarli taʼsir qiladi.
3. **Google Business Profile** va **Yandex Biznes** — ofis kartochkasini yarating va
   toʻldiring. "Yurist Toshkent" kabi soʻrovlarda chiqish uchun eng kuchli omil shu.
4. Search Console da `ekologiya-huquqi.html` boʻyicha 301 yoʻnaltirish ishlayotganini
   bir hafta ichida tekshiring.
5. **Kontent** — blogga muntazam yangi maqolalar qoʻshish reytingni oʻstiradi.
6. **Havolalar** — huquqiy kataloglar va hamkor saytlardan havolalar oling.

> Texnik SEO toʻliq bajarildi, lekin hech kim "topda turish"ni kafolatlay olmaydi —
> u kontent, havolalar va raqobatga bogʻliq. Yuqoridagi 6 qadam eng katta taʼsir beradi.

---

## 4. Yoʻnalish ranglari

Har bir amaliyot yoʻnalishi oʻz urgʻu rangiga ega (`data-acc` atributi,
`assets/css/vl-extra.css`, 1-boʻlim):

| # | Yoʻnalish | Rang |
|---|-----------|------|
| 1 | Korporativ huquq | `#C5A15C` oltin |
| 2 | Mehnat huquqi | `#2F7D6B` zumrad |
| 3 | Soliq huquqi | `#B5763A` mis |
| 4 | Intellektual mulk | `#6C5CA8` binafsha |
| 5 | Yuridik hamrohlik | `#2E6C9E` koʻk |
| 6 | Litsenziya va ruxsatnomalar | `#4E8A3C` yashil |
| 7 | Toʻlovga qobiliyatsizlik | `#A8452F` gʻisht |
| 8 | Oila huquqi | `#B4507A` pushti |
| 9 | IT Park rezidentligi | `#1E8A9E` firuza |

---

## 5. Kesh va yangilanishlar (MUHIM)

`.htaccess` CSS va JS fayllarini bir yilga keshlashga buyuradi — bu tezlik uchun yaxshi,
lekin fayl yangilanganda brauzer eskisini koʻrsatishda davom etadi. Shu sababli barcha
havolalarda **versiya belgisi** bor:

```html
<link rel="stylesheet" href="assets/css/vl-extra.css?v=7">
<script src="assets/js/main.js?v=7"></script>
```

**Qoida:** `assets/` ichidagi biror faylni oʻzgartirsangiz, barcha 39 ta sahifada
`?v=7` ni `?v=8` ga almashtiring. Aks holda tashrifchilar eski nusxani koʻradi.

Terminal orqali bir buyruq bilan:
```
grep -rl '?v=7' *.html ru/*.html en/*.html | xargs sed -i 's/?v=7/?v=8/g'
```

Qoʻshimcha himoya sifatida eng muhim uslublar har sahifaning `<head>` qismiga
kichik `<style>` blok koʻrinishida ham singdirilgan — kesh eskirgan boʻlsa ham
rasm nisbatlari toʻgʻri koʻrinadi.

### Oʻzgarish koʻrinmayotgan boʻlsa
1. Brauzerda **Ctrl + F5** (Mac: **Cmd + Shift + R**) bosing.
2. Hosting panelida kesh boʻlsa (LiteSpeed, Cloudflare) uni tozalang.
3. `?v=` raqami oshirilganini tekshiring.

## 6. Matnlarni tahrirlash

Barcha 3 tildagi matnlar `assets/js/i18n.js` da. **Muhim:** matnlar endi HTML fayllarga
ham singdirilgan (SEO uchun). Shuning uchun matnni oʻzgartirganda `i18n.js` bilan birga
tegishli sahifadagi matnni ham yangilang — yoki oʻzgartirishni menga ayting,
uchala tilni birdan qayta chiqarib beraman.

---

## 7. Aloqa maʼlumotlari

- Telefon: +998 77 143 68 88
- Email: info@verolex.uz
- Manzil: Toshkent, Yunusobod tumani, Markaz 4, Abdulla Qodiriy koʻchasi 28A
- Geolokatsiya: 41.3213243, 69.2777646
- Telegram kanali: https://t.me/verolex_advisory
- Telegram (murojaat): https://t.me/VeroLex_admin
- Instagram: https://www.instagram.com/verolex_advisory
- Facebook: https://www.facebook.com/people/Vero-Lex/
- YouTube: https://www.youtube.com/@VeroLexAdvisory
- LinkedIn: https://www.linkedin.com/company/144922984/
