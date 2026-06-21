/* ==========================================================================
   UXTIME — 共享页头 / 页脚组件注入 (原生 JS，零依赖)
   解决 44 个页面导航/页脚重复维护问题：改这一处即全站生效。
   用法：页面 <body data-nav="anli|fuwu|news|we"> 标记当前栏目；
   放置挂载点 <header data-site-header></header> / <footer data-site-footer></footer>
   ========================================================================== */
(function () {
  "use strict";

  var NAV = [
    { key: "anli", href: "anli-all.html", label: "案例" },
    { key: "fuwu", href: "fuwu.html",     label: "服务" },
    { key: "news", href: "xianyu.html",   label: "新闻" },
    { key: "we",   href: "we.html",       label: "我们" }
  ];

  var current = document.body.getAttribute("data-nav") || "";

  function headerHTML() {
    var links = NAV.map(function (item) {
      var active = item.key === current ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + active + '>' + item.label + "</a>";
    }).join("");

    return (
      '<div class="nav-inner">' +
        '<a class="brand" href="index.html" aria-label="UXTIME DESIGN 首页">' +
          'UXTIME<span class="dot">.</span>' +
          '<span class="brand-sub">沐川系设计</span>' +
        "</a>" +
        '<button class="nav-toggle" type="button" aria-label="打开菜单" aria-expanded="false"><span></span></button>' +
        '<nav class="nav-links" aria-label="主导航">' + links + "</nav>" +
      "</div>"
    );
  }

  function footerHTML() {
    return (
      '<div class="footer-inner">' +
        '<div>' +
          '<div class="footer-brand">UXTIME<span class="dot">.</span></div>' +
          '<p class="footer-meta">CopyRight 2023 Uxtime Design · All Rights Reserved.<br>' +
          'ICP备08003561号 · 微信 414504566 · ' +
          '<a href="mailto:Jet.jiang@uxtime.com">Jet.jiang@uxtime.com</a></p>' +
        "</div>" +
        '<nav class="footer-links" aria-label="页脚导航">' +
          '<a href="index.html">Home</a>' +
          '<a href="anli-all.html">Portfolio</a>' +
          '<a href="we_connect.html">Contact</a>' +
        "</nav>" +
      "</div>"
    );
  }

  var header = document.querySelector("[data-site-header]");
  if (header) {
    header.classList.add("site-header");
    header.innerHTML = headerHTML();

    var toggle = header.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      });
      // 点击导航链接后收起移动端菜单
      header.querySelectorAll(".nav-links a").forEach(function (a) {
        a.addEventListener("click", function () {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  var footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.classList.add("site-footer");
    footer.innerHTML = footerHTML();
  }
})();
