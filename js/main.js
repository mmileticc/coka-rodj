(function () {
  "use strict";

  var C = window.INVITE;
  var reduceMotion = window.Effects.reduceMotion;
  var isLocal = location.protocol === "file:" ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
    /\.localhost$/.test(location.hostname);

  function $(sel) { return document.querySelector(sel); }
  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, C);
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- Tekst iz konfiguracije ---------- */
  document.querySelectorAll("[data-text]").forEach(function (node) {
    var v = get(node.getAttribute("data-text"));
    if (v != null) node.textContent = v;
  });

  var porukaBox = $("#poruka-tekst");
  (C.poruka.pasusi || []).forEach(function (p) { porukaBox.appendChild(el("p", null, p)); });

  var steps = $("#uputstva");
  (C.lokacija.uputstva || []).forEach(function (u) { steps.appendChild(el("li", null, u)); });

  var tags = $("#tagovi");
  (C.dressCode.tagovi || []).forEach(function (t) { tags.appendChild(el("span", "tag", t)); });

  /* ---------- Mapa ---------- */
  var q = encodeURIComponent(C.lokacija.mapaUpit);
  $("#map").src = "https://maps.google.com/maps?q=" + q + "&z=17&hl=sr-Latn&output=embed";
  $("#maps-btn").href = "https://www.google.com/maps/search/?api=1&query=" + q;

  /* ---------- Slike ----------
   * Ako slika fali: lokalno prikaži placeholder, na javnom sajtu je sakrij.
   */
  function loadImage(img, src, onMissing) {
    img.addEventListener("error", function () {
      if (isLocal) {
        var ph = el("div", "img-missing", "Ubaci sliku:\n" + src);
        img.replaceWith(ph);
      } else if (onMissing) {
        onMissing();
      }
    }, { once: true });
    img.src = src;
  }

  var lightbox = null;
  function openLightbox(src, cap) {
    if (!window.bootstrap) return;
    if (!lightbox) lightbox = new bootstrap.Modal($("#lightbox"));
    $("#lightbox-img").src = src;
    $("#lightbox-img").alt = cap || "";
    $("#lightbox-cap").textContent = cap || "";
    lightbox.show();
  }

  function photoTile(item, colCls, tiltIdx) {
    var col = el("div", colCls + " reveal");
    var fig = el("figure", "polaroid " + (tiltIdx % 2 ? "tilt-right" : "tilt-left"));
    var btn = el("button", "polaroid-btn");
    btn.type = "button";
    btn.setAttribute("aria-label", "Uvećaj sliku" + (item.opis ? ": " + item.opis : ""));
    var img = el("img");
    img.alt = item.opis || "";
    img.loading = "lazy";
    btn.appendChild(img);
    fig.appendChild(btn);
    if (item.opis) fig.appendChild(el("figcaption", null, item.opis));
    col.appendChild(fig);
    btn.addEventListener("click", function () {
      if (img.isConnected) openLightbox(item.src, item.opis);
    });
    loadImage(img, item.src, function () { col.remove(); });
    return col;
  }

  // slavljenica
  var hero = $("#slavljenica-img");
  loadImage(hero, C.slike.slavljenica, function () {
    var col = hero.closest(".col-md-5");
    col.nextElementSibling.className = "col-md-8 mx-auto text-center reveal is-visible";
    col.remove();
  });

  var ulazGrid = $("#ulaz-grid");
  (C.slike.ulaz || []).forEach(function (item, i) {
    ulazGrid.appendChild(photoTile(item, "col-sm-8 col-md-6 col-lg-4", i + 1));
  });

  var inspoGrid = $("#inspo-grid");
  (C.slike.inspo || []).forEach(function (item, i) {
    inspoGrid.appendChild(photoTile(item, "col-6 col-md-4 col-lg-3", i));
  });

  /* ---------- Countdown ---------- */
  var target = new Date(C.datum).getTime();
  var cd = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
  var cdTimer = null;
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var diff = target - Date.now();
    if (isNaN(diff) || diff <= 0) {
      $("#cd-boxes").classList.add("d-none");
      $("#cd-done").classList.remove("d-none");
      if (cdTimer) clearInterval(cdTimer);
      return;
    }
    var s = Math.floor(diff / 1000);
    cd.d.textContent = Math.floor(s / 86400);
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick();
  cdTimer = setInterval(tick, 1000);

  /* ---------- Pojavljivanje na skrol ---------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Efekti ---------- */
  var glitter = new window.Effects.Glitter($("#glitter"));
  window.Effects.buildReflections($("#reflections"));

  var introBall = new window.DiscoBall($(".intro-ball"), { rows: 14, speed: 0.5 });
  var heroBall = new window.DiscoBall($("#hero-ball"), { rows: 18, speed: 0.35 });
  introBall.draw();
  heroBall.draw();

  function startAnim() {
    if (reduceMotion) return;
    glitter.start();
    if (document.body.classList.contains("opened")) heroBall.start();
    else introBall.start();
  }
  function stopAnim() {
    glitter.stop(); heroBall.stop(); introBall.stop();
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAnim(); else startAnim();
  });
  window.addEventListener("resize", function () {
    heroBall.resize(); heroBall.draw();
  });

  /* ---------- Intro ---------- */
  var intro = $("#intro");
  function openInvite(instant) {
    document.body.classList.add("opened");
    introBall.stop();
    try { sessionStorage.setItem("coka-opened", "1"); } catch (e) {}
    if (instant || reduceMotion) {
      intro.remove();
    } else {
      $("#flash").classList.add("go");
      intro.classList.add("leaving");
      setTimeout(function () { intro.remove(); }, 900);
    }
    heroBall.resize();
    heroBall.draw();
    startAnim();
    setupReveal();
  }

  var already = false;
  try { already = sessionStorage.getItem("coka-opened") === "1"; } catch (e) {}
  if (already) {
    openInvite(true);
  } else {
    // intro uvek otvara pozivnicu od vrha
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.classList.add("locked");
    $("#open-btn").addEventListener("click", function () {
      document.documentElement.classList.remove("locked");
      openInvite(false);
    });
    $("#open-btn").focus({ preventScroll: true });
    startAnim();
  }

  /* ---------- Easter egg: disko režim ---------- */
  var toast = $("#toast");
  var partyTimer = null;
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }
  function setParty(on) {
    document.body.classList.toggle("party", on);
    heroBall.setParty(on);
    glitter.party = on;
  }
  function triggerParty() {
    if (reduceMotion) { showToast("🪩 Disco mode: ON"); return; }
    if (!heroBall.running) heroBall.start();
    setParty(true);
    showToast("🪩 Disco mode: ON");
    clearTimeout(partyTimer);
    partyTimer = setTimeout(function () { setParty(false); }, 8000);
  }
  var hb = $("#hero-ball");
  hb.addEventListener("click", triggerParty);
  hb.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerParty(); }
  });
})();
