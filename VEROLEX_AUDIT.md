# VeroLex sayti: audit va keyingi ishlar

| | |
|---|---|
| Sana | 2026-yil 1-oktabr, 13:45–14:45 Asia/Tashkent; sayt arxivi tekshiruvi 17:55–18:40 |
| Obyekt | https://verolex.uz (UZ / RU / EN) |
| Manbalar | `Vero Lex(Draft)_website.docx` (TZ qoralamasi), `Кп-seo-verolex-uz.pdf` (SEO taklifi, 5 bet), buyurtmachining 2026-10-01 13:12 dagi qo'shimcha talablari, dastlabki audit (2026-10-01), sayt arxivi `verolex-sayt_8_1.zip` (fayllar sanasi 2026-08-10) |
| Hujjatlar to'plami | Ushbu fayl; `VEROLEX_REQUIREMENTS_MATRIX.csv`; `VEROLEX_BACKLOG.md`; `VEROLEX_TEST_RESULTS.md`; `VEROLEX_REDESIGN_TZ.md`; `VEROLEX_CONTENT_CHECKLIST.md`; dalillar `audit/evidence/` papkasida |

---

## 1. Rahbar uchun qisqa xulosa

1. **Saytning asosiy qismi bor va uni saqlab qolish mumkin.**
   - 3 tilda 39 URL (13 sahifa turi), 9 ta xizmat sahifasi.
   - Noyob title va description, canonical, hreflang, strukturali ma'lumotlar.
   - FAQ va aloqa kanallari.

   Butun saytni qaytadan yozish kerakligi haqida dalil yo'q. Bu dastlabki audit kuzatuvlariga (D2) tayanadi.
