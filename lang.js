// Navve — language detection & switcher helper.
// Included on both English and French pages. Reads `navve_lang` from
// localStorage to respect an explicit user choice, otherwise falls back to
// `navigator.language`. Redirects only when we'd end up on the wrong side.
(function () {
  try {
    var isFrPage = /(^|\/)fr\//.test(location.pathname);
    var stored = localStorage.getItem('navve_lang');
    var prefersFr;

    if (stored === 'en' || stored === 'fr') {
      prefersFr = stored === 'fr';
    } else {
      var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
      prefersFr = nav.indexOf('fr') === 0;
    }

    if (prefersFr && !isFrPage) {
      var page = location.pathname.split('/').pop() || 'index.html';
      location.replace('fr/' + page + location.search + location.hash);
    } else if (!prefersFr && isFrPage && stored === 'en') {
      // Only leave the French site if the user explicitly picked English.
      // (A French speaker landing on /fr/ via direct link should stay there.)
      var parts = location.pathname.split('/');
      var file = parts.pop() || 'index.html';
      location.replace('../' + file + location.search + location.hash);
    }
  } catch (e) { /* localStorage unavailable — no-op */ }
})();

// Handles clicks on the [data-lang] switcher: remember the choice, then
// follow the link normally.
document.addEventListener('click', function (e) {
  var el = e.target.closest && e.target.closest('[data-lang]');
  if (!el) return;
  try { localStorage.setItem('navve_lang', el.getAttribute('data-lang')); } catch (e) {}
});
