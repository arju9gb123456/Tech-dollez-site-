/* =========================================================
   TECH DOLLEZ — Main interactions
   Preloader · smooth scroll · GSAP scroll animations · tilt · cursor · form
   Made by Arjun Ahirwar
   ========================================================= */
(function () {
  const WA_NUMBER = '916260993724';
  const root = document.documentElement;
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (reduced) root.classList.add('reduced');
  if (!hasGSAP) root.classList.add('no-js');

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Split statement into words ---------- */
  const statement = document.getElementById('statementText');
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

  // anchor links → smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -20 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Preloader ---------- */
  body.classList.add('is-loading');
  const pre = document.getElementById('preloader');
  const preBar = document.getElementById('preloaderBar');
  const preCount = document.getElementById('preloaderCount');
  let progress = 0;
  // Don't wait for heavy assets (fonts, 3D) — the page is usable as soon as the DOM is ready.
  // Wait at most ~350ms for web fonts so the intro text doesn't flash.
  let loaded = false;
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 350))]).then(() => { loaded = true; });

  const preTimer = setInterval(() => {
    const cap = loaded ? 100 : 88;
    progress += Math.max(6, (cap - progress) * 0.25);
    if (progress > cap) progress = cap;
    const v = Math.round(progress);
    preBar.style.width = v + '%';
    preCount.textContent = v;
    if (v >= 100) {
      clearInterval(preTimer);
      setTimeout(finishLoading, 80);
    }
  }, reduced ? 10 : 30);

  function finishLoading() {
    pre.classList.add('done');
    body.classList.remove('is-loading');
    if (lenis) lenis.start();
    introAnimation();
  }
  if (lenis) lenis.stop();

  /* ---------- Intro ---------- */
  function introAnimation() {
    if (!hasGSAP || reduced) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero .line__inner', { y: 0, duration: 1.4, stagger: 0.12 }, 0.2)
      .to('.hero .reveal-up', { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.5)
      .from('.nav__inner', { y: -40, opacity: 0, duration: 1 }, 0.4)
      .from('.hero__scroll', { opacity: 0, duration: 1 }, 1);
  }

  /* ---------- Nav ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  function onScrollNav(y) {
    nav.classList.toggle('scrolled', y > 40);
    const menuOpen = navLinks.classList.contains('open');
    nav.classList.toggle('hidden', !menuOpen && y > lastY && y > 500);
    lastY = y;
  }
  if (lenis) lenis.on('scroll', ({ scroll }) => onScrollNav(scroll));
  else window.addEventListener('scroll', () => onScrollNav(window.scrollY), { passive: true });

  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  function closeMenu() {
    if (!navLinks.classList.contains('open')) return;
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduced) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      body.classList.add('has-cursor');
    });
    document.addEventListener('pointerleave', () => body.classList.remove('has-cursor'));
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .card, .plan, .step, summary, input, select, textarea').forEach((el) => {
      el.addEventListener('pointerenter', () => ring.classList.add('hover'));
      el.addEventListener('pointerleave', () => ring.classList.remove('hover'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 3D tilt + glow cards ---------- */
  document.querySelectorAll('.tilt').forEach((card) => {
    const baseY = card.classList.contains('plan--hot') && window.innerWidth > 1080 ? -14 : 0;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      if (finePointer && !reduced) {
        const rx = (0.5 - py) * 12;
        const ry = (px - 0.5) * 14;
        card.style.transform = `translateY(${baseY}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      }
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  /* ---------- Count-up helper ---------- */
  function countUp(el, target, suffix, duration) {
    const start = performance.now();
    const fmt = (n) => n.toLocaleString('en-IN');
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(target * eased)) + (suffix || '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Scroll animations ---------- */
  if (hasGSAP && !reduced) {
    gsap.registerPlugin(ScrollTrigger);

    // hero 3D reacts to scroll
    ScrollTrigger.create({
      trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: (self) => { if (window.__heroScroll) window.__heroScroll(self.progress); }
    });
    gsap.to('.hero__content', {
      y: -120, opacity: 0, scale: 0.94, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // statement word-by-word light up
    const words = gsap.utils.toArray('#statementText .w');
    gsap.to(words, {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: '#statement', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 }
    });

    // generic reveal-up (outside hero)
    gsap.utils.toArray('.reveal-up').forEach((el) => {
      if (el.closest('.hero')) return;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // section titles
    gsap.utils.toArray('.section__head, .showcase__head, .process__intro, .stack__text').forEach((el) => {
      gsap.from(el.children, {
        y: 50, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });

    // service cards stagger in 3D
    gsap.from('.services__grid .card', {
      y: 80, opacity: 0, rotateX: -18, duration: 1.2, stagger: 0.09, ease: 'expo.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: '.services__grid', start: 'top 80%' }
    });

    // Apple-style device reveal
    const deviceTl = gsap.timeline({
      scrollTrigger: { trigger: '.showcase__stage', start: 'top 85%', end: 'top 20%', scrub: 1 }
    });
    deviceTl.to('#device', { rotateX: 0, scale: 1, ease: 'none' }, 0)
      .to('#phone', { y: 0, rotate: -6, opacity: 1, ease: 'none' }, 0.35)
      .to('.chart-line', { strokeDashoffset: 0, ease: 'none' }, 0.2);

    let mockCounted = false;
    ScrollTrigger.create({
      trigger: '.showcase__stage', start: 'top 45%',
      onEnter: () => {
        if (mockCounted) return; mockCounted = true;
        document.querySelectorAll('.mock-stat b').forEach((b) => countUp(b, +b.dataset.count, '', 1800));
      }
    });

    // horizontal process (desktop only)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const track = document.getElementById('processTrack');
      const pin = document.querySelector('.process__pin');
      const vp = document.querySelector('.process__viewport');
      const getDist = () => track.scrollWidth - vp.clientWidth;
      const tween = gsap.to(track, {
        x: () => -Math.max(0, getDist()), ease: 'none',
        scrollTrigger: {
          trigger: pin, start: 'top top', end: () => '+=' + Math.max(1, getDist()),
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
      gsap.utils.toArray('.step').forEach((s, i) => {
        gsap.from(s, { opacity: 0.3, scale: 0.9, duration: 0.6, delay: i * 0.05, scrollTrigger: { trigger: pin, start: 'top 60%' } });
      });
      return () => tween.kill();
    });
    mm.add('(max-width: 900px)', () => {
      gsap.utils.toArray('.step').forEach((s) => {
        gsap.from(s, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } });
      });
    });

    // counters
    gsap.utils.toArray('.counter').forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => countUp(el, +el.dataset.target, el.dataset.suffix, 1600)
      });
    });

    // plans
    gsap.from('.plans__grid .plan', {
      y: 70, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.plans__grid', start: 'top 80%' }
    });

    // faq items
    gsap.from('.faq__item', {
      y: 30, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out',
      scrollTrigger: { trigger: '.faq__list', start: 'top 82%' }
    });

    // contact box zoom
    gsap.from('.contact__box', {
      scale: 0.92, opacity: 0, y: 60, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__box', start: 'top 85%' }
    });

    // marquee skew on scroll velocity
    const marquee = document.querySelector('.marquee');
    ScrollTrigger.create({
      trigger: marquee, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 300);
        gsap.to(marquee, { skewX: v, duration: 0.4, overwrite: true });
      }
    });

    // footer giant text
    gsap.from('.footer__big', {
      yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.footer', start: 'top 90%' }
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  } else {
    // no GSAP or reduced motion: show final states
    document.querySelectorAll('.reveal-up').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
    document.querySelectorAll('.line__inner').forEach((el) => { el.style.transform = 'none'; });
    document.querySelectorAll('#statementText .w').forEach((el) => { el.style.opacity = 1; });
    const dev = document.getElementById('device'); if (dev) dev.style.transform = 'none';
    const ph = document.getElementById('phone'); if (ph) { ph.style.transform = 'rotate(-6deg)'; ph.style.opacity = 1; }
    document.querySelectorAll('.chart-line').forEach((el) => { el.style.strokeDashoffset = 0; });
    document.querySelectorAll('.mock-stat b').forEach((b) => { b.textContent = (+b.dataset.count).toLocaleString('en-IN'); });
    document.querySelectorAll('.counter').forEach((el) => { el.textContent = el.dataset.target + (el.dataset.suffix || ''); });
  }

})();
