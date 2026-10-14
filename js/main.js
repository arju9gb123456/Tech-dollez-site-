/* =========================================================
   TECH DOLLEZ — Main interactions (shared by every page)
   Preloader · smooth scroll · page links · nav · cursor · tilt · scroll animations
   Made by Arjun Ahirwar
   ========================================================= */
(function () {
  const root = document.documentElement;
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const lite = () => root.dataset.fx === 'lite';

  if (reduced) root.classList.add('reduced');
  if (!hasGSAP) root.classList.add('no-js');

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Split statement into words ---------- */
  const statement = $('#statementText');
  if (statement) {
    const words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- Page helpers (shared with other scripts) ---------- */
  // "/services", "/services.html", "/services/" and "/index.html" all normalise the same way
  const normPath = (p) => (p || '/').replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const here = normPath(location.pathname);

  function visibleTarget(el) {
    if (!el) return null;
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return el.closest('section') || el.parentElement;
    return el;
  }
  function scrollToEl(el, immediate) {
    el = visibleTarget(el);
    if (!el) return;
    if (lenis) {
      lenis.resize();   // page height may have changed (rendered cards, fonts) — refresh the scroll limit first
      lenis.scrollTo(el, { offset: -20, immediate: !!immediate, force: true });
    } else el.scrollIntoView({ behavior: reduced || immediate ? 'auto' : 'smooth' });
  }
  // Go to "#id", "/page" or "/page#id" — scrolls if it's on this page, navigates otherwise
  function goTo(target) {
    if (!target) return;
    const url = new URL(target, location.href);
    if (url.origin === location.origin && normPath(url.pathname) === here) {
      if (url.hash.length > 1) {
        const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (el) { document.dispatchEvent(new CustomEvent('td:goto', { detail: el.id })); scrollToEl(el); return; }
      } else if (!url.search) { scrollToEl(body); return; }
    }
    location.href = url.href;
  }
  window.__goTo = goTo;
  window.__scrollToEl = scrollToEl;

  // Same-page links (#id or /this-page#id) scroll smoothly instead of jumping
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') && !href.startsWith(location.origin)) return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || normPath(url.pathname) !== here || url.search) return;
    if (url.hash.length < 2) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    closeMenu();
    document.dispatchEvent(new CustomEvent('td:goto', { detail: el.id }));
    scrollToEl(el);
    if (history.replaceState) history.replaceState(null, '', url.hash);
  });

  /* ---------- Preloader (only on the first page of a visit) ---------- */
  const pre = $('#preloader');
  const skipPreloader = root.classList.contains('no-preload') || !pre;
  try { sessionStorage.setItem('td-visited', '1'); } catch (e) { /* storage unavailable */ }

  if (skipPreloader) {
    if (pre) pre.remove();
    requestAnimationFrame(() => introAnimation(true));
  } else {
    body.classList.add('is-loading');
    const preBar = $('#preloaderBar');
    const preCount = $('#preloaderCount');
    let progress = 0;
    let loaded = false;
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 350))]).then(() => { loaded = true; });
    if (lenis) lenis.stop();
    const preTimer = setInterval(() => {
      const cap = loaded ? 100 : 88;
      progress += Math.max(6, (cap - progress) * 0.25);
      if (progress > cap) progress = cap;
      const v = Math.round(progress);
      preBar.style.width = v + '%';
      preCount.textContent = v;
      if (v >= 100) {
        clearInterval(preTimer);
        setTimeout(() => {
          pre.classList.add('done');
          body.classList.remove('is-loading');
          if (lenis) lenis.start();
          introAnimation(false);
          setTimeout(() => pre.remove(), 1200);
        }, 80);
      }
    }, reduced ? 10 : 30);
  }

  /* ---------- Intro ---------- */
  function introAnimation(quick) {
    jumpToHash();
    if (!hasGSAP || reduced) { showFinalStates(); return; }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if ($('.hero')) {
      tl.to('.hero .line__inner', { y: 0, duration: quick ? 1.1 : 1.4, stagger: 0.12 }, quick ? 0 : 0.2)
        .to('.hero .reveal-up', { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, quick ? 0.2 : 0.5);
      if ($('.hero__scroll')) tl.from('.hero__scroll', { opacity: 0, duration: 1 }, 1);
    }
    if (!quick) tl.from('.nav__inner', { y: -40, opacity: 0, duration: 1 }, 0.4);
  }

  // Arriving from another page with /page#section → scroll there once layout has settled
  function jumpToHash() {
    if (location.hash.length < 2) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;
    document.dispatchEvent(new CustomEvent('td:goto', { detail: id }));
    const land = () => { if (hasGSAP) ScrollTrigger.refresh(); scrollToEl(el, true); };
    setTimeout(land, 120);
    // late layout shifts (web fonts, pinned sections) can move the target — correct once more if needed
    setTimeout(() => { const t = visibleTarget(el).getBoundingClientRect().top; if (Math.abs(t - 20) > 60) land(); }, 900);
  }
  // hash changes on the same page (back/forward, typed links)
  window.addEventListener('hashchange', () => {
    const el = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!el) return;
    document.dispatchEvent(new CustomEvent('td:goto', { detail: el.id }));
    scrollToEl(el);
  });

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  const burger = $('#navBurger');
  const navLinks = $('#navLinks');
  let lastY = 0;
  function onScrollNav(y) {
    nav.classList.toggle('scrolled', y > 40);
    const menuOpen = navLinks.classList.contains('open');
    nav.classList.toggle('hidden', !menuOpen && y > lastY && y > 500);
    lastY = y;
  }
  if (lenis) lenis.on('scroll', ({ scroll }) => onScrollNav(scroll));
  else window.addEventListener('scroll', () => onScrollNav(window.scrollY), { passive: true });
  onScrollNav(window.scrollY);

  const navInner = navLinks.parentElement;
  const navAnchor = navLinks.nextElementSibling; // keep original position for desktop

  // On mobile the menu is a full-screen overlay. It must live directly under <body>:
  // inside the nav, any transform / backdrop-filter on an ancestor turns `position: fixed`
  // into "fixed to that small box", which made the menu overlap the page.
  const mobileMQ = window.matchMedia('(max-width: 900px)');
  function placeMenu() {
    if (mobileMQ.matches) {
      if (navLinks.parentElement !== body) body.appendChild(navLinks);
    } else {
      closeMenu();
      if (navLinks.parentElement !== navInner) navInner.insertBefore(navLinks, navAnchor);
    }
  }
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('menu-open', open);
    if (open) nav.classList.remove('hidden');
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  function closeMenu() {
    if (!navLinks.classList.contains('open')) return;
    setMenu(false);
  }
  window.__closeMenu = closeMenu;
  burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  // tap on the empty overlay area closes the menu
  navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks) closeMenu();
    if (e.target.closest('a[href^="/"]')) setTimeout(closeMenu, 50);
  });
  placeMenu();
  if (mobileMQ.addEventListener) mobileMQ.addEventListener('change', placeMenu);
  else mobileMQ.addListener(placeMenu);

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduced) {
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!lite()) body.classList.add('has-cursor');
    });
    document.addEventListener('pointerleave', () => body.classList.remove('has-cursor'));
    (function loop() {
      if (!lite()) {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      } else body.classList.remove('has-cursor');
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', (e) => {
      ring.classList.toggle('hover', !!e.target.closest('a, button, .card, .plan, .step, .wk, .tile, summary, input, select, textarea, label'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        if (lite()) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 3D tilt + glow cards ---------- */
  $$('.tilt').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      if (finePointer && !reduced && !lite()) {
        const baseY = card.classList.contains('plan--hot') && window.innerWidth > 1080 ? -14 : 0;
        card.style.transform = `translateY(${baseY}px) rotateX(${(0.5 - py) * 12}deg) rotateY(${(px - 0.5) * 14}deg) scale(1.02)`;
      }
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  /* ---------- Count-up helper ---------- */
  function countUp(el, target, suffix, duration) {
    const start = performance.now();
    const fmt = (n) => n.toLocaleString('en-IN');
    (function step(now) {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 4)))) + (suffix || '');
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  window.__countUp = countUp;

  function showFinalStates() {
    $$('.reveal-up').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
    $$('.line__inner').forEach((el) => { el.style.transform = 'none'; });
    $$('#statementText .w').forEach((el) => { el.style.opacity = 1; });
    const dev = $('#device'); if (dev) dev.style.transform = 'none';
    const ph = $('#phone'); if (ph) { ph.style.transform = 'rotate(-6deg)'; ph.style.opacity = 1; }
    $$('.chart-line').forEach((el) => { el.style.strokeDashoffset = 0; });
    $$('.mock-stat b').forEach((b) => { b.textContent = (+b.dataset.count).toLocaleString('en-IN'); });
    $$('.counter').forEach((el) => { el.textContent = el.dataset.target + (el.dataset.suffix || ''); });
  }

  /* ---------- Scroll animations (each block only runs if its section is on this page) ---------- */
  if (!hasGSAP || reduced) { if (!skipPreloader) showFinalStates(); return; }
  gsap.registerPlugin(ScrollTrigger);
  const has = (s) => !!$(s);

  if (has('#hero')) {
    ScrollTrigger.create({
      trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: (self) => { if (window.__heroScroll) window.__heroScroll(self.progress); }
    });
    gsap.to('.hero__content', { y: -120, opacity: 0, scale: 0.94, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  if (has('#statement')) {
    gsap.to('#statementText .w', { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '#statement', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } });
  }

  $$('.reveal-up').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  $$('.section__head, .showcase__head, .process__intro, .stack__text').forEach((el) => {
    gsap.from(el.children, { y: 50, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 82%' } });
  });

  if (has('.services__grid')) {
    gsap.from('.services__grid .card', { y: 80, opacity: 0, rotateX: -18, duration: 1.2, stagger: 0.09, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.services__grid', start: 'top 80%' } });
  }

  if (has('.showcase__stage')) {
    gsap.timeline({ scrollTrigger: { trigger: '.showcase__stage', start: 'top 85%', end: 'top 20%', scrub: 1 } })
      .to('#device', { rotateX: 0, scale: 1, ease: 'none' }, 0)
      .to('#phone', { y: 0, rotate: -6, opacity: 1, ease: 'none' }, 0.35)
      .to('.chart-line', { strokeDashoffset: 0, ease: 'none' }, 0.2);
    let mockCounted = false;
    ScrollTrigger.create({
      trigger: '.showcase__stage', start: 'top 45%',
      onEnter: () => { if (mockCounted) return; mockCounted = true; $$('.mock-stat b').forEach((b) => countUp(b, +b.dataset.count, '', 1800)); }
    });
  }

  if (has('#processTrack')) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const track = $('#processTrack');
      const pin = $('.process__pin');
      const vp = $('.process__viewport');
      const getDist = () => track.scrollWidth - vp.clientWidth;
      const tween = gsap.to(track, {
        x: () => -Math.max(0, getDist()), ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + Math.max(1, getDist()), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      return () => tween.kill();
    });
    mm.add('(max-width: 900px)', () => {
      $$('.step').forEach((s) => gsap.from(s, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: s, start: 'top 88%' } }));
    });
  }

  $$('.counter').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => countUp(el, +el.dataset.target, el.dataset.suffix, 1600) });
  });

  if (has('.plans__grid')) {
    gsap.from('.plans__grid .plan', { y: 70, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.plans__grid', start: 'top 80%' } });
  }
  if (has('.faq__list')) {
    gsap.from('.faq__item', { y: 30, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.faq__list', start: 'top 82%' } });
  }
  if (has('.contact__box')) {
    gsap.from('.contact__box', { scale: 0.94, opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.contact__box', start: 'top 90%' } });
  }

  const marquee = $('.marquee');
  if (marquee) {
    ScrollTrigger.create({
      trigger: marquee, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => gsap.to(marquee, { skewX: gsap.utils.clamp(-8, 8, self.getVelocity() / 300), duration: 0.4, overwrite: true })
    });
  }

  if (has('.footer__big')) {
    gsap.from('.footer__big', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.footer', start: 'top 90%' } });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
