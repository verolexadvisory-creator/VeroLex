# VeroLex — redizayn va yangi bo'limlar uchun texnik topshiriq

Versiya: 1.0 (2026-10-01, Asia/Tashkent). Holati: kelishish uchun loyiha.

## 0. Hujjat haqida

**Manbalar.** Har qoidaning yonida uning manbasi belgilangan:
- **[TALAB]** — buyurtmachining 2026-10-01 13:12 dagi topshirig'i (prompt 0-bo'lim) yoki DOCX TZ;
- **[TAKLIF]** — maqsadni amalga oshirish uchun ijrochi taklif qilgan yechim: aniq rang kodlari, shriftlar, o'lchamlar, limitlar, URL nomlari va boshqalar. Ular buyurtmachining so'zlari emas va tasdiqlanguncha o'zgartirilishi mumkin.

**Kontent.** Bu hujjatda haqiqiy xodim, hamkor yoki vakansiya ma'lumoti yo'q. Wireframe'lardagi `[XODIM ISMI]`, `[KOMPANIYA LOGOSI]` kabi qavsli yozuvlar faqat maket o'rni. Ular saytda haqiqiy ma'lumot sifatida nashr qilinmaydi.

### Hozirgi holat va rejalashtirilgan o'zgarish

| Soha | Hozirgi holat (dalil) | Rejalashtirilgan |
|---|---|---|
| Sahifalar | 13 sahifa turi × 3 til = 39 URL: bosh sahifa, kompaniya, blog/FAQ, aloqa va 9 xizmat (D2) | + Jamoa ro'yxati va profillar, Hamkorlar, Vakansiyalar ro'yxati va sahifalari, Maxfiylik; keyinroq Yangiliklar va keyslar |
| Menyu | Jamoa, Hamkorlar va Vakansiyalar yo'q (D2) | §7dagi 7 bandli menyu |
| URL | UZ ildizda, `/ru/`, `/en/`; `.html` (D2). www va wwwsiz hamda `/index.html` aliaslari indeksda (D3) | Sxema saqlanadi; aliaslar 301 bilan birlashtiriladi (B-08) |
| SEO | Noyob title va description, 1 ta H1, canonical, hreflang, JSON-LD (D2) | Hammasi saqlanadi; yangi sahifalarga ham shu standart |
| Forma | Label'lar inputga bog'lanmagan; brauzer faqat bo'sh maydonni tekshiradi; serverda validatsiya, honeypot va rate limit bor (D2, D1L) | §6.5 forma standarti |
| Dizayn | Buyurtmachi bahosiga ko'ra jiddiy yuridik konsaltingga yetarli mos emas | §1–§6 dizayn tizimi |
| Admin | Sayt arxivida admin yoki CMS yo'q: statik HTML, `i18n.js` va `send.php` (D1L) | §10dagi modellar uchun yangi individual backend va admin (AUDIT §10, 5-savol, B varianti) |

---

## 1. Maqsad va tamoyillar

**Maqsad [TALAB 0.1].** Sayt VeroLex Advisory'ning ekspertligini, tartibliligini va korporativ mijozlar bilan ishlash qobiliyatini xotirjam va professional uslubda ko'rsatishi kerak.

**Asosiy auditoriya:**
- biznes egalari;
- mahalliy va xorijiy kompaniyalar;
- investorlar va hamkorlar.

Jismoniy shaxslar uchun xizmatlar ham navigatsiyada oson topilishi kerak [TALAB 0.1; DOCX §3].

**Tamoyillar [TAKLIF]:**
1. **Mazmun birinchi.** Har blok bitta savolga javob beradi: kim, nima qiladi, qanday ishlaydi, kim bilan, qanday bog'lanish mumkin.
2. **Tasdiqlangan ma'lumot.** Sana, tajriba, mijozlar soni, yutuq va logo faqat VeroLex tasdiqlagan bo'lsa chiqadi. Ma'lumot bo'lmasa, blok ko'rsatilmaydi.
3. **Vazminlik.** Rang palitrasi cheklangan, tipografika vazmin, dekor minimal. Animatsiya faqat holatni bildirish uchun ishlatiladi.
4. **Uch til teng.** UZ, RU va EN matnlari bir xil sifatda; eng uzun til (odatda RU) bo'yicha joylashuv sinovdan o'tkaziladi.
5. **Barcha uchun qulay.** Maqsad — WCAG 2.2 AA darajasi. Bu taklif; DOCX §7 faqat kontrast va alt matnlarni talab qiladi.

## 2. Brend asoslari

- **Logotip.** Mavjud VeroLex logotipi saqlanadi [TALAB 0.1]. PDF muqovasidagi versiyada “Vero” to'q ko'k, “Lex” oltin rangda (D1, T-02).
- **Vektor fayl.** SVG fayl VeroLex'dan olinadi (B-22). To'q fon uchun oq yoki och versiya kerak.
- **Yozilishi.** Logotipning shakli va ranglari o'zgartirilmaydi. Kompaniya nomi matnda “VeroLex Advisory” deb yoziladi; rasmiy nomni VeroLex tasdiqlaydi (CONTENT_CHECKLIST §1).

## 3. Ranglar [TAKLIF; asosiy to'rt rang — prompt 0.1 taklifi]

| Token | Qiymat | Qo'llanishi | Kontrast (D1, `05_contrast.json`) |
|---|---|---|---|
| `--navy-900` | `#142131` | Header, footer, asosiy tugma foni, to'q bloklar, sarlavhalar | Och fonda 15.03:1; oq matn shu fonda 16.26:1 |
| `--ink` | `#20262E` | Asosiy matn | `#F7F6F2` ustida 14.09:1; oq ustida 15.24:1 |
| `--bg` | `#F7F6F2` | Sahifa foni (iliq och) | — |
| `--surface` | `#FFFFFF` | Kartalar, formalar | — |
| `--muted` | `#5B6470` | Ikkilamchi matn, sana, meta | `--bg` ustida 5.55:1; oq ustida 6.00:1 |
| `--gold` | `#AD8A4F` | **Faqat aksent:** ingichka chiziqlar, to'q fondagi ikonka va raqamlar, hover chizig'i | **`--bg` ustida 2.98:1 — och fonda matn uchun taqiqlanadi.** To'q ko'k ustida 5.05:1 — ruxsat |
| `--gold-text` | `#7A5E2E` | Och fondagi “eyebrow” yorliqlari (masalan, “XIZMATLAR”) | `--bg` ustida 5.60:1 |
| `--gold-light` | `#C9A86A` | To'q fondagi aksent va fokus halqasi | `--navy-900` ustida 7.19:1 |
| `--line` | `#D9D4C7` | Faqat dekorativ ajratuvchi chiziq | 1.37:1 — forma chegarasi yoki ma'lumot tashuvchi element uchun ishlatilmaydi |
| `--border` | `#7D838B` | Input chegarasi, karta outline (UI) | Oq ustida 3.82:1; `--bg` ustida 3.54:1 (UI uchun ≥3:1) |
| `--error` | `#B42318` | Xato matni va chegarasi | Oq ustida 6.57:1; `--bg` ustida 6.08:1 |
| `--success` | `#1E6B41` | Muvaffaqiyat xabari | Oq ustida 6.49:1; `--bg` ustida 6.00:1 |
| `--on-navy-2` | `#E8E4DA` | To'q fondagi ikkilamchi matn | 12.81:1 |
| `--on-navy-muted` | `#AEB6C2` | Footerdagi kichik matn | 7.95:1 |

