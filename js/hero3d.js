/* =========================================================
   TECH DOLLEZ — Hero 3D (Three.js)
   Iridescent morphing orb + particle field, reacts to mouse & scroll
   Made by Arjun Ahirwar
   ========================================================= */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const root = document.documentElement;

  function webglOK() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }
  if (!webglOK()) { root.classList.add('no-webgl'); return; }

  // Lazy-load Three.js (~600 KB) only after the page is already visible & interactive
  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  function loadThree() {
    if (window.THREE) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const sc = document.createElement('script');
      sc.src = THREE_URL; sc.async = true;
      sc.onload = resolve; sc.onerror = reject;
      document.head.appendChild(sc);
    });
  }
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  function start() {
    idle(() => {
      loadThree()
        .then(() => { init(); root.classList.add('webgl-ready'); })
        .catch(() => root.classList.add('no-webgl'));
    }, { timeout: 1200 });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 250));
  else setTimeout(start, 250);

  function init() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const lowPower = isMobile || (navigator.hardwareConcurrency || 8) <= 4;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  /* ---------- Simplex noise (Ashima Arts, MIT) ---------- */
  const noiseGLSL = `
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }`;

  /* ---------- Orb ---------- */
  const uniforms = {
    uTime: { value: 0 },
    uDistort: { value: 0.24 },
    uFreq: { value: 1.1 },
    uHover: { value: 0 }
  };

  const orbMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: noiseGLSL + `
      uniform float uTime; uniform float uDistort; uniform float uFreq; uniform float uHover;
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      void main(){
        float t = uTime * 0.32;
        float n = snoise(position * uFreq + vec3(t, t*0.8, t*0.6));
        n += 0.35 * snoise(position * uFreq * 2.4 - vec3(t*1.4));
        vNoise = n;
        vec3 p = position + normal * n * (uDistort + uHover * 0.18);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vView = normalize(-mv.xyz);
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      vec3 palette(float t){
        vec3 a = vec3(0.50, 0.45, 0.62);
        vec3 b = vec3(0.50, 0.45, 0.40);
        vec3 c = vec3(1.00, 1.00, 1.00);
        vec3 d = vec3(0.55, 0.78, 0.92);
        return a + b * cos(6.28318 * (c * t + d));
      }
      void main(){
        float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
        vec3 col = palette(vNoise * 0.35 + fres * 0.6 + uTime * 0.04);
        // dark glass body with neon iridescent rim
        vec3 c = col * (0.06 + fres * 1.25);
        c += col * smoothstep(0.35, 1.2, vNoise) * 0.12;
        float spec = pow(max(dot(reflect(-vView, vNormal), normalize(vec3(0.4, 0.8, 0.6))), 0.0), 32.0);
        c += spec * 0.35;
        gl_FragColor = vec4(c, 1.0);
      }`
  });

  const orbGeo = new THREE.IcosahedronGeometry(1.3, lowPower ? 22 : 40);
  const orb = new THREE.Mesh(orbGeo, orbMat);

  /* ---------- Wire halo ring ---------- */
  const ringGeo = new THREE.TorusGeometry(2.35, 0.006, 8, 220);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x8f7bff, transparent: true, opacity: 0.45 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 2.4;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.004, 8, 220), new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3 }));
  ring2.rotation.set(Math.PI / 1.8, 0.4, 0);

  /* ---------- Particles ---------- */
  const COUNT = lowPower ? 500 : 1200;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const palette = [new THREE.Color('#00d4ff'), new THREE.Color('#7c5cff'), new THREE.Color('#ff3d9a'), new THREE.Color('#ffb547'), new THREE.Color('#ffffff')];
  for (let i = 0; i < COUNT; i++) {
    const r = 2.6 + Math.random() * 6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
    pos[i * 3 + 2] = r * Math.cos(ph) - 2;
    const c = palette[(Math.random() * palette.length) | 0];
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  // soft round sprite for particles
  const spr = document.createElement('canvas');
  spr.width = spr.height = 64;
  const sctx = spr.getContext('2d');
  const sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  sg.addColorStop(0, 'rgba(255,255,255,1)');
  sg.addColorStop(0.35, 'rgba(255,255,255,.6)');
  sg.addColorStop(1, 'rgba(255,255,255,0)');
  sctx.fillStyle = sg;
  sctx.fillRect(0, 0, 64, 64);
  const sprite = new THREE.CanvasTexture(spr);

  const pMat = new THREE.PointsMaterial({
    map: sprite,
    size: isMobile ? 0.06 : 0.05, vertexColors: true, transparent: true, opacity: 0.8,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  const particles = new THREE.Points(pGeo, pMat);

  const group = new THREE.Group();
  group.add(orb, ring1, ring2);
  scene.add(group, particles);

  /* ---------- Sizing ---------- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // keep orb a nice size on narrow screens
    const s = w < 600 ? 0.72 : w < 1000 ? 0.88 : 1;
    group.scale.setScalar(s);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---------- Interaction ---------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  canvas.parentElement.addEventListener('pointerenter', () => { hoverTarget = 1; });
  canvas.parentElement.addEventListener('pointerleave', () => { hoverTarget = 0; });
  let hoverTarget = 0;

  // scroll progress through hero (0 → 1), exposed for GSAP too
  let scrollP = 0;
  window.__heroScroll = (p) => { scrollP = p; };

  /* ---------- Loop ---------- */
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(canvas);

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = reduced ? 0 : t;
    uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.05;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    group.rotation.y = t * 0.12 + mouse.x * 0.5;
    group.rotation.x = mouse.y * 0.3 + scrollP * 0.8;
    group.position.y = scrollP * -1.2;
    group.position.x = mouse.x * 0.15;
    ring1.rotation.z = t * 0.25;
    ring2.rotation.z = -t * 0.18;

    particles.rotation.y = t * 0.02 + mouse.x * 0.08;
    particles.rotation.x = mouse.y * 0.05;

    camera.position.z = 6 + scrollP * 2.5;
    renderer.render(scene, camera);
  }
  tick();
  }
})();
