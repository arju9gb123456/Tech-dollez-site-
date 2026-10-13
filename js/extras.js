/* =========================================================
   TECH DOLLEZ — Extras
   Portfolio · ERP demo · Before/After · Playground presets
   Website audit · Chat assistant · Command palette · Hindi/English
   Made by Arjun Ahirwar
   ========================================================= */
(function () {
  const WA = '916260993724';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const waLink = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  const fx = window.__fx || { burst() {} };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function scrollToEl(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  function toast(msg, ms = 2600) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  /* =======================================================
     1. PORTFOLIO
     ======================================================= */
  const PROJECTS = [
    {
      id: 'printx-erp', f: 'software', feature: true, live: true, variant: 'dash',
      theme: { t1: '#a855f7', t2: '#ec4899', tbg: 'linear-gradient(135deg,#2a0f3d,#3d0f2a 60%,#3d200f)', tsurf: '#15101f', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'Software · ERP', title: 'PrintX ERP',
      short: 'Order-to-delivery ERP for a B2B custom printing business — five role-based dashboards running the company every day.',
      lead: 'A complete business operating system for a B2B custom printing & dropship company.',
      problem: 'Orders, production, shipping and payments were scattered across WhatsApp chats and spreadsheets — nothing had a single source of truth and deadlines slipped.',
      built: ['Role-based dashboards for Sales, Production, Logistics, Finance & Admin', 'Lead Management CRM with CSV import/export', 'SLA breach tracking & courier tracking links', 'Bulk label printing & Bluedart Excel export', 'GST validation, shipping reconciliation & staff help desk'],
      stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'], tags: ['ERP', 'CRM', 'Logistics'], demo: '#erp'
    },
    {
      id: 'facultypro', f: 'software', feature: true, variant: 'faces',
      theme: { t1: '#22e3a5', t2: '#00d4ff', tbg: 'linear-gradient(135deg,#062a22,#06222e)', tsurf: '#0c1a1a', tline: 'rgba(255,255,255,.08)', ttext: '#fff' },
      cat: 'Software · Education', title: 'FacultyPro',
      short: 'Faculty directory & HR system — 778 faculty profiles, flip-card UI and a serverless AWS backend.',
      lead: 'A searchable faculty directory that grew into a full faculty & HR management platform.',
      problem: 'Faculty information lived in 31 separate department PDFs — impossible to search, update or manage.',
      built: ['Python pipeline that extracted 778 faculty records & 772 photos from 31 PDFs', 'Animated flip-card directory with search & filters', 'AWS serverless backend: API Gateway, Lambda, DynamoDB, S3, Cognito', 'Role-based access, research module & document uploads', 'Full CRUD with an automated test harness'],
      stack: ['JavaScript', 'Python', 'AWS Lambda', 'DynamoDB', 'Cognito', 'S3'], tags: ['HR', 'AWS', 'Directory']
    },
    {
      id: 'surveillance', f: 'software', feature: true, variant: 'map',
      theme: { t1: '#ff5a4e', t2: '#ffb547', tbg: 'linear-gradient(135deg,#2e0d0b,#2e1d08)', tsurf: '#1a1210', tline: 'rgba(255,255,255,.08)', ttext: '#fff' },
      cat: 'Software · Healthcare', title: 'Health Surveillance Dashboard',
      short: 'Disease-surveillance analytics for a hospital — 3,300+ records mapped across 92 districts.',
      lead: 'An analytics dashboard that turns raw hospital OPD data into maps, trends and reports.',
      problem: 'Thousands of patient-visit rows sat in Excel files with no way to see where cases came from or how they were trending.',
      built: ['Excel data cleaning with pincode correction & district mapping', 'Choropleth & density maps with full district GeoJSON', 'Multi-select disease & region filters', 'One-click PDF reports & fullscreen map mode', 'Secure login gate'],
      stack: ['JavaScript', 'Leaflet / GeoJSON', 'Chart.js', 'PDF export'], tags: ['Analytics', 'Maps', 'Reports']
    },
    {
      id: 'bazarville', f: 'web', variant: 'site',
      theme: { t1: '#ec4899', t2: '#fb923c', tbg: 'linear-gradient(135deg,#f6e9f2,#fdf0e6)', tsurf: '#ffffff', tline: 'rgba(0,0,0,.07)', ttext: '#1a1a1a' },
      cat: 'Website · E‑Catalog', title: 'Bazarville Digital Showroom',
      short: 'Apple-clean product showroom with WhatsApp bulk enquiries and its own admin panel.',
      lead: 'A digital showroom where corporate buyers discover products and send bulk enquiries instantly.',
      problem: 'Buyers had to ask for catalogs on WhatsApp one by one — slow for them and for the sales team.',
      built: ['Clean, light, Apple-style product catalog', 'Collections & product pages', 'WhatsApp bulk-enquiry flow', 'Supabase admin panel for products, collections, settings & enquiries'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Supabase', 'Vercel'], tags: ['Catalog', 'Admin Panel']
    },
    {
      id: 'cmch', f: 'web', variant: 'site',
      theme: { t1: '#0ea5e9', t2: '#14b8a6', tbg: 'linear-gradient(135deg,#e0f2fe,#ccfbf1)', tsurf: '#ffffff', tline: 'rgba(0,0,0,.07)', ttext: '#0f172a' },
      cat: 'Website · Healthcare', title: 'Medical College & Hospital',
      short: 'Homepage redesign — from an old PHP site to a modern, fast and responsive front page.',
      lead: 'A modern homepage for a medical college & hospital, rebuilt without losing any content.',
      problem: 'The old site was slow, dated and hard to use on mobile — but every existing link and page had to stay exactly the same.',
      built: ['Light, modern header & hero slider', 'Fully responsive layout', 'Every existing link & content preserved', 'Faster loading static build on Netlify'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Netlify'], tags: ['Redesign', 'Healthcare']
    },
    {
      id: 'nursing', f: 'web', variant: 'site',
      theme: { t1: '#8b5cf6', t2: '#06b6d4', tbg: 'linear-gradient(135deg,#ede9fe,#e0f7fa)', tsurf: '#ffffff', tline: 'rgba(0,0,0,.07)', ttext: '#1e1b4b' },
      cat: 'Website · Education', title: 'College of Nursing',
      short: 'Page-by-page redesign from table & iframe layouts to a clean, responsive college website.',
      lead: 'A nursing college website brought from the early-2000s into today.',
      problem: 'Built with tables and iframes, the old site broke on phones and looked outdated to new students.',
      built: ['Modern responsive design for every page', 'Home, About, Events, Principal’s Pen & Contact redesigned', 'Consistent navigation & typography', 'Mobile-first layouts'],
      stack: ['HTML', 'CSS', 'JavaScript'], tags: ['Redesign', 'Education']
    },
    {
      id: 'oyno', f: 'web', variant: 'app',
      theme: { t1: '#14b8a6', t2: '#22d3ee', tbg: 'linear-gradient(135deg,#071a2e,#0a2533)', tsurf: '#0c1726', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'Website · App Launch', title: 'OYNO — Elite Cricket DRS',
      short: 'Launch website for OutyaNotOut, a cricket review app that captures live moments with a 60-second buffer.',
      lead: 'Marketing website for a cricket DRS app built for players who want proof, not arguments.',
      problem: 'A new app needed a premium site to explain the product and host its legal pages for the app stores.',
      built: ['Dark navy & teal landing page', 'Feature storytelling for clip capture & review', 'Privacy, Terms & Delete-account pages for store compliance', 'Fast static build'],
      stack: ['HTML', 'CSS', 'JavaScript'], tags: ['Landing Page', 'App']
    },
    {
      id: 'salon', f: 'web', variant: 'site',
      theme: { t1: '#d4a24c', t2: '#f5d38a', tbg: 'linear-gradient(135deg,#140f08,#231a0c)', tsurf: '#0f0c08', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'Website · Local Business', title: 'SS Hair Saloon',
      short: 'Modern animated website for a hair salon at Kubereshwar Dham, Sehore.',
      lead: 'A stylish, animated website that makes a local salon look as good as its haircuts.',
      problem: 'Customers could only find the salon by word of mouth — no services, prices or booking online.',
      built: ['Dark & gold premium design', 'Smooth animations', 'Services showcase', 'WhatsApp & call buttons for quick bookings'],
      stack: ['HTML', 'CSS', 'JavaScript'], tags: ['Local Business', 'Animated']
    },
    {
      id: 'edusmart', f: 'concept', concept: true, feature: true, variant: 'dash',
      theme: { t1: '#6366f1', t2: '#22d3ee', tbg: 'linear-gradient(135deg,#111a3d,#0a2a3a)', tsurf: '#0e1428', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'Software · School ERP', title: 'EduSmart School ERP',
      short: 'All-in-one school management — admissions, attendance, fees, exams and a parent app.',
      lead: 'A complete school operating system that replaces registers, Excel sheets and WhatsApp groups.',
      problem: 'Schools juggle paper registers, Excel fee sheets and endless parent calls — data is scattered and nothing is real-time.',
      built: ['Online admissions & student profiles', 'Attendance with instant SMS / WhatsApp alerts to parents', 'Fee collection with UPI, receipts & due reminders', 'Exams, report cards & timetable', 'Parent & teacher mobile app'],
      stack: ['React', 'Node.js', 'PostgreSQL', 'Flutter'], tags: ['ERP', 'Education', 'Mobile App']
    },
    {
      id: 'freshcart', f: 'concept', concept: true, variant: 'app',
      theme: { t1: '#22c55e', t2: '#a3e635', tbg: 'linear-gradient(135deg,#06210f,#1a2a06)', tsurf: '#0b170e', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'App · Grocery Delivery', title: 'FreshCart',
      short: '10-minute grocery delivery app with live order tracking and a store admin dashboard.',
      lead: 'A quick-commerce grocery app for a local supermarket chain going online.',
      problem: 'Neighbourhood stores lose customers to big delivery apps because they have no way to take and track online orders.',
      built: ['Customer app with smart search & one-tap reorder', 'Live rider tracking on the map', 'UPI, card & cash-on-delivery payments', 'Store dashboard for inventory & orders', 'Offers, coupons & push notifications'],
      stack: ['Flutter', 'Node.js', 'MongoDB', 'Google Maps API'], tags: ['Mobile App', 'E‑Commerce']
    },
    {
      id: 'royalstay', f: 'concept', concept: true, variant: 'site',
      theme: { t1: '#c9a227', t2: '#e7c873', tbg: 'linear-gradient(135deg,#2a0a12,#1a0f05)', tsurf: '#140a0c', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'Website · Hospitality', title: 'Royal Heritage Hotel',
      short: 'Luxury hotel website with room booking, photo tours and direct reservations.',
      lead: 'A booking-first website so a heritage hotel earns more from direct bookings instead of paying portal commissions.',
      problem: 'Most bookings came through travel portals that charge heavy commission, and the old website couldn’t take reservations.',
      built: ['Elegant, photo-led luxury design', 'Room availability & instant booking', 'Virtual tour gallery', 'Events & wedding enquiry forms', 'Multi-language support'],
      stack: ['Next.js', 'Tailwind', 'Supabase', 'Razorpay'], tags: ['Booking', 'Luxury']
    },
    {
      id: 'fitpulse', f: 'concept', concept: true, variant: 'app',
      theme: { t1: '#f97316', t2: '#ef4444', tbg: 'linear-gradient(135deg,#2a1206,#2a0808)', tsurf: '#170c08', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'App · Fitness', title: 'FitPulse Gym App',
      short: 'Gym membership app with workout plans, check-ins and trainer chat.',
      lead: 'A member app that keeps gym-goers motivated and gym owners organised.',
      problem: 'Memberships, renewals and diet plans were tracked on paper — members dropped off and renewals were missed.',
      built: ['QR check-in & attendance streaks', 'Personal workout & diet plans', 'Membership renewal reminders & online payment', 'Trainer chat & progress photos', 'Owner dashboard with revenue & retention'],
      stack: ['React Native', 'Node.js', 'MongoDB'], tags: ['Mobile App', 'Fitness']
    },
    {
      id: 'legalease', f: 'concept', concept: true, variant: 'site',
      theme: { t1: '#3b82f6', t2: '#94a3b8', tbg: 'linear-gradient(135deg,#0b1220,#16202f)', tsurf: '#0d1524', tline: 'rgba(255,255,255,.09)', ttext: '#fff' },
      cat: 'Website · Professional', title: 'LegalEase Law Associates',
      short: 'Trust-building law firm website with consultation booking and case-type pages.',
      lead: 'A professional website that turns visitors into consultation bookings.',
      problem: 'Potential clients couldn’t understand the firm’s expertise online, and there was no easy way to book a consultation.',
      built: ['Clean, authoritative design', 'Practice-area pages for SEO', 'Online consultation booking with calendar', 'Client testimonials & FAQs', 'WhatsApp & call quick actions'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Calendly'], tags: ['Professional', 'SEO']
    },
    {
      id: 'jarvis', f: 'lab', variant: 'hud',
      theme: { t1: '#00d4ff', t2: '#3d8bff', tbg: 'radial-gradient(circle at 50% 50%,#062033,#03070d)', tsurf: '#050b12', tline: 'rgba(255,255,255,.08)', ttext: '#fff' },
      cat: 'Labs · AI', title: 'Jarvis AI HUD',
      short: 'Iron‑Man‑style AI assistant interface running on a local LLM via Ollama.',
      lead: 'An experiment in futuristic interfaces — a HUD-style AI assistant powered by a local language model.',
      problem: 'Exploring how AI assistants could feel more alive than a plain chat box — and run privately on your own machine.',
      built: ['Animated HUD interface with rotating rings', 'Local LLM integration through Ollama', 'Real-time responses without cloud APIs'],
      stack: ['JavaScript', 'Ollama', 'LLM'], tags: ['AI', 'Experiment']
    }
  ];

  function thumb(p) {
    const bar = '<div class="mk__bar"><i></i><i></i><i></i></div>';
    const nav = '<div class="nav"><b></b><span class="l"></span><span class="l"></span><span class="l"></span><span class="l"></span></div>';
    switch (p.variant) {
      case 'dash':
        return `<div class="mk mk--dash"><div class="mk__win">${bar}<div class="mk__in"><div class="side"><i></i><i></i><i></i><i></i><i></i></div><div class="main"><div class="row"><div class="box acc"></div><div class="box"></div><div class="box"></div><div class="box"></div></div><div class="chart"><div class="bars">${'<i style="height:' + [45, 70, 55, 85, 60, 95, 75, 88].join('%"></i><i style="height:') + '%"></i>'}</div></div><span class="l m"></span><span class="l s"></span></div></div></div></div>`;
      case 'faces':
        return `<div class="mk"><div class="mk__win">${bar}<div class="mk__in">${nav}<span class="l m"></span><div class="faces">${'<i></i>'.repeat(18)}</div></div></div></div>`;
      case 'map': {
        const dots = [[22, 30, 10], [40, 46, 16], [58, 34, 8], [70, 58, 12], [34, 66, 9], [52, 72, 14], [80, 30, 7], [16, 52, 6]]
          .map(([x, y, s], i) => `<i style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;animation-delay:-${i * 0.3}s"></i>`).join('');
        return `<div class="mk"><div class="mk__win">${bar}<div class="mk__in"><div class="row"><div class="box acc" style="min-height:22px"></div><div class="box" style="min-height:22px"></div><div class="box" style="min-height:22px"></div></div><div class="map">${dots}</div></div></div></div>`;
      }
      case 'app':
        return `<div class="mk mk--app"><div class="ph"><span class="l s"></span><div class="vid"></div><span class="l m"></span><span class="l"></span><div class="row"><div class="box"></div><div class="box"></div></div></div><div class="ph"><span class="l m"></span><span class="l x"></span><span class="l"></span><div class="pill"></div></div></div>`;
      case 'hud':
        return '<div class="mk mk--hud"><div class="hud"><i></i><i></i><i></i><b></b></div></div>';
      default:
        return `<div class="mk"><div class="mk__win">${bar}<div class="mk__in">${nav}<span class="l s acc"></span><span class="l x"></span><span class="l x" style="width:60%"></span><span class="l m"></span><div class="pill"></div><div class="row"><div class="box"></div><div class="box"></div><div class="box"></div></div></div></div></div>`;
    }
  }
  const themeStyle = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');

  const grid = $('#workGrid');
  if (grid) {
    grid.innerHTML = PROJECTS.map((p) => `
      <div class="wk${p.feature ? ' feature' : ''}" data-f="${p.f}" data-id="${p.id}" style="${themeStyle(p.theme)}" tabindex="0" role="button" aria-label="Open case study: ${esc(p.title)}">
        <div class="card__glow"></div>
        <div class="wk__thumb">${thumb(p)}${p.live ? '<span class="wk__live"><i></i>Live in production</span>' : ''}${p.concept ? '<span class="wk__concept">✦ Concept design</span>' : ''}<span class="wk__open">↗</span></div>
        <div class="wk__body">
          <span class="wk__cat">${esc(p.cat)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.short)}</p>
          <div class="wk__tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
      </div>`).join('');
    grid.style.gridAutoFlow = 'dense';

    // hover glow + subtle tilt
    $$('.wk', grid).forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', px * 100 + '%');
        c.style.setProperty('--my', py * 100 + '%');
        if (finePointer && !reduced) c.style.transform = `rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-4px)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
      c.addEventListener('click', () => openModal(c.dataset.id));
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(c.dataset.id); } });
      // card glow uses .card__glow styles; give it accent
      c.style.setProperty('--accent', c.style.getPropertyValue('--t1'));
    });

    // filters
    $('#workFilters').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('#workFilters button').forEach((x) => x.classList.toggle('active', x === b));
      const f = b.dataset.f;
      const cards = $$('.wk', grid);
      cards.forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.f !== f));
      if (hasGSAP && !reduced) gsap.fromTo(cards.filter((c) => !c.classList.contains('is-hidden')), { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out', clearProps: 'transform,opacity' });
    });
  }

  /* ---------- Case study modal ---------- */
  const modal = $('#workModal');
  let lastFocus = null;
  function openModal(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;
    const panel = $('.modal__panel', modal);
    panel.setAttribute('style', themeStyle(p.theme));
    $('#mThumb').innerHTML = thumb(p);
    $('#mCat').textContent = p.cat;
    $('#mCat').style.color = p.theme.t1;
    $('#mTitle').textContent = p.title;
    $('#mLead').textContent = p.lead;
    $('#mProblem').textContent = p.problem;
    const labels = $$('.modal__cols b', modal);
    labels[0].textContent = p.concept ? 'The idea' : 'The challenge';
    labels[1].textContent = p.concept ? 'What it includes' : 'What we built';
    $('#mCat').textContent = p.concept ? `Concept design · ${p.cat}` : p.cat;
    $('#mBuilt').innerHTML = p.built.map((b) => `<li>${esc(b)}</li>`).join('');
    $('#mStack').innerHTML = p.stack.map((s) => `<span>${esc(s)}</span>`).join('');
    const cta = $('#mCta');
    cta.href = waLink(p.concept
      ? `Hi Tech Dollez! 👋 I liked your "${p.title}" concept. I want something like this for my business.`
      : `Hi Tech Dollez! 👋 I saw your "${p.title}" project. I want something similar for my business.`);
    let demoBtn = $('#mDemo');
    if (p.demo) {
      if (!demoBtn) {
        demoBtn = document.createElement('button');
        demoBtn.id = 'mDemo'; demoBtn.type = 'button'; demoBtn.className = 'btn btn--ghost';
        demoBtn.style.marginLeft = '10px';
        cta.after(demoBtn);
      }
      demoBtn.textContent = 'Try the live demo ↓';
      demoBtn.onclick = () => { closeModal(); setTimeout(() => scrollToEl(p.demo), 250); };
    } else if (demoBtn) demoBtn.remove();
    modal.hidden = false;
    document.body.classList.add('modal-open');
    if (window.__lenis) window.__lenis.stop();
    setTimeout(() => $('.modal__close', modal).focus(), 50);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (window.__lenis) window.__lenis.start();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  if (modal) modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });

  /* =======================================================
     2. ERP DEMO
     ======================================================= */
  const ERP = {
    sales: () => `
      <div class="e-top"><div><small>Good afternoon, Sales team</small><p class="e-h">Sales Dashboard</p></div><span class="e-badge">● Live sync</span></div>
      <div class="e-kpis">
        ${kpi('Orders today', '48', '+12%')}${kpi('Revenue (MTD)', '₹3.2L', '+8%')}${kpi('New leads', '23', '+15%')}${kpi('Conversion', '34%', '+3%')}
      </div>
      <div class="e-wrap"><table class="e-table">
        <tr><th>Order</th><th>Client</th><th>Product</th><th>Qty</th><th>Status</th></tr>
        ${row('#PX-2481', 'Acme Corp', 'Custom T‑Shirts', '250', '<span class="st p">In production</span>')}
        ${row('#PX-2480', 'BlueLeaf Cafe', 'Printed Mugs', '120', '<span class="st b">Design approval</span>')}
        ${row('#PX-2479', 'Nova Tech', 'Branded Diaries', '400', '<span class="st y">Dispatched</span>')}
        ${row('#PX-2478', 'Shree Events', 'Hoodies', '80', '<span class="st g">Delivered</span>')}
        ${row('#PX-2477', 'Urban Gym', 'Caps', '150', '<span class="st r">SLA risk</span>')}
      </table></div>`,
    production: () => `
      <div class="e-top"><div><small>Production floor</small><p class="e-h">Job Board</p></div><span class="e-badge">9 active jobs</span></div>
      <div class="e-kanban">
        ${col('Design', [['Acme Corp · T‑Shirts', 'Artwork v2', 40], ['BlueLeaf · Mugs', 'Awaiting approval', 20]])}
        ${col('Printing', [['Nova Tech · Diaries', 'Screen print', 65], ['Urban Gym · Caps', 'Embroidery', 55], ['Zen Yoga · Totes', 'DTF print', 80]])}
        ${col('Quality Check', [['Shree · Hoodies', 'Batch 2 of 2', 90], ['Metro Bank · Pens', 'Final check', 95]])}
        ${col('Ready to Ship', [['Pixel Labs · Stickers', 'Packed', 100], ['Green Farms · Bags', 'Label printed', 100]])}
      </div>`,
    logistics: () => `
      <div class="e-top"><div><small>Shipments & couriers</small><p class="e-h">Logistics Tracker</p></div><span class="e-badge">Bulk labels ready</span></div>
      <div class="e-track">
        ${ship('Nova Tech · #PX-2479', 'Bluedart · AWB 7810 2245 91', 3, '<span class="st b">In transit</span>')}
        ${ship('Shree Events · #PX-2478', 'Delhivery · AWB 1462 8830 07', 5, '<span class="st g">Delivered</span>')}
        ${ship('Urban Gym · #PX-2477', 'Bluedart · AWB 7810 2245 88', 1, '<span class="st r">SLA breach in 6h</span>')}
      </div>`,
    finance: () => `
      <div class="e-top"><div><small>Accounts & GST</small><p class="e-h">Finance Overview</p></div><span class="e-badge">GST verified</span></div>
      <div class="e-kpis">
        ${kpi('Invoiced', '₹8.4L', '+11%')}${kpi('Received', '₹6.9L', '+9%')}${kpi('Pending', '₹1.5L', '-4%', true)}${kpi('GST collected', '₹1.28L', '+11%')}
      </div>
      <div class="e-grid2">
        <div class="e-panel"><b>Monthly revenue</b><div class="e-bars">
          ${[['May', 48], ['Jun', 62], ['Jul', 55], ['Aug', 74], ['Sep', 81], ['Oct', 92]].map(([m, h], i) => `<div><i style="height:${h}%;animation-delay:${i * 0.07}s"></i><small>${m}</small></div>`).join('')}
        </div></div>
        <div class="e-panel"><b>Payment summary</b><div class="e-lines">
          <div><span>Online / UPI</span><b>₹4.1L</b></div><div><span>Bank transfer</span><b>₹2.3L</b></div><div><span>Cash</span><b>₹0.5L</b></div><div><span>Overdue invoices</span><b style="color:var(--pink)">7</b></div>
        </div></div>
      </div>`,
    admin: () => `
      <div class="e-top"><div><small>Users, roles & help desk</small><p class="e-h">Admin Console</p></div><span class="e-badge">2 open tickets</span></div>
      <div class="e-users">
        ${user('SA', 'Sales Team', '4 users · Sales role', '<span class="st g">Active</span>')}
        ${user('PR', 'Production', '6 users · Production role', '<span class="st g">Active</span>')}
        ${user('LG', 'Logistics', '3 users · Logistics role', '<span class="st g">Active</span>')}
        ${user('FN', 'Finance', '2 users · Finance role', '<span class="st g">Active</span>')}
        ${user('HD', 'Help Desk', 'Ticket: Label printer offline', '<span class="st y">In progress</span>')}
        ${user('HD', 'Help Desk', 'Ticket: New user access', '<span class="st b">Assigned</span>')}
      </div>`
  };
  function kpi(l, v, d, dn) { return `<div class="e-kpi"><small>${l}</small><b>${v}</b><em class="${dn ? 'dn' : ''}">${d}</em></div>`; }
  function row(...c) { return `<tr>${c.map((x) => `<td>${x}</td>`).join('')}</tr>`; }
  function col(name, items) {
    return `<div class="e-col"><b>${name}<span>${items.length}</span></b>${items.map(([t, s, p], i) => `<div class="e-card" style="animation-delay:${i * 0.07}s">${t}<small>${s}</small><div class="bar"><i style="width:${p}%"></i></div></div>`).join('')}</div>`;
  }
  function ship(t, s, step, st) {
    const steps = Array.from({ length: 5 }, (_, i) => `<i class="${i < step ? 'on' : ''}${i === step - 1 && step < 5 ? ' now' : ''}"></i>`).join('');
    return `<div class="e-ship"><div><b>${t}</b><br><small>${s}</small></div>${st}<div class="e-steps">${steps}</div><small>Packed</small><small style="text-align:right">Delivered</small></div>`;
  }
  function user(i, n, s, st) { return `<div class="e-user"><i>${i}</i><div><b>${n}</b><small>${s}</small></div>${st}</div>`; }

  const erpMain = $('#erpMain');
  if (erpMain) {
    const show = (tab) => {
      erpMain.innerHTML = ERP[tab]();
      erpMain.style.animation = 'none'; void erpMain.offsetWidth; erpMain.style.animation = '';
    };
    show('sales');
    $('.erp__side').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-tab]');
      if (!b) return;
      $$('.erp__side button').forEach((x) => x.classList.toggle('active', x === b));
      show(b.dataset.tab);
    });
  }

  /* =======================================================
     3. BEFORE / AFTER
     ======================================================= */
  const ba = $('#ba');
  if (ba) {
    const range = $('#baRange');
    const set = (v) => ba.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => set(range.value));
    // hint animation once visible
    if (!reduced) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const seq = [50, 80, 20, 50];
        let i = 0;
        const step = () => {
          if (i >= seq.length - 1) return;
          const from = seq[i], to = seq[i + 1], t0 = performance.now();
          (function tick(now) {
            const p = Math.min(1, (now - t0) / 700);
            const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
            set(v); range.value = v;
            if (p < 1) requestAnimationFrame(tick); else { i++; setTimeout(step, 150); }
          })(t0);
        };
        setTimeout(step, 400);
      }, { threshold: 0.5 });
      io.observe(ba);
    }
  }

  /* =======================================================
     4. PLAYGROUND PRESETS
     ======================================================= */
  const PRESETS = {
    salon: { name: 'Glow Studio', style: 'luxury', accent: '#ffb547', font: 'classic', mode: 'dark', radius: 6, tag: 'Book in 30 seconds', h: 'Look your best at <em class="pv-name"></em>', p: 'Haircuts, styling, grooming & bridal makeup — by expert stylists.', c1: 'Book Now', c2: 'See Services', nav: ['Services', 'Gallery', 'Prices'], cards: ['Expert stylists', 'Premium products', 'Easy booking'] },
    restaurant: { name: 'Spice Route', style: 'bold', accent: '#ff5a4e', font: 'modern', mode: 'light', radius: 14, tag: 'Now taking orders', h: 'Taste the magic of <em class="pv-name"></em>', p: 'Fresh, hot and delicious — dine in, take away or order online.', c1: 'Order Online', c2: 'View Menu', nav: ['Menu', 'Specials', 'Visit'], cards: ['Fresh daily', 'Fast delivery', 'Family seating'] },
    clinic: { name: 'CarePlus Clinic', style: 'minimal', accent: '#00d4ff', font: 'modern', mode: 'light', radius: 20, tag: 'Same-day appointments', h: 'Trusted care at <em class="pv-name"></em>', p: 'Experienced doctors, modern diagnostics and care that puts you first.', c1: 'Book Appointment', c2: 'Our Doctors', nav: ['Doctors', 'Services', 'Timings'], cards: ['Expert doctors', 'Modern lab', 'Online booking'] },
    college: { name: 'Bright Future College', style: 'neon', accent: '#7c5cff', font: 'modern', mode: 'dark', radius: 16, tag: 'Admissions 2026 open', h: 'Shape your future at <em class="pv-name"></em>', p: 'Top faculty, modern labs and a campus built for success.', c1: 'Apply Now', c2: 'Courses', nav: ['Courses', 'Campus', 'Admissions'], cards: ['Top faculty', 'Smart labs', 'Placements'] },
    shop: { name: 'Urban Threads', style: 'bold', accent: '#ff3d9a', font: 'modern', mode: 'dark', radius: 10, tag: 'New collection live', h: 'Shop the latest at <em class="pv-name"></em>', p: 'Trendy styles, great prices and doorstep delivery across India.', c1: 'Shop Now', c2: 'New Arrivals', nav: ['Shop', 'Offers', 'Track Order'], cards: ['Free shipping', 'Easy returns', 'Secure payment'] },
    startup: { name: 'Nexora AI', style: 'neon', accent: '#22e3a5', font: 'tech', mode: 'dark', radius: 12, tag: 'Now in beta', h: 'Build faster with <em class="pv-name"></em>', p: 'The smartest way to automate your workflow — powered by AI.', c1: 'Start Free', c2: 'Watch Demo', nav: ['Product', 'Pricing', 'Docs'], cards: ['AI powered', 'Bank-grade security', '99.9% uptime'] }
  };
  const presetsEl = $('#presets');
  const pv = $('#pv');
  if (presetsEl && pv && window.__pv) {
    presetsEl.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-preset]');
      if (!b) return;
      const p = PRESETS[b.dataset.preset];
      $$('button', presetsEl).forEach((x) => x.classList.toggle('active', x === b));
      const { state, render, nameIn, radiusIn } = window.__pv;
      Object.assign(state, { name: p.name, style: p.style, accent: p.accent, font: p.font, mode: p.mode, radius: p.radius });
      nameIn.value = p.name; radiusIn.value = p.radius;
      $('.pv-tag', pv).textContent = p.tag;
      $('.pv-hero h3', pv).innerHTML = p.h;
      $('.pv-hero p', pv).textContent = p.p;
      const ctas = $$('.pv-ctas .pv-btn', pv);
      ctas[0].textContent = p.c1; ctas[1].textContent = p.c2;
      $$('.pv-nav nav span', pv).forEach((s, i) => { s.textContent = p.nav[i]; });
      $$('.pv-card b', pv).forEach((s, i) => { s.textContent = p.cards[i]; });
      render();
      const r = b.getBoundingClientRect();
      fx.burst(r.left + r.width / 2, r.top + r.height / 2, 20);
    });
  }

  /* =======================================================
     5. WEBSITE AUDIT (Google PageSpeed Insights)
     ======================================================= */
  const auditForm = $('#auditForm');
  if (auditForm) {
    const urlIn = $('#auditUrl'), out = $('#auditResult'), btn = $('#auditBtn');
    let strategy = 'mobile', busy = false;
    $('#auditStrat').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      strategy = b.dataset.s;
      $$('#auditStrat button').forEach((x) => x.classList.toggle('active', x === b));
    });

    function normalize(v) {
      v = v.trim();
      if (!v) return null;
      if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
      try {
        const u = new URL(v);
        if (!u.hostname.includes('.') || u.hostname.length < 4) return null;
        return u.href;
      } catch (e) { return null; }
    }
    const MSGS = ['Connecting to Google Lighthouse…', 'Loading your website…', 'Measuring speed & Core Web Vitals…', 'Checking SEO signals…', 'Testing accessibility…', 'Reviewing best practices…', 'Almost there — crunching numbers…'];
    const cls = (s) => (s >= 90 ? 'good' : s >= 50 ? 'mid' : 'bad');

    auditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;
      const url = normalize(urlIn.value);
      if (!url) {
        auditForm.classList.remove('shake'); void auditForm.offsetWidth; auditForm.classList.add('shake');
        toast('Please enter a valid website, e.g. yourwebsite.com');
        return;
      }
      busy = true; btn.disabled = true;
      out.hidden = false;
      out.innerHTML = `<div class="scan"><div class="radar"><i></i></div><div class="scan__msg" id="scanMsg">${MSGS[0]}</div><div class="scan__sub">Real Google audit — usually takes 15–40 seconds.</div></div>`;
      let mi = 0;
      const msgEl = $('#scanMsg');
      const mt = setInterval(() => { mi = Math.min(mi + 1, MSGS.length - 1); if (window.__scramble) window.__scramble(msgEl, MSGS[mi], 500); else msgEl.textContent = MSGS[mi]; }, 3800);

      const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(url) +
        '&strategy=' + strategy + '&category=performance&category=accessibility&category=best-practices&category=seo';
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 75000);
      try {
        const res = await fetch(api, { signal: ctrl.signal });
        const data = await res.json();
        if (!res.ok || !data.lighthouseResult) throw new Error((data.error && data.error.message) || 'Audit failed');
        const c = data.lighthouseResult.categories, a = data.lighthouseResult.audits;
        const scores = [
          ['Performance', Math.round((c.performance && c.performance.score || 0) * 100)],
          ['Accessibility', Math.round((c.accessibility && c.accessibility.score || 0) * 100)],
          ['Best Practices', Math.round((c['best-practices'] && c['best-practices'].score || 0) * 100)],
          ['SEO', Math.round((c.seo && c.seo.score || 0) * 100)]
        ];
        const avg = Math.round(scores.reduce((s, x) => s + x[1], 0) / 4);
        const m = (k) => (a[k] && a[k].displayValue) || '—';
        const grade = avg >= 90 ? ['Excellent', 'g-good'] : avg >= 50 ? ['Needs work', 'g-mid'] : ['Poor', 'g-bad'];
        const host = new URL(url).hostname;
        const msg = `Hi Tech Dollez! 👋 I ran your free audit on ${host} (${strategy}).\n\n` +
          scores.map(([n, s]) => `*${n}:* ${s}/100`).join('\n') + `\n\nI want to improve my website.`;
        out.innerHTML = `
          <div class="res__head"><div><b>Results for ${esc(host)}</b><small>${esc(url)} · ${strategy}</small></div><span class="res__grade ${grade[1]}">${grade[0]} · ${avg}/100</span></div>
          <div class="res__rings">${scores.map(([n, s]) => `
            <div class="res__ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" class="bg"/><circle cx="50" cy="50" r="40" class="fg c-${cls(s)}" data-s="${s}"/></svg><b class="c-${cls(s)}">${s}</b><span>${n}</span></div>`).join('')}
          </div>
          <div class="res__metrics">
            <div class="res__metric"><small>First Contentful Paint</small><b>${esc(m('first-contentful-paint'))}</b></div>
            <div class="res__metric"><small>Largest Contentful Paint</small><b>${esc(m('largest-contentful-paint'))}</b></div>
            <div class="res__metric"><small>Total Blocking Time</small><b>${esc(m('total-blocking-time'))}</b></div>
            <div class="res__metric"><small>Layout Shift (CLS)</small><b>${esc(m('cumulative-layout-shift'))}</b></div>
          </div>
          <div class="res__cta"><p>${avg >= 90 ? 'Great scores! 🎉 Want a design that looks as good as it performs? <b>Let’s make it unforgettable.</b>' : `Your website scores <b>${avg}/100</b>. Slow sites lose customers — <b>we can take it to 90+.</b>`}</p>
          <a class="btn btn--primary" href="${waLink(msg)}" target="_blank" rel="noopener"><span>Fix my website</span></a></div>`;
        requestAnimationFrame(() => {
          $$('.res__ring .fg', out).forEach((r) => { r.style.strokeDashoffset = String(251.3 - 251.3 * (+r.dataset.s / 100)); });
        });
        const r = out.getBoundingClientRect();
        fx.burst(r.left + r.width / 2, r.top + 80, 36);
      } catch (err) {
        out.innerHTML = `<div class="res__err"><b>We couldn't audit that site right now.</b>
          <p>Google's free audit may be busy, or the site blocked the test. No problem — Arjun will check it personally and send you a free report.</p>
          <a class="btn btn--primary" href="${waLink(`Hi Tech Dollez! 👋 Please do a free audit of my website: ${url}`)}" target="_blank" rel="noopener"><span>Get free manual audit</span></a></div>`;
      } finally {
        clearInterval(mt); clearTimeout(to);
        busy = false; btn.disabled = false;
      }
    });
  }

  /* =======================================================
     6. CHAT ASSISTANT (instant answers → WhatsApp)
     ======================================================= */
  const chat = $('#chat');
  if (chat) {
    const panel = $('#chatPanel'), body = $('#chatBody'), quick = $('#chatQuick'), form = $('#chatForm'), input = $('#chatInput');
    let opened = false;
    const QUICK = [['🛠️ Services', 'What services do you offer?'], ['💰 Pricing', 'How much does a website cost?'], ['⏱️ Timeline', 'How long does it take?'], ['📁 Our work', 'Show me your work'], ['🔍 Free audit', 'Can you audit my website?'], ['💬 Talk to Arjun', 'I want to talk to Arjun']];
    const R = [
      [/^(hi+|hello|hey|namaste|hlo|helo|yo)\b/, () => ({ t: 'Hey! 👋 Great to see you here. Ask me anything about websites, apps or software — or tap a quick option below.' })],
      [/thank|thanks|shukriya|dhanyavad|great|awesome|nice/, () => ({ t: 'Happy to help! 😊 Whenever you’re ready, Arjun is just one WhatsApp message away.', wa: 'Hi Tech Dollez! I want to discuss a project.' })],
      [/price|cost|rate|charge|kitna|kitne ka|paisa|paise|budget|fee|₹|quote|quotation/, () => ({ t: 'Every project is custom, so pricing depends on pages, features and timeline. Share what you need and you’ll get a clear quote on WhatsApp — no hidden costs. 🎁 Not sure yet? You can also get a <b>free homepage concept</b>.', wa: 'Hi Tech Dollez! I want a quote for my project.' })],
      [/how long|time|days|din|week|timeline|deadline|jaldi|urgent|kab tak/, () => ({ t: 'A standard business website usually takes <b>1–3 weeks</b>. Apps and custom software are planned in milestones — you get a clear timeline before we start, plus regular previews.' })],
      [/audit|speed|slow|score|lighthouse|performance/, () => ({ t: 'Yes! Try our <b>free website audit</b> — it runs a real Google Lighthouse test on any site in seconds.', go: '#audit', goLabel: 'Open free audit' })],
      [/work|portfolio|project|example|sample|client|banaya|previous/, () => ({ t: 'We’ve built an ERP that runs a printing company, hospital analytics dashboards, a faculty HR system on AWS, and websites for colleges, salons and app launches.', go: '#work', goLabel: 'See our work' })],
      [/erp|crm|software|dashboard|billing|inventory|system|admin panel/, () => ({ t: 'Custom software is our specialty — ERPs, CRMs, dashboards, billing & automation built exactly around how your business runs. Check out the live <b>PrintX ERP</b> demo on this page!', go: '#erp', goLabel: 'Try ERP demo' })],
      [/\bapp\b|android|ios|mobile app|play ?store/, () => ({ t: 'We build smooth Android & iOS apps with clean, easy interfaces — plus the launch website and store pages.', wa: 'Hi Tech Dollez! I want to build a mobile app.' })],
      [/redesign|old (site|website)|purani|update (my )?(site|website)|revamp/, () => ({ t: 'Redesigns are our favorite! We make old sites fast, modern and mobile-friendly while keeping your content and SEO safe. Drag the before/after slider to see the difference.', go: '#compare', goLabel: 'See before / after' })],
      [/seo|google|rank|search/, () => ({ t: 'We handle technical SEO, speed optimization and Google setup so customers can actually find you.' })],
      [/domain|hosting|email|server|ssl/, () => ({ t: 'We help you buy and set up your domain, hosting, SSL and business email — everything ready to go live.' })],
      [/service|offer|what do you do|kya karte|kya kya/, () => ({ t: 'We do: 🌐 Website design & development, 📱 App development, ⚙️ Custom software & ERP, ♻️ Website redesign, 🚀 SEO & growth, 🎨 UI/UX.', go: '#services', goLabel: 'View services' })],
      [/design|playground|look|style|theme/, () => ({ t: 'Want to play designer? Our <b>live Playground</b> lets you pick a style, color and font and see your website change instantly.', go: '#playground', goLabel: 'Open playground' })],
      [/contact|whatsapp|call|number|phone|talk|baat|arjun|human|person/, () => ({ t: 'You can reach Arjun directly on WhatsApp or call <b>+91 62609 93724</b>. He usually replies fast!', wa: 'Hi Arjun! I came from the Tech Dollez website and want to talk.' })],
      [/hindi|हिंदी|hinglish/, () => ({ t: 'Haan bilkul! 😊 Aap Hindi ya Hinglish mein baat kar sakte hain — WhatsApp pe Arjun se seedha baat karein.', wa: 'Namaste! Mujhe website/app banwani hai.' })]
    ];
    function reply(q) {
      const s = q.toLowerCase();
      for (const [re, fn] of R) if (re.test(s)) return fn();
      return { t: 'Good question! Arjun can answer that best — send it on WhatsApp and you’ll get a proper reply quickly.', wa: `Hi Tech Dollez! I have a question: ${q}` };
    }
    function add(html, who = 'bot') {
      const d = document.createElement('div');
      d.className = 'msg ' + who;
      d.innerHTML = html;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }
    function bot(r) {
      const t = add('<i></i><i></i><i></i>', 'bot typing');
      setTimeout(() => {
        t.remove();
        let html = r.t;
        if (r.wa) html += `<br><a class="msg__wa" href="${waLink(r.wa)}" target="_blank" rel="noopener">💬 Chat on WhatsApp</a>`;
        if (r.go) html += `<br><a class="msg__wa" style="background:var(--violet)" href="${r.go}" data-go="${r.go}">${r.goLabel} →</a>`;
        add(html, 'bot');
      }, 650 + Math.random() * 500);
    }
    function ask(q) {
      if (!q.trim()) return;
      add(esc(q), 'me');
      bot(reply(q));
    }
    function open() {
      chat.classList.add('open');
      panel.hidden = false;
      if (!opened) {
        opened = true;
        quick.innerHTML = QUICK.map(([l, q]) => `<button type="button" data-q="${esc(q)}">${l}</button>`).join('');
        bot({ t: 'Hi! 👋 I’m the Tech Dollez assistant — I answer common questions instantly. For anything specific, I’ll connect you to Arjun on WhatsApp.' });
      }
      setTimeout(() => input.focus({ preventScroll: true }), 300);
    }
    function close() { chat.classList.remove('open'); panel.hidden = true; }
    window.__openChat = open;
    $('#chatLaunch').addEventListener('click', open);
    $('#chatClose').addEventListener('click', close);
    quick.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.dataset.q); });
    form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); input.value = ''; });
    body.addEventListener('click', (e) => {
      const g = e.target.closest('[data-go]');
      if (!g) return;
      e.preventDefault();
      if (window.innerWidth < 640) close();
      scrollToEl(g.dataset.go);
    });
    // stop page smooth-scroll from hijacking chat scroll
    body.setAttribute('data-lenis-prevent', '');
  }

  /* =======================================================
     7. LANGUAGE (EN / हिंदी)
     ======================================================= */
  const HI = [
    ['.nav__links a[href="#services"]', 'सर्विसेज़'], ['.nav__links a[href="#work"]', 'हमारा काम'], ['.nav__links a[href="#playground"]', 'प्लेग्राउंड'],
    ['.nav__links a[href="#audit"]', 'फ्री ऑडिट'], ['.nav__links a[href="#about"]', 'हमारे बारे में'], ['.nav__links a[href="#contact"]', 'संपर्क'],
    ['.hero .pill', '<span class="pill__dot"></span> Tech Dollez · वेब और ऐप स्टूडियो · भोपाल'],
    ['.hero .line__inner', ['हम बनाते हैं', 'आपकी डिजिटल दुनिया।']],
    ['.rot-pre', 'हमारी खासियत:'],
    ['.hero__sub', 'Tech Dollez प्रीमियम वेबसाइट, मोबाइल ऐप और कस्टम सॉफ़्टवेयर बनाता है — तेज़, खूबसूरत और आपके बिज़नेस को आगे बढ़ाने के लिए।'],
    ['.hero__ctas .btn--primary span', 'अपना प्रोजेक्ट शुरू करें'], ['.hero__ctas .btn--ghost', 'सर्विसेज़ देखें'],
    ['#services .eyebrow', 'सर्विसेज़'], ['#services .section__title', 'सब कुछ डिजिटल।<br><span class="grad-text">एक ही जगह।</span>'],
    ['#services .section__desc', 'पहले लैंडिंग पेज से लेकर पूरे बिज़नेस सिस्टम तक — एक टीम, एक स्टैंडर्ड: प्रीमियम।'],
    ['.services__grid .card h3', ['वेबसाइट डिज़ाइन', 'वेब डेवलपमेंट', 'ऐप डेवलपमेंट', 'कस्टम सॉफ़्टवेयर', 'वेबसाइट रीडिज़ाइन', 'SEO और ग्रोथ']],
    ['.services__grid .card p', ['मोशन और 3D के साथ पिक्सेल-परफ़ेक्ट डिज़ाइन, जो आपके ब्रांड को सबसे अलग दिखाए।', 'मॉडर्न फ़्रेमवर्क से बनी बेहद तेज़, सुरक्षित और स्केलेबल वेबसाइट और वेब ऐप्स।', 'Android और iOS के लिए स्मूद ऐप्स, जिन्हें आपके ग्राहक इस्तेमाल करना पसंद करेंगे।', 'ERP, CRM, डैशबोर्ड और ऑटोमेशन — बिल्कुल आपके बिज़नेस के हिसाब से।', 'पुरानी, धीमी साइट? हम उसे मॉडर्न, तेज़ और मोबाइल-फ़र्स्ट बना देते हैं।', 'टेक्निकल SEO, स्पीड और एनालिटिक्स से Google पर पहचान और ज़्यादा लीड्स।']],
    ['.spot__text', 'दूसरे वेबसाइट बनाते हैं।<br>हम <em>एक्सपीरियंस</em> बनाते हैं।'],
    ['.showcase__head .eyebrow', 'शोकेस'], ['.showcase__head .section__title', 'देखने में <span class="grad-text">वाह।</span><br>काम में दमदार।'],
    ['#playground .eyebrow', 'प्लेग्राउंड'], ['#playground .section__title', 'अपनी वेबसाइट डिज़ाइन करें।<br><span class="grad-text">लाइव। अभी।</span>'],
    ['#playground .section__desc', 'स्टाइल, कलर और फ़ॉन्ट चुनें — आपकी वेबसाइट तुरंत बदलती दिखेगी। पसंद आई? हम इसे असली में बना देंगे।'],
    ['#work .eyebrow', 'हमारा काम'], ['#work .section__title', 'असली प्रोजेक्ट्स।<br><span class="grad-text">असली बिज़नेस।</span>'],
    ['#work .section__desc', 'ERP, हॉस्पिटल टूल्स, कॉलेज वेबसाइट्स, ऐप्स — जो हर दिन असली लोगों के काम आ रहे हैं।'],
    ['#erp .eyebrow', 'फ़ीचर्ड प्रोजेक्ट'], ['#erp .section__desc', 'एक B2B कस्टम प्रिंटिंग बिज़नेस के लिए ऑर्डर से डिलीवरी तक का पूरा सिस्टम — पाँच रोल-बेस्ड डैशबोर्ड, लाइव और हर दिन इस्तेमाल में।'],
    ['#compare .eyebrow', 'रीडिज़ाइन'], ['#compare .section__title', 'पुरानी साइट? <span class="grad-text">खींचकर बदलें।</span>'],
    ['#compare .section__desc', 'धीमे, पुराने पेजों से तेज़, मॉडर्न और मोबाइल-फ़्रेंडली एक्सपीरियंस तक। हैंडल खींचें और फ़र्क़ देखें।'],
    ['.process__intro .eyebrow', 'प्रोसेस'], ['.process__intro .section__title', 'आइडिया से<br><span class="grad-text">लॉन्च तक।</span>'],
    ['.process__intro .section__desc', 'साफ़ और ट्रांसपेरेंट प्रोसेस — आपको हमेशा पता रहेगा कि आगे क्या होगा।'],
    ['#why .eyebrow', 'क्यों Tech Dollez'], ['#why .section__title', 'सबसे <span class="grad-text grad-anim">अलग।</span>'],
    ['#why .section__desc', 'साफ़ कोड, ज़बरदस्त स्पीड और एक टीम जो बस एक मैसेज दूर है।'],
    ['#audit .eyebrow', 'फ्री वेबसाइट ऑडिट'], ['#audit .section__title', 'आपकी वेबसाइट <span class="grad-text">कितनी अच्छी है?</span>'],
    ['#audit .section__desc', 'कोई भी वेबसाइट डालें और सेकंडों में असली Google Lighthouse रिपोर्ट पाएँ — स्पीड, SEO, एक्सेसिबिलिटी और बेस्ट प्रैक्टिसेज़।'],
    ['#auditBtn span', 'फ्री ऑडिट चलाएँ'],
    ['.stack__text .eyebrow', 'टेक्नोलॉजी'], ['.stack__text .section__title', 'मॉडर्न स्टैक।<br><span class="grad-text">फ़्यूचर-प्रूफ़</span> बिल्ड्स।'],
    ['.stack__text .section__desc', 'हम आपके प्रोजेक्ट के लिए सही टूल्स चुनते हैं — वही भरोसेमंद टेक्नोलॉजी जिस पर दुनिया के बेस्ट प्रोडक्ट्स चलते हैं।'],
    ['#about .eyebrow', 'इसके पीछे कौन है'], ['#about .section__title', 'नमस्ते, मैं अर्जुन हूँ। <span class="grad-text">मैं ऐसी चीज़ें बनाता हूँ जो काम करें।</span>'],
    ['#about .about__text .section__desc', ['मैं भोपाल से एक फ़ुल-स्टैक डेवलपर और B.Tech CSE स्टूडेंट हूँ। मैं सिर्फ़ सुंदर वेबसाइट नहीं बनाता — मैं असली बिज़नेस के पीछे के सिस्टम बनाता हूँ: एक प्रिंटिंग कंपनी के ऑर्डर्स चलाने वाला ERP, हॉस्पिटल के लिए एनालिटिक्स डैशबोर्ड, और कॉलेज, सैलून और स्टार्टअप्स के लिए मॉडर्न वेबसाइट्स।', 'Tech Dollez के साथ आप सीधे उसी डेवलपर से बात करते हैं जो आपका कोड लिखता है। न कोई बिचौलिया, न टेम्पलेट, न बहाने।']],
    ['#about .about__card .btn span', 'अर्जुन से बात करें'],
    ['#plans .eyebrow', 'प्लान्स'], ['#plans .section__title', 'अपना <span class="grad-text">शुरुआती पॉइंट चुनें।</span>'],
    ['#plans .section__desc', 'हर प्रोजेक्ट कस्टम होता है — बताइए आपको क्या चाहिए और WhatsApp पर साफ़ कोटेशन पाइए।'],
    ['.plan .btn', 'कोटेशन पाएँ'],
    ['.band__kicker', '🎁 अभी तय नहीं किया?'], ['.band__title', 'अपने बिज़नेस के लिए <span class="grad-text grad-anim">फ्री होमपेज कॉन्सेप्ट</span> पाएँ।'],
    ['.band__desc', 'अपने बिज़नेस का नाम और काम बताइए। हम आपको एक डिज़ाइन कॉन्सेप्ट भेजेंगे — न पेमेंट, न कोई कमिटमेंट।'], ['.band .btn span', 'फ्री कॉन्सेप्ट पाएँ'],
    ['#faq .eyebrow', 'सवाल-जवाब'], ['#faq .section__title', 'सवाल?<br><span class="grad-text">जवाब यहाँ।</span>'],
    ['#contact .eyebrow', 'संपर्क'], ['#contact .section__title', 'चलिए कुछ<br><span class="grad-text grad-anim">शानदार बनाते हैं।</span>'],
    ['#contact .contact__info > .section__desc', 'अपने प्रोजेक्ट के बारे में बताइए — हम WhatsApp पर जल्दी जवाब देते हैं।'],
    ['.pl-step legend', ['आपको क्या चाहिए?', 'ज़रूरी फ़ीचर्स', 'बस हो गया!']],
    ['#statement .eyebrow', 'हम कौन हैं'],
    ['.spot__hint', '<span>✦</span> कर्सर घुमाकर छुपा टेक्स्ट देखें'],
    ['.feature b', ['3D और मोशन', 'मोबाइल-फ़र्स्ट', 'बेहद तेज़', 'सुरक्षित']],
    ['.feature p', ['ऐसे एनिमेशन जो ज़िंदा लगें — कोई टेम्पलेट नहीं।', 'हर फ़ोन, टैबलेट और डेस्कटॉप पर परफ़ेक्ट।', 'ऑप्टिमाइज़्ड कोड और एसेट्स — तुरंत लोडिंग।', 'बेस्ट-प्रैक्टिस सिक्योरिटी, SSL और साफ़ आर्किटेक्चर।']],
    ['.builder__controls .ctrl__label', ['अपनी इंडस्ट्री से शुरू करें', 'आपके बिज़नेस का नाम', 'स्टाइल', 'एक्सेंट कलर', 'फ़ॉन्ट', 'मोड', null]],
    ['.rl', 'कोनों की गोलाई'],
    ['.builder__note', 'लाइव प्रीव्यू — हर बदलाव तुरंत दिखता है।'],
    ['#bRandom', '🎲 सरप्राइज़ करो'], ['#bOrder', 'मेरे लिए यही बनाओ'],
    ['#workFilters button', ['सभी', 'वेबसाइट्स', 'सॉफ़्टवेयर और ERP', 'कॉन्सेप्ट्स', 'लैब्स']],
    ['.erp__list li', ['रोल-बेस्ड डैशबोर्ड: सेल्स, प्रोडक्शन, लॉजिस्टिक्स, फ़ाइनेंस, एडमिन', 'CSV इम्पोर्ट / एक्सपोर्ट के साथ लीड मैनेजमेंट CRM', 'SLA ब्रीच ट्रैकिंग और कूरियर ट्रैकिंग लिंक', 'बल्क शिपिंग लेबल और Bluedart Excel एक्सपोर्ट', 'GST और मोबाइल नंबर वैलिडेशन, शिपिंग रिकंसिलिएशन', 'स्टाफ़ के लिए बिल्ट-इन हेल्प डेस्क टिकटिंग']],
    ['.erp__note', ['सैंपल डेटा के साथ इंटरैक्टिव डेमो — टैब्स पर क्लिक करें।', 'एक आम रीडिज़ाइन का उदाहरण — हम कॉलेज, हॉस्पिटल, दुकानों और बिज़नेस के लिए यही करते हैं।']],
    ['.ba__tag', ['पहले', 'बाद में · Tech Dollez']],
    ['.step h3', ['समझना', 'डिज़ाइन', 'डेवलपमेंट', 'लॉन्च', 'ग्रोथ']],
    ['.step p', ['एक छोटी कॉल या WhatsApp चैट पर हम आपके बिज़नेस, लक्ष्य और ग्राहकों को समझते हैं।', 'प्रीमियम UI कॉन्सेप्ट, कलर, टाइपोग्राफ़ी और मोशन — कोड की एक लाइन से पहले आपकी मंज़ूरी।', 'साफ़, तेज़ और स्केलेबल कोड, नियमित प्रीव्यू के साथ — अपना प्रोडक्ट बनते हुए देखिए।', 'हर डिवाइस पर टेस्टिंग, डोमेन और होस्टिंग सेटअप, और आसान गो-लाइव।', 'लगातार सपोर्ट, अपडेट, SEO और नए फ़ीचर्स — जैसे-जैसे आपका बिज़नेस बढ़े।']],
    ['.tile__cap', ['<b>हाथ से लिखा कोड।</b> साफ़, मॉडर्न और बढ़ने के लिए तैयार — कोई भारी-भरकम टेम्पलेट नहीं।', '<b>परफ़ॉर्मेंस सबसे पहले।</b> हर बिल्ड टॉप Lighthouse स्कोर के लिए ट्यून किया जाता है।', null, '<b>पूरी तरह सुरक्षित।</b> SSL, साफ़ कोड और बैकअप।', '<b>हर स्क्रीन पर परफ़ेक्ट।</b> डेस्कटॉप, टैबलेट और मोबाइल पर पिक्सेल-परफ़ेक्ट।']],
    ['.nums span', ['रिस्पॉन्सिव', 'स्पीड स्कोर लक्ष्य', 'WhatsApp सपोर्ट', 'सीधे डेवलपर से']],
    ['.clock__sub', 'भोपाल · IST'],
    ['.about__role', 'फ़ाउंडर · फ़ुल-स्टैक डेवलपर'], ['.about__loc', '📍 भोपाल, मध्य प्रदेश'],
    ['.about__timeline b', ['ERP और सॉफ़्टवेयर', 'हेल्थकेयर और एजुकेशन', 'वेबसाइट और ऐप्स', 'Tech Dollez']],
    ['.about__timeline span', ['ऑर्डर फ़्लो, CRM, लॉजिस्टिक्स, फ़ाइनेंस — रोज़ के बिज़नेस के लिए।', 'हॉस्पिटल डैशबोर्ड, फ़ैकल्टी सिस्टम और कॉलेज वेबसाइट रीडिज़ाइन।', 'ब्रांड्स के लिए प्रीमियम एनिमेटेड वेबसाइट्स और ऐप साइट्स।', 'यह सब एक प्रीमियम डिजिटल स्टूडियो में।']],
    ['.plan__name', ['स्टार्टर', 'बिज़नेस', 'कस्टम']],
    ['.plan h3', ['लॉन्च साइट', 'ग्रोथ वेबसाइट', 'ऐप्स और सॉफ़्टवेयर']],
    ['.plan__desc', ['दुकानों, फ़्रीलांसर्स और नए ब्रांड्स के लिए परफ़ेक्ट।', 'उन बिज़नेस के लिए जो अलग दिखना और लीड्स पाना चाहते हैं।', 'मोबाइल ऐप, ERP, डैशबोर्ड और SaaS प्रोडक्ट्स।']],
    ['.plan__badge', 'सबसे लोकप्रिय'],
    ['.plan li', ['5 तक प्रीमियम पेज', 'मोबाइल-रिस्पॉन्सिव डिज़ाइन', 'WhatsApp और कॉल बटन', 'बेसिक SEO सेटअप', 'कस्टम प्रीमियम डिज़ाइन + एनिमेशन', 'एडमिन पैनल / CMS', 'लीड फ़ॉर्म और इंटीग्रेशन', 'स्पीड और SEO ऑप्टिमाइज़ेशन', 'डोमेन और होस्टिंग सेटअप', 'Android / iOS ऐप्स', 'कस्टम सॉफ़्टवेयर और ERP', 'API और डेटाबेस डिज़ाइन', 'लगातार मेंटेनेंस']],
    ['.faq__item summary', ['Tech Dollez क्या है?', 'क्या आप भोपाल के बाहर के क्लाइंट्स के साथ काम करते हैं?', 'वेबसाइट बनने में कितना समय लगता है?', 'क्या आप मेरी मौजूदा वेबसाइट रीडिज़ाइन कर सकते हैं?', 'क्या आप डोमेन और होस्टिंग देते हैं?', 'क्या मैं खुद कंटेंट अपडेट कर पाऊँगा?', 'लॉन्च के बाद सपोर्ट का क्या?'].map((q) => q + '<span class="faq__icon"></span>')],
    ['.faq__item p', ['Tech Dollez भोपाल, मध्य प्रदेश का एक डिजिटल स्टूडियो है, जिसके फ़ाउंडर अर्जुन अहिरवार हैं। हम पूरे भारत के बिज़नेस के लिए वेबसाइट, मोबाइल ऐप, कस्टम सॉफ़्टवेयर और ERP बनाते हैं, और पुरानी वेबसाइट्स को रीडिज़ाइन करते हैं।', 'हाँ। हम भोपाल में हैं, लेकिन पूरे भारत के बिज़नेस के साथ काम करते हैं — पहली कॉल से लॉन्च तक सब कुछ WhatsApp और वीडियो कॉल पर ऑनलाइन हो सकता है।', 'एक आम बिज़नेस वेबसाइट पेज और फ़ीचर्स के हिसाब से आमतौर पर 1–3 हफ़्ते में बन जाती है। ऐप और कस्टम सॉफ़्टवेयर माइलस्टोन में प्लान होते हैं — शुरू करने से पहले आपको साफ़ टाइमलाइन मिलेगी।', 'हाँ। हम डिज़ाइन को मॉडर्न बनाते हैं, स्पीड बढ़ाते हैं, उसे पूरी तरह मोबाइल-फ़्रेंडली बनाते हैं और आपका कंटेंट और SEO सुरक्षित रखते हैं।', 'हम आपका डोमेन, होस्टिंग और बिज़नेस ईमेल खरीदने और सेट करने में मदद करते हैं, ताकि सब कुछ लाइव होने के लिए तैयार रहे।', 'अगर ज़रूरत हो, तो हम एक आसान एडमिन पैनल जोड़ देते हैं ताकि आप बिना कोड छुए टेक्स्ट, फ़ोटो और प्रोडक्ट्स अपडेट कर सकें।', 'लॉन्च के बाद भी हम आपके साथ हैं — फ़िक्स, अपडेट और नए फ़ीचर्स बस एक WhatsApp मैसेज दूर हैं।']],
    ['.contact__person span', 'फ़ाउंडर और लीड डेवलपर'],
    ['.pl-hint', ['एक या ज़्यादा चुनें', 'वैकल्पिक — जो चाहिए वो चुनें']],
    ['.pl-sub', 'टाइमलाइन'],
    ['.chips[data-name="services"] .chip', ['🌐 वेबसाइट', '📱 मोबाइल ऐप', '⚙️ कस्टम सॉफ़्टवेयर', '♻️ रीडिज़ाइन', '🛒 ई-कॉमर्स', '🚀 SEO', '🎨 UI / UX', '🤔 अभी पक्का नहीं']],
    ['.chips[data-name="features"] .chip', ['एडमिन पैनल', 'ऑनलाइन पेमेंट', 'WhatsApp', 'बुकिंग', 'लॉगिन / अकाउंट', 'ब्लॉग', '3D / एनिमेशन', 'एनालिटिक्स']],
    ['.chips[data-name="timeline"] .chip', ['⚡ जल्द से जल्द', '📅 एक महीने में', '🌿 कोई जल्दी नहीं']],
    ['#planner .field label', ['आपका नाम', 'फ़ोन (वैकल्पिक)', 'कुछ और बताना है? (वैकल्पिक)']],
    ['#plBack', '← पीछे'], ['#plNext', 'आगे →'], ['#plSend span', 'WhatsApp पर भेजें'],
    ['.footer__seo p', '<b>Tech Dollez</b> <b>भोपाल, मध्य प्रदेश</b> की एक वेबसाइट डिज़ाइन और ऐप डेवलपमेंट कंपनी है। हम पूरे भारत के क्लाइंट्स के लिए प्रीमियम बिज़नेस वेबसाइट, Android और iOS ऐप, कस्टम सॉफ़्टवेयर, ERP और CRM सिस्टम, ई-कॉमर्स स्टोर और वेबसाइट रीडिज़ाइन बनाते हैं — SEO, होस्टिंग और लगातार सपोर्ट के साथ।'],
    ['.footer__services a', ['भोपाल में वेबसाइट डिज़ाइन', 'वेब डेवलपमेंट', 'ऐप डेवलपमेंट', 'कस्टम सॉफ़्टवेयर और ERP', 'वेबसाइट रीडिज़ाइन', 'फ्री वेबसाइट ऑडिट']],
    ['.footer__links a', ['सर्विसेज़', 'प्रोसेस', 'प्लान्स', 'संपर्क']],
    ['.chat__hello', 'सवाल? मुझसे पूछें!']
  ];
  const HI_ROT = ['वेबसाइट्स', 'मोबाइल ऐप्स', 'सॉफ़्टवेयर', 'रीडिज़ाइन', 'ब्रांड्स', 'एक्सपीरियंस'];
  const HI_STATEMENT = 'हर अच्छे बिज़नेस को ऐसी डिजिटल पहचान चाहिए जो जितनी अच्छी दिखे, उतनी ही अच्छी चले। हम आपके आइडिया को तेज़, बेहतरीन और यादगार वेबसाइट, ऐप और सॉफ़्टवेयर में बदलते हैं।';
  const enStore = new Map();
  const statementEl = $('#statementText');
  const EN_STATEMENT = statementEl ? Array.from(statementEl.querySelectorAll('.w')).map((w) => w.textContent).join(' ') : '';
  let lang = 'en';

  function setLang(l) {
    if (l === lang) return;
    lang = l;
    document.documentElement.lang = l === 'hi' ? 'hi' : 'en';
    HI.forEach(([sel, val]) => {
      $$(sel).forEach((el, i) => {
        if (!enStore.has(el)) enStore.set(el, el.innerHTML);
        const v = l === 'hi' ? (Array.isArray(val) ? val[i] : val) : enStore.get(el);
        if (v == null) return;
        el.innerHTML = v;
        if (el.dataset.txt !== undefined) el.dataset.txt = el.textContent;
      });
    });
    if (statementEl) {
      const words = (l === 'hi' ? HI_STATEMENT : EN_STATEMENT).split(/\s+/);
      statementEl.innerHTML = words.map((w) => `<span class="w" style="opacity:1">${esc(w)}</span>`).join(' ');
    }
    window.__rotWords = l === 'hi' ? HI_ROT : null;
    window.__lang = l;
    document.dispatchEvent(new CustomEvent('td:lang', { detail: l }));
    const rot = $('#rotator');
    if (rot) rot.textContent = l === 'hi' ? HI_ROT[0] : 'websites';
    $$('#langToggle span').forEach((s, i) => s.classList.toggle('on', (i === 1) === (l === 'hi')));
    try { localStorage.setItem('td-lang', l); } catch (e) { /* storage unavailable */ }
    if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 100);
  }
  window.__setLang = setLang;
  $('#langToggle').addEventListener('click', () => {
    setLang(lang === 'en' ? 'hi' : 'en');
    toast(lang === 'hi' ? 'भाषा: हिंदी 🇮🇳' : 'Language: English');
  });
  try { if (localStorage.getItem('td-lang') === 'hi') setTimeout(() => setLang('hi'), 50); } catch (e) { /* storage unavailable */ }

  /* =======================================================
     8. COMMAND PALETTE (Ctrl / ⌘ + K)
     ======================================================= */
  const cmdk = $('#cmdk');
  if (cmdk) {
    const list = $('#cmdkList'), input = $('#cmdkInput');
    const ITEMS = [
      ['Go to', '🏠', 'Home', '#top'], ['Go to', '🛠️', 'Services', '#services'], ['Go to', '📁', 'Our Work', '#work'],
      ['Go to', '🧾', 'PrintX ERP demo', '#erp'], ['Go to', '🎨', 'Design Playground', '#playground'], ['Go to', '♻️', 'Before / After', '#compare'],
      ['Go to', '🧭', 'Process', '#process'], ['Go to', '⚡', 'Why Tech Dollez', '#why'], ['Go to', '🔍', 'Free Website Audit', '#audit'],
      ['Go to', '👋', 'About Arjun', '#about'], ['Go to', '📦', 'Plans', '#plans'], ['Go to', '❓', 'FAQ', '#faq'], ['Go to', '✉️', 'Contact', '#contact'],
      ['Actions', '💬', 'Chat on WhatsApp', () => window.open(waLink('Hi Tech Dollez! I want to discuss a project.'), '_blank', 'noopener'), 'WhatsApp'],
      ['Actions', '📞', 'Call Arjun', () => { window.location.href = 'tel:+916260993724'; }, '+91 62609 93724'],
      ['Actions', '📋', 'Copy phone number', () => { navigator.clipboard && navigator.clipboard.writeText('+91 6260993724').then(() => toast('Phone number copied ✓')).catch(() => toast('+91 62609 93724')); }],
      ['Actions', '🤖', 'Open chat assistant', () => window.__openChat && window.__openChat()],
      ['Actions', '🎲', 'Surprise me with a design', () => { scrollToEl('#playground'); setTimeout(() => $('#bRandom') && $('#bRandom').click(), 900); }],
      ['Actions', '🌐', 'Switch language (EN / हिंदी)', () => $('#langToggle').click()]
    ];
    let filtered = ITEMS, sel = 0;
    function render() {
      const q = input.value.trim().toLowerCase();
      filtered = ITEMS.filter((it) => it[2].toLowerCase().includes(q));
      sel = Math.min(sel, Math.max(0, filtered.length - 1));
      if (!filtered.length) { list.innerHTML = '<div class="cmdk__empty">No results — try “audit” or “work”.</div>'; return; }
      let html = '', group = '';
      filtered.forEach((it, i) => {
        if (it[0] !== group) { group = it[0]; html += `<div class="cmdk__group">${group}</div>`; }
        html += `<button type="button" class="cmdk__item${i === sel ? ' sel' : ''}" data-i="${i}"><i>${it[1]}</i>${esc(it[2])}${it[4] ? `<small>${esc(it[4])}</small>` : typeof it[3] === 'string' ? '<small>↵</small>' : ''}</button>`;
      });
      list.innerHTML = html;
      const s = $('.cmdk__item.sel', list);
      if (s) s.scrollIntoView({ block: 'nearest' });
    }
    function run(i) {
      const it = filtered[i];
      if (!it) return;
      close();
      setTimeout(() => (typeof it[3] === 'string' ? scrollToEl(it[3]) : it[3]()), 120);
    }
    function open() {
      cmdk.hidden = false; input.value = ''; sel = 0; render();
      if (window.__lenis) window.__lenis.stop();
      setTimeout(() => input.focus(), 30);
    }
    function close() { cmdk.hidden = true; if (window.__lenis && !document.body.classList.contains('modal-open')) window.__lenis.start(); }
    window.__openCmdk = open;
    $('#cmdkBtn').addEventListener('click', open);
    input.addEventListener('input', () => { sel = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % filtered.length; render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + filtered.length) % filtered.length; render(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
    });
    list.addEventListener('click', (e) => { const b = e.target.closest('.cmdk__item'); if (b) run(+b.dataset.i); });
    list.addEventListener('mousemove', (e) => {
      const b = e.target.closest('.cmdk__item');
      if (b && +b.dataset.i !== sel) { sel = +b.dataset.i; $$('.cmdk__item', list).forEach((x) => x.classList.toggle('sel', x === b)); }
    });
    cmdk.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.hidden ? open() : close(); }
      else if (e.key === 'Escape') {
        if (!cmdk.hidden) close();
        else if (modal && !modal.hidden) closeModal();
        else if (chat && chat.classList.contains('open')) $('#chatClose').click();
      }
    });
  }

  /* =======================================================
     9. EASTER EGG — type "techdollez" or the Konami code
     ======================================================= */
  let buf = '';
  const KONAMI = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
  let kbuf = '';
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    buf = (buf + e.key.toLowerCase()).slice(-10);
    kbuf = (kbuf + e.key).slice(-KONAMI.length);
    if (buf === 'techdollez' || kbuf === KONAMI) { buf = ''; kbuf = ''; party(); }
  });
  function party() {
    toast('🎉 Secret unlocked! You love details — so do we.', 3500);
    let n = 0;
    const t = setInterval(() => {
      fx.burst(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.7, 30);
      if (++n > 12) clearInterval(t);
    }, 160);
  }

  /* =======================================================
     10. ENTRANCE ANIMATIONS
     ======================================================= */
  if (hasGSAP && !reduced) {
    gsap.from('#workGrid .wk', { y: 70, opacity: 0, rotateX: -12, duration: 1.1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '#workGrid', start: 'top 82%' } });
    gsap.from('.erp__list li', { x: 40, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.erp__list', start: 'top 85%' } });
    gsap.from('.erp__app', { y: 80, opacity: 0, scale: 0.94, rotateX: 10, duration: 1.4, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.erp__app', start: 'top 85%' } });
    gsap.from('.ba', { y: 60, opacity: 0, scale: 0.95, duration: 1.3, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.ba', start: 'top 85%' } });
    gsap.from('.audit__form', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.audit__form', start: 'top 88%' } });
    gsap.from('.about__card', { x: -60, opacity: 0, rotateY: 14, duration: 1.3, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.about__grid', start: 'top 78%' } });
    gsap.from('.about__timeline > div', { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.about__timeline', start: 'top 88%' } });
    gsap.from('.band__inner', { y: 50, opacity: 0, scale: 0.96, duration: 1.2, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.band', start: 'top 85%' } });
    gsap.from('.chat__launch', { x: -80, opacity: 0, duration: 1, delay: 3.2, ease: 'expo.out', clearProps: 'transform,opacity' });
    ScrollTrigger.refresh();
  }
})();
