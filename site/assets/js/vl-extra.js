/* VeroLex Advisory — qoʻshimcha interaktiv elementlar
   (skroll indikatori va "yuqoriga" tugmasi). main.js ga tegilmagan. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- skroll indikatori ---- */
  var bar = document.createElement("div");
  bar.className = "vl-progress";
  document.body.appendChild(bar);

  /* ---- "yuqoriga" tugmasi ---- */
  var top = document.createElement("button");
  top.className = "vl-top";
  top.type = "button";
  top.setAttribute("aria-label", "Sahifa boshiga qaytish");
  top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(top);
  top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });


  /* ---- bosh sahifa kirish animatsiyasi ---- */
  var intro = document.getElementById("vlIntro");
  if (intro) {
    if (reduced) { intro.remove(); }
    else { window.setTimeout(function () { intro.remove(); }, 2900); }
  }

  var ticking = false;
  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var y = window.scrollY || doc.scrollTop;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    top.classList.toggle("show", y > 600);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();
