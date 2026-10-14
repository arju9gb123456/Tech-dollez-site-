/* =========================================================
   TECH DOLLEZ — Live customizer
   Visitors can change theme, color palette, font, background graphics
   and effects. Choices are saved and applied on every page.
   (The first paint is handled by the tiny inline script in <head>.)
   Made by Arjun Ahirwar
   ========================================================= */
(function () {
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const KEY = 'td-prefs';
  const DEFAULTS = { theme: 'dark', palette: 'aurora', font: 'modern', bg: 'aurora', fx: 'full' };
  const LAZY_FONTS = { friendly: 'Poppins:wght@400;500;600;700;800', futuristic: 'Space+Grotesk:wght@400;500;600;700' };
  const sysLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  let prefs = Object.assign({}, DEFAULTS);
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}') || {}); } catch (e) { /* storage unavailable */ }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* storage unavailable */ } };
  const resolvedTheme = () => (prefs.theme === 'auto' ? (sysLight && sysLight.matches ? 'light' : 'dark') : prefs.theme);

  function loadFont(key) {
    const fam = LAZY_FONTS[key];
    if (!fam || document.querySelector(`link[data-font="${key}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${fam}&display=swap`;
    l.dataset.font = key;
    document.head.appendChild(l);
  }

  function apply(animate) {
    if (animate) {
      root.classList.add('theme-anim');
      clearTimeout(apply.t);
      apply.t = setTimeout(() => root.classList.remove('theme-anim'), 650);
    }
    const t = resolvedTheme();
    root.setAttribute('data-theme', t);
    ['palette', 'font', 'bg', 'fx'].forEach((k) => {
      if (prefs[k] && prefs[k] !== DEFAULTS[k]) root.setAttribute('data-' + k, prefs[k]);
      else root.removeAttribute('data-' + k);
    });
    loadFont(prefs.font);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = t === 'light' ? '#f6f6fb' : '#05050a';
    const tt = $('#themeToggle');
    if (tt) {
      tt.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      tt.dataset.mode = t;
    }
    syncUI();
    document.dispatchEvent(new CustomEvent('td:prefs', { detail: Object.assign({ resolvedTheme: t }, prefs) }));
    if (window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(), 200);
  }

  function syncUI() {
    $$('[data-pref]').forEach((group) => {
      const key = group.dataset.pref;
      const val = key === 'lang' ? (window.__getLang ? window.__getLang() : 'en') : prefs[key];
      $$('button[data-v]', group).forEach((b) => {
        const on = b.dataset.v === val;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    });
  }

  function set(key, val) {
    if (key === 'lang') {
      if (window.__setLang) window.__setLang(val);
      syncUI();
      return;
    }
    prefs[key] = val;
    save();
    apply(true);
  }

  /* ---------- Theme toggle in the nav ---------- */
  function toggleTheme() {
    set('theme', resolvedTheme() === 'light' ? 'dark' : 'light');
  }
  window.__toggleTheme = toggleTheme;
  const tt = $('#themeToggle');
  if (tt) tt.addEventListener('click', toggleTheme);
  if (sysLight) {
    const onSys = () => { if (prefs.theme === 'auto') apply(true); };
    if (sysLight.addEventListener) sysLight.addEventListener('change', onSys); else sysLight.addListener(onSys);
  }

  /* ---------- Customizer drawer ---------- */
  const cz = $('#cz');
  let lastFocus = null;
  function openCz() {
    if (!cz) return;
    if (window.__closeMenu) window.__closeMenu();
    lastFocus = document.activeElement;
    syncUI();
    cz.hidden = false;
    requestAnimationFrame(() => cz.classList.add('open'));
    root.classList.add('cz-open');
    if (window.__lenis) window.__lenis.stop();
    try { localStorage.setItem('td-cz-seen', '1'); } catch (e) { /* storage unavailable */ }
    root.classList.add('cz-seen');
    setTimeout(() => { const b = $('.cz__x', cz); if (b) b.focus(); }, 60);
  }
  function closeCz() {
    if (!cz || cz.hidden) return;
    cz.classList.remove('open');
    root.classList.remove('cz-open');
    setTimeout(() => { cz.hidden = true; }, 350);
    if (window.__lenis && !document.body.classList.contains('modal-open')) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.__openCz = openCz;

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-cz]')) { e.preventDefault(); openCz(); return; }
    if (!cz || cz.hidden) return;
    if (e.target.closest('#cz [data-close]')) { closeCz(); return; }
    const b = e.target.closest('#cz [data-pref] button[data-v]');
    if (b) set(b.parentElement.dataset.pref, b.dataset.v);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCz(); });
  document.addEventListener('td:lang', syncUI);

  const reset = $('#czReset');
  if (reset) reset.addEventListener('click', () => {
    prefs = Object.assign({}, DEFAULTS);
    save();
    apply(true);
  });

  // gentle hint on the customize button until it's been opened once
  try { if (localStorage.getItem('td-cz-seen')) root.classList.add('cz-seen'); } catch (e) { root.classList.add('cz-seen'); }

  apply(false);
})();
