/*
 * Disko kugla iscrtana na <canvas>-u.
 * Kugla je podeljena na pločice (geografska širina/dužina), rotira se oko
 * vertikalne ose i svaka pločica se senči prema svetlu + nasumično zasvetluca.
 */
(function () {
  "use strict";

  var LIGHT = normalize([-0.45, 0.6, 0.75]);
  var VIEW = [0, 0, 1];
  var HALF = normalize([LIGHT[0] + VIEW[0], LIGHT[1] + VIEW[1], LIGHT[2] + VIEW[2]]);

  function normalize(v) {
    var l = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  // Deterministički "random" po pločici, da se šara ne menja iz frejma u frejm
  function hash(i, j) {
    var x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function DiscoBall(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.rows = opts.rows || 18;
    this.speed = opts.speed || 0.35;     // radijana u sekundi
    this.targetSpeed = this.speed;
    this.baseSpeed = this.speed;
    this.rot = 0;
    this.time = 0;
    this.last = 0;
    this.running = false;
    this.party = false;
    this.cssSize = 0;
    this._buildTiles();
    this.resize();
    var self = this;
    this._loop = function (t) { self._frame(t); };
  }

  DiscoBall.prototype._buildTiles = function () {
    var rows = this.rows;
    var tiles = [];
    for (var i = 0; i < rows; i++) {
      var lat0 = -Math.PI / 2 + (i * Math.PI) / rows;
      var lat1 = lat0 + Math.PI / rows;
      var latMid = (lat0 + lat1) / 2;
      var cols = Math.max(6, Math.round(2 * rows * Math.cos(latMid)));
      for (var j = 0; j < cols; j++) {
        tiles.push({
          lat0: lat0, lat1: lat1, latMid: latMid,
          lon: (j * 2 * Math.PI) / cols,
          dLon: (2 * Math.PI) / cols,
          seed: hash(i, j),
          seed2: hash(j + 7, i + 3),
        });
      }
    }
    this.tiles = tiles;
  };

  DiscoBall.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var size = Math.max(40, Math.round(rect.width || this.canvas.width));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cssSize = size;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  DiscoBall.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.last = 0;
    requestAnimationFrame(this._loop);
  };

  DiscoBall.prototype.stop = function () { this.running = false; };

  DiscoBall.prototype.setParty = function (on) {
    this.party = on;
    this.targetSpeed = on ? this.baseSpeed * 6 : this.baseSpeed;
  };

  DiscoBall.prototype._frame = function (t) {
    if (!this.running) return;
    var dt = this.last ? Math.min((t - this.last) / 1000, 0.1) : 0;
    this.last = t;
    // glatko ubrzavanje / usporavanje
    this.speed += (this.targetSpeed - this.speed) * Math.min(1, dt * 2.5);
    this.rot += this.speed * dt;
    this.time += dt;
    this.draw();
    requestAnimationFrame(this._loop);
  };

  function point(lat, lon) {
    var c = Math.cos(lat);
    return [c * Math.sin(lon), Math.sin(lat), c * Math.cos(lon)];
  }

  DiscoBall.prototype.draw = function () {
    var ctx = this.ctx;
    var S = this.cssSize;
    var cx = S / 2, cy = S / 2, R = S * 0.46;
    ctx.clearRect(0, 0, S, S);

    // tamna osnova (vidi se kroz fuge između pločica)
    var base = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    base.addColorStop(0, "#3a3a44");
    base.addColorStop(1, "#060608");
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    var gap = 0.12; // udeo fuge
    var tiles = this.tiles;
    var time = this.time;
    var sparkleRate = this.party ? 3.2 : 1.4;

    for (var k = 0; k < tiles.length; k++) {
      var tl = tiles[k];
      var lonMid = tl.lon + this.rot + tl.dLon / 2;
      var n = point(tl.latMid, lonMid);
      if (n[2] <= 0.02) continue; // zadnja strana kugle

      var a0 = tl.lon + this.rot + tl.dLon * gap / 2;
      var a1 = tl.lon + this.rot + tl.dLon * (1 - gap / 2);
      var dLat = tl.lat1 - tl.lat0;
      var b0 = tl.lat0 + dLat * gap / 2;
      var b1 = tl.lat1 - dLat * gap / 2;
      var p1 = point(b0, a0), p2 = point(b0, a1), p3 = point(b1, a1), p4 = point(b1, a0);

      var diff = Math.max(0, dot(n, LIGHT));
      var spec = Math.pow(Math.max(0, dot(n, HALF)), 40);
      var v = 45 + 150 * diff + 70 * (tl.seed - 0.5) + 255 * spec;

      // nasumično svetlucanje pločica
      var tw = Math.sin(time * sparkleRate * (1 + tl.seed2 * 2) + tl.seed * 40);
      var flash = tw > 0.985 ? (tw - 0.985) / 0.015 : 0;
      v += flash * 220;
      v = Math.max(0, Math.min(255, v));

      var r = v, g = v, b = v + 8;
      // poneka roze pločica ("girl" akcent)
      if (tl.seed > 0.93 || (this.party && tl.seed > 0.75)) {
        r = Math.min(255, v + 40); g = v * 0.62; b = v * 0.82;
      }
      // tamnjenje ka ivici kugle (sferni utisak)
      var edge = 0.35 + 0.65 * Math.pow(n[2], 0.6);
      ctx.fillStyle = "rgb(" + (r * edge | 0) + "," + (g * edge | 0) + "," + (Math.min(255, b) * edge | 0) + ")";

      ctx.beginPath();
      ctx.moveTo(cx + p1[0] * R, cy - p1[1] * R);
      ctx.lineTo(cx + p2[0] * R, cy - p2[1] * R);
      ctx.lineTo(cx + p3[0] * R, cy - p3[1] * R);
      ctx.lineTo(cx + p4[0] * R, cy - p4[1] * R);
      ctx.closePath();
      ctx.fill();

      if (flash > 0.4) {
        // mala zvezdica na pločici koja sija
        var sx = cx + n[0] * R, sy = cy - n[1] * R, len = R * 0.12 * flash;
        ctx.strokeStyle = "rgba(255,255,255," + (0.85 * flash) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx - len, sy); ctx.lineTo(sx + len, sy);
        ctx.moveTo(sx, sy - len); ctx.lineTo(sx, sy + len);
        ctx.stroke();
      }
    }

    // sjaj ivice
    var rim = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.02);
    rim.addColorStop(0, "rgba(255,255,255,0)");
    rim.addColorStop(1, "rgba(220,220,235,0.18)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  };

  window.DiscoBall = DiscoBall;
})();
