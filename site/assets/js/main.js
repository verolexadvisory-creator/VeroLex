/* VeroLex Advisory — umumiy skript */
(function () {
  "use strict";

  /* ============ TIL TIZIMI (uz / ru / en) ============ */
  var LANGS = ["uz", "ru", "en"];
  /* sahifa tili URL manzilidan aniqlanadi (/, /ru/, /en/) */
  var pageLang = document.documentElement.getAttribute("lang");
  var lang = LANGS.indexOf(pageLang) > -1 ? pageLang : "uz";
  var ROOT = document.documentElement.getAttribute("data-root") || "";

  function t(key) {
    var d = (window.I18N && window.I18N[lang]) || {};
    return d[key] != null ? d[key] : null;
  }

  function applyLang(next) {
    lang = next;
    try { localStorage.setItem("vl_lang", lang); } catch (e) {}
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-ph"));
      if (v != null) el.setAttribute("placeholder", v);
    });
    /* sahifa sarlavhasi HTML da tayyor holda turadi (SEO uchun) */
    document.querySelectorAll(".lang button, .lang-m button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
  }

  /* til almashtirish — mos tildagi sahifaga oʻtish */
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      var to = b.getAttribute("data-lang");
      if (to === lang || LANGS.indexOf(to) === -1) return;
      var file = (location.pathname.split("/").pop() || "index.html");
      if (file.indexOf(".html") === -1) file = "index.html";
      try { localStorage.setItem("vl_lang", to); } catch (e) {}
      location.href = ROOT + (to === "uz" ? "" : to + "/") + file;
    });
  });

  /* ============ HEADER ============ */
  var header = document.querySelector(".header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobil menyu */
  var drawer = document.getElementById("drawer");
  var burger = document.getElementById("burger");
  var drawerClose = document.getElementById("drawerClose");
  if (burger && drawer) {
    burger.addEventListener("click", function () { drawer.classList.add("open"); document.body.style.overflow = "hidden"; });
  }
  function closeDrawer() { if (drawer) { drawer.classList.remove("open"); document.body.style.overflow = ""; } }
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  /* menyudagi havolalar bosilganda oyna yopiladi — "Xizmatlar" ochish/yopish tugmasi bundan mustasno */
  if (drawer) drawer.querySelectorAll("a").forEach(function (a) {
    if (a.parentElement && a.parentElement.id === "mServices") return;
    a.addEventListener("click", closeDrawer);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });
  var mDd = document.getElementById("mServices");
  if (mDd) {
    mDd.querySelector("a").addEventListener("click", function (e) {
      e.preventDefault();
      mDd.classList.toggle("open");
    });
  }

  /* ============ SKROLL REVEAL ============ */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ============ FAQ AKKORDEON ============ */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("active");
      document.querySelectorAll(".faq-item.active").forEach(function (o) {
        o.classList.remove("active");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("active");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ============ FORMA YUBORISH (Telegram orqali) ============ */
  document.querySelectorAll("form.vl-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      var status = form.querySelector(".f-status");
      var data = {
        name: (form.querySelector("[name=name]") || {}).value || "",
        phone: (form.querySelector("[name=phone]") || {}).value || "",
        email: (form.querySelector("[name=email]") || {}).value || "",
        message: (form.querySelector("[name=message]") || {}).value || "",
        website: (form.querySelector("[name=website]") || {}).value || "", // honeypot
        page: (location.pathname.split("/").pop() || "index.html"),
        lang: lang
      };
      if (!data.name.trim() || !data.phone.trim()) {
        status.className = "f-status err";
        status.textContent = t("msg_fill") || "Iltimos, ism va telefon raqamini kiriting.";
        return;
      }
      btn.classList.add("loading");
      btn.disabled = true;
      status.className = "f-status";

      fetch(ROOT + "send.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            status.className = "f-status ok";
            status.textContent = t("msg_success") || "Xabaringiz yuborildi!";
            if (typeof window.vlTrackLead === "function") {
              window.vlTrackLead({ page: data.page, lang: data.lang });
            }
            form.reset();
          } else { throw new Error("fail"); }
        })
        .catch(function () {
          status.className = "f-status err";
          status.textContent = t("msg_error") || "Xatolik yuz berdi. Qayta urinib ko'ring.";
        })
        .finally(function () {
          btn.classList.remove("loading");
          btn.disabled = false;
        });
    });
  });

  /* ============ YIL ============ */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* boshlang'ich til */
  applyLang(lang);
})();
