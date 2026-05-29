/* ============================================================
   INGER · Google Analytics (GA4) — chargé UNIQUEMENT après
   consentement « Mesure d'audience » (RGPD).
   Se déclenche via window.INGER_CONSENT et l'évènement 'inger:consent'
   émis par js/cookies.js.
   ============================================================ */
(function () {
  "use strict";
  if (window.__ingerGA) return; window.__ingerGA = true;

  var ID = "G-QXKBEN20QZ";
  var loaded = false;

  function loadGA(){
    if (loaded) return; loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", ID, { anonymize_ip: true });
  }

  // 1) Choix déjà enregistré (rechargement / visite suivante)
  if (window.INGER_CONSENT && window.INGER_CONSENT.analytics) loadGA();

  // 2) L'utilisateur accepte la mesure d'audience pendant la visite
  window.addEventListener("inger:consent", function (e) {
    if (e.detail && e.detail.analytics) loadGA();
  });
})();
