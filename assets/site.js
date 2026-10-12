// Commun aux pages du site : menu mobile, boutons « Télécharger » vers le
// bon store, mesure des clics (même événement que l'accueil).
(function () {
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  if (nav && burger) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    document.querySelectorAll('#menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }
  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /android/i.test(ua);
  var page = location.pathname.replace(/\.html$/, '').replace(/\//g, '') || 'home';
  document.querySelectorAll('[data-dl]').forEach(function (a) {
    var loc = a.dataset.dl + '_' + page;
    if (isIOS) a.href = 'https://apps.apple.com/fr/app/pikacheck-tracker-alertes/id6749660231?utm_source=website&utm_medium=' + loc + '&utm_campaign=download';
    else if (isAndroid) a.href = 'https://play.google.com/store/apps/details?id=com.pikacheck.app&utm_source=website&utm_medium=' + loc + '&utm_campaign=download';
    a.addEventListener('click', function () {
      if (typeof gtag === 'function') gtag('event', 'download_click', { event_category: 'engagement', event_label: loc, platform: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop', value: 1 });
    });
  });
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
