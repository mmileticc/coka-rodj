/*
 * Pozadinski efekti: svetlucavi glitter (canvas) i odsjaji disko kugle.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Glitter ---------- */
  function Glitter(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.running = false;
    this.party = false;
    var self = this;
    this._loop = function (t) { self._frame(t); };
    this.resize();
    window.addEventListener("resize", function () { self.resize(); });
  }

  var COLORS = ["255,255,255", "214,214,228", "190,190,205", "255,150,205"];

  Glitter.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth, h = window.innerHeight;
    this.w = w; this.h = h;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.min(170, Math.round((w * h) / 8500));
    this.particles = [];
    for (var i = 0; i < count; i++) this.particles.push(this._make(true));
    if (!this.running) this._draw(0);
  };

  Glitter.prototype._make = function (anywhere) {
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : -5,
      r: 0.4 + Math.random() * 1.5,
      vy: 4 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      freq: 0.6 + Math.random() * 2.2,
      c: COLORS[(Math.random() * (Math.random() < 0.15 ? 4 : 3)) | 0],
    };
  };

  Glitter.prototype.start = function () {
    if (this.running || reduceMotion) return;
    this.running = true;
    this.last = 0;
    requestAnimationFrame(this._loop);
  };
  Glitter.prototype.stop = function () { this.running = false; };

  Glitter.prototype._frame = function (t) {
    if (!this.running) return;
    var dt = this.last ? Math.min((t - this.last) / 1000, 0.1) : 0;
    this.last = t;
    var mult = this.party ? 3 : 1;
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      p.y += p.vy * dt * mult;
      if (p.y > this.h + 5) this.particles[i] = this._make(false);
    }
    this._draw(t / 1000);
    requestAnimationFrame(this._loop);
  };

  Glitter.prototype._draw = function (time) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var tw = 0.5 + 0.5 * Math.sin(time * p.freq * (this.party ? 3 : 1) + p.phase);
      var a = 0.15 + 0.85 * tw * tw;
      ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      if (tw > 0.93 && p.r > 1.1) {
        // zvezdasti odbljesak
        var len = p.r * 4 * tw;
        ctx.strokeStyle = "rgba(" + p.c + "," + (a * 0.7).toFixed(3) + ")";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x - len, p.y); ctx.lineTo(p.x + len, p.y);
        ctx.moveTo(p.x, p.y - len); ctx.lineTo(p.x, p.y + len);
        ctx.stroke();
      }
    }
  };

  /* ---------- Odsjaji disko kugle ---------- */
  function buildReflections(container) {
    var n = window.innerWidth < 600 ? 14 : 26;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      var size = 4 + Math.random() * 10;
      s.style.setProperty("--x", (Math.random() * 100).toFixed(1) + "vw");
      s.style.setProperty("--y", (Math.random() * 100).toFixed(1) + "vh");
      s.style.setProperty("--size", size.toFixed(1) + "px");
      s.style.setProperty("--dur", (9 + Math.random() * 12).toFixed(1) + "s");
      s.style.setProperty("--delay", (-Math.random() * 20).toFixed(1) + "s");
      s.style.setProperty("--drift", (20 + Math.random() * 40).toFixed(1) + "vw");
      s.style.setProperty("--hue", Math.random() < 0.3 ? "330" : "240");
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  window.Effects = {
    reduceMotion: reduceMotion,
    Glitter: Glitter,
    buildReflections: buildReflections,
  };
})();
