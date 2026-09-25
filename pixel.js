/* ==========================================================
   pixel.js — Utmify (UTMs) + TikTok Pixel num arquivo só
   Uso em cada página de oferta, no <head>:

   <script>window.OFERTA = { id: "oferta-x", nome: "Oferta X", valor: 97, moeda: "BRL" };</script>
   <script src="/pixel.js"></script>
   ========================================================== */
(function (w, d) {
  if (w.__PIXEL_JS_LOADED) return;          // evita carregar duas vezes na mesma página
  w.__PIXEL_JS_LOADED = true;

  var PIXEL_ID = "DALANH3C77U250DBQQ20";
  var OF = w.OFERTA || {};
  var oferta = {
    id:    OF.id    || location.pathname.replace(/^\/|\/$/g, "") || "home",
    nome:  OF.nome  || d.title || "Oferta",
    valor: Number(OF.valor) || 0,
    moeda: OF.moeda || "BRL"
  };

  /* ── 1. Utmify: rastreamento de UTMs ── */
  var u = d.createElement("script");
  u.src = "https://cdn.utmify.com.br/scripts/utms/latest.js";
  u.async = true; u.defer = true;
  u.setAttribute("data-utmify-prevent-xcod-sck", "");
  u.setAttribute("data-utmify-prevent-subids", "");
  (d.head || d.documentElement).appendChild(u);

  /* ── 2. TikTok Pixel: código base ── */
  if (!w.ttq || !w.ttq._i || !w.ttq._i[PIXEL_ID]) {
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (e, n) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
        ttq._t = ttq._t || {}; ttq._t[e] = +new Date();
        ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        var s = d.createElement("script"); s.type = "text/javascript"; s.async = !0;
        s.src = r + "?sdkid=" + e + "&lib=" + t;
        var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(s, a);
      };
    }(w, d, "ttq");
    w.ttq.load(PIXEL_ID);
  }

  /* ── 3. Advanced Matching (email/telefone, se algum script salvou) ── */
  function formatPhone(p) {
    var dg = String(p || "").replace(/\D/g, "");
    if (!dg) return "";
    if (dg.length === 10 || dg.length === 11) dg = "55" + dg; // BR sem DDI
    return "+" + dg;
  }
  function identify(dados) {
    try {
      var cd = dados || {};
      if (!dados) { try { cd = JSON.parse(localStorage.getItem("ptracker_cd") || "{}"); } catch (e) {} }
      var id = {};
      if (cd.email) { id.email = String(cd.email).trim().toLowerCase(); id.external_id = id.email; }
      if (cd.phone) { var ph = formatPhone(cd.phone); if (ph) id.phone_number = ph; }
      if (Object.keys(id).length) w.ttq.identify(id);
    } catch (e) {}
  }
  identify();

  /* ── 4. Eventos ── */
  function novoId(ev) {
    return ev.toLowerCase() + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }
  function params(extra) {
    var e = extra || {};
    var valor = e.valor != null ? Number(e.valor) : oferta.valor;
    return {
      contents: [{
        content_id:   e.id   || oferta.id,
        content_name: e.nome || oferta.nome,
        content_type: "product",
        quantity: 1,
        price: valor
      }],
      content_type: "product",
      value: valor,
      currency: e.moeda || oferta.moeda
    };
  }

  // PageView (event_id gerado ANTES e enviado junto → dedup com server-side funciona)
  w.__ptracker_pv_id = novoId("pv");
  w.ttq.page();
  w.ttq.track("ViewContent", params(), { event_id: w.__ptracker_pv_id });

  /* Função pública pra disparar eventos nos botões da página:
     trackTT("InitiateCheckout")
     trackTT("AddToCart", { valor: 47 })
     trackTT("CompletePayment", { email: "x@y.com", phone: "87999999999" })  */
  w.trackTT = function (evento, extra) {
    extra = extra || {};
    if (extra.email || extra.phone) identify({ email: extra.email, phone: extra.phone });
    var eid = extra.event_id || novoId(evento);
    w.ttq.track(evento, params(extra), { event_id: eid });
    return eid;
  };

  w.TT_PIXEL_READY = true;
})(window, document);
