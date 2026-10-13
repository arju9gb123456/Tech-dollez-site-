/* =========================================================
   TECH DOLLEZ — Feature layer
   FX trail & bursts · scroll progress · text scramble · spotlight
   live playground · bento widgets · project planner · footer letters
   Made by Arjun Ahirwar
   ========================================================= */
(function () {
  const WA_NUMBER = '916260993724';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const COLORS = ['#00d4ff', '#7c5cff', '#ff3d9a', '#ffb547', '#22e3a5'];

  /* run fn once when element scrolls into view */
  function onView(el, fn, margin = '0px 0px -12% 0px') {
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } });
    }, { rootMargin: margin });
    io.observe(el);
  }

  /* =======================================================
     1. FX CANVAS — cursor sparkle trail + click bursts
     ======================================================= */
  const fx = (function () {
    const c = $('#fxCanvas');
    if (!c || reduced) return { burst() {} };
    const ctx = c.getContext('2d');
    let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parts = [];
    let running = false;

    function size() {
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    function add(x, y, vx, vy, life, size, color) {
      parts.push({ x, y, vx, vy, life, max: life, size, color });
      if (parts.length > 400) parts.shift();
      if (!running) { running = true; requestAnimationFrame(loop); }
    }

    function loop() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 1;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.96; p.vy = p.vy * 0.96 + 0.04;
        const t = p.life / p.max;
        ctx.globalAlpha = t;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * t, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(loop);
      else { running = false; ctx.clearRect(0, 0, w, h); }
    }

    // sparkle trail (desktop)
    if (finePointer) {
      let lx = 0, ly = 0, hue = 0;
      window.addEventListener('pointermove', (e) => {
        const dx = e.clientX - lx, dy = e.clientY - ly;
        const dist = Math.hypot(dx, dy);
        lx = e.clientX; ly = e.clientY;
        if (dist < 4) return;
        const n = Math.min(3, Math.ceil(dist / 14));
        for (let i = 0; i < n; i++) {
          hue = (hue + 1) % COLORS.length;
          add(e.clientX + (Math.random() - .5) * 6, e.clientY + (Math.random() - .5) * 6,
            (Math.random() - .5) * 0.8, (Math.random() - .5) * 0.8, 28 + Math.random() * 16, 1.6 + Math.random() * 1.8, COLORS[hue]);
        }
      }, { passive: true });
    }

    function burst(x, y, count = 26) {
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const sp = 3 + Math.random() * 5;
        add(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 40 + Math.random() * 25, 2 + Math.random() * 2.6, COLORS[(Math.random() * COLORS.length) | 0]);
      }
    }
    return { burst };
  })();

  document.addEventListener('click', (e) => {
    const t = e.target.closest('.btn--primary, .swatches button, .seg button, .wa-float');
    if (t) fx.burst(e.clientX || t.getBoundingClientRect().left + 20, e.clientY || t.getBoundingClientRect().top + 20);
  });

  /* =======================================================
     2. SCROLL PROGRESS + BACK TO TOP
     ======================================================= */
  const bar = $('#scrollProgress');
  const toTop = $('#toTop');
  const ring = $('#toTopRing');
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (ring) ring.style.strokeDashoffset = String(132 - 132 * p);
    if (toTop) toTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* =======================================================
     3. TEXT SCRAMBLE
     ======================================================= */
  const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEFXYZ0123456789';
  function scramble(el, to, duration = 700) {
    if (reduced) { el.textContent = to; return Promise.resolve(); }
    const from = el.textContent;
    const len = Math.max(from.length, to.length);
    const frames = Math.round(duration / 16.7);
    const queue = [];
    for (let i = 0; i < len; i++) {
      const start = Math.floor(Math.random() * frames * 0.45);
      const end = start + Math.floor(frames * 0.35 + Math.random() * frames * 0.3);
      queue.push({ from: from[i] || '', to: to[i] || '', start, end });
    }
    cancelAnimationFrame(el.__scr);
    return new Promise((resolve) => {
      let f = 0;
      (function update() {
        let out = '', done = 0;
        for (const q of queue) {
          if (f >= q.end) { done++; out += q.to; }
          else if (f >= q.start) out += q.to === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          else out += q.from;
        }
        el.textContent = out;
        if (done === queue.length) return resolve();
        f++;
        el.__scr = requestAnimationFrame(update);
      })();
    });
  }

  // nav links scramble on hover
  if (finePointer) {
    $$('.nav__links a, .footer__links a').forEach((a) => {
      a.dataset.txt = a.textContent;
      a.addEventListener('pointerenter', () => scramble(a, a.dataset.txt, 450));
    });
  }

  // eyebrows decode when visible
  $$('.eyebrow').forEach((el) => {
    el.dataset.txt = el.textContent;
    onView(el, () => scramble(el, el.dataset.txt, 900));
  });

  // hero word rotator
  const rot = $('#rotator');
  if (rot) {
    const defaults = ['websites', 'mobile apps', 'software', 'redesigns', 'brands', 'experiences'];
    let wi = 0;
    setInterval(() => {
      if (document.hidden) return;
      const words = window.__rotWords || defaults;
      wi = (wi + 1) % words.length;
      scramble(rot, words[wi], 800);
    }, 2600);
  }

  /* =======================================================
     4. SPOTLIGHT REVEAL
     ======================================================= */
  const stage = $('#spotStage');
  if (stage) {
    let tx = 50, ty = 50, x = 50, y = 50, hovering = false, visible = false, t0 = performance.now();
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      hovering = true;
    });
    stage.addEventListener('pointerleave', () => { hovering = false; });
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !looping) { looping = true; requestAnimationFrame(loop); }
    }).observe(stage);
    let looping = false;
    function loop(now) {
      if (!visible) { looping = false; return; }
      if (!hovering) {
        const t = (now - t0) / 1000;
        tx = 50 + Math.sin(t * 0.7) * 38;
        ty = 50 + Math.sin(t * 1.3) * 32;
      }
      x += (tx - x) * 0.09; y += (ty - y) * 0.09;
      stage.style.setProperty('--x', x + '%');
      stage.style.setProperty('--y', y + '%');
      requestAnimationFrame(loop);
    }
  }

  /* =======================================================
     5. LIVE PLAYGROUND
     ======================================================= */
  const pv = $('#pv');
  if (pv) {
    const frame = pv.closest('.pv-frame');
    const state = { name: 'Your Brand', style: 'neon', accent: '#7c5cff', font: 'modern', mode: 'dark', radius: 14 };
    const nameIn = $('#bName');
    const radiusIn = $('#bRadius');
    const radiusVal = $('#bRadiusVal');
    const modeBtn = $('#bMode');
    const url = $('#pvUrl');
    const order = $('#bOrder');

    function pop() {
      frame.classList.remove('pop'); void frame.offsetWidth; frame.classList.add('pop');
    }
    function slug(s) { return (s.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbrand').slice(0, 20); }
    function second(hex) {
      // shift hue for gradient partner
      const map = { '#7c5cff': '#ff3d9a', '#00d4ff': '#7c5cff', '#ff3d9a': '#ffb547', '#ffb547': '#ff5a4e', '#22e3a5': '#00d4ff', '#ff5a4e': '#ff3d9a' };
      return map[hex] || '#ff3d9a';
    }
    function render(animate = true) {
      pv.dataset.style = state.style;
      pv.dataset.font = state.font;
      pv.dataset.mode = state.mode;
      pv.style.setProperty('--a', state.accent);
      if (state.style !== 'luxury') pv.style.setProperty('--a2', second(state.accent));
      else pv.style.removeProperty('--a2');
      pv.style.setProperty('--r', state.radius + 'px');
      frame.style.setProperty('--pv-a', state.accent);
      $$('.pv-name', pv).forEach((n) => { n.textContent = state.name || 'Your Brand'; });
      url.textContent = slug(state.name);
      radiusVal.textContent = state.radius + 'px';
      radiusIn.style.setProperty('--p', (state.radius / 30) * 100 + '%');
      modeBtn.setAttribute('aria-pressed', String(state.mode === 'light'));
      // sync controls
      $$('[data-ctrl]').forEach((g) => {
        const key = g.dataset.ctrl;
        $$('button', g).forEach((b) => b.classList.toggle('active', b.dataset.v === state[key]));
      });
      const msg =
        `Hi Tech Dollez! 👋 I designed this in your Playground — please build it for me:\n\n` +
        `*Business:* ${state.name || 'Your Brand'}\n*Style:* ${cap(state.style)}\n*Accent color:* ${state.accent}\n` +
        `*Font:* ${cap(state.font)}\n*Mode:* ${cap(state.mode)}\n*Corners:* ${state.radius}px`;
      order.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
      if (animate) pop();
    }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    $$('[data-ctrl]').forEach((g) => {
      g.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        state[g.dataset.ctrl] = b.dataset.v;
        render();
      });
    });
    nameIn.addEventListener('input', () => { state.name = nameIn.value.trim(); render(false); });
    radiusIn.addEventListener('input', () => { state.radius = +radiusIn.value; render(false); });
    modeBtn.addEventListener('click', () => { state.mode = state.mode === 'dark' ? 'light' : 'dark'; render(); });

    const pick = (arr) => arr[(Math.random() * arr.length) | 0];
    $('#bRandom').addEventListener('click', (e) => {
      state.style = pick(['neon', 'minimal', 'bold', 'luxury']);
      state.accent = pick(['#7c5cff', '#00d4ff', '#ff3d9a', '#ffb547', '#22e3a5', '#ff5a4e']);
      state.font = pick(['modern', 'classic', 'tech']);
      state.mode = pick(['dark', 'light']);
      state.radius = pick([0, 6, 10, 14, 20, 28]);
      radiusIn.value = state.radius;
      render();
      const r = e.currentTarget.getBoundingClientRect();
      fx.burst(r.left + r.width / 2, r.top + r.height / 2, 34);
    });

    // gentle 3D tilt on preview
    if (finePointer && !reduced) {
      const wrap = pv.closest('.builder__preview');
      wrap.addEventListener('pointermove', (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        frame.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 5}deg)`;
      });
      wrap.addEventListener('pointerleave', () => { frame.style.transform = ''; });
    }
    render(false);
    window.__pv = { state, render, nameIn, radiusIn };
  }
  window.__scramble = scramble;
  window.__fx = fx;

  /* =======================================================
     6. BENTO WIDGETS
     ======================================================= */
  // tile cursor glow
  $$('.tile').forEach((t) => {
    t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', e.clientX - r.left + 'px');
      t.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  // code typing
  const codeEl = $('#codeType');
  if (codeEl) {
    const L = [
      [['c', '// Tech Dollez — building your next big thing']],
      [['k', 'import '], ['p', '{ '], ['f', 'Website'], ['p', ', '], ['f', 'App'], ['p', ' } '], ['k', 'from '], ['s', '"tech-dollez"'], ['p', ';']],
      [],
      [['k', 'export default function '], ['f', 'YourBusiness'], ['p', '() {']],
      [['k', '  return '], ['p', '(']],
      [['t', '    <Website']],
      [['a', '      design'], ['p', '='], ['s', '"premium"']],
      [['a', '      speed'], ['p', '='], ['s', '"blazing"']],
      [['a', '      animations'], ['p', '={'], ['n', 'true'], ['p', '}']],
      [['a', '      mobile'], ['p', '='], ['s', '"pixel-perfect"']],
      [['a', '      growth'], ['p', '={'], ['n', 'Infinity'], ['p', '}']],
      [['t', '    />']],
      [['p', '  );']],
      [['p', '}']],
      [],
      [['c', '// ✦ Made by Arjun Ahirwar']]
    ];
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    function htmlUpTo(n) {
      // render first n characters of the whole program
      let out = '', left = n;
      for (const line of L) {
        for (const [cls, txt] of line) {
          if (left <= 0) break;
          const part = txt.slice(0, left);
          out += `<span class="${cls}">${esc(part)}</span>`;
          left -= part.length;
        }
        if (left <= 0) break;
        out += '\n'; left -= 1;
      }
      return out;
    }
    const total = L.reduce((a, l) => a + l.reduce((b, [, t]) => b + t.length, 0) + 1, 0);
    if (reduced) codeEl.innerHTML = htmlUpTo(total);
    else onView(codeEl, () => {
      let n = 0;
      (function type() {
        n += 1 + (Math.random() < 0.3 ? 1 : 0);
        codeEl.innerHTML = htmlUpTo(n) + '<span class="cur"></span>';
        if (n < total) setTimeout(type, 22 + Math.random() * 40);
        else setTimeout(() => { n = 0; type(); }, 4200);
      })();
    });
  }

  // lighthouse rings
  $$('.ring').forEach((r) => {
    const score = +r.dataset.score;
    const fg = $('.ring__fg', r);
    const b = $('b', r);
    onView(r, () => {
      fg.style.strokeDashoffset = String(213.6 - (213.6 * score) / 100);
      const start = performance.now();
      (function tick(now) {
        const p = Math.min(1, (now - start) / 1800);
        b.textContent = Math.round(score * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  });

  // live IST clock + availability
  const clockEl = $('#liveClock');
  if (clockEl) {
    const statusEl = $('#liveStatus');
    const live = statusEl.parentElement;
    const noteEl = $('#liveNote');
    const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false });
    function tick() {
      const now = new Date();
      clockEl.textContent = fmt.format(now).toUpperCase();
      const h = +hourFmt.format(now);
      const online = h >= 9 && h < 22;
      live.classList.toggle('off', !online);
      const hi = window.__lang === 'hi';
      statusEl.textContent = online ? (hi ? 'अभी ऑनलाइन' : 'Online now') : (hi ? 'अभी दूर · सुबह 9 बजे वापस' : 'Away · back at 9 AM');
      noteEl.textContent = online ? (hi ? 'WhatsApp पर जल्दी जवाब।' : 'Replies on WhatsApp — fast.') : (hi ? 'WhatsApp पर मैसेज छोड़ें — सुबह सबसे पहले जवाब।' : 'Leave a WhatsApp message — we reply first thing.');
    }
    tick();
    setInterval(tick, 1000);
  }

  // responsive morph
  const morph = $('#morph');
  if (morph) {
    const modes = ['desktop', 'tablet', 'mobile'];
    const label = $('#morphLabel');
    let mi = 0;
    setInterval(() => {
      if (document.hidden) return;
      mi = (mi + 1) % modes.length;
      morph.dataset.mode = modes[mi];
      const HI_M = { desktop: 'डेस्कटॉप', tablet: 'टैबलेट', mobile: 'मोबाइल' };
      scramble(label, window.__lang === 'hi' ? HI_M[modes[mi]] : modes[mi].charAt(0).toUpperCase() + modes[mi].slice(1), 500);
    }, 2400);
  }

  /* =======================================================
     7. PROJECT PLANNER
     ======================================================= */
  const planner = $('#planner');
  if (planner) {
    const steps = $$('.pl-step', planner);
    const back = $('#plBack'), next = $('#plNext'), send = $('#plSend');
    const label = $('#plStepLabel'), prog = $('#plProgress');
    const note = $('#formNote'), summary = $('#plSummary');
    let cur = 1;

    $$('.chips', planner).forEach((g) => {
      const multi = g.dataset.multi === 'true';
      g.addEventListener('click', (e) => {
        const c = e.target.closest('.chip');
        if (!c) return;
        if (multi) c.classList.toggle('on');
        else $$('.chip', g).forEach((x) => x.classList.toggle('on', x === c && !x.classList.contains('on')));
        if (c.classList.contains('on')) {
          const r = c.getBoundingClientRect();
          fx.burst(r.left + r.width / 2, r.top + r.height / 2, 12);
        }
      });
    });
    const picked = (name) => $$(`.chips[data-name="${name}"] .chip.on`, planner).map((c) => c.dataset.v);

    function show(n, dir = 1) {
      cur = n;
      steps.forEach((s) => {
        const on = +s.dataset.step === n;
        s.classList.toggle('active', on);
        s.classList.toggle('back', on && dir < 0);
      });
      label.textContent = window.__lang === 'hi' ? `स्टेप ${n} / 3` : `Step ${n} of 3`;
      prog.style.width = (n / 3) * 100 + '%';
      back.hidden = n === 1;
      next.hidden = n === 3;
      send.hidden = n !== 3;
      note.classList.remove('err');
      note.textContent = window.__lang === 'hi' ? 'आपका ब्रीफ़ WhatsApp में खुलेगा, भेजने के लिए तैयार।' : 'Your brief opens in WhatsApp, ready to send.';
      if (n === 3) {
        const f = picked('features'), t = picked('timeline');
        summary.innerHTML =
          `<b>Services:</b> ${picked('services').join(', ')}<br>` +
          `<b>Features:</b> ${f.length ? f.join(', ') : '—'}<br>` +
          `<b>Timeline:</b> ${t.length ? t[0] : 'Not decided'}`;
        setTimeout(() => $('#fName').focus({ preventScroll: true }), 350);
      }
    }

    next.addEventListener('click', () => {
      if (cur === 1 && !picked('services').length) {
        const g = $('.chips[data-name="services"]', planner);
        g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake');
        note.textContent = 'Pick at least one service to continue.';
        note.classList.add('err');
        return;
      }
      show(cur + 1, 1);
    });
    back.addEventListener('click', () => show(cur - 1, -1));

    planner.addEventListener('submit', (e) => {
      e.preventDefault();
      if (cur !== 3) { next.click(); return; }
      const nameIn = $('#fName');
      const name = nameIn.value.trim();
      const phone = $('#fPhone').value.trim();
      const msg = $('#fMsg').value.trim();
      if (!name) {
        nameIn.closest('.field').classList.add('error');
        note.textContent = 'Please add your name.';
        note.classList.add('err');
        return;
      }
      nameIn.closest('.field').classList.remove('error');
      const f = picked('features'), t = picked('timeline');
      const text =
        `Hi Tech Dollez! 👋 Here's my project brief:\n\n` +
        `*Name:* ${name}\n` + (phone ? `*Phone:* ${phone}\n` : '') +
        `*Services:* ${picked('services').join(', ')}\n` +
        (f.length ? `*Features:* ${f.join(', ')}\n` : '') +
        (t.length ? `*Timeline:* ${t[0]}\n` : '') +
        (msg ? `\n*Details:* ${msg}` : '');
      const r = send.getBoundingClientRect();
      fx.burst(r.left + r.width / 2, r.top + r.height / 2, 40);
      note.textContent = 'Opening WhatsApp…';
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });

    document.addEventListener('td:lang', () => {
      label.textContent = window.__lang === 'hi' ? `स्टेप ${cur} / 3` : `Step ${cur} of 3`;
      if (!note.classList.contains('err')) note.textContent = window.__lang === 'hi' ? 'आपका ब्रीफ़ WhatsApp में खुलेगा, भेजने के लिए तैयार।' : 'Your brief opens in WhatsApp, ready to send.';
    });
    // plan "Get Quote" buttons preselect services
    $$('[data-plan]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const map = { Starter: ['Website'], Business: ['Website', 'SEO'], Custom: ['Mobile App', 'Custom Software'] };
        const want = map[btn.dataset.plan] || [];
        $$('.chips[data-name="services"] .chip', planner).forEach((c) => c.classList.toggle('on', want.includes(c.dataset.v)));
        show(1);
      });
    });
  }

  /* =======================================================
     8. FOOTER LETTERS
     ======================================================= */
  const big = $('.footer__big');
  if (big) {
    const txt = big.textContent.trim();
    big.classList.remove('grad-text');
    big.setAttribute('aria-label', txt); big.setAttribute('role', 'img');
    big.innerHTML = txt.split('').map((ch, i) =>
      ch === ' ' ? '<span class="fl sp" aria-hidden="true"> </span>'
        : `<span class="fl" style="--i:${i}" aria-hidden="true">${ch}</span>`).join('');
    if (!finePointer && !reduced) {
      // on touch: little wave when it enters view
      onView(big, () => {
        $$('.fl', big).forEach((l, i) => {
          setTimeout(() => { l.style.transform = 'translateY(-14%)'; setTimeout(() => { l.style.transform = ''; }, 300); }, i * 60);
        });
      });
    }
  }

  /* =======================================================
     9. ENTRANCE ANIMATIONS (GSAP)
     ======================================================= */
  if (hasGSAP && !reduced) {
    gsap.from('.bento .tile', {
      y: 60, opacity: 0, scale: 0.96, duration: 1.1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.bento', start: 'top 82%' }
    });
    gsap.from('.builder__controls', {
      x: -60, opacity: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.builder__grid', start: 'top 80%' }
    });
    gsap.from('.builder__preview', {
      y: 80, rotateX: 18, opacity: 0, duration: 1.4, ease: 'expo.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.builder__grid', start: 'top 80%' }
    });
    gsap.from('.spot__stage', {
      scale: 0.85, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.spot', start: 'top 75%' }
    });
    ScrollTrigger.refresh();
  }
})();