**Qoidalar:**
1. Oltin rang sahifa yuzasining taxminan 5 foizidan oshmaydi. Katta oltin bloklar va gradientlar ishlatilmaydi.
2. Asosiy tugma — to'q ko'k fon, oq matn. Oltin fonli tugma ishlatilsa, matni to'q ko'k bo'ladi (5.05:1), oq emas (3.22:1 — FAIL).
3. Xato va muvaffaqiyat holati faqat rang bilan emas, matn va ikonka bilan ham bildiriladi.
4. To'q rejim (dark mode) bu bosqich scope'iga kirmaydi.

## 4. Tipografika [TAKLIF]

**Shrift oilalari.** Ko'pi bilan ikkita oila ishlatiladi [TALAB 0.1]:
- Sarlavhalar uchun vazmin serif. Nomzodlar: **Source Serif 4** yoki **PT Serif**.
- Matn va formalar uchun sans-serif. Nomzodlar: **Inter** yoki **PT Sans**.

Har to'rt nomzodda lotin va kirill yozuvlari bor. Yakuniy tanlovdan oldin glif sinovi o'tkaziladi. Sinov qatori: `Oʻzbekiston, gʻoya, Oʻ oʻ Gʻ gʻ ʼ — O'zbek, g'oya; Ёё Йй Щщ Ъъ; Ўў Ққ Ғғ Ҳҳ; “ ” « » № – —`. U 3 brauzerda va mobilda ko'riladi; “tofu” (bo'sh kvadrat) belgisi chiqmasligi kerak.

**Yuklash.**
- Shriftlar saytning o'z serveridan beriladi: WOFF2, `latin`, `latin-ext` va `cyrillic` subset'lari.
- `font-display: swap` ishlatiladi; asosiy matn shrifti preload qilinadi.
- Shriftlar soni: 2 oila × 2–3 vazn.

**O'lchamlar (px, qator balandligi):**

| Element | Desktop (≥1024) | Mobil (<768) | Vazn |
|---|---|---|---|
| H1 | 44 / 52 | 30 / 38 | Serif 600 |
| H2 | 32 / 40 | 26 / 34 | Serif 600 |
| H3 | 24 / 32 | 21 / 28 | Serif 600 |
| H4 | 20 / 28 | 18 / 26 | Sans 600 |
| Asosiy matn | 18 / 30 | 17 / 28 | Sans 400 |
| Kichik matn, meta | 15 / 22 | 14 / 20 | Sans 400 |
| Tugma | 16 / 24 | 16 / 24 | Sans 600 |
| Eyebrow yorlig'i | 13 / 18, harflar orasi +0.08em, katta harf | 13 / 18 | Sans 600 |

**Qoidalar:**
- Matn ustuni eng ko'pi bilan 70 belgi kenglikda.
- Mobil qurilmada 14 px dan kichik matn ishlatilmaydi.
- Sarlavhalar kesilmaydi va `…` bilan qisqartirilmaydi; uzun so'zlar uchun `hyphens: auto` (`lang` atributi to'g'ri bo'lsa).

## 5. Grid, oraliqlar va breakpointlar [TAKLIF]

- **Konteyner:** eng ko'pi bilan 1200 px. Yon bo'shliq desktopda 24 px, mobilda 16 px.
- **Grid:**
  - desktop — 12 ustun, oraliq 24;
  - planshet — 8 ustun, oraliq 20;
  - mobil — 4 ustun, oraliq 16.
- **Oraliqlar shkalasi:** 4, 8, 12, 16, 24, 32, 48, 64, 96. Bo'limlar orasi: desktopda 96, mobilda 64.
- **Breakpointlar:**
  - `<768` — mobil;
  - `768–1023` — planshet;
  - `1024–1279` — kichik desktop;
  - `≥1280` — desktop.
- **Test kengliklari:** 360, 390, 768, 1024, 1440 (L-11).
- **Kartalar:** fon `--surface`, chegara `1px --line` (dekorativ), radius 4 px, soya yo'q yoki juda yengil.

## 6. Komponentlar va holatlar

### 6.1 Tugmalar [TAKLIF]
| Tur | Ko'rinish | Ishlatilishi |
|---|---|---|
| Asosiy | `--navy-900` fon, oq matn; hover — fon 8 % och, ostida oltin chiziq | “Konsultatsiya olish”, “Ariza yuborish”. Bitta ekranda bitta |
| Ikkilamchi | Shaffof fon, `--navy-900` 1.5 px chegara va matn | “Xizmatlarni ko'rish”, “Batafsil” |
| Matnli havola | `--navy-900` matn, tagiga chizilgan | Kartalar ichida |

- Minimal bosish maydoni 44 × 44 px.
- Tugma matni 3 tilda bir qatorga sig'ishi kerak; sig'masa, ikki qatorga o'tadi, kesilmaydi.

### 6.2 Fokus [TALAB 0.1: “klaviatura fokusi ko'rinadi”]
- Och fonda: `outline: 2px solid --navy-900; outline-offset: 2px`.
- To'q fonda: `--gold-light`.
- `outline: none` faqat muqobil ko'rinadigan indikator bo'lsa ishlatiladi.

### 6.3 Harakat [TALAB 0.1]
- Faqat hover va fokus o'tishlari, 150–200 ms.
- Uzluksiz animatsiya, parallaks, avtomatik karusel va “yaltirash” yo'q.
- `@media (prefers-reduced-motion: reduce)` — barcha o'tishlar o'chiriladi (L-18: ishlayotgan animatsiya 0).

