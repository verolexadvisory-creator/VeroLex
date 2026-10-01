# Audit dalillari

Bu papkada 2026-10-01 auditining dalil fayllari va qayta ishga tushiriladigan tekshiruv skriptlari bor.

## Fayllar

| Fayl | Mazmuni | Test |
|---|---|---|
| `00_session_env.txt` | Muhit, vositalar versiyasi, `verolex.uz` ga ulanish bloklangani (HTTP 403 / EGRESS_BLOCKED) | T-04, T-05, T-10 |
| `01_repo_inventory.txt` | Repository tarkibi: faqat README, sayt kodi yo'q; README'dagi kontentga oid faktlar | T-03 |
| `02_docx_structure.txt` | DOCX bo'limlari va jadvallari | T-01 |
| `03_pdf_pages.md` | PDF sahifalari indeksi va hujjatdagi bo'shliqlar | T-02 |
| `04_search_index.md` | Qidiruv indeksidagi URLlar, xostlar va sarlavhalar (bilvosita dalil) | T-06 |
| `05_contrast.json` | Taklif etilgan palitraning WCAG kontrast hisobi (26 juftlik) | T-07 |
| `06_ga4_condition_repro.txt` | GA4 yoqilish sharti mantiqining reproduksiyasi (production fayli emas) | T-08 |
| `07_selftest_fixture.txt` | Skriptlarning sun'iy fixture saytdagi o'z testi: 17/17 PASS | T-09 |
| `live/` | (hali yo'q) Jonli sayt tekshiruvi natijalari — tarmoq ochilgach yaratiladi | L-01–L-28 |

## Skriptlar (`scripts/`)

| Skript | Vazifasi |
|---|---|
| `site_inventory.mjs` | robots, sitemap, har URL: redirect zanjiri, status, title, description, H1, heading, canonical, hreflang (qaytish havolalari bilan), OG, JSON-LD, emaillar (raw, DOM, JSON-LD), aliaslar, haqiqiy 404, ichki havolalar, bir xil domendagi JS'dagi analitika ID'lari va shartlari |
| `ui_checks.mjs` | 4 viewport (skrinshot, overflow), mobil menyu, klaviatura fokusi, til almashtirish (back, forward, reload), FAQ, aria/alt lokalizatsiyasi, reduced-motion, tel/mailto/Telegram/xarita, forma ssenariylari S1–S7 |
| `contrast.mjs` | Palitra kontrasti |
| `ga4_condition_repro.mjs` | GA4 sharti reproduksiyasi |
| `selftest.mjs` | Skriptlarni `fixture/` sun'iy saytida tekshiradi (tarmoqsiz) |
| `lib.mjs` | Umumiy yordamchi funksiyalar va xavfsiz marshrutlash |

### Xavfsizlik

- Brauzer ichidan yuborilgan GET bo'lmagan barcha so'rovlar (POST va boshqalar) **mock** qilinadi. Ular serverga yetmaydi.
- Tashqi forma backendlari (masalan, `api.telegram.org`) va analitika “hit”lari (`g/collect`, Ads, Metrika) **abort** qilinadi va logga yoziladi.
- Forma ssenariylarida sahifa yuklangandan keyin faqat statik resurslar (css, js, rasm, shrift) tarmoqqa chiqadi.
- So'rovlar ko'pi bilan 3 parallel va kutish bilan yuboriladi. Admin manzillari skaner qilinmaydi.
- `selftest.mjs` buni server tomonidagi hisoblagich bilan tekshiradi: GET bo'lmagan so'rov 0 ta, `/api/` so'rovi 0 ta.

### Ishga tushirish

```bash
cd audit/evidence/scripts
npm install
node selftest.mjs
node site_inventory.mjs --base https://verolex.uz --out ../live
node ui_checks.mjs --base https://verolex.uz --out ../live --browser chromium
```

Qo'shimcha parametrlar:
- `--concurrency 2` — parallel so'rovlar soni, ko'pi bilan 3;
- `--delay 400` — so'rovlar orasidagi kutish (ms);
- `--pages "/,/ru/,…"` — tekshiriladigan sahifalar;
- `--browser firefox|webkit`;
- `--skip-forms`, `--skip-viewports`.

Staging muhiti bo'lsa, skriptlarni avval stagingda ishga tushirish tavsiya etiladi.
