(function () {
  var THEME_KEY = "nihantra-patel-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  btn.addEventListener("click", function () {
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  });
})();

(function () {
  var els = document.querySelectorAll("section.block");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("in-view"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function (e) { io.observe(e); });
})();

(function () {
  var API = "https://api.counterapi.dev/v1/nihantra-patel-site/";
  var LIKED_KEY = "nihantra-patel-liked";

  function bump(counter, cb) {
    fetch(API + counter + "/up")
      .then(function (r) { return r.json(); })
      .then(function (d) { cb(d.count); })
      .catch(function () { cb(null); });
  }
  function read(counter, cb) {
    fetch(API + counter + "/")
      .then(function (r) { return r.json(); })
      .then(function (d) { cb(d.count); })
      .catch(function () { cb(null); });
  }

  var visitLine = document.getElementById("visit-line");
  var visitCount = document.getElementById("visit-count");
  bump("visits", function (v) {
    if (v == null) { visitLine.setAttribute("data-hidden", "1"); return; }
    visitCount.textContent = v.toLocaleString();
  });

  var likeBtn = document.getElementById("like-btn");
  var likeCount = document.getElementById("like-count");
  read("likes", function (v) {
    if (v != null) likeCount.textContent = v.toLocaleString();
  });

  if (localStorage.getItem(LIKED_KEY) === "1") {
    likeBtn.classList.add("liked");
    likeBtn.setAttribute("aria-pressed", "true");
  }

  likeBtn.addEventListener("click", function () {
    if (localStorage.getItem(LIKED_KEY) === "1") return;
    bump("likes", function (v) {
      if (v != null) likeCount.textContent = v.toLocaleString();
    });
    localStorage.setItem(LIKED_KEY, "1");
    likeBtn.classList.add("liked");
    likeBtn.setAttribute("aria-pressed", "true");
  });
})();