### 6.4 Ikonka va tasvirlar [TALAB 0.1]
- Chiziqli ikonkalar to'plami, 1.5 px, bitta uslubda.
- Katta tarozi, bolg'a va ustun kabi “yuridik klishe” tasvirlar sahifa mazmunini bosib ketmaydi.
- Dekorativ rasmga `alt=""` beriladi. Mazmunli rasmning alt matni har bir tilda alohida yoziladi.

### 6.5 Formalar [TAKLIF; B-04, B-05 asosida]
- Har maydonda ko'rinadigan `<label>`. Placeholder faqat misol uchun (masalan, `+998 90 123 45 67`).
- Majburiy maydon “*” bilan va “(majburiy)” matni bilan belgilanadi.
- Xato maydon ostida, shu tilda chiqadi va `aria-describedby` hamda `aria-invalid` bilan bog'lanadi. Yuborishdan keyin fokus birinchi xato maydonga o'tadi.
- **Holatlar:**
  - **Bo'sh;**
  - **Yuborilmoqda** — tugma `disabled` + `aria-busy`, matni “Yuborilmoqda…”;
  - **Muvaffaqiyat** — faqat server tasdiqlaganda;
  - **Xato** — server yoki tarmoq xatosi; “Qayta urinish” tugmasi va telefon raqami ko'rsatiladi;
  - **Takroriy bosish** — ikkinchi so'rov yuborilmaydi.
- Forma ostida maxfiylik siyosatiga havola va qisqa axborot (B-07).
- Muvaffaqiyat xabari `role="status"`, xato xabari `role="alert"`.

### 6.6 Bo'sh va xato holatlar [TALAB 0.1–0.4]
| Holat | Ko'rinish |
|---|---|
| Blok uchun kontent yo'q (jamoa, hamkorlar, yangiliklar) | Bosh sahifada blok umuman ko'rsatilmaydi |
| Ochiq vakansiya yo'q | “Hozircha ochiq vakansiyalar yo'q” + korporativ madaniyat bloki. Umumiy CV taklifi faqat qabul jarayoni sozlangan bo'lsa |
| Xodim fotosi yo'q | Neytral fonda bosh harflar (monogramma). Stok surat ishlatilmaydi |
| Logo yuklanmadi | Kompaniya nomi matn sifatida, logo joyining o'lchamida |
| Tarjima yo'q | Til almashtirgich shu tilning ro'yxat sahifasiga olib boradi va “Bu sahifa hozircha [til]da mavjud emas” deb yozadi; hreflangda bu til ko'rsatilmaydi |

## 7. Navigatsiya

### 7.1 Asosiy menyu [TALAB 0.1 — taklif etilgan menyu]

| # | UZ | RU | EN | Ichki bandlar |
|---|---|---|---|---|
| 1 | Bosh sahifa | Главная | Home | — |
| 2 | Xizmatlar | Услуги | Services | Tasdiqlangan yo'nalishlar ro'yxati (hozir 9 ta). Ikki guruh [TAKLIF]: “Biznes uchun” / “Jismoniy shaxslar uchun” (masalan, oila huquqi) |
| 3 | Biz haqimizda | О нас | About us | Kompaniya · Jamoa / Компания · Команда / Company · Team |
| 4 | Hamkorlar | Партнёры | Partners | — (nomi tasdiqlanadi, pastdagi izohga qarang) |
| 5 | Blog | Блог | Blog | Hozir: FAQ. Reliz-4dan keyin: Yangiliklar · Legal Alerts · Tahlil · FAQ |
| 6 | Vakansiyalar | Вакансии | Careers | — |
| 7 | Aloqa | Контакты | Contact | — |

Menyudan tashqari elementlar:
- headerning o'ng tomonida **“Konsultatsiya olish”** tugmasi (asosiy CTA);
- til tanlagich `UZ | RU | EN` — joriy til `aria-current="true"` bilan belgilanadi; `aria-label` 3 tilda: “Til tanlash” / “Выбор языка” / “Choose language”.

**Izohlar [TAKLIF]:**
- **“Hamkorlar” nomi.** Bu ro'yxatda mijoz kompaniyalar ham bo'lishi mumkin. Sahifa sarlavhasi: “Biz bilan ishlayotgan va ishlagan kompaniyalar” [TALAB 0.4]. Menyu nomi “Hamkorlar” qoladimi yoki “Mijozlar va hamkorlar” bo'ladimi — VeroLex hal qiladi.
- **Keyslar** [DOCX §5] haqiqiy keyslar paydo bo'lgach “Biz haqimizda → Tajriba” bandi va xizmat sahifalaridagi blok sifatida qo'shiladi. Alohida 8-menyu bandi qo'shilmaydi.
- **Yangiliklar va Legal Alerts** [DOCX §5] “Blog” ichida bo'ladi. Blog nomi Reliz-4da “Yangiliklar va tahlil” deb o'zgarishi mumkin; URL `/blog.html` saqlanadi.
- Kontenti yo'q band menyuda ko'rsatilmaydi. Istisno — “Vakansiyalar”: u doim ko'rinadi va kerak bo'lsa bo'sh holatini ko'rsatadi [TALAB 0.2].
- **Chuqurlik.** Har sahifaga bosh sahifadan ko'pi bilan 2 klik, materialgacha ko'pi bilan 3 klik [DOCX §7].

### 7.2 Mobil menyu [TAKLIF]
- “Menyu” tugmasi: `aria-expanded`, `aria-controls`; yorlig'i 3 tilda.
- Ochilganda menyu butun ekranni egallaydi va fokus uning ichida qoladi (focus trap). Escape tugmasi menyuni yopib, fokusni tugmaga qaytaradi.
- Yopiq menyuning havolalari fokusga tushmaydi (L-12).
- Pastki qismda telefon, Telegram va “Konsultatsiya olish” tugmasi.

### 7.3 Footer [TAKLIF]
- To'q ko'k fonda 4 ustun: kompaniya qisqacha · xizmatlar · bo'limlar · aloqa.
- Aloqa ustunida: manzil, telefon, rasmiy email (B-02), Telegram, ijtimoiy profillar.
- Pastki qatorda: © yil, rasmiy nom, “Maxfiylik siyosati”, cookie sozlamalari.

## 8. URL va SEO saqlash rejasi

**Saqlanadigan URLlar [TALAB 0.1].** Mavjud 39 URL saqlanadi: `/`, `/about.html`, `/blog.html`, `/contact.html`, 9 xizmat sahifasi (masalan, `/ru/korporativ.html`) va ularning `/ru/`, `/en/` versiyalari. Ularning title, description, H1, canonical, hreflang va JSON-LD qiymatlari redizayndan oldin `site_inventory.mjs` bilan saqlab olinadi (NEW-008).

