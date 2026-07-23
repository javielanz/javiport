// Hero 3D prism — the "ThreeJS Scene (Prism)" slot from the Stitch v2 reference.
// three.js is dynamic-imported on idle so it lands in its own async chunk and
// never blocks hero paint/LCP. Degrades: no WebGL2 → nothing (particle field
// remains); prefers-reduced-motion → single static frame, no animation loop.

const ACCENT = 0xc99a5b; // --color-accent
const IVORY = 0xf5f1ea; //  --color-text
const GLASS = 0x14110f; //  --color-bg-elev

const MAX_DPR = 2;
const FRAME_BUDGET_MS = 3;
const BUDGET_STRIKES = 30;

interface SceneHandle {
  dispose: () => void;
}

let active: SceneHandle | null = null;

async function createScene(container: HTMLElement): Promise<SceneHandle | null> {
  const probe = document.createElement('canvas');
  if (!probe.getContext('webgl2')) return null;

  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: import('three').WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 50);
  camera.position.set(0, 0, 6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // Kept deliberately dark: the ivory hero headline sits on top of this canvas,
  // so facet reflections must never approach text luminance.
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: GLASS,
    metalness: 0.35,
    roughness: 0.42,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.32,
    flatShading: true,
  });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.6 });

  const group = new THREE.Group();
  scene.add(group);

  const faceted = (geometry: import('three').BufferGeometry) => {
    const mesh = new THREE.Mesh(geometry, glassMaterial);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial));
    return mesh;
  };

  const prism = faceted(new THREE.OctahedronGeometry(1.05, 0));
  prism.scale.set(1, 1.55, 1);
  group.add(prism);
  group.position.z = -1.4;

  const shards: { mesh: import('three').Mesh; radius: number; speed: number; phase: number; tilt: number }[] = [];
  for (let i = 0; i < 5; i++) {
    const mesh = faceted(new THREE.TetrahedronGeometry(0.14 + (i % 3) * 0.05, 0));
    const shard = {
      mesh,
      radius: 2 + i * 0.28,
      speed: 0.1 + (i % 3) * 0.05,
      phase: (i / 5) * Math.PI * 2,
      tilt: (i - 2) * 0.35,
    };
    group.add(mesh);
    shards.push(shard);
  }

  const keyLight = new THREE.DirectionalLight(ACCENT, 1.3);
  keyLight.position.set(3, 2, 4);
  const rimLight = new THREE.DirectionalLight(IVORY, 0.45);
  rimLight.position.set(-3, -1, -2);
  scene.add(keyLight, rimLight, new THREE.AmbientLight(GLASS, 0.5));

  let baseScale = 1;
  const fitScale = () => {
    const s = Math.min(1, container.clientWidth / 1100) * (container.clientWidth < 768 ? 0.8 : 1);
    baseScale = Math.max(0.55, s);
    group.scale.setScalar(baseScale);
  };
  fitScale();

  // Own accumulated time instead of THREE.Clock: Clock.start() resets elapsed
  // time, which would replay the intro and snap the rotation phase every time
  // the hero re-enters the viewport.
  let tAccum = 0;
  let introElapsed = 0;
  let lastNow = 0;
  const INTRO_S = 1.2; // matches --dur-hero so scale and opacity finish together
  const pointerTarget = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  let rafId = 0;
  let running = false;
  let fpsTarget = 60;
  let lastTs = 0;
  let strikes = 0;
  let dprStep = 0;

  const positionShards = (t: number) => {
    for (const s of shards) {
      const a = s.phase + t * s.speed;
      s.mesh.position.set(Math.cos(a) * s.radius, Math.sin(a * 0.7) * 0.9 + s.tilt, Math.sin(a) * s.radius * 0.5);
      s.mesh.rotation.x = a * 1.4;
      s.mesh.rotation.y = a;
    }
  };

  const renderFrame = () => {
    const now = performance.now();
    const delta = lastNow === 0 ? 0 : Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;
    tAccum += delta;
    // Materialize once: scale eases 0.92 -> 1 in step with the canvas opacity
    // transition, latched so hero re-entries never replay it.
    if (introElapsed < INTRO_S) introElapsed = Math.min(INTRO_S, introElapsed + delta);
    const intro = reducedMotion ? 1 : introElapsed / INTRO_S;
    const introEased = 1 - Math.pow(1 - intro, 3);
    group.scale.setScalar(baseScale * (0.92 + 0.08 * introEased));
    pointer.x += (pointerTarget.x - pointer.x) * 0.05;
    pointer.y += (pointerTarget.y - pointer.y) * 0.05;
    const scroll = reducedMotion ? 0 : window.scrollY;
    const t = tAccum;
    group.rotation.y = t * 0.15 + pointer.x * 0.3 + scroll * 0.00045;
    group.rotation.x = Math.sin(t * 0.2) * 0.06 - pointer.y * 0.2;
    group.position.y = Math.sin(t * 0.5) * 0.08 + scroll * 0.0002;
    positionShards(t);
    renderer.render(scene, camera);
  };

  // Degradation ladder: sustained CPU cost over budget lowers DPR, then caps fps.
  const degradeIfNeeded = (frameMs: number) => {
    if (frameMs <= FRAME_BUDGET_MS) {
      strikes = 0;
      return;
    }
    if (++strikes < BUDGET_STRIKES) return;
    strikes = 0;
    const steps = [Math.min(window.devicePixelRatio, MAX_DPR), 1.5, 1];
    if (dprStep < steps.length - 1) {
      renderer.setPixelRatio(steps[++dprStep]);
      console.info(`[PrismScene] frame budget exceeded — pixel ratio → ${steps[dprStep]}`);
    } else if (fpsTarget > 30) {
      fpsTarget = 30;
      console.info('[PrismScene] frame budget exceeded — capping to 30 fps');
    }
  };

  const loop = (ts: number) => {
    rafId = requestAnimationFrame(loop);
    if (document.hidden) return;
    if (ts - lastTs < 1000 / fpsTarget) return;
    lastTs = ts;
    const t0 = performance.now();
    renderFrame();
    degradeIfNeeded(performance.now() - t0);
  };

  const start = () => {
    if (running || reducedMotion) return;
    running = true;
    lastNow = 0; // first frame after a pause contributes zero delta — no time jump
    rafId = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
  };

  const onPointerMove = (e: PointerEvent) => {
    pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    fitScale();
    if (reducedMotion) renderFrame();
  });
  resizeObserver.observe(container);

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0.05 }
  );
  intersectionObserver.observe(container);

  if (reducedMotion) {
    renderer.domElement.style.transition = 'none';
    renderFrame();
  }
  // Fade the canvas in once a frame exists (CSS handles the transition).
  requestAnimationFrame(() => renderer.domElement.classList.add('is-live'));

  return {
    dispose() {
      stop();
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as import('three').Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      glassMaterial.dispose();
      edgeMaterial.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

function init() {
  const container = document.getElementById('prism-scene');
  if (!container || active) return;
  const schedule =
    'requestIdleCallback' in window
      ? (cb: () => void) => window.requestIdleCallback(cb)
      : (cb: () => void) => window.setTimeout(cb, 200);
  schedule(() => {
    void createScene(container).then((handle) => {
      active = handle;
    });
  });
}

// ClientRouter view transitions: hoisted scripts run once, so re-init on soft
// navigations and tear down the WebGL context before the DOM swap.
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => {
  active?.dispose();
  active = null;
});

init();
