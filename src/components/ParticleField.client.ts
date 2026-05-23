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
  let mouse = { x: null as number | null, y: null as number | null };
  let rafId = 0;
  let frameTime = 0;
  let overBudgetCount = 0;

  // Degradation flags
  let linesEnabled = true;
  let densityFactor = 1;
  let fpsTarget = 60;
  let lastFrameTs = 0;

  // Spring / physics constants
  const SPRING_K   = 0.02;
  const DAMPING    = 0.88;
  const REPEL_R    = 180;
  const REPEL_FORCE = 4.0;
  const NOISE_AMP  = 0.05;
  const LINES_MAX_DIST = 80;
  const COLOR_LERP_R = 120;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const count = Math.floor(getParticleCount(canvas.width) * densityFactor);
    particles = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
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

    if (p.baseX < 0 || p.baseX > canvas.width)  { p.vx *= -1; p.baseX = Math.max(0, Math.min(canvas.width,  p.baseX)); }
    if (p.baseY < 0 || p.baseY > canvas.height)  { p.vy *= -1; p.baseY = Math.max(0, Math.min(canvas.height, p.baseY)); }

    const mobile = isMobile(canvas.width);

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
    if (!linesEnabled || isMobile(canvas.width)) return;
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    for (const p of particles) {
      updateParticle(p);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    frameTime = performance.now() - t0;

    // Perf-budget degradation ladder (>2ms × 2 consecutive frames)
    if (frameTime > 2) {
      overBudgetCount++;
      if (overBudgetCount >= 2) {
        if (linesEnabled) {
          linesEnabled = false;
          console.info('[ParticleField] frame budget exceeded — dropping connecting lines');
        } else if (densityFactor > 0.75) {
          densityFactor = 0.75;
          initParticles();
          console.info('[ParticleField] frame budget exceeded — reducing particle density 25%');
        } else if (fpsTarget > 30) {
          fpsTarget = 30;
          console.info('[ParticleField] frame budget exceeded — capping to 30 fps');
        }
        overBudgetCount = 0;
      }
    } else {
      overBudgetCount = 0;
    }

    rafId = requestAnimationFrame(frame);
  }

  // Touch impulse — brief outward push from touch point, decays in ~300ms
  function handleTouch(e: TouchEvent) {
    if (!isMobile(canvas.width)) return;
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
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = getParticleCount(canvas.width);
  ctx.fillStyle = BASE_COLOR;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Auto-init on the canvas element defined in Hero.astro
const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
if (canvas) {
  initParticleField(canvas);
}