**Yangi URLlar [TAKLIF].** Hozirgi asosiy sahifalarda inglizcha slug va `.html` uslubi ishlatilgan (about, blog, contact). Yangi sahifalar ham shu uslubda bo'ladi; slug har uch tilda bir xil.

| Sahifa | UZ | RU | EN |
|---|---|---|---|
| Kompaniya (mavjud) | `/about.html` | `/ru/about.html` | `/en/about.html` |
| Jamoa ro'yxati | `/team.html` | `/ru/team.html` | `/en/team.html` |
| Xodim profili | `/team/{slug}.html` | `/ru/team/{slug}.html` | `/en/team/{slug}.html` |
| Hamkorlar | `/partners.html` | `/ru/partners.html` | `/en/partners.html` |
| Vakansiyalar | `/careers.html` | `/ru/careers.html` | `/en/careers.html` |
| Vakansiya | `/careers/{slug}.html` | `/ru/careers/{slug}.html` | `/en/careers/{slug}.html` |
| Maxfiylik | `/privacy.html` | `/ru/privacy.html` | `/en/privacy.html` |

**Slug qoidalari:**
- Xodim slug'i — ismning lotin translitidagi shakli (masalan, `ism-familiya`).
- Vakansiya slug'i — lavozim nomi va yaratilgan oy (taklif: `yurist-korporativ-2026-10`).
- Slug nashrdan keyin o'zgarmaydi. O'zgarsa, eski URL 301 bilan yangisiga yo'naltiriladi.

**Har yangi sahifa uchun:**
- har tilda alohida title va description (admin orqali);
- self-canonical;
- faqat nashr qilingan tillarga hreflang va x-default (hozirgi qoidaga mos);
- sitemapga avtomatik qo'shilish va yashirilganda olib tashlanish;
- bitta H1;
- Open Graph (B-17).

**Indekslanmaydigan sahifalar:** ariza tasdiq sahifasi, qidiruv natijalari, filtrli ro'yxatlar va admin. Ular `noindex` bo'ladi va sitemapga kiritilmaydi. CV fayllar umuman ommaviy URLga ega emas.

## 9. Shablonlar: desktop va mobil

Belgilar: `[ ]` — blok, `( )` — tugma, `{ }` — dinamik ma'lumot. Mobil ustun tartibi yuqoridan pastga.

### 9.1 Bosh sahifa [TALAB 0.1 ketma-ketligi]
```
DESKTOP (1440)                                         MOBIL (390)
┌───────────────────────────────────────────────────┐  ┌────────────────────┐
│ LOGO  Xizmatlar Biz haqimizda Hamkorlar Blog       │  │ LOGO     ☰ Menyu   │
│       Vakansiyalar Aloqa   UZ|RU|EN (Konsultatsiya)│  ├────────────────────┤
├───────────────────────────────────────────────────┤  │ eyebrow            │
│ eyebrow: YURIDIK KONSALTING · TOSHKENT             │  │ H1 (≤3 qator)      │
│ H1: {pozitsiya, 1 jumla}                           │  │ foyda matni        │
│ 2 qator: mijoz uchun foyda                         │  │ (Konsultatsiya)    │
│ (Konsultatsiya olish)  (Xizmatlarni ko'rish)       │  │ (Xizmatlar)        │
│ o'ngda: haqiqiy ofis yoki jamoa surati (bo'lsa)    │  │ surat (bo'lsa)     │
├───────────────────────────────────────────────────┤  ├────────────────────┤
│ XIZMATLAR: 3×3 karta (nomi, 1 jumla, →)            │  │ 1 ustunli kartalar │
│ “Biznes uchun” / “Jismoniy shaxslar uchun” yorliq  │  │                    │
├───────────────────────────────────────────────────┤  ├────────────────────┤
│ KOMPANIYA HAQIDA: 2 ustun — matn | 3 ta tasdiqlan- │  │ matn               │
│ gan fakt (faqat tasdiqlangan raqamlar) (Batafsil)  │  │ faktlar 1 ustun    │
├───────────────────────────────────────────────────┤  ├────────────────────┤
│ JAMOA: 4 karta (foto, ism, lavozim, ixtisos)       │  │ gorizontal emas,   │
│ (Butun jamoa)                                      │  │ 1 ustun, 3 karta + │
├───────────────────────────────────────────────────┤  │ (Butun jamoa)      │
│ BIZ BILAN ISHLAYOTGAN VA ISHLAGAN KOMPANIYALAR:    │  ├────────────────────┤
│ 6 ta logo grid (2 qator × 6 yoki 3) (Barchasi)     │  │ logolar 2 ustunli  │
├───────────────────────────────────────────────────┤  ├────────────────────┤
│ YANGILIKLAR / TAHLIL: 3 karta (Reliz-4dan keyin)   │  │ 3 karta            │
├───────────────────────────────────────────────────┤  ├────────────────────┤
│ ALOQA: forma | telefon, Telegram, manzil, xarita   │  │ forma, keyin aloqa │
├───────────────────────────────────────────────────┤  ├────────────────────┤
│ FOOTER                                             │  │ FOOTER             │
└───────────────────────────────────────────────────┘  └────────────────────┘
```
- Har blok admin orqali yoqiladi va o'chiriladi. Kontenti bo'lmagan blok render qilinmaydi (NEW-004).
- Jamoa va hamkorlar bloklari tasdiqlangan ma'lumot kelgunga qadar o'chiq turadi.
- Hero matnida tasdiqlanmagan da'vo (REC-007) ishlatilmaydi.

### 9.2 Xizmat sahifasi (mavjud 9 ta sahifa)
```
DESKTOP                                               MOBIL
[Breadcrumb: Bosh sahifa / Xizmatlar / {Xizmat}]      [Breadcrumb]
[H1 {Xizmat}] [qisqa tavsif] (Konsultatsiya olish)    [H1] [tavsif] (CTA)
[2/3: Nima qilamiz — ro'yxat; Qanday ishlaymiz —      [Nima qilamiz]
 bosqichlar; Kimlar uchun]  [1/3 yon panel:           [Qanday ishlaymiz]
 Mas'ul mutaxassislar (NEW-019), aloqa]               [Mutaxassislar]
[Tegishli keyslar — Reliz-4, bo'lsa]                  [FAQ shu xizmat bo'yicha]
[FAQ shu xizmat bo'yicha — mavjud FAQPage saqlanadi]  [Aloqa formasi]
[Aloqa formasi]
```
- Mavjud matn, H1, title, description va Service/Breadcrumb/FAQPage schema saqlanadi.
- Matnni yurist tekshiradi va sahifaga “tekshirilgan sana” qo'yiladi (REC-008).

