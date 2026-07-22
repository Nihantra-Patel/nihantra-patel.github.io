(function () {
  var canvas = document.getElementById("galaxy");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, stars, planets;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeStars() {
    var count = Math.round((w * h) / 2200);
    var arr = [];
    for (var i = 0; i < count; i++) {
      var bright = Math.random() < 0.12;
      arr.push({
        x: rand(0, w),
        y: rand(0, h),
        r: bright ? rand(1.4, 2.4) : rand(0.4, 1.3),
        baseAlpha: bright ? rand(0.7, 1) : rand(0.2, 0.75),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.5, 2.2),
        bright: bright
      });
    }
    return arr;
  }

  function makePlanets() {
    var palette = [
      "rgba(216,122,99,0.35)",
      "rgba(122,155,216,0.28)",
      "rgba(160,120,200,0.26)"
    ];
    var arr = [];
    for (var i = 0; i < 3; i++) {
      arr.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(60, 160),
        color: palette[i % palette.length],
        dx: rand(-0.02, 0.02),
        dy: rand(-0.015, 0.015)
      });
    }
    return arr;
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = makeStars();
    planets = makePlanets();
  }

  var t = 0;
  function frame() {
    t += 1;
    ctx.clearRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";
    planets.forEach(function (p) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
      if (p.y > h + p.r) p.y = -p.r;
      var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";

    stars.forEach(function (s) {
      var twinkle = Math.sin(t * 0.02 * s.speed + s.phase);
      var a = s.baseAlpha * (0.35 + 0.65 * ((twinkle + 1) / 2));
      if (s.bright) {
        var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        glow.addColorStop(0, "rgba(255,255,255," + (a * 0.5).toFixed(3) + ")");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(255,255,255," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(frame);
})();