2. **Analitikada aniq kod xatosi bor (P1).** GA4 identifikatori sozlangan, lekin uni yoqadigan shart shu identifikatorning o'zini rad etadi. Shart mantiqini qayta yaratib sinadim: u har doim `false` beradi (T-08). Natijada shu kod yo'li orqali GA4 ma'lumot yig'maydi va SEO hamda reklama natijasini o'lchab bo'lmaydi.
3. **Murojaat yo'lida xavflar bor (P1):**
   - sahifalarda ikki xil email ishlatilgan;
   - forma telefon va email formatini tekshirmaydi;
   - maydonlarda label yo'q;
   - maxfiylik siyosati va cookie xabarnomasi yo'q;
   - arizalar haqiqatan yetib borishi tasdiqlanmagan (test kanalisiz tekshirib bo'lmaydi).
4. **Indeksda bir xost ishlatilmagan (P1, tekshiruv kerak).** Qidiruv indeksida UZ sahifalar `www.verolex.uz`, RU sahifalar `verolex.uz` xostida; `/ru/` va `/ru/index.html` ikkalasi ham indeksda (D3). Bitta kanonik xost va 301 redirect kerak.
5. **TZ qoralamasidagi ko'p modullar ommaviy saytda yo'q:**
   - jamoa profillari;
   - keyslar;
   - yangiliklar va Legal Alerts;
   - karyera;
   - qidiruv, obuna, PDF materiallar.

   DOCX hali “kelishish uchun qoralama”. Shuning uchun bu shartnoma buzilganining isboti emas.
6. **Buyurtmachining yangi talablari majburiy scope sifatida rejalashtirildi:** jiddiy dizayn, Vakansiyalar, “Biz haqimizda” bo'limida Jamoa (lavozim va mutaxassislik alohida), mahalliy va xorijiy Hamkorlar. Ularning to'liq spetsifikatsiyasi `VEROLEX_REDESIGN_TZ.md`da. Haqiqiy kontent (xodimlar, logolar, vakansiyalar) VeroLex'dan kutilmoqda.
7. **Taklif etilgan oltin rang (#AD8A4F) och fonda matn uchun yaramaydi.** Kontrast 2.98:1 — WCAG AA'ning katta matn uchun minimumi 3:1 dan ham past (T-07). Oltin faqat aksent bo'ladi; matn uchun to'q oltin #7A5E2E (5.60:1).
8. **SEO taklifi o'lchanadigan natijani belgilamaydi.**
   - KPI, kalit so'zlar ro'yxati va “kafolatlangan o'tishlar” soni yo'q.
   - Qamrov faqat RU tili va O'zbekiston.
   - 24 mln so'm faqat SEO xizmati uchun. Sayt va texnik tuzatishlar bu summaga kirmaydi; texnik tuzatishlarni buyurtmachi bajaradi.
9. **Muhim cheklov.** Bu muhitning tarmoq siyosati `verolex.uz` ga ulanishni blokladi (T-04, T-05). Shuning uchun dastlabki audit kuzatuvlarini jonli saytda qayta tekshira olmadim. Ular matritsada “D2” deb belgilangan. Jonli tekshiruv uchun skriptlar tayyor va lokal fixture'da sinovdan o'tgan (17/17, T-09). Domenga ruxsat berilgach, ularni bir buyruq bilan ishga tushirish mumkin.
10. **Sayt arxivi tekshiruvi (D1L).** Yuborilgan arxiv lokal serverda to'liq tekshirildi (`audit/evidence/08_local_copy/`):
    - **Arxivda admin panel yoki CMS yo'q.** Sayt statik HTML va `i18n.js` dan iborat, forma uchun PHP ishlatiladi. Matnlar kodni qo'lda tahrirlash orqali o'zgartiriladi. Demak, DOCX'dagi admin talablari bajarilmagan va “mavjud panelni kengaytirish” varianti qo'llanmaydi.
    - **Texnik SEO asosi yaxshi.** 39 URL; noyob metadata; canonical, hreflang, JSON-LD va Open Graph to'g'ri.
    - **Indeksdagi `/ru/` va `/ru/index.html` dublikatining sababi topildi.** Menyu `index.html` ga olib boradi, uni asosiy manzilga yo'naltiruvchi 301 esa yo'q.
    - **Server forma ma'lumotlarini tekshiradi.** `send.php` da validatsiya, honeypot va daqiqasiga 5 ta so'rov chegarasi bor.
    - **Arxiv production'dan farq qiladi.** Arxivdagi GA4 sharti to'g'ri, email esa hamma joyda bitta. Demak, production'dagi GA4 xatosi va ikki xil email keyingi qo'lda kiritilgan o'zgarishlardan kelib chiqqan.
    - **Xavfsizlik bo'yicha shoshilinch ish (P1, B-29):** arxivda haqiqiy Telegram tokeni bor `.env` fayli bor. Fayl izohiga ko'ra token avval skrinshotda ochiq ko'ringan. Tokenni almashtirish kerak. `diagnostika.php` parolsiz turibdi, uni serverdan o'chirish kerak.

## 2. Qamrov, usul va cheklovlar

**Nima tekshirildi:**
- DOCX — barcha 13 bo'lim, ilova va 4 jadval (T-01);
- PDF — 5 sahifa (T-02);
- ushbu GitHub repository (T-03);
- qidiruv indeksidagi signallar (T-06);
- taklif etilgan palitra kontrasti (T-07);
- GA4 sharti mantiqi (T-08);
- audit skriptlarining o'z testi (T-09).

**Dalil darajalari** (`VEROLEX_TEST_RESULTS.md`):
- **D1** — shu sessiyada bevosita bajarilgan;
- **D2** — dastlabki audit kuzatuvi, qayta tekshirilmagan;
- **D3** — qidiruv indeksi (bilvosita);
- **D0** — dalil yo'q.

Matritsadagi har qatorda dalil darajasi ko'rsatilgan.

**Manba turlari ajratilgan:**
- HUJJAT TALABI — `TZ-xxx`, `SEO-xxx`;
- BUYURTMACHINING YANGI TALABI — `NEW-xxx`;
- JONLI SAYTDAGI DALIL — D2 va D3;
- MENING QO'SHIMCHA TAVSIYAM — `REC-xxx`.

**Cheklovlar:**
- **Jonli sayt.** Tarmoq siyosati ulanishni bloklagan (HTTP 403, `EGRESS_BLOCKED`). Bu sayt nosozligi emas. L-01–L-28 testlari BLOCKED.
- **Repository.** Unda sayt kodi yo'q, faqat tijorat taklifi bo'yicha README. `.html` URLlardan backend yoki CMS yo'q degan xulosa chiqarilmadi.
- **Admin, server va hisoblar.** Admin panel, hosting, backup, GA4/GSC/Ads hisoblari va forma yetkazilishi tekshirilmadi, chunki kirish yo'q.
- **Brauzerlar.** Firefox va WebKit bu muhitda o'rnatilmagan. Haqiqiy iPhone va Android qurilmalari tekshirilmagan.
- **Taqiqlangan amallar.** Productionga ariza, xabar yoki qo'ng'iroq yuborilmadi. Exploit, brute-force va yuklama testi o'tkazilmadi.
- **Yuridik matnlar.** FAQ va xizmat sahifalaridagi muddat, soliq va imtiyozlar tekshirilmadi va tasdiqlanmadi (REC-008).
- **Rasmiy texnik manbalar.** Google va web.dev sahifalari tarmoq cheklovi tufayli audit vaqtida qayta ochilmadi. Ularga havolalar §11da.
- **Repository ochiq.** Bu repository public. Audit fayllarida ichki ma'lumot bor (masalan, SEO taklifi narxi). Repositoryni private qilish yoki audit fayllarini yopiq joyda saqlash tavsiya etiladi (REC-012).

## 3. Natijalar statistikasi

Talablar reyestri: **144 qator** (arxiv tekshiruvidan keyin REC-017–REC-019 qo'shildi) (`VEROLEX_REQUIREMENTS_MATRIX.csv`).

| Guruh | Jami | BAJARILGAN | QISMAN | BAJARILMAGAN | TEKSHIRILMADI |
|---|---|---|---|---|---|
| TZ (DOCX) | 69 | 8 | 19 | 24 | 18 |
| SEO (PDF) | 26 | 4 | 3 | 3 | 16 |
| NEW (buyurtmachi, 2026-10-01) | 30 | 0 | 4 | 25 | 1 |
| REC (qo'shimcha tavsiyalar) | 19 | 0 | 0 | 6 | 13 |
| **Jami** | **144** | **12** | **26** | **58** | **48** |

Arxiv tekshiruvidan oldin statistika bunday edi: 141 qator; 6 bajarilgan, 24 qisman, 44 bajarilmagan, 67 tekshirilmagan. Tekshirilmaganlar soni asosan admin panel bandlari hisobiga kamaydi: ular endi “BAJARILMAGAN” (arxivda admin yo'q). D1L dalili arxivga tegishli. Production bilan farqi bo'lgan joylarda (GA4, email) D2 kuzatuvi ustun turadi.

**Statistikani o'qish:**
- “TEKSHIRILMADI” muvaffaqiyatsiz degani emas. Ularning asosiy qismi admin panel, server, hisoblar va jonli sayt kirishiga bog'liq.
- NEW guruhidagi “BAJARILMAGAN” — yangi scope, ya'ni hali qilinmagan ish. Bu nuqson ham, avvalgi pudratchining majburiyati ham emas.
- “Sayt X % tayyor” degan ko'rsatkich hisoblanmadi.

**Test qamrovi** (`VEROLEX_TEST_RESULTS.md`):
- shu sessiyada 10 test: 7 PASS, 3 BLOCKED;
- dastlabki auditdan 17 kuzatuv (D2);
- 28 jonli test BLOCKED, ularning skripti tayyor;
- 20 qabul testi (REJA) yangi modullar uchun.

### DOCX bo'limlarining qamrovi

| DOCX bo'limi | Reyestrdagi ID'lar |
|---|---|
| §1 Umumiy ma'lumot | TZ-001, TZ-045 |
| §2 Maqsad va vazifalar | TZ-001, TZ-015, TZ-026 |
| §3 Auditoriya | NEW-002 (biznes va jismoniy shaxslar uchun xizmatlar), NEW-009 (nomzodlar) |
| §4 Til versiyalari | TZ-001–TZ-006 |
| §5 Sayt tuzilmasi | TZ-007–TZ-024; NEW-003, NEW-004 (bosh sahifa), NEW-016 (kompaniya), NEW-017, NEW-018 (jamoa), NEW-009–NEW-015 (karyera) |
| §6.1 Umumiy funksiyalar | TZ-008, TZ-009, TZ-025–TZ-034 |
| §6.2 Admin panel | TZ-035–TZ-040 |
| §7 Dizayn va UX | NEW-001, NEW-002, NEW-006; TZ-041–TZ-044 |
| §8 Texnik talablar | TZ-045–TZ-060, SEO-021 |
| §9 Kontent | TZ-061, TZ-062, TZ-041, NEW-005 |
| §10 Hosting va qo'llab-quvvatlash | TZ-063–TZ-066 |
| §11 Bosqichlar | TZ-067 |
| §12 Qabul mezonlari | TZ-068, TZ-026, TZ-063 |
| §13 Ochiq savollar | TZ-069, TZ-011, TZ-041, TZ-061, TZ-045, TZ-046 |
| Ilova: analog saytlar | §6 (izoh) |

**Scope'dan tashqari:** mijoz uchun shaxsiy kabinet. DOCX §13ga ko'ra joriy versiyada nazarda tutilmagan, shuning uchun uning yo'qligi nuqson emas.

## 4. Asosiy topilmalar va biznesga ta'siri

| # | Topilma | Dalil | Biznesga ta'siri | Backlog |
|---|---|---|---|---|
| 1 | GA4 yoqilish sharti identifikatorning o'zini rad etadi | D2 kod; D1 reproduksiya | Trafik va arizalar manbasi o'lchanmaydi; SEO uchun 24 mln so'm sarflansa ham natijasini ko'rib bo'lmaydi | B-01 |
| 2 | Ikki xil email (info@verolex.uz va gmail) | D2, D3, README | Mijoz qaysi manzilga yozishini bilmaydi; agar qutilardan biri o'qilmasa, murojaat yo'qoladi; NAP izchilligi buziladi | B-02 |
| 3 | Arizalarning yetib borishi tasdiqlanmagan | D0 | Ishlamasa — asosiy funksiya ishlamaydi (P0 ga ko'tariladi) | B-03 |
| 4 | Forma telefon va emailni tekshirmaydi, labelsiz | D2 | Noto'g'ri raqamli ariza bo'yicha mijozga qayta bog'lanib bo'lmaydi; ekran o'quvchisi foydalanuvchilari uchun to'siq | B-04, B-05 |
| 5 | Maxfiylik siyosati va cookie xabarnomasi yo'q | D2 | Shaxsiy ma'lumot va reklama teglari bor; huquqiy talablarga moslikni yurist baholashi kerak; korporativ mijoz ishonchiga ta'sir qiladi | B-07 |
| 6 | www va wwwsiz xostlar, `/index.html` aliaslari indeksda | D3 | Indeks signallari bo'linadi; dublikatlar paydo bo'ladi | B-08 |
| 7 | Tasdiqlanmagan da'volar: “2020-yildan” va “10+ yil” birga, “24/7”, “bepul” | D2, D3 | Yuridik firma uchun ishonch va reklama aniqligi muhim | B-15 |
| 8 | Jamoa, hamkorlar va vakansiyalar bo'limlari yo'q | D2 | Korporativ va xorijiy mijoz uchun asosiy ishonch omillari ko'rinmaydi; nomzodlar jalb qilinmaydi | M-03–M-06 |
| 9 | Yandex Xaritalarda “Веро Лекс — больше не работает” kartochkasi bor | D3 | Brend bo'yicha qidiruvda chalkashlik bo'lishi mumkin; kartochka kimga tegishli ekani tasdiqlanmagan | B-16 |
| 10 | Kod VeroLex repositoryida emas; admin panel noma'lum | D1, D0 | Pudratchiga bog'liqlik; yangi modullar uchun arxitektura qarorini qabul qilib bo'lmaydi | B-09 |

## 5. Hujjatlar orasidagi farqlar va ularning talqini

1. **CMS.**
   - DOCX tayyor CMS platformasini emas, individual frontend, backend va o'z admin panelini talab qiladi (§1, §8).
   - PDF SEO mutaxassisi kontent va metama'lumotlarni boshqara oladigan “zamonaviy CMS”ni talab qiladi (2-bet, 2.1-band). 5-betdagi izohda ijrochi sayt bu talabga mos emas deb yozgan va texnik tuzatishlarni buyurtmachi zimmasiga qo'ygan.
   - Bu ikki talab funksional jihatdan mos kelishi mumkin. O'z admin paneli PDF ehtiyojini qondirishi uchun title, description, H1, ALT va matnni dasturchisiz tahrirlash imkoniyati yetarli. **WordPress yoki boshqa CMSga ko'chish avtomatik majburiyat emas.** Qaror admin panel va kod ko'rilgandan keyin qabul qilinadi (§10, 5-savol).
2. **Tillar.** DOCX RU, UZ va EN versiyalarini talab qiladi (§4). PDF'dagi SEO targ'iboti esa faqat **rus tilida va O'zbekiston hududida** (4-bet, §9, 8-band). Uch tilli sayt uch tilli SEO xizmati degani emas. UZ va EN uchun SEO kerak bo'lsa, u alohida kelishiladi (SEO-019).
3. **Narx va rollar.** PDF 5-betda: 8 000 000 so'm/oy × 3 oy = 24 000 000 so'm. Izohga ko'ra texnik tuzatishlarni buyurtmachi kiritadi. Bu summaga yangi sayt, admin panel, redizayn va texnik tuzatishlar **kirmaydi**. Vazifalar uchga bo'linadi:
   - **Dasturchi** — kod va admin panel;
   - **SEO ijrochisi** — tahlil, matn, meta, hisobot va texnik topshiriq yozish;
   - **VeroLex** — qarorlar, kontent va kirishlar.
4. **meta keywords** (PDF 2-bet, 2.6-band). Bu hujjat talabi sifatida bajarilishi mumkin. Lekin Google meta keywords'ni reytingda ishlatmaydi. Yandex bo'yicha rasmiy manba bu auditda qayta tekshirilmadi. Shuning uchun ustuvorligi past (SEO-006, P3).
5. **400 belgi va kalit so'zlar nisbati** (PDF 2-bet, 2.5-band; 3-bet, §5). Bu talab qayd etildi, lekin u universal muvaffaqiyat formulasi emas. Matnning foydaliligi, aniqligi va qidiruv niyatiga mosligi muhimroq. Kalit so'zlarni sun'iy ko'paytirish tavsiya etilmaydi (SEO-005).
6. **JavaScript.** JavaScript'ning o'zi SEO nuqsoni emas. Muhim navigatsiya haqiqiy `<a href>` bo'lishi, kontent indekslanishi va har til alohida URLga ega bo'lishi kerak. Bu tekshiruv tarmoq ochilgach bajariladi (SEO-004, L-09).
7. **URL.** `/`, `/ru/`, `/en/` sxemasi ishlayapti. DOCX'dagi `/uz/` faqat misol (“например”), shuning uchun UZ sahifalarini ko'chirish talab qilinmaydi. `.html` qo'shimchasi SEO nuqsoni emas (TZ-004, TZ-053).
8. **AI optimizatsiyasi va linkbuilding** (PDF 5-bet, 7- va 12-ishlar). Ular uchun o'lchanadigan natija yozilishi kerak. Qidiruvdagi o'rin, trafik yoki AI javoblarida chiqish kafolatlanmaydi. Google AI funksiyalari uchun maxsus majburiy schema yoki `llms.txt` talab qilinmaydi; oddiy SEO amaliyotlari amal qiladi (SEO-022, SEO-025).
9. **SEO taklifida aniqlanmagan bandlar:**
   - kalit so'zlar ro'yxati (PDF'da “tuzdik” deyilgan, lekin ilova qilinmagan);
   - semantik yadro hajmi va uni URLlarga taqsimlash;
   - maqolalar soni va hajmi;
   - linkbuilding sifati;
   - AI optimizatsiyasi natijalari;
   - boshlang'ich KPI;
   - “kafolatlangan o'tishlar” soni (2-bet);
   - kim tuzatadi va kim qayta tekshiradi.

   Hammasi B-12 bandida shartnomaga kiritiladi.
10. **DOCX hali qoralama.** Sarlavhada “черновик для согласования” yozilgan. Tasdiqlangan yakuniy TZ yoki shartnoma berilmadi. Shuning uchun bajarilmagan band pudratchining shartnomani buzganini isbotlamaydi. Buyurtmachining yangi talablari ham avvalgi pudratchining majburiyati sifatida baholanmadi.

## 6. Analog saytlar haqida

DOCX ilovasida `kostalegal.com` va `lexcell.uz` saytlari strukturaviy analog sifatida keltirilgan. Bu auditda ularning faqat tuzilmasi hisobga olindi:
- amaliyotlar bo'yicha bo'limlar;
- jamoa profillari;
- insights va alerts;
- keyslar.

Ularning matni, dizayni, jamoasi va reytinglari VeroLex'ga ko'chirilmaydi. Saytlarning o'zi tarmoq cheklovi tufayli ochilmadi.

## 7. Semantik klasterlar (taklif, hajm ma'lumotisiz)

Real qidiruv hajmi, trafik va o'rin ma'lumoti yo'q, shuning uchun raqam keltirilmadi. Quyidagi klasterlar gipoteza. SEO ijrochisi ularni Yandex Wordstat, Google Keyword Planner va GSC ma'lumotlari bilan tekshirib, har klasterga **bitta** asosiy URL biriktiradi (SEO-014).

**PDF qamrovi (RU, O'zbekiston)**

| Klaster | So'rov namunalari (RU) | Maqsadli sahifa |
|---|---|---|
| Brend | VeroLex, Веро Лекс, VeroLex Advisory | Bosh sahifa; lokal kartochkalar (B-16) |
| Umumiy yuridik xizmatlar | юридические услуги Ташкент, юрист для бизнеса Ташкент, юридическая фирма Ташкент | Bosh sahifa |
| Yuridik hamrohlik (abonent) | юридическое сопровождение бизнеса, абонентское юридическое обслуживание | Yuridik hamrohlik sahifasi |
| Korporativ huquq | регистрация ООО в Узбекистане, корпоративный юрист, изменение устава | `/ru/korporativ.html` |
| Soliq | налоговый консультант Ташкент, налоговая проверка юрист | Soliq sahifasi |
| Mehnat | трудовой юрист, трудовой спор с работодателем | Mehnat sahifasi |
| Litsenziya va ruxsatnomalar | получение лицензии в Узбекистане, разрешительные документы | Litsenziya sahifasi |
| IT Park | резидентство IT Park, как стать резидентом IT Park | IT Park sahifasi |
| Intellektual mulk | регистрация товарного знака в Узбекистане | IP sahifasi |
| Bankrotlik | банкротство юридического лица Узбекистан | Bankrotlik sahifasi |
| Oila huquqi (jismoniy shaxslar) | семейный юрист Ташкент, раздел имущества, алименты | Oila huquqi sahifasi |
| Ma'lumot olish uchun so'rovlar | как открыть ООО в Узбекистане, налоги для ООО | Blog/FAQ (Reliz-4 dan keyin — materiallar) |

**PDF qamrovidan tashqari — UZ va EN uchun qo'shimcha taklif** (alohida kelishiladi):
- **UZ:** `yurist Toshkent`, `MChJ ochish`, `IT Park rezidenti bo'lish`, `tovar belgisini ro'yxatdan o'tkazish`.
- **EN** (xorijiy investorlar): `law firm Tashkent`, `company registration Uzbekistan`, `IT Park residency Uzbekistan`, `trademark registration Uzbekistan`.

## 8. Ishlayotgan va saqlanadigan qismlar

- 3 tilli URL sxemasi va 39 ta mavjud URL (D2).
- 9 ta xizmat sahifasi, ularning noyob metadatasi va H1 (D2).
- canonical, uz/ru/en/x-default hreflang; Organization/LegalService, WebSite, WebPage, Service, BreadcrumbList va FAQPage strukturali ma'lumotlari (D2). Email birxilligi tuzatiladi.
- `sitemap.xml` va `robots.txt` (D2). Ularning to'g'riligi L-01 bilan qayta tekshiriladi.
- 18 ta FAQ — foydali kontent. Ular saqlanadi va muallif yurist hamda tekshirilgan sana qo'shiladi.
- Telefon, Telegram, xarita va ijtimoiy profil havolalari (D2).
- Formaning asosi: bo'sh maydon tekshiruvi, 3 tilli xabar va honeypot (D2).
- Sinab ko'rilgan sahifalarda til almashtirish (D2).

## 9. Auditni yopish uchun kerakli kirishlar va materiallar

Parol yoki token audit hujjatlariga yozilmaydi. Kirishlar alohida xavfsiz kanal orqali beriladi.

| # | Kerak | Nima uchun | Kimdan |
|---|---|---|---|
| 1 | Audit muhitida `verolex.uz` va `www.verolex.uz` uchun tarmoq ruxsati (Claude Code muhit sozlamalari → Network access) | L-01–L-19, L-28 ni ishga tushirish | VeroLex (muhit egasi) |
| 2 | Sayt manba kodi (repository) va deploy yo'riqnomasi | Stek, admin panel, xavfsizlik va arxitektura qarori | Pudratchi |
| 3 | Admin panel demosi yoki test akkauntlari (administrator, muharrir) | TZ §6.2 va SEO-002 | Pudratchi |
| 4 | Staging va alohida test kanali (Telegram yoki email) | Formalar va kelajakdagi CV qabulini xavfsiz sinash | Pudratchi; VeroLex |
| 5 | Hosting va DNS kirishi (yoki ma'lumot); backup jadvali | Redirectlar (B-08), backup (B-19) | VeroLex; Pudratchi |
| 6 | GA4, GSC, Yandex.Webmaster va Metrika, Google Ads — o'qish huquqi | B-01, B-10, B-11, L-26 | VeroLex |
| 7 | Rasmiy email qarori | B-02 | VeroLex rahbariyati |
| 8 | Tasdiqlangan yakuniy TZ yoki pudratchi bilan shartnoma | Talablarning yakuniy statusi | VeroLex |
| 9 | Kontent: kompaniya ma'lumotlari, xodimlar, vakansiyalar, hamkorlar va logolar (ruxsat bilan), fotosuratlar | NEW-modullarni nashr qilish | VeroLex (`VEROLEX_CONTENT_CHECKLIST.md`) |
| 10 | Maxfiylik siyosati, cookie va rozilik matnlari | B-07, M-06 | Yurist |
| 11 | Firefox, WebKit va haqiqiy iPhone hamda Android qurilmalari | L-21, L-22 | QA |

## 10. Beshta savolga javob

**1. Hozir nimalar ishlaydi va ularni qaytadan ishlab chiqish shart emas?**

Quyidagilar ishlaydi:
- 3 tilli URL tuzilmasi va 39 sahifa;
- 9 ta xizmat sahifasi;
- SEO asoslari: noyob title va description, H1, canonical, hreflang, sitemap, robots, strukturali ma'lumotlar;
- FAQ kontenti;
- aloqa kanallari;
- formaning asosi;
- sinab ko'rilgan sahifalardagi til almashtirish.

Bularni saqlab, bosqichma-bosqich yaxshilash kerak. Butun saytni qaytadan yozish zarurligi dalillar bilan isbotlanmagan. Bu xulosa dastlabki audit kuzatuvlariga tayanadi va tarmoq ochilgach qayta tasdiqlanadi.

**2. Birinchi navbatda qaysi ishlarni bajarish kerak?**
1. **Telegram tokenini almashtirish va `diagnostika.php` ni o'chirish (B-29)** — bu bugunoq qilinadi.
1. Kirishlar va kod (B-09). Arxivda admin yo'qligi aniqlandi, shuning uchun arxitektura qarori — B varianti.
2. GA4 shartini tuzatish va hodisalarni tasdiqlash (B-01).
3. Bitta rasmiy emailni tanlash va hamma joyda bir xil qilish (B-02).
4. Arizalar yetib borishini test kanalida tekshirish (B-03).
5. Forma validatsiyasi, label va holatlar (B-04, B-05) hamda spam bo'yicha qaror (B-06).
6. Maxfiylik siyosati, forma axboroti va cookie xabarnomasi (B-07).
7. Kanonik xost va `/index.html` aliaslari (B-08), GSC va Yandex.Webmaster (B-11).
8. SEO shartnomasini aniqlashtirish: KPI, kalit so'zlar, qamrov va rollar (B-12).
9. Kontent yig'ishni boshlash: xodimlar, hamkorlar va logolar, vakansiyalar (M-11).
10. Dizayn tizimi va maketlar (M-01). Ular Reliz-3dagi Jamoa, Hamkorlar va Vakansiyalar bo'limlari uchun asos bo'ladi.

**3. Qaysi ish dasturchiniki, qaysisi SEO mutaxassisiniki, qaysisi VeroLex jamoasiniki?**

| Dasturchi | SEO ijrochisi | VeroLex jamoasi |
|---|---|---|
| B-01, B-03, B-04, B-05, B-06 (bajarish), B-08, B-13, B-14, B-17, B-19, B-24, B-25; M-02–M-10 | Semantik yadro, meta, matnlar va hisobot (SEO-xxx); B-11; texnik topshiriqlarni yozish va qayta tekshirish (SEO-012); B-16 (texnik qismi) | Qarorlar: email (B-02), spam (B-06), Hamkorlar menyu nomi; kirishlar (B-09); SEO shartnomasi (B-12); kontent va rozilik (M-11); yurist — maxfiylik siyosati, da'volar va FAQ tekshiruvi (B-07, B-15); HR — vakansiyalar |
| Dizayner: M-01 (dizayn tizimi, maketlar) | | Fotosessiya; logolar va ruxsatlar |

**4. Auditni to'liq yopish uchun qanday kirish yoki tasdiqlangan material kerak?**

§9dagi jadval. Eng muhimlari:
- audit muhitida `verolex.uz` uchun tarmoq ruxsati;
- manba kodi va admin demo;
- staging va test kanali;
- analitika hisoblariga o'qish huquqi;
- tasdiqlangan yakuniy TZ;
- `VEROLEX_CONTENT_CHECKLIST.md`dagi kontent.

**5. Mavjud saytni bosqichma-bosqich takomillashtirish uchun qanday texnik yo'l ma'qul?**

Tavsiya — **bosqichma-bosqich takomillashtirish**. Mavjud URLlar va SEO saqlanadi (NEW-008). Avval joriy saytdagi P1 xatolar tuzatiladi (Reliz-1), keyin dizayn tizimi joriy qilinadi (Reliz-2), keyin yangi bo'limlar qo'shiladi (Reliz-3–5).

Backend yoki CMS bo'yicha qaror B-09 natijasiga bog'liq. Variantlar:

| Variant | Qachon to'g'ri | Afzallik | Xavf |
|---|---|---|---|
| **A. Mavjud admin panelni kengaytirish** | Admin bor va 3 tilli mustaqil nashr, SEO maydonlari, media hamda rollarni qo'llaydi; kod VeroLex'ga topshiriladi. **Arxiv tekshiruvi (D1L): arxivda admin yo'q — bu variant faqat pudratchi production'da alohida admin borligini ko'rsatsa ko'rib chiqiladi** | Eng arzon; DOCX talabiga mos; URLlar o'zgarmaydi | Kod sifati past bo'lsa, texnik qarz to'planadi |
| **B. Yangi individual backend va admin modul** (jamoa, hamkorlar, vakansiyalar, materiallar uchun umumiy model); mavjud sahifalar shablonlarga ko'chiriladi | Admin yo'q, cheklangan yoki kod berilmaydi | DOCX §8 ga mos (“без готовых CMS”); REDESIGN_TZ §10dagi modellar to'g'ridan-to'g'ri amalga oshadi | Ko'proq ish; URLlar va metadata ko'chirilishini qat'iy nazorat qilish kerak |
| **C. Tayyor CMS (WordPress va boshqalar)** | Faqat VeroLex DOCX'dagi “tayyor CMSsiz” talabini rasman o'zgartirsa | SEO plaginlari va tayyor admin | DOCX'ga zid; 39 URL va 3 tilli hreflang'ni ko'chirish xavfi; plaginlarga bog'liqlik |

Qaror mezonlari:
1. Admin 3 tilni mustaqil nashr qila oladimi?
2. Har sahifa va til uchun SEO maydonlarini tahrirlash mumkinmi?
3. Media kutubxonasi va rollar bormi?
4. Yangi ma'lumot modellarini (xodim, hamkor, vakansiya, ariza) qo'shish mumkinmi?
5. CV kabi maxfiy fayllarni xavfsiz saqlash mumkinmi?
6. Kod topshirilganmi va hujjatlashtirilganmi?

Agar 1–4 va 6 bajarilsa — A varianti, aks holda — B varianti. C varianti faqat TZ rasman o'zgartirilsa.

**Arxiv tekshiruvidan keyingi tavsiya: B varianti.** Mavjud statik sahifalar, ularning URL, metadata va JSON-LD qismlari yangi shablonlarga ko'chiriladi. Kontent (39 sahifa matni va `i18n.js`) ma'lumotlar bazasiga import qilinadi. Shunda dizayn, Jamoa, Hamkorlar va Vakansiyalar bitta individual admin orqali boshqariladi. Bu yo'l DOCX talabiga ham, PDF'dagi “kontentni CMS orqali boshqarish” ehtiyojiga ham javob beradi.

## 11. Manbalar

- **Foydalanuvchi bergan fayllar:**
  - `Vero Lex(Draft)_website.docx` — §1–§13 va ilova; tuzilmasi `audit/evidence/02_docx_structure.txt`da;
  - `Кп-seo-verolex-uz.pdf` — 1–5-sahifalar; indeksi `audit/evidence/03_pdf_pages.md`da;
  - `VeroLex_Audit_2026-10-01.md` — dastlabki audit, D2 kuzatuvlari;
  - `VeroLex_Claude_Code_Prompt.md` — topshiriq, 0-bo'lim (yangi talablar).
- **Repository:** `README.md` (`audit/evidence/01_repo_inventory.txt`).
- **Qidiruv indeksi:** `audit/evidence/04_search_index.md`.
- **Jonli sayt URLlari** (bu sessiyada ochilmadi): https://verolex.uz/ , https://verolex.uz/sitemap.xml , https://verolex.uz/robots.txt , https://verolex.uz/assets/js/analytics.js?v=8 , https://verolex.uz/assets/js/main.js?v=8
- **Rasmiy texnik manbalar** (audit vaqtida tarmoq cheklovi tufayli qayta ochilmadi):
  - Google meta teglari: https://developers.google.com/search/docs/crawling-indexing/special-tags
  - Crawl qilinadigan havolalar: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
  - Ko'p tilli saytlar: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
  - SEO asoslari: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
  - Google AI funksiyalari: https://developers.google.com/search/docs/appearance/ai-features
  - Web Vitals: https://web.dev/articles/vitals
  - WCAG 2.2: https://www.w3.org/TR/WCAG22/
