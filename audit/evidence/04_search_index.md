# Qidiruv indeksidagi bilvosita dalil (D3)

Vaqt: 2026-10-01, taxminan 13:55–14:00, Asia/Tashkent.
Vosita: Claude Code WebSearch. Qidiruv tizimi va hudud vosita tomonidan belgilanadi; hujjatlarga ko'ra natijalar AQSh hududiga moslangan.

**Cheklov:** bu Google Search Console yoki Yandex.Webmaster ma'lumoti emas. Natija indeksning bir lahzadagi va to'liq bo'lmagan ko'rinishini beradi. Sarlavha qidiruv tizimi tomonidan qayta yozilgan bo'lishi mumkin. Pastdagi “snippet xulosasi” vosita modelining qisqa bayoni, sahifa matnidan to'g'ridan-to'g'ri iqtibos emas.

## So'rovlar va verolex.uz natijalari

| So'rov | Natijadagi URL | Ko'ringan sarlavha |
|---|---|---|
| `site:verolex.uz` | https://www.verolex.uz/ | Yuridik Xizmatlar Toshkent |
| | https://www.verolex.uz/about.html | Biz Haqimizda |
| | https://www.verolex.uz/blog.html | Yuridik Blog va FAQ |
| | https://www.verolex.uz/contact.html | Aloqa - VeroLex Advisory |
| | https://verolex.uz/ru/index.html | Юридические Услуги Ташкент |
| `site:verolex.uz/ru` | https://verolex.uz/ru/ | Юридические услуги в Ташкенте — VeroLex Advisory |
| | https://verolex.uz/ru/index.html | Юридические Услуги Ташкент |
| | https://verolex.uz/ru/blog.html | Юридический Блог и FAQ |
| `site:verolex.uz/en` | verolex.uz natijasi chiqmadi | — |
| `site:www.verolex.uz` | www.verolex.uz/, /about.html, /contact.html; verolex.uz/ru/index.html, /ru/korporativ.html | (yuqoridagidek) Корпоративное право Ташкент |
| `VeroLex Advisory Tashkent юридические услуги` | https://verolex.uz/ru/index.html | VeroLex Advisory - Профессиональные Юридические Услуги |
| | https://verolex.uz/ru/ | Юридические услуги в Ташкенте — VeroLex Advisory |
| | https://verolex.uz/ru/korporativ.html | Корпоративное право Ташкент |
| | https://yandex.com/maps/org/vero_leks/213290364260/reviews/ | Больше не работает: Веро Лекс, юридические услуги, … |
| | https://verinlex.uz/en/ | Legal services in Uzbekistan (boshqa kompaniya, nomi o'xshash) |

## Kuzatuvlar va ularning chegarasi

1. **Xost bir xil emas.** UZ sahifalari indeksda `www.verolex.uz`, RU sahifalari esa `verolex.uz` xostida ko'rindi. Dastlabki auditda canonical teglari bor deb qayd etilgan, lekin ularning qiymati yozib olinmagan. www va wwwsiz versiya o'rtasidagi 301 va canonical izchilligi tekshirilishi kerak.
2. **Alias dubli.** `https://verolex.uz/ru/` va `https://verolex.uz/ru/index.html` alohida natija sifatida chiqdi. Ikki URLda turli sarlavha ko'rindi; buning sababi turli crawl vaqti yoki qidiruv tizimining sarlavhani qayta yozishi bo'lishi mumkin. `/index.html` aliasi canonical yoki 301 bilan birlashtirilishi kerak.
3. **Gipoteza, isbotlanmagan.** Dastlabki auditdagi HTTP kanalida 502 qaytargan sahifalar aynan UZ about/blog/contact edi. Indeksda aynan shu sahifalar www xostida ko'rindi. Bu bog'liqlik birinchi navbatda tekshiriladigan gipoteza, xulosa emas.
4. **EN versiya.** `site:verolex.uz/en` so'rovida natija chiqmadi. Bu EN sahifalar indeksda yo'qligini isbotlamaydi, chunki operator va vosita cheklangan. Tekshirish uchun GSC'dagi “Pages” hisobotiga qarash kerak.
5. **Lokal kartochka.** Yandex Xaritalarda “Веро Лекс, юридические услуги” kartochkasi “больше не работает” belgisi bilan chiqdi. Uning VeroLex Advisory'ga tegishliligi tasdiqlanmagan. Vosita xulosasida sharhlarda boshqa yo'nalishlar va ismlar tilga olingan; bu boshqa tashkilot bo'lishi mumkin. Brend qidiruvida chalkashlik bo'lmasligi uchun VeroLex Yandex Biznes, Google Business Profile va 2GIS kartochkalarini tekshirishi kerak.
6. **Snippet xulosasidagi da'volar (D3, tasdiqlanmagan).** Bir vaqtning o'zida “2020-yildan beri”, “10+ yillik tajriba”, “24/7”, “3 til”, “100% onlayn” va “birinchi konsultatsiya bepul” degan iboralar uchradi. “2020-yildan” va “10+ yil” birga ishlatilsa, o'quvchi ularni ziddiyat deb tushunishi mumkin: biri kompaniya yoshini, ikkinchisi jamoa tajribasini bildirishi mumkin. Ifodani kompaniya tasdiqlashi va aniq yozishi kerak.
7. Snippetlarda telefon `+998 77 143 68 88`, manzil “Abdulla Qodiriy ko'chasi 28A, Yunusobod, Markaz-4” va email `verolexadvisory@gmail.com` uchradi. Dastlabki auditga ko'ra ayrim sahifalarda esa `info@verolex.uz` ishlatiladi.
