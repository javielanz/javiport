// Particle field — ported from STITCH_EXPORT/home.html canvas implementation.
// Additions over Stitch: density tiers, touch-impulse, connecting lines,
// color lerp by distance, perf-budget degradation ladder.

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
}

function getParticleCount(width: number): number {
  if (width >= 1280) return 140;
  if (width >= 768)  return 90;
  return 50;
}

function isMobile(width: number): boolean {
  return width < 768;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const BASE_COLOR  = 'rgba(245, 241, 234, 0.55)';
const HOT_COLOR   = [201, 154, 91] as const;
const BASE_ALPHA  = 0.55;

export function initParticleField(canvas: HTMLCanvasElement): () => void {
  // Respect prefers-reduced-motion: render static grid, no animation.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    renderStaticGrid(canvas);
    return () => {};
  }

  const ctx = canvas.getContext('2d')!;
  let particles: Particle[] = [];
  const mouse = { x: null as number | null, y: null as number | null };
  let rafId = 0;
  let frameTime = 0;
  let overBudgetCount = 0;

  // Logical (CSS-pixel) size; the backing store is scaled by dpr for crisp
  // dots on high-DPI screens. All simulation math stays in logical pixels.
  let vw = 0;
  let vh = 0;
  let dprCap = 2;

  // Degradation flags
  let linesEnabled = true;
  let densityFactor = 1;
  let fpsTarget = 60;
  let lastFrameTs = 0;
  let lastRenderTs = 0;
  let slowStreak = 0;

  // Spring / physics constants
  const SPRING_K   = 0.02;
  const DAMPING    = 0.88;
  const REPEL_R    = 180;
  const REPEL_FORCE = 4.0;
  const NOISE_AMP  = 0.05;
  const LINES_MAX_DIST = 80;
  const COLOR_LERP_R = 120;

  // Backing-store sizing is split from seeding so the DPR degradation rung can
  // rescale without teleporting every particle (their state is in logical px).
  function applySize() {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    canvas.width  = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    applySize();
    initParticles();
  }

  function initParticles() {
    const count = Math.floor(getParticleCount(vw) * densityFactor);
    particles = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * vw;
      const y = Math.random() * vh;
      particles.push({
        x, y,
        baseX: x, baseY: y,
        size: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        color: BASE_COLOR,
      });
    }
  }

  function updateParticle(p: Particle) {
    // Brownian drift
    p.vx += (Math.random() - 0.5) * NOISE_AMP;
    p.vy += (Math.random() - 0.5) * NOISE_AMP;
    p.baseX += p.vx;
    p.baseY += p.vy;

    if (p.baseX < 0 || p.baseX > vw)  { p.vx *= -1; p.baseX = Math.max(0, Math.min(vw, p.baseX)); }
    if (p.baseY < 0 || p.baseY > vh)  { p.vy *= -1; p.baseY = Math.max(0, Math.min(vh, p.baseY)); }

    const mobile = isMobile(vw);

    if (!mobile && mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_R && dist > 0) {
        const floor = 20;
        const dSafe = Math.max(dist, floor);
        const force = Math.min(REPEL_FORCE * (REPEL_R / (dSafe * dSafe)) * 400, REPEL_FORCE);
        const nx = dx / dist;
        const ny = dy / dist;
        // Repel: push particle away from cursor
        p.x -= nx * force;
        p.y -= ny * force;
      }

      // Color lerp by distance
      if (dist < COLOR_LERP_R) {
        const t = 1 - dist / COLOR_LERP_R;
        const r = Math.round(lerp(245, HOT_COLOR[0], t));
        const g = Math.round(lerp(241, HOT_COLOR[1], t));
        const b = Math.round(lerp(234, HOT_COLOR[2], t));
        const a = lerp(BASE_ALPHA, 0.85, t);
        p.color = `rgba(${r},${g},${b},${a})`;
      } else {
        p.color = BASE_COLOR;
      }
    } else {
      p.color = BASE_COLOR;
    }

    // Spring return to home
    const sdx = p.baseX - p.x;
    const sdy = p.baseY - p.y;
    p.vx = (p.vx + sdx * SPRING_K) * DAMPING;
    p.vy = (p.vy + sdy * SPRING_K) * DAMPING;
    p.x += p.vx;
    p.y += p.vy;
  }

  function drawConnections() {
    if (!linesEnabled || isMobile(vw)) return;
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINES_MAX_DIST) {
          const alpha = ((LINES_MAX_DIST - dist) / LINES_MAX_DIST) * 0.4;
          ctx.strokeStyle = `rgba(245,241,234,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function frame(ts: number) {
    if (document.hidden) { rafId = requestAnimationFrame(frame); return; }

    const fpsMs = 1000 / fpsTarget;
    if (ts - lastFrameTs < fpsMs) { rafId = requestAnimationFrame(frame); return; }
    lastFrameTs = ts;

    const t0 = performance.now();

    // Clear in device space — Math.round(vw*dpr) can exceed vw*dpr, and a
    // logical-space clear would leave a sliver of residue on that edge.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    drawConnections();

    for (const p of particles) {
      updateParticle(p);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    frameTime = performance.now() - t0;

    // Perf-budget degradation ladder (>2ms × 2 consecutive frames). The CPU
    // budget can't see GPU fill cost, so sustained missed frames (gap between
    // *rendered* frames well above the target interval) feed the same ladder.
    const renderGap = lastRenderTs ? ts - lastRenderTs : 0;
    lastRenderTs = ts;
    if (fpsTarget === 60 && renderGap > 28) {
      slowStreak++;
    } else {
      slowStreak = Math.max(0, slowStreak - 1);
    }

    if (frameTime > 2) {
      overBudgetCount++;
    } else {
      overBudgetCount = 0;
    }

    if (overBudgetCount >= 2 || slowStreak >= 30) {
      degrade();
      overBudgetCount = 0;
      slowStreak = 0;
    }

    rafId = requestAnimationFrame(frame);
  }

  function degrade() {
    if (linesEnabled) {
      linesEnabled = false;
      console.info('[ParticleField] frame budget exceeded — dropping connecting lines');
    } else if (densityFactor > 0.75) {
      densityFactor = 0.75;
      initParticles();
      console.info('[ParticleField] frame budget exceeded — reducing particle density 25%');
    } else if (dprCap > 1 && (window.devicePixelRatio || 1) > 1) {
      dprCap = 1;
      applySize();
      console.info('[ParticleField] frame budget exceeded — dropping to 1x pixel ratio');
    } else if (fpsTarget > 30) {
      fpsTarget = 30;
      console.info('[ParticleField] frame budget exceeded — capping to 30 fps');
    }
  }

  // Touch impulse — brief outward push from touch point, decays in ~300ms
  function handleTouch(e: TouchEvent) {
    if (!isMobile(vw)) return;
    const touch = e.touches[0];
    if (!touch) return;
    const tx = touch.clientX;
    const ty = touch.clientY;
    const impulseRadius = 150;
    const impulseForce  = 6;
    const decayFrames   = 18; // ~300ms at 60fps

    let frame = 0;
    function decay() {
      if (frame++ >= decayFrames) return;
      const strength = impulseForce * (1 - frame / decayFrames);
      for (const p of particles) {
        const dx = p.x - tx;
        const dy = p.y - ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < impulseRadius && dist > 0) {
          p.vx += (dx / dist) * strength * 0.3;
          p.vy += (dy / dist) * strength * 0.3;
        }
      }
      requestAnimationFrame(decay);
    }
    decay();
  }

  // Wire up events
  const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  const onMouseOut  = () => { mouse.x = null; mouse.y = null; };
  const onResize    = () => resize();

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseout',  onMouseOut,  { passive: true });
  window.addEventListener('resize',    onResize,    { passive: true });
  canvas.addEventListener('touchstart', handleTouch, { passive: true });

  resize();
  rafId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseout',  onMouseOut);
    window.removeEventListener('resize',    onResize);
    canvas.removeEventListener('touchstart', handleTouch);
  };
}

// Static grid for prefers-reduced-motion
function renderStaticGrid(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = Math.round(vw * dpr);
  canvas.height = Math.round(vh * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = getParticleCount(vw);
  ctx.fillStyle = BASE_COLOR;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * vw;
    const y = Math.random() * vh;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Auto-init on the canvas element defined in Hero.astro. ClientRouter swaps in
// a fresh canvas on soft navigations, so re-bind on astro:page-load and tear
// down the old loop before the swap.
let cleanup: (() => void) | null = null;
let boundCanvas: HTMLCanvasElement | null = null;

function init() {
  const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
  if (!canvas || canvas === boundCanvas) return;
  cleanup?.();
  boundCanvas = canvas;
  cleanup = initParticleField(canvas);
}

init();
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => {
  cleanup?.();
  cleanup = null;
  boundCanvas = null;
});
