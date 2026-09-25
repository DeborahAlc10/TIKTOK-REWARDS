/* ==========================================================
   pixel.js — Utmify (UTMs + Pixel TikTok) num arquivo só
   Uso em cada página de oferta, no <head>:

   <script src="/pixel.js"></script>

   ⚠️ Remova das páginas os códigos da Utmify colados direto
   no HTML, senão tudo carrega em dobro.
   ========================================================== */
(function (w, d) {
  if (w.__PIXEL_JS_LOADED) return;   // evita carregar duas vezes na mesma página
  w.__PIXEL_JS_LOADED = true;

  function carregar(src, attrs) {
    // não carrega de novo se o script já estiver na página
    if (d.querySelector('script[src="' + src + '"]')) return;
    var s = d.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    (attrs || []).forEach(function (a) { s.setAttribute(a[0], a[1]); });
    (d.head || d.documentElement).appendChild(s);
  }

  /* ── 1. Utmify: rastreamento de UTMs ── */
  carregar("https://cdn.utmify.com.br/scripts/utms/latest.js", [
    ["data-utmify-prevent-xcod-sck", ""],
    ["data-utmify-prevent-subids", ""]
  ]);

  /* ── 2. Utmify: pixel do TikTok ──
     Este ID é o da configuração na Utmify (não o ID do pixel no TikTok). */
  w.tikTokPixelId = "6ab05758c591cb5ec278cd19";
  carregar("https://cdn.utmify.com.br/scripts/pixel/pixel-tiktok.js");
})(window, document);