### 9.3 Biz haqimizda → Kompaniya (`/about.html`)
```
DESKTOP                                               MOBIL
[H1 Biz haqimizda] [sub-nav: Kompaniya | Jamoa]       [H1] [sub-nav tabs]
[Faoliyat mohiyati — 2 abzas | ofis surati]           [matn] [surat]
[Kimlarga xizmat qilamiz: segmentlar, 3–4 karta]      [segmentlar 1 ustun]
[Xizmat yo'nalishlari — xizmat sahifalariga havola]   [yo'nalishlar ro'yxati]
[Ish usuli: 4 bosqich (murojaat → tahlil → yechim     [bosqichlar vertikal]
 → hamrohlik)]
[Qadriyatlar: 3–4 band]                               [qadriyatlar]
[Geografiya va ish tillari]                           [geografiya]
[Hamkorlik tartibi: to'lov modellari, shartnoma]      [hamkorlik]
[Tarix va missiya; tasdiqlangan sana va faktlar]      [tarix]
[Jamoa bloki (4 karta) → /team.html]                  [jamoa → ]
[CTA: Konsultatsiya olish]                            [CTA]
```

### 9.4 Biz haqimizda → Jamoa (`/team.html`)
```
DESKTOP                                               MOBIL
[H1 Bizning jamoa] [1 abzas]                          [H1] [abzas]
[Filtr: Barchasi | {xizmat yo'nalishlari}] (NEW-019)  [Filtr: select]
┌──────────┐┌──────────┐┌──────────┐┌──────────┐      ┌────────────────────┐
│ [FOTO 4:5]│ ...                                    │ [FOTO 4:5]          │
│ {F.I.Sh.} │                                        │ {F.I.Sh.}           │
│ Lavozimi: │  ← yorliq kichik, muted                │ Lavozimi: {…}       │
│ {lavozim} │                                        │ Mutaxassisligi: {…} │
│ Mutaxassis│                                        │ (Profil →)          │
│ ligi: {…} │                                        └────────────────────┘
│ (Profil →)│                                         1 ustun; planshetda 2
└──────────┘ 4 ustun (1024–1279: 3)
```
- **Kartada uchta ma'lumot bir vaqtda ko'rinadi:**
  1. F.I.Sh. va foto;
  2. **Lavozimi**;
  3. **Mutaxassisligi** [TALAB 0.3].
- “Lavozimi” va “Mutaxassisligi” yorliqlari ko'rinadi. Faqat “Yurist” degan bitta umumiy yozuv bilan almashtirilmaydi.
- Ism ikki qatorgacha o'raladi. Mutaxassislik 3 tadan ko'p bo'lsa, birinchi 3 tasi va “+N” ko'rsatiladi.
- Tartib admin tomonidan belgilanadi.

### 9.5 Xodim profili (`/team/{slug}.html`)
```
DESKTOP                                               MOBIL
[Breadcrumb: Biz haqimizda / Jamoa / {Ism}]           [Breadcrumb]
┌─────────────┬─────────────────────────────────┐     [FOTO]
│ [FOTO 4:5]  │ H1 {F.I.Sh.}                     │     [H1 Ism]
│             │ Lavozimi: {…}                    │     [Lavozimi] [Mutaxassisligi]
│             │ Mutaxassisligi: {chips}          │     [Kasbiy maqom]
│             │ Kasbiy maqom: {faqat tasdiqlangan}│    [Ish tillari]
│             │ Ish tillari: UZ · RU · EN         │     [Bio]
│             │ (Konsultatsiya so'rash)           │     [Ta'lim va malaka]
└─────────────┴─────────────────────────────────┘     [Tajriba]
[Bio — 2–4 abzas]                                     [Xizmatlar →]
[Ta'lim va malaka (tasdiqlangan)] [Tajriba]           [Nashrlar]
[Xizmat yo'nalishlari → xizmat sahifalariga]          [Aloqa: korporativ]
[Nashrlar va loyihalar (e'lon qilish mumkin bo'lsa)]  [Boshqa a'zolar →]
[Korporativ aloqa: umumiy telefon/email yoki shaxsiy
 korporativ email (ruxsat bilan)]
[Jamoaning boshqa a'zolari: 3 karta]
```
- **Til almashtirgich** shu xodimning boshqa tildagi profiliga olib boradi. Tarjima bo'lmasa, §6.6dagi qoida ishlaydi.
- **Kasbiy maqom** (masalan, advokat) faqat VeroLex bergan va tasdiqlagan ma'lumot bo'yicha yoziladi [TALAB 0.3].
- **Person schema** faqat ko'rinadigan maydonlar bilan: `name`, `jobTitle`, `worksFor`, `image`, `knowsLanguage`, `knowsAbout`.

### 9.6 Hamkorlar (`/partners.html`)
```
DESKTOP                                               MOBIL
[H1 Biz bilan ishlayotgan va ishlagan kompaniyalar]   [H1]
[1 abzas: kim bilan va qanday ishlaymiz]              [abzas]
[Filtr (≥24 kompaniyada): Hammasi|Mahalliy|Xorijiy;   [Filtr: 2 select]
 Holat: Hammasi|Amaldagi|Yakunlangan]
── Mahalliy kompaniyalar ──                           ── Mahalliy ──
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐     ┌────────┐┌────────┐
│ [LOGO] ││        ││        ││        ││        │     │ [LOGO] ││ [LOGO] │
│ {Nomi} ││        ││        ││        ││        │     │ {Nomi} ││ {Nomi} │
│ {Mijoz/││        ││        ││        ││        │     │ {tur}  ││ {tur}  │
│ Hamkor}││        ││        ││        ││        │     └────────┘└────────┘
│{Holat} ││        ││        ││        ││        │      2 ustun
└────────┘ 5–6 ustun                                  ── Xorijiy ──
── Xorijiy kompaniyalar ──  (bayroq emas, mamlakat     ...
   nomi matn bilan)
```
- **Holat yorlig'i:**
  - “Hozir hamkorlik qilamiz” — amaldagi;
  - “Avval hamkorlik qilganmiz” — yakunlangan.

  Yakunlangan hamkorlik hozir davom etayotgandek ko'rsatilmaydi [TALAB 0.4].
