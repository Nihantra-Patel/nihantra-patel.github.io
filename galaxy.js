(function () {
  var canvas = document.getElementById("galaxy");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h;
  var layers = [];
  var nebulae = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeStarLayer(count, rMin, rMax, aMin, aMax, speed) {
    var arr = [];
    for (var i = 0; i < count; i++) {
      arr.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(rMin, rMax),
        baseAlpha: rand(aMin, aMax),
        phase: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.4, 1.6),
        driftX: rand(-speed, speed),
        driftY: rand(-speed * 0.4, speed * 0.4)
      });
    }
    return arr;
  }

  function makeNebulae() {
    var palette = [
      { c1: "rgba(88,63,140,0.22)", c2: "rgba(40,20,70,0)" },
      { c1: "rgba(40,90,140,0.16)", c2: "rgba(15,35,60,0)" },
      { c1: "rgba(150,70,100,0.14)", c2: "rgba(60,20,40,0)" }
    ];
    var arr = [];
    for (var i = 0; i < 4; i++) {
      var p = palette[i % palette.length];
      arr.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(Math.min(w, h) * 0.35, Math.min(w, h) * 0.7),
        c1: p.c1,
        c2: p.c2,
        dx: rand(-0.015, 0.015),
        dy: rand(-0.01, 0.01)
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

    var density = (w * h) / 1000000;
    layers = [
      makeStarLayer(Math.round(90 * density), 0.3, 0.8, 0.15, 0.5, 0.02),
      makeStarLayer(Math.round(60 * density), 0.6, 1.3, 0.35, 0.8, 0.05),
      makeStarLayer(Math.round(24 * density), 1.1, 2.2, 0.55, 1, 0.09)
    ];
    nebulae = makeNebulae();
  }

  var t = 0;
  function frame() {
    t += 1;

    ctx.fillStyle = "#04050b";
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";
    nebulae.forEach(function (n) {
      n.x += n.dx;
      n.y += n.dy;
      if (n.x < -n.r) n.x = w + n.r;
      if (n.x > w + n.r) n.x = -n.r;
      if (n.y < -n.r) n.y = h + n.r;
      if (n.y > h + n.r) n.y = -n.r;
      var grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.c1);
      grad.addColorStop(1, n.c2);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";

    layers.forEach(function (stars) {
      stars.forEach(function (s) {
        s.x += s.driftX;
        s.y += s.driftY;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        var twinkle = Math.sin(t * 0.02 * s.twinkleSpeed + s.phase);
        var a = s.baseAlpha * (0.5 + 0.5 * ((twinkle + 1) / 2));

        if (s.r > 1.4) {
          var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          glow.addColorStop(0, "rgba(210,225,255," + (a * 0.35).toFixed(3) + ")");
          glow.addColorStop(1, "rgba(210,225,255,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "rgba(255,255,255," + a.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(frame);
})();
