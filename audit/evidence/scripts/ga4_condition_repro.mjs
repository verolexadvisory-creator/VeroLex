// A01 reproduksiyasi. Bu production fayl EMAS: dastlabki auditda
// https://verolex.uz/assets/js/analytics.js?v=8 dan iqtibos qilingan shart
// mantiqi qayta yaratilgan. Production faylni qayta yuklab bo'lmadi (tarmoq cheklovi).
const GA4_ID = 'G-N4Z7XF5GGK';

// Kuzatilgan shart (dastlabki audit bo'yicha):
const hasGA4_observed = Boolean(GA4_ID && GA4_ID !== 'G-N4Z7XF5GGK');

// Taklif etilgan shart: faqat bo'sh qiymat yoki namunaviy "G-XXXXXXXXXX" ko'rinishini rad etadi.
const isPlaceholder = (id) => !id || /^G-X+$/i.test(id);
const hasGA4_fixed = !isPlaceholder(GA4_ID);

console.log(JSON.stringify({
  GA4_ID,
  hasGA4_kuzatilgan_shart: hasGA4_observed,
  hasGA4_taklif_etilgan_shart: hasGA4_fixed,
  namunaviy_id_rad_etiladimi: isPlaceholder('G-XXXXXXXXXX'),
  bosh_qiymat_rad_etiladimi: isPlaceholder(''),
}, null, 2));