- **Munosabat turi** (“Mijoz” yoki “Hamkor”) faqat VeroLex tasdiqlagan qiymat bilan. Noma'lum bo'lsa, kompaniya nashr qilinmaydi.
- **Logo:**
  - joy balandligi desktopda 64 px, mobilda 48 px;
  - `object-fit: contain`, ichki bo'shliq 16 px;
  - logo rangi o'zgartirilmaydi (grayscale filtr yo'q);
  - `alt="{Nomi} logotipi"`.
- Sayt havolasi (bo'lsa) `rel="noopener nofollow"` bilan beriladi.
- **Bosh sahifa bloki:** 6–12 ta logo (admin “bosh sahifada ko'rsatish” belgisini qo'yadi). Avtomatik aylanadigan karusel ishlatilmaydi.

### 9.7 Vakansiyalar (`/careers.html`)
```
DESKTOP                                               MOBIL
[H1 Vakansiyalar] [Biz bilan ishlash — madaniyat]     [H1] [madaniyat]
[Filtr (ko'p bo'lsa): yo'nalish | format]             [filtr]
┌───────────────────────────────────────────────┐    ┌────────────────────┐
│ {Lavozim}                          (Batafsil) │    │ {Lavozim}          │
│ {Yo'nalish} · {Shahar} · {Format} · {Bandlik}  │    │ {Yo'nalish}        │
│ E'lon: {sana}  · Muddat: {sana, bo'lsa}        │    │ {Shahar} · {Format}│
└───────────────────────────────────────────────┘    │ {Bandlik}          │
[Bo'sh holat: “Hozircha ochiq vakansiyalar yo'q”]     │ (Batafsil)         │
                                                      └────────────────────┘
```

### 9.8 Vakansiya sahifasi va ariza (`/careers/{slug}.html`)
```
DESKTOP                                               MOBIL
[Breadcrumb] [H1 {Lavozim}]                           [H1]
[Meta: yo'nalish · shahar · format · bandlik ·        [meta ro'yxat]
 e'lon sanasi · muddat]                               (Ariza yuborish ↓)
┌──────────────────────────┬──────────────────┐      [Vazifalar]
│ Vazifalar (ro'yxat)      │ Yopishqoq panel: │      [Talablar]
│ Talablar                 │ {meta}           │      [Tajriba]
│ Zarur tajriba            │ (Ariza yuborish) │      [Tillar]
│ Til talablari            │                  │      [Sharoit]
│ Ish sharoiti             │                  │      [Haq — tasdiqlangan bo'lsa]
│ Manzil / format          │                  │      [ARIZA FORMASI]
│ Haq to'lash — FAQAT      │                  │
│ tasdiqlangan bo'lsa      │                  │
└──────────────────────────┴──────────────────┘
[ARIZA FORMASI: F.I.Sh.* | Telefon* | Email* | Vakansiya (oldindan tanlangan) |
 CV* (PDF/DOCX, ≤10 MB) | Izoh (ixtiyoriy, ≤1000) | Maxfiylik axboroti + havola |
 (Ariza yuborish)]
```
- **Yopilgan vakansiya:** sahifa saqlanadi. Yuqorida “Qabul yopilgan” banneri chiqadi, forma ko'rsatilmaydi va server ham arizani qabul qilmaydi. JobPosting schema olib tashlanadi.
- **Arxivlangan vakansiya:** ro'yxatda ko'rinmaydi. URL 410 qaytaradi yoki “Vakansiya arxivlangan” sahifasini noindex bilan ko'rsatadi.

### 9.9 Blog (hozir FAQ) va Reliz-4 dagi material sahifasi
- **Hozir.** FAQ ro'yxati: akkordeon `<button aria-expanded>` (B-14), FAQPage schema saqlanadi.
- **Reliz-4.**
  - Ro'yxat sahifasi: tur yorlig'i (Yangilik, Legal Alert, Tahlil), sana, muallif, 2 qatorli tavsif; kategoriya va sana filtri.
  - Material sahifasi: H1, sana, muallif yurist (profilga havola), tegishli xizmatlar, matn, “Tekshirilgan sana”, ulashish tugmalari, Article schema.

### 9.10 Aloqa (`/contact.html`)
```
DESKTOP                                               MOBIL
[H1 Aloqa]                                            [H1]
[2 ustun: FORMA | Telefon (tel:), Email (mailto:,     [Telefon, Email, Telegram]
 B-02), Telegram, Manzil (matn), Ish vaqti,            [Manzil, ish vaqti]
 Ijtimoiy tarmoqlar]                                   [FORMA]
[Xarita iframe (title, lazy) + “Xaritada ochish”      [Xarita + havola]
 havolasi; iframe yuklanmasa manzil matni qoladi]
```

### 9.11 Maxfiylik siyosati va 404
- **Maxfiylik:** oddiy matn shabloni. H1, “Yangilangan sana”, mundarija.
- **404:** shu tilda xabar, qidiruv (Reliz-5dan keyin), asosiy bo'limlarga havolalar va HTTP 404 status (L-04).

## 10. Modullar spetsifikatsiyasi (ma'lumot modeli va admin)

Umumiy qoidalar (NEW-029):
- **Bitta model patterni.** Har obyektda `id`, `slug`, `status`, `sort_order`, `created_at`, `updated_at`, `updated_by` maydonlari bor. Tarjima qilinadigan maydonlar har til uchun alohida saqlanadi.
- **Til bo'yicha nashr.** Har til uchun alohida `published` belgisi; obyekt bir tilda nashr qilinib, boshqasida draft turishi mumkin [DOCX §4].
- **SEO maydonlari.** Har til uchun `seo_title` va `seo_description`. Bo'sh qolsa, shablon bo'yicha avtomatik to'ldiriladi.
- **O'zgarishlar tarixi.** Kim, qachon va nimani o'zgartirgani saqlanadi [DOCX §6.2].
- **Rollar [TAKLIF; REC-014]:**
  - **Administrator** — hammasi.
  - **Muharrir** — kontent; CV va arizalarga kirish yo'q.
  - **HR** — vakansiyalar va arizalar.

### 10.1 Kompaniya [TALAB 0.3]
- **Admin.** “Biz haqimizda” sahifasining bloklari: matn, rasm, bloklar tartibi. Bloklar yoqiladi va o'chiriladi.
- **Faktlar (raqamlar) bloki.** Maydonlar: `qiymat`, `izoh ×3 til`, `tasdiq_manbasi` (ichki, nashr qilinmaydi), `tasdiqlangan` (ha/yo'q). Tasdiqlanmagan fakt nashr qilinmaydi.

### 10.2 Jamoa — `TeamMember` [TALAB 0.3]
| Maydon | Turi | 3 til | Majburiy | Izoh |
|---|---|---|---|---|
| full_name | matn | ✓ (translit farq qilishi mumkin) | ✓ | |
| slug | matn | — | ✓ | Nashrdan keyin o'zgarsa 301 |
| photo | rasm (JPEG/WebP, 4:5, ≥1200 px balandlik) | — | nashr uchun ✓ | Media kutubxonasidan |
| photo_alt | matn | ✓ | ✓ | Masalan, “{F.I.Sh.} portreti” |
| position (Lavozimi) | matn | ✓ | ✓ | Kompaniyadagi rol |
| specializations (Mutaxassisligi) | Xizmatlar bilan bog'langan ro'yxat + erkin matn | ✓ | ✓ (≥1) | NEW-019 bog'lanishi |
| professional_status | ro'yxatdan tanlov (masalan, yurist, advokat, maslahatchi, yordamchi) | ✓ (tarjimasi lug'atdan) | — | Faqat tasdiqlangan; erkin matn emas |
| bio_short | matn ≤ 300 belgi | ✓ | ✓ | Kartada ishlatilmaydi, profil uchun |
| bio | boy matn | ✓ | — | |
| education | ro'yxat (muassasa, daraja, yil) | ✓ | — | Tasdiqlangan |
| experience | matn | ✓ | — | |
| work_languages | ko'p tanlov (UZ, RU, EN, CN…) | — | ✓ | |
| publications | ro'yxat (nomi, havola, yil) | ✓ | — | E'lon qilishga ruxsat bo'lsa |
| corporate_email / phone | matn | — | — | Faqat korporativ va ruxsat bilan; shaxsiy aloqa saqlanmaydi |
| consent_publication | ha/yo'q + sana (ichki) | — | ✓ | Ommaga chiqmaydi |
| show_on_home | ha/yo'q | — | — | |
| status | draft / published / hidden | har til uchun | ✓ | Hidden — 404 yoki 410 va sitemapdan chiqadi |
| sort_order | son | — | ✓ | |

### 10.3 Vakansiyalar — `Vacancy` va `Application` [TALAB 0.2]
**Vacancy**
| Maydon | Turi | 3 til | Majburiy |
|---|---|---|---|
| title (lavozim) | matn | ✓ | ✓ |
| practice_area (yo'nalish) | xizmatga bog'lanish yoki matn | ✓ | ✓ |
| city | matn | ✓ | ✓ |
| work_format | ofis / gibrid / masofaviy | lug'at | ✓ |
| employment_type | to'liq / qisman / amaliyot / loyiha | lug'at | ✓ |
| responsibilities | ro'yxat | ✓ | ✓ |
| requirements | ro'yxat | ✓ | ✓ |
| experience_required | matn | ✓ | ✓ |
| language_requirements | matn | ✓ | — |
| conditions | ro'yxat | ✓ | — |
| location_text | matn | ✓ | — |
| published_at | sana | — | avtomatik |
| apply_until | sana | — | — |
| salary_text | matn | ✓ | — (faqat tasdiqlangan; bo'sh bo'lsa blok yo'q) |
| salary_confirmed | ha/yo'q | — | salary_text bo'lsa ✓ |
| status | draft / published / closed / archived | — | ✓ |
| recipient | HR email yoki admin navbati | — | ✓ |

**Holat jadvali**
| Holat | Ro'yxatda | Sahifa | Forma | Sitemap | JobPosting |
|---|---|---|---|---|---|
| draft | — | 404 (oldindan ko'rish faqat admin uchun) | — | — | — |
| published | ✓ | ✓ | ✓ | ✓ | ✓ (haqiqiy maydonlar bilan) |
| closed | “Yopilgan” belgisi bilan (ixtiyoriy) | ✓ + “Qabul yopilgan” | ✗ (server ham 409 qaytaradi) | — | ✗ |
| archived | — | 410 yoki noindex sahifa | ✗ | — | ✗ |

`apply_until` sanasi o'tganda vakansiya avtomatik **closed** holatiga o'tadi.

**Application**
| Maydon | Izoh |
|---|---|
| vacancy_id, vacancy_title_snapshot | Tegishli vakansiyaga bog'lanish [TALAB] |
| full_name, phone, email | Server validatsiyasi |
| cv_file | PDF/DOCX; ≤ 10 MB [TAKLIF]; kengaytma, MIME va fayl signaturasi tekshiriladi; nomi tasodifiy UUID qilib o'zgartiriladi |
| comment | ≤ 1000 belgi |
| submitted_at, source_url, lang | [TALAB]: vaqt va manba sahifa |
| consent_text_version | Qaysi maxfiylik matni ko'rsatilgani |
| status | yangi / ko'rib chiqilmoqda / suhbat / rad etildi / qabul qilindi |
| notes | HR izohi (ichki) |

**Fayl xavfsizligi [TALAB 0.2; TAKLIF]:**
- CV web root'dan tashqarida yoki yopiq bucket'da saqlanadi.
- Yuklab olish faqat HR yoki administrator sessiyasi orqali; har yuklab olish logga yoziladi.
- `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`.
- Saqlash muddati va o'chirish tartibini yurist belgilaydi (REC-015).

**Yetkazish.** Ariza bazaga saqlanadi va tanlangan qabul qiluvchiga bildirishnoma yuboriladi. Email ichida CV ilova sifatida yuborilmaydi, faqat admin panelga havola beriladi [TAKLIF].

Forma holatlari va muvaffaqiyat qoidasi — §6.5. Muvaffaqiyat xabari faqat yozuv saqlanganda chiqadi. Bildirishnoma yuborilmasa, ariza saqlangan holda qoladi va xato admin panelda ko'rinadi.

### 10.4 Hamkorlar — `Company` [TALAB 0.4]
| Maydon | Turi | 3 til | Majburiy | Ommaga chiqadimi |
|---|---|---|---|---|
| name | matn | ✓ (odatda bir xil) | ✓ | ✓ |
| logo | SVG yoki PNG (shaffof fon), ≥ 400 px kenglik | — | ✓ | ✓ |
| logo_alt | matn | ✓ | ✓ | ✓ |
| country | ISO kod + nom | lug'at | ✓ | ✓ |
| scope | mahalliy / xorijiy | — | ✓ | ✓ (guruhlash) |
| relationship_type | mijoz / hamkor (VeroLex tasdiqlaganidek) | lug'at | ✓ | ✓ |
| relationship_status | amaldagi / yakunlangan | lug'at | ✓ | ✓ |
| description | matn ≤ 200 | ✓ | — | ✓ |
| website | URL | — | — | ✓ (`nofollow`) |
| publication_permission | ha/yo'q + sana + kim bergan | — | ✓ | **✗ (ichki)** |
| permission_source | matn yoki fayl | — | — | **✗ (ichki)** |
| show_on_home | ha/yo'q | — | — | — |
| sort_order, status | | — | ✓ | — |

Nashr sharti: `publication_permission = ha` **va** `relationship_type` hamda `relationship_status` to'ldirilgan bo'lishi kerak. Aks holda admin “Nashr qilish” tugmasini faol qilmaydi.

## 11. Lokalizatsiya qoidalari

- **Interfeys matnlari** — menyu, tugmalar, forma yorliqlari va xabarlari, aria va alt, cookie va bo'sh holatlar. Ular bitta lug'at faylida saqlanadi va 3 tilda to'ldiriladi. Bitta til bo'sh qolsa, build xato beradi [TAKLIF].
- **Kontent tarjimasi.** Tarjimada maqom, tajriba yili va raqamlar o'zgarmaydi [TALAB 0.3]. Tarjima mas'uli TZ-061 bo'yicha.
- **Sana formati:**
  - UZ — `1-oktabr, 2026`;
  - RU — `1 октября 2026`;
  - EN — `1 October 2026`.

  Telefon har tilda `+998 77 143 68 88` shaklida.
- **`lang` atributi:** UZ — `uz` (lotin), RU — `ru`, EN — `en`. Kelajakda kirill yozuvidagi UZ qo'shilsa, `uz-Cyrl`.

## 12. SEO talablari (yangi va o'zgargan sahifalar)

- §8 qoidalari: URL, canonical, hreflang, sitemap va noindex.
- **Strukturali ma'lumotlar** — faqat ko'rinadigan, haqiqiy kontent bilan; rich result kafolatlanmaydi (REC-016):
  - Organization/LegalService (mavjud, NAP B-02 bo'yicha);
  - Person — profil sahifasida;
  - JobPosting — faqat published vakansiyada;
  - BreadcrumbList — barcha ichki sahifalarda;
  - Article — Reliz-4 materiallarida.
- Hamkorlar sahifasiga hamkorlik haqida alohida schema qo'shilmaydi.
- **Heading.** Bitta H1, darajalar ketma-ket (L-02).
- **Rasmlar.** `width` va `height` belgilangan, ekrandan pastdagilari `loading="lazy"`, WebP yoki AVIF. Portretlar ≤ 150 KB, logolar ≤ 30 KB [TAKLIF].
- Redizayn relizidan keyin `site_inventory.mjs` qayta ishga tushiriladi va natija bazaviy inventar bilan solishtiriladi (NEW-008).

## 13. Analitika hodisalari [TAKLIF; REC-001]

| Hodisa | Qachon | Parametrlar (PII yo'q) |
|---|---|---|
| `generate_lead` | Aloqa formasi server tomonidan qabul qilinganda | `form_id`, `page_type`, `lang` |
| `vacancy_apply` | Vakansiya arizasi saqlanganda | `vacancy_slug`, `lang` |
| `click_tel` / `click_email` / `click_telegram` | Havola bosilganda | `location` (header, footer, contact, profile) |
| `language_switch` | Til tugmasi bosilganda | `from`, `to`, `page_type` |
| `team_profile_view` | Profil ochilganda | `member_slug` (ommaviy slug) |
| `partner_site_click` | Hamkor saytiga o'tilganda | `company_slug` |

Hodisalarga ism, telefon, email, izoh matni va CV nomi yuborilmaydi.

## 14. Accessibility mezonlari [TAKLIF: WCAG 2.2 AA]

- **Kontrast:** oddiy matn ≥ 4.5:1, katta matn va UI elementlari ≥ 3:1 (§3).
- **Klaviatura:** barcha funksiyalar klaviatura bilan ishlaydi; fokus ko'rinadi; mantiqiy tartibda; menyuda tuzoq yo'q (focus trap faqat ochiq modal va menyuda).
- **Formalar:** label, xato bog'lanishi, `autocomplete` (`name`, `tel`, `email`).
- **Akkordeon va menyu:** `aria-expanded` va `aria-controls`.
- **Harakat:** `prefers-reduced-motion`.
- **Kattalashtirish:** 200 % gacha kattalashtirganda kontent yo'qolmaydi; 320 px kenglikda gorizontal skroll yo'q.
- **Sahifa tili:** `lang` to'g'ri; yordamchi matnlar shu tilda (B-13).

## 15. Umumiy qabul mezonlari [TALAB 0.1 + TAKLIF]

1. Har asosiy shablon (§9.1–§9.11) uchun desktop va mobil maketlar UZ, RU va EN tillarida tasdiqlangan.
2. Menyu va CTA'lar barcha sahifalarda bir xil; bitta ekranda bitta asosiy CTA.
3. 360–1440 px oralig'ida matn kesilmaydi va gorizontal overflow 0 (L-11).
4. Klaviatura fokusi hamma joyda ko'rinadi (L-12, fokus testi).
5. Til almashtirish har sahifada shu sahifaning boshqa tildagi versiyasiga o'tadi (L-13, Q-12).
6. Mavjud 39 URL, title, description, hreflang va JSON-LD saqlangan yoki 301 rejasi bajarilgan (NEW-008).
7. Jamoa kartasida “Lavozimi” va “Mutaxassisligi” alohida ko'rinadi; profilning o'z URLi bor (Q-09, Q-10).
8. Vakansiya ro'yxati va sahifasi ishlaydi; noto'g'ri CV rad etiladi; yopilgan vakansiyaga ariza yuborilmaydi; CVga ochiq kirish yo'q (Q-01–Q-08). Test arizasi productionga yuborilmaydi.
9. Hamkorlar mahalliy va xorijiy guruhlarga, amaldagi va yakunlangan holatlarga to'g'ri ajratilgan; logolar proporsiyasi buzilmagan; mobil ko'rinish toza (Q-15–Q-20).
10. Admin panelda qilingan o'zgarish tegishli barcha til va sahifalarda aks etadi.
11. Saytda haqiqiy bo'lmagan xodim, hamkor, logo, raqam yoki keys yo'q.
