/** Decorative, dependency-free starfield. Returns a disposer for reuse. */
export function createParticleBackground(host) {
  if (!host || host.querySelector('[data-starfield]')) return () => {};
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};
  canvas.dataset.starfield = '';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;';
  host.append(canvas);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const colors = ['139,174,255', '172,143,247', '215,228,255'];
  // Stable constellation across full-page navigation; no storage is required.
  let seed = 7319;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const stars = Array.from({ length: 230 }, (_, i) => ({
    x: random(), y: random(), phase: random() * Math.PI * 2,
    depth: i % 3, radius: 0.85 + random() * 0.65 + (i % 3) * 0.2,
    alpha: 0.2 + random() * 0.38, color: colors[i % 3],
  }));
  let width = 1, height = 1, count = 0, frame = 0, last = 0, time = 0;
  let scroll = window.scrollY, previousScroll = scroll, drift = 0;
  let brightness = 1, speed = 1, edgeFocus = 0, cluster = 0;
  let sections = [], layoutDirty = true, disposed = false;
  let scrollSource = null, sourcePosition = window.scrollY, virtualScroll = window.scrollY;
  function readScroll() {
    const source = document.querySelector('[data-particle-scroll]');
    const position = source ? source.scrollTop : window.scrollY;
    if (source === scrollSource) virtualScroll += position - sourcePosition;
    scrollSource = source;
    sourcePosition = position;
    return virtualScroll;
  }
  const pointer = { x: -1000, y: -1000, active: false, strength: 0 };
  const wrap = (value, size) => ((value % size) + size) % size;
  const lerp = (a, b, amount) => a + (b - a) * amount;

  function measure() {
    width = host.clientWidth || innerWidth;
    height = host.clientHeight || innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, width < 768 ? 1.5 : 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    count = Math.min(width < 768 ? 75 : 230, Math.max(40, Math.round(width * height / 6000)));
    layoutDirty = true;
    wake();
  }

  function atmosphere() {
    if (layoutDirty) {
      sections = [...document.querySelectorAll('main section[id], footer')]
        .filter(el => el.getClientRects().length)
        .map(el => ({ id: el.id, top: el.getBoundingClientRect().top + window.scrollY }));
      layoutDirty = false;
    }
    let id = 'hero';
    for (const section of sections) {
      if (section.top <= window.scrollY + height * 0.45) id = section.id;
    }
    if (id === 'hero') return [1, 1, 0, 0];
    if (id === 'work' || id === 'project-collection-section') return [0.75, 0.7, 1, 0.3];
    if (id === 'contact' || id === '') return [0.5, 0.25, 0.4, 0];
    return [0.72, 0.65, 0.3, 1];
  }

  function draw(now) {
    frame = 0;
    if (disposed || document.hidden) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    const still = reduced.matches;
    const ease = 1 - Math.exp(-dt * 3);
    const targetScroll = readScroll();
    drift = lerp(drift, Math.max(-900, Math.min(900, (targetScroll - previousScroll) / dt)), ease);
    previousScroll = targetScroll;
    scroll = lerp(scroll, targetScroll, ease);
    const target = atmosphere();
    brightness = lerp(brightness, target[0], ease);
    speed = lerp(speed, target[1], ease);
    edgeFocus = lerp(edgeFocus, target[2], ease);
    cluster = lerp(cluster, target[3], ease * 0.5);
    pointer.strength = lerp(pointer.strength, pointer.active && fine.matches && !still ? 1 : 0, ease);
    if (!still) time += dt * speed;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < count; i++) {
      const star = stars[i];
      const depth = (star.depth + 1) / 3;
      const pad = 30;
      let x = wrap(star.x * (width + pad * 2) + (still ? 0 : Math.sin(time * 0.06 + star.phase) * 12 * depth + scroll * 0.008 * depth), width + pad * 2) - pad;
      let y = wrap(star.y * (height + pad * 2) - (still ? 0 : time * (1 + depth * 3) + scroll * depth * 0.085 + drift * depth * 0.012), height + pad * 2) - pad;
      // A slowly evolving, faint band adds depth at section transitions.
      x += Math.sin(y / height * Math.PI * 2 + star.phase) * cluster * 12 * depth;

      const dx = x - pointer.x, dy = y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < 150) {
        const influence = (1 - distance / 150) ** 2 * 9 * depth * pointer.strength;
        x += dx / distance * influence;
        y += dy / distance * influence;
      }
      const edge = Math.min(1, Math.min(x + pad, width + pad - x, y + pad, height + pad - y) / pad);
      const outside = Math.min(1, Math.abs(x / width - 0.5) * 2);
      const twinkle = still ? 0.85 : 0.82 + Math.sin(time * 0.45 + star.phase) * 0.18;
      const alpha = star.alpha * brightness * twinkle * Math.max(0, edge) * (1 - edgeFocus * (1 - outside) * 0.6);
      if (i % 31 === 0) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 8);
        glow.addColorStop(0, `rgba(${star.color},${alpha * 0.3})`);
        glow.addColorStop(1, `rgba(${star.color},0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(x - 8, y - 8, 16, 16);
      }
      ctx.fillStyle = `rgba(${star.color},${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!still) frame = requestAnimationFrame(draw);
  }

  function wake() {
    if (!frame && !document.hidden && !disposed) frame = requestAnimationFrame(draw);
  }
  function visibility() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    previousScroll = readScroll();
    wake();
  }
  function move(event) {
    if (!fine.matches || reduced.matches || event.pointerType === 'touch') return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }
  function leave() { pointer.active = false; }
  const observer = new ResizeObserver(() => { layoutDirty = true; });
  observer.observe(document.body);
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', leave);
  window.addEventListener('blur', leave);
  document.addEventListener('visibilitychange', visibility);
  reduced.addEventListener('change', visibility);
  measure();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', measure);
    window.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', leave);
    window.removeEventListener('blur', leave);
    document.removeEventListener('visibilitychange', visibility);
    reduced.removeEventListener('change', visibility);
    canvas.remove();
  };
}

/** Shared lifecycle for both static pages and React effects (including StrictMode). */
export function mountParticleBackground(host) {
  let dispose = createParticleBackground(host);
  const stop = () => dispose();
  const restore = event => {
    if (event.persisted) dispose = createParticleBackground(host);
  };
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', restore);
  return () => {
    dispose();
    window.removeEventListener('pagehide', stop);
    window.removeEventListener('pageshow', restore);
  };
}
