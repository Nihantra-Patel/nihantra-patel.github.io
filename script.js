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
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof Lenis === "undefined" || typeof gsap === "undefined") return;

  var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
})();

(function () {
  var heroLines = document.querySelectorAll(".hero h1 .line");
  if (!heroLines.length) return;

  heroLines.forEach(function (line) {
    var text = line.textContent;
    line.textContent = "";
    text.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? " " : ch;
      line.appendChild(span);
    });
  });

  var chars = document.querySelectorAll(".hero h1 .char");
  if (typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(chars, { yPercent: 120, opacity: 0 });
    gsap.to(chars, {
      yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out",
      stagger: 0.012, delay: 0.15
    });
  } else {
    chars.forEach(function (c) { c.style.opacity = 1; });
  }
})();

(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: function () { el.classList.add("in"); }
      });
    });
  } else if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }
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
