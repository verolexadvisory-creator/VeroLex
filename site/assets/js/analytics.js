/* ============================================================
   VeroLex Advisory — Google Analytics 4 va Google Ads
   ------------------------------------------------------------
   SOZLASH — faqat quyidagi uch qatorni tahrirlang.

   1) GA4_ID — Google Analytics 4 oʻlchov identifikatori.
      Qayerdan olinadi: analytics.google.com → Администратор →
      Потоки данных → verolex.uz → "Идентификатор потока данных"
      yonidagi G- bilan boshlanuvchi kod.

   2) ADS_ID — Google Ads hisoblagichi (Tag Assistant koʻrsatgan).

   3) ADS_LABEL — Google Ads konversiya yorligʻi. Google Ads →
      Цели → Конверсии → "Отправка формы" → Настроить тег →
      u yerdagi send_to qiymati "AW-17593861057/AbCdEf..." koʻrinishida
      boʻladi. Faqat chiziqdan keyingi qismini yozing.
      Boʻsh qoldirilsa, Ads konversiyasi yuborilmaydi (xato chiqmaydi).
   ============================================================ */
(function () {
  "use strict";

  var GA4_ID    = "G-XXXXXXXXXX";        // <-- toʻldiring
  var ADS_ID    = "AW-17593861057";
  var ADS_LABEL = "";                    // <-- ixtiyoriy

  var hasGA4 = GA4_ID.indexOf("G-") === 0 && GA4_ID.indexOf("X") === -1;
  var hasAds = ADS_ID.indexOf("AW-") === 0;
  if (!hasGA4 && !hasAds) return;

  /* ---------- gtag.js ni yuklash ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + (hasGA4 ? GA4_ID : ADS_ID);
  document.head.appendChild(s);

  gtag("js", new Date());
  if (hasGA4) {
    gtag("config", GA4_ID, {
      page_title: document.title,
      page_language: document.documentElement.getAttribute("lang") || "uz"
    });
  }
  if (hasAds) gtag("config", ADS_ID);

  /* ---------- Umumiy hodisa yuborish ---------- */
  function track(name, params) {
    params = params || {};
    params.page_language = document.documentElement.getAttribute("lang") || "uz";
    params.page_path = location.pathname;
    try { gtag("event", name, params); } catch (e) {}
  }
  window.vlTrack = track;

  /* ---------- Murojaat yuborilganda (asosiy maqsad) ---------- */
  window.vlTrackLead = function (info) {
    info = info || {};
    track("generate_lead", {
      form_page: info.page || location.pathname,
      form_language: info.lang || "uz",
      value: 1,
      currency: "UZS"
    });
    if (hasAds && ADS_LABEL) {
      gtag("event", "conversion", { send_to: ADS_ID + "/" + ADS_LABEL, value: 1, currency: "UZS" });
    }
  };

  /* ---------- Aloqa havolalari ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";

    if (href.indexOf("tel:") === 0) {
      track("contact_click", { method: "phone", link_url: href });
    } else if (href.indexOf("mailto:") === 0) {
      track("contact_click", { method: "email" });
    } else if (href.indexOf("t.me/") > -1) {
      track("contact_click", { method: "telegram", link_url: href });
    } else if (href.indexOf("instagram.com") > -1 || href.indexOf("facebook.com") > -1 ||
               href.indexOf("youtube.com") > -1 || href.indexOf("linkedin.com") > -1) {
      track("social_click", { link_url: href });
    } else if (href.indexOf("google.com/maps") > -1) {
      track("map_click", {});
    }
  }, true);

  /* ---------- Til almashtirish ---------- */
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      track("language_switch", { language_to: b.getAttribute("data-lang") });
    });
  });

  /* ---------- Savol-javob ochilishi (qiziqishni oʻlchash) ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var el = q.querySelector("[data-i18n]");
      track("faq_open", { faq_question: (el ? el.textContent : "").slice(0, 90) });
    });
  });
})();
