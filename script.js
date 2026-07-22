(function () {
  var THEME_KEY = "nihantra-patel-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  btn.addEventListener("click", function () {
    var current = root.getAttribute("data-theme") || "dark";
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  });
})();

(function () {
  var heroLines = document.querySelectorAll(".hero h1 .line");
  if (!heroLines.length) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  heroLines.forEach(function (line) {
    var text = line.textContent;
    line.textContent = "";
    text.split("").forEach(function (ch, i) {
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? " " : ch;
      if (!reduced) {
        span.style.transitionDelay = (i * 14) + "ms";
      } else {
        span.style.opacity = 1;
        span.style.transform = "none";
      }
      line.appendChild(span);
    });
  });

  if (!reduced) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.querySelectorAll(".hero h1 .char").forEach(function (c) {
          c.classList.add("in");
        });
      });
    });
  }
})();

(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();

(function () {
  if (window.matchMedia("(hover: none)").matches) return;
  var magnets = document.querySelectorAll("[data-magnet]");
  magnets.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.25;
      var y = (e.clientY - r.top - r.height / 2) * 0.25;
      el.style.transform = "translate(" + x + "px," + y + "px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "translate(0,0)";
    });
  });
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
    if (v == null) { visitLine.style.display = "none"; return; }
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
