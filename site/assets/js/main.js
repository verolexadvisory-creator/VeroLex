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
      var file = (location.pathname.split("/").pop() || "");
      /* bosh sahifa canonical manzili katalog ("/", "/ru/") — index.html ga o'tmaymiz */
      if (file.indexOf(".html") === -1 || file === "index.html") file = "";
      /* kompyuterda faylni to'g'ridan-to'g'ri ochganda (file://) papka emas, index.html kerak */
      if (!file && location.protocol === "file:") file = "index.html";
      try { localStorage.setItem("vl_lang", to); } catch (e) {}
      location.href = (ROOT + (to === "uz" ? "" : to + "/") + file) || "./";
    });
  });

  /* ============ LOKAL KO'RISH (file://) ============ */
  /* Serverda "./" va "../ru/" kabi havolalar index.html ni ochadi; kompyuterda faylni
     to'g'ridan-to'g'ri ochganda esa papka ro'yxati chiqadi. Faqat file:// da index.html qo'shamiz. */
  if (location.protocol === "file:") {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (/^(https?:|mailto:|tel:|#)/i.test(h)) return;
      var m = h.match(/^([^#?]*?)(\/?)([#?].*)?$/);
      if (m && (m[1] === "." || m[1] === ".." || m[2] === "/" || m[1] === "")) {
        var base = m[1] === "" ? "" : m[1].replace(/\/?$/, "/");
        if (m[1] === "" && !m[3]) return;
        a.setAttribute("href", base + "index.html" + (m[3] || ""));
      }
    });
  }

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
    burger.addEventListener("click", function () {
      drawer.classList.add("open");
      document.body.style.overflow = "hidden";
      burger.setAttribute("aria-expanded", "true");
      if (drawerClose) drawerClose.focus();
    });
  }
  function closeDrawer() {
    if (!drawer || !drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    document.body.style.overflow = "";
    if (burger) { burger.setAttribute("aria-expanded", "false"); burger.focus(); }
  }
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
      var isOpen = mDd.classList.toggle("open");
      this.setAttribute("aria-expanded", isOpen ? "true" : "false");
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
  document.querySelectorAll(".faq-item").forEach(function (item, i) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    /* ekran o'quvchilar uchun ochiq/yopiq holat */
    if (!a.id) a.id = "faq-a-" + (i + 1);
    q.setAttribute("aria-controls", a.id);
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", function () {
      var open = item.classList.contains("active");
      document.querySelectorAll(".faq-item.active").forEach(function (o) {
        o.classList.remove("active");
        o.querySelector(".faq-a").style.maxHeight = null;
        var oq = o.querySelector(".faq-q");
        if (oq) oq.setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("active");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ============ FORMA YUBORISH (Telegram orqali) ============ */
  /* maydon darajasidagi xato: aria-invalid + aria-describedby bilan bog'langan matn */
  function setFieldError(input, msg) {
    if (!input) return;
    var errId = input.id ? input.id + "-err" : "";
    var box = errId ? document.getElementById(errId) : null;
    if (msg) {
      input.setAttribute("aria-invalid", "true");
      if (!box && errId) {
        box = document.createElement("span");
        box.className = "f-err";
        box.id = errId;
        input.insertAdjacentElement("afterend", box);
      }
      if (box) { box.textContent = msg; input.setAttribute("aria-describedby", errId); }
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      if (box) box.remove();
    }
  }
  /* send.php bilan bir xil qoidalar: ism >= 2 belgi, telefonda 9–15 raqam, email ixtiyoriy */
  function validateForm(form) {
    var f = {
      name: form.querySelector("[name=name]"),
      phone: form.querySelector("[name=phone]"),
      email: form.querySelector("[name=email]")
    };
    var errors = [];
    var name = f.name ? f.name.value.trim() : "";
    var digits = f.phone ? f.phone.value.replace(/\D/g, "") : "";
    var email = f.email ? f.email.value.trim() : "";
    setFieldError(f.name, name.length < 2 ? (t("msg_name") || "Ismingizni kiriting.") : "");
    if (name.length < 2) errors.push(f.name);
    setFieldError(f.phone, (digits.length < 9 || digits.length > 15) ? (t("msg_phone") || "Telefon raqamini to'liq kiriting, masalan +998 90 123 45 67.") : "");
    if (digits.length < 9 || digits.length > 15) errors.push(f.phone);
    var emailBad = email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    setFieldError(f.email, emailBad ? (t("msg_email") || "Email manzili noto'g'ri.") : "");
    if (emailBad) errors.push(f.email);
    return errors.filter(Boolean);
  }

  document.querySelectorAll("form.vl-form").forEach(function (form) {
    /* maydon tuzatilganda xato matnini olib tashlash */
    form.addEventListener("input", function (ev) {
      if (ev.target && ev.target.getAttribute("aria-invalid") === "true") setFieldError(ev.target, "");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      var status = form.querySelector(".f-status");
      if (btn.disabled) return; /* takroriy yuborishdan himoya */
      var data = {
        name: (form.querySelector("[name=name]") || {}).value || "",
        phone: (form.querySelector("[name=phone]") || {}).value || "",
        email: (form.querySelector("[name=email]") || {}).value || "",
        message: (form.querySelector("[name=message]") || {}).value || "",
        website: (form.querySelector("[name=website]") || {}).value || "", // honeypot
        page: (location.pathname.split("/").pop() || "index.html"),
        lang: lang
      };
      var invalid = validateForm(form);
      if (invalid.length) {
        status.className = "f-status err";
        status.textContent = t("msg_check") || t("msg_fill") || "Iltimos, belgilangan maydonlarni tekshiring.";
        invalid[0].focus();
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
          } else {
            var err = new Error("fail");
            err.code = res && res.error;
            throw err;
          }
        })
        .catch(function (err) {
          /* server xato kodiga mos xabar (send.php: validation | rate | config | telegram) */
          var key = { validation: "msg_invalid", rate: "msg_rate" }[err && err.code] || "msg_error";
          status.className = "f-status err";
          status.textContent = t(key) || t("msg_error") || "Xatolik yuz berdi. Qayta urinib ko'ring.";
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
