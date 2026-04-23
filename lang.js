// Navve — language detection & switcher helper.
// Included on both English and French pages. Reads `navve_lang` from
// localStorage to respect an explicit user choice, otherwise falls back to
// `navigator.languages` / `navigator.language`. Redirects only when we'd end
// up on the wrong side.
(function () {
  try {
    function normalizeTag(tag) {
      return String(tag || '').toLowerCase().replace(/_/g, '-');
    }
    function languageSubtagIsFr(tag) {
      var n = normalizeTag(tag);
      return n === 'fr' || n.indexOf('fr-') === 0;
    }
    /** True if the user lists French (Canada) among accepted languages (e.g. en-CA, fr-CA). */
    function listIncludesFrCA(langs) {
      if (!langs || !langs.length) return false;
      for (var i = 0; i < langs.length; i++) {
        if (normalizeTag(langs[i]) === 'fr-ca') return true;
      }
      return false;
    }
    function browserPrefersFrench() {
      var langs = navigator.languages;
      var primary = (langs && langs[0]) || navigator.language || navigator.userLanguage || '';
      return languageSubtagIsFr(primary) || listIncludesFrCA(langs);
    }

    var isFrPage = /(^|\/)fr\//.test(location.pathname);
    var stored = localStorage.getItem('navve_lang');
    var prefersFr;

    if (stored === 'en' || stored === 'fr') {
      prefersFr = stored === 'fr';
    } else {
      prefersFr = browserPrefersFrench();
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
