/* ==========================================================================
   UXTIME — 站点交互 (原生 JS，替换 jQuery + responsiveSlides + magic-line)
   - 首页轮播（淡入淡出 / 自动播放 / 前后翻页 / 圆点 / 悬停暂停）
   - 滚动进入视口淡入（IntersectionObserver）
   - 全部尊重 prefers-reduced-motion
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 轮播 ---------- */
  function initSlider(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
    if (slides.length === 0) return;

    var track = root.querySelector(".slider-track");
    var index = 0;
    var timer = null;
    var interval = parseInt(root.getAttribute("data-interval"), 10) || 5000;

    // 圆点
    var dotsWrap = document.createElement("div");
    dotsWrap.className = "slider-dots";
    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "第 " + (i + 1) + " 张");
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    // 前后按钮
    var prev = document.createElement("button");
    prev.className = "slider-btn prev"; prev.type = "button";
    prev.setAttribute("aria-label", "上一张"); prev.innerHTML = "&#8249;";
    var next = document.createElement("button");
    next.className = "slider-btn next"; next.type = "button";
    next.setAttribute("aria-label", "下一张"); next.innerHTML = "&#8250;";
    prev.addEventListener("click", function () { go(index - 1); restart(); });
    next.addEventListener("click", function () { go(index + 1); restart(); });

    root.appendChild(prev);
    root.appendChild(next);
    if (slides.length > 1) root.appendChild(dotsWrap);

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
      dots.forEach(function (d, n) { d.classList.toggle("is-active", n === index); });
    }
    function start() {
      if (reduceMotion || slides.length < 2) return;
      timer = window.setInterval(function () { go(index + 1); }, interval);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });

    go(0);
    start();
  }

  /* ---------- 滚动进入视口淡入 ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal, .reveal-stagger");
    if (els.length === 0) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  function init() {
    document.querySelectorAll(".slider").forEach(initSlider);
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
