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

  var GA4_ID    = "G-N4Z7XF5GGK";        // production'dagi ID (2026-10-01 auditida ko'rilgan) — GA4 hisobida tasdiqlang
  var ADS_ID    = "AW-17593861057";
  var ADS_LABEL = "";                    // <-- ixtiyoriy

  /* Faqat namunaviy "G-XXXXXXXXXX" yoki bo'sh qiymat rad etiladi.
     DIQQAT: bu yerda ID ni o'zi bilan solishtirmang (2026-10 auditidagi xato). */
  var hasGA4 = /^G-[A-Z0-9]{6,}$/.test(GA4_ID) && !/^G-X+$/.test(GA4_ID);
  var hasAds = ADS_ID.indexOf("AW-") === 0;
  if (!hasGA4 && !hasAds) return;

  /* ---------- gtag.js ni yuklash ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  /* ---------- Cookie roziligi (Google Consent Mode v2) ----------
     Rozilik berilmaguncha analitika va reklama cookie'lari ishlatilmaydi.
     Tanlov localStorage'da "vl_consent" kalitida saqlanadi: "granted" | "denied". */
  var CONSENT_KEY = "vl_consent";
  function readConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function consentState(v) {
    var g = v === "granted" ? "granted" : "denied";
    return { ad_storage: g, ad_user_data: g, ad_personalization: g, analytics_storage: g };
  }
  var stored = readConsent();
  var defaults = consentState(stored);
  defaults.wait_for_update = 500;
  gtag("consent", "default", defaults);

  var CONSENT_TEXT = {
    uz: { msg: "Sayt tashriflar statistikasini yuritish uchun cookie fayllardan foydalanadi (Google Analytics, Google Ads). Batafsil:", link: "maxfiylik siyosati", ok: "Qabul qilish", no: "Rad etish" },
    ru: { msg: "Сайт использует cookie для статистики посещений (Google Analytics, Google Ads). Подробнее:", link: "политика конфиденциальности", ok: "Принять", no: "Отклонить" },
    en: { msg: "This website uses cookies to measure visits (Google Analytics, Google Ads). Learn more:", link: "Privacy Policy", ok: "Accept", no: "Decline" }
  };
  function saveConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
    gtag("consent", "update", consentState(v));
  }
  function showConsentBanner() {
    if (document.getElementById("vlConsent")) return;
    var lang = document.documentElement.getAttribute("lang") || "uz";
    var t = CONSENT_TEXT[lang] || CONSENT_TEXT.uz;
    var root = document.documentElement.getAttribute("data-root") || "";
    var box = document.createElement("div");
    box.className = "vl-consent";
    box.id = "vlConsent";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Cookie");
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(t.msg + " "));
    var a = document.createElement("a");
    a.href = root + (lang === "uz" ? "" : lang + "/") + "privacy.html";
    a.textContent = t.link;
    p.appendChild(a);
    p.appendChild(document.createTextNode("."));
    var btns = document.createElement("div");
    btns.className = "vl-consent-btns";
    function mk(label, cls, value) {
      var b = document.createElement("button");
      b.type = "button"; b.className = cls; b.textContent = label;
      b.addEventListener("click", function () { saveConsent(value); box.remove(); });
      return b;
    }
    btns.appendChild(mk(t.no, "vl-decline", "denied"));
    btns.appendChild(mk(t.ok, "vl-accept", "granted"));
    box.appendChild(p);
    box.appendChild(btns);
    document.body.appendChild(box);
  }
  function initConsentUi() {
    if (!stored) showConsentBanner();
    /* maxfiylik sahifasidagi "Cookie sozlamalari" tugmasi */
    document.querySelectorAll("[data-consent-open]").forEach(function (b) {
      b.addEventListener("click", showConsentBanner);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initConsentUi);
  else initConsentUi();

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
