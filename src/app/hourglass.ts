export interface SlideState {
  x: number;
  y: number;
  s: number;
  rx: number;
  rz: number;
  o: number;
}

export function initHourglass(
  canvas: HTMLCanvasElement,
  getState: () => SlideState
) {
  if (typeof window === "undefined") {
    return { onChange: (_d: number) => {}, destroy: () => {} };
  }

  let destroyed = false;
  let internalDestroy: (() => void) | null = null;
  let internalOnChange: ((d: number) => void) | null = null;
  let queuedDir: number | null = null;

  const init = () => {
    if (destroyed) return;
    const THREE = (window as any).THREE;
    if (!THREE) {
      setTimeout(init, 50);
      return;
    }

    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch {
      return;
    }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const INK = 0x15312a;
  const PAPER = 0xf3ede2;

  const root = new THREE.Group();
  const spin = new THREE.Group();
  root.add(spin);
  scene.add(root);

  const solid = new THREE.MeshBasicMaterial({
    color: PAPER,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const line = new THREE.LineBasicMaterial({ color: INK });
  const faint = new THREE.LineBasicMaterial({
    color: INK,
    transparent: true,
    opacity: 0.22,
  });

  const inked = (geo: any, thr = 25) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, solid));
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, thr), line));
    return g;
  };

  const V2 = (x: number, y: number) => new THREE.Vector2(x, y);

  // 1. Wooden plates (top & bottom)
  const plate = [
    V2(0, -0.11),
    V2(1.04, -0.11),
    V2(1.1, -0.07),
    V2(1.1, 0.01),
    V2(1.02, 0.05),
    V2(0.94, 0.11),
    V2(0, 0.11),
  ];
  const bottom = inked(new THREE.LatheGeometry(plate, 56));
  bottom.position.y = -1.62;
  const top = inked(new THREE.LatheGeometry(plate, 56));
  top.position.y = 1.62;
  top.rotation.x = Math.PI;
  spin.add(bottom, top);

  // 2. 3 Turned Pillars
  const pil = [
    V2(0, -1.52),
    V2(0.075, -1.52),
    V2(0.075, -1.45),
    V2(0.045, -1.39),
    V2(0.045, -0.14),
    V2(0.08, -0.06),
    V2(0.08, 0.06),
    V2(0.045, 0.14),
    V2(0.045, 1.39),
    V2(0.075, 1.45),
    V2(0.075, 1.52),
    V2(0, 1.52),
  ];
  for (let k = 0; k < 3; k++) {
    const p = inked(new THREE.LatheGeometry(pil, 10), 20);
    const a = Math.PI / 2 + (k * Math.PI * 2) / 3;
    p.position.set(Math.cos(a) * 0.93, 0, Math.sin(a) * 0.93);
    spin.add(p);
  }

  // 3. Glass silhouette + profile
  const TABLE = [
    [0, 0.055],
    [0.1, 0.085],
    [0.25, 0.2],
    [0.45, 0.42],
    [0.65, 0.6],
    [0.85, 0.71],
    [1.05, 0.75],
    [1.25, 0.69],
    [1.4, 0.52],
    [1.5, 0.3],
  ];
  const prof = (y: number) => {
    y = Math.abs(y);
    for (let i = 0; i < TABLE.length - 1; i++) {
      const [y0, r0] = TABLE[i],
        [y1, r1] = TABLE[i + 1];
      if (y <= y1) {
        const t = (y - y0) / (y1 - y0);
        return r0 + (r1 - r0) * (t * t * (3 - 2 * t) * 0.5 + t * 0.5);
      }
    }
    return TABLE[TABLE.length - 1][1];
  };

  const pts: any[] = [];
  for (let i = 0; i <= 90; i++) {
    const y = -1.5 + (3 * i) / 90;
    pts.push(V2(prof(y), y));
  }

  const rim = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uInk: { value: new THREE.Color(INK) } },
    vertexShader:
      "varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",
    fragmentShader:
      "uniform vec3 uInk; varying vec3 vN; varying vec3 vV; void main(){ float f = 1.0-abs(dot(normalize(vN),normalize(vV))); float a = smoothstep(.78,.97,f); gl_FragColor = vec4(uInk, a*.95); }",
  });
  spin.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 64), rim));

  // 4. Glass Engraved Meridians
  const merid: number[] = [];
  for (let m = 0; m < 18; m++) {
    const a = (m / 18) * Math.PI * 2,
      c = Math.cos(a),
      s = Math.sin(a);
    for (let i = 0; i < pts.length - 1; i++)
      merid.push(
        pts[i].x * c,
        pts[i].y,
        pts[i].x * s,
        pts[i + 1].x * c,
        pts[i + 1].y,
        pts[i + 1].x * s
      );
  }
  [-1.05, -0.45, 0.45, 1.05, -1.47, 1.47].forEach((y) => {
    const r = prof(y);
    for (let i = 0; i < 64; i++) {
      const a0 = (i / 64) * Math.PI * 2,
        a1 = ((i + 1) / 64) * Math.PI * 2;
      merid.push(
        Math.cos(a0) * r,
        y,
        Math.sin(a0) * r,
        Math.cos(a1) * r,
        y,
        Math.sin(a1) * r
      );
    }
  });
  const mg = new THREE.BufferGeometry();
  mg.setAttribute("position", new THREE.Float32BufferAttribute(merid, 3));
  spin.add(new THREE.LineSegments(mg, faint));

  // 5. Stippled Sand Particles
  const dot = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff";
    x.beginPath();
    x.arc(16, 16, 14, 0, Math.PI * 2);
    x.fill();
    return new THREE.CanvasTexture(c);
  })();

  const sandMat = new THREE.PointsMaterial({
    color: INK,
    size: 0.03,
    map: dot,
    alphaTest: 0.5,
    transparent: true,
  });

  const SANDN = 4500;
  const fill = (y0: number, y1: number) => {
    const arr: [number, number, number][] = [];
    while (arr.length < SANDN) {
      const x = (Math.random() * 2 - 1) * 0.76,
        z = (Math.random() * 2 - 1) * 0.76,
        y = y0 + Math.random() * (y1 - y0);
      if (Math.hypot(x, z) < prof(y) * 0.9 - 0.015) arr.push([x, y, z]);
    }
    arr.sort((a, b) => a[1] - b[1]);
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(arr.flat(), 3)
    );
    const m = new THREE.Points(g, sandMat);
    spin.add(m);
    return { g, m, ys: arr.map((p) => p[1]) };
  };

  const topSand = fill(0.08, 1.44);
  const botSand = fill(-1.47, -0.22);

  // 6. Falling sand stream
  const SN = 80;
  const sp = new Float32Array(SN * 3);
  const phase = new Float32Array(SN);
  for (let i = 0; i < SN; i++) phase[i] = Math.random();
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  spin.add(
    new THREE.Points(
      sg,
      new THREE.PointsMaterial({
        color: INK,
        size: 0.026,
        map: dot,
        alphaTest: 0.5,
        transparent: true,
      })
    )
  );

  // 7. Ambient background dust particles
  const DN = 180;
  const dpos = new Float32Array(DN * 3);
  const dspd: number[] = [];
  for (let i = 0; i < DN; i++) {
    dpos[i * 3] = (Math.random() * 2 - 1) * 9;
    dpos[i * 3 + 1] = (Math.random() * 2 - 1) * 5.5;
    dpos[i * 3 + 2] = -1 - Math.random() * 5;
    dspd.push(0.08 + Math.random() * 0.2);
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
  scene.add(
    new THREE.Points(
      dg,
      new THREE.PointsMaterial({
        color: INK,
        size: 0.035,
        map: dot,
        alphaTest: 0.5,
        transparent: true,
        opacity: 0.35,
      })
    )
  );

  // Resize handler
  let halfH = 0;
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(((camera.fov / 2) * Math.PI) / 180) * 11;
  };
  resize();
  window.addEventListener("resize", resize);

  // Mouse interaction
  const mouse = { nx: 0, ny: 0 };
  const onPointerMove = (e: PointerEvent) => {
    mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ny = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  // State interpolations
  const st: SlideState = { x: 0.58, y: -0.05, s: 0.95, rx: 0.15, rz: -0.15, o: 0.85 };
  let spinT = 0,
    spinC = 0,
    flipT = 0,
    flipC = 0,
    pulse = 0;
  const par = { x: 0, y: 0 };
  const t0 = performance.now();
  let lastT = performance.now();
  let frameId: number;

  const frame = (now: number) => {
    if (destroyed) return;
    frameId = requestAnimationFrame(frame);

    const T = getState();
    const k = 0.05;

    st.x += (T.x - st.x) * k;
    st.y += (T.y - st.y) * k;
    st.s += (T.s - st.s) * k;
    st.rx += (T.rx - st.rx) * k;
    st.rz += (T.rz - st.rz) * k;
    st.o += (T.o - st.o) * k;

    par.x += (mouse.nx - par.x) * 0.05;
    par.y += (mouse.ny - par.y) * 0.05;

    spinC += (spinT - spinC) * 0.045;
    flipC += (flipT - flipC) * 0.035;
    pulse *= 0.95;

    const time = ((now || t0) - t0) / 1000;
    const halfW = halfH * camera.aspect;
    const base = Math.min(1, camera.aspect / 1.1 + 0.25);

    root.position.set(
      st.x * halfW,
      st.y * halfH + Math.sin(time * 0.8) * 0.04,
      0
    );
    root.scale.setScalar(
      Math.max(0.01, st.s * base * (1 - Math.sin(pulse * Math.PI) * 0.12))
    );
    root.rotation.set(st.rx + par.y * 0.14 + flipC, par.x * 0.1, st.rz);

    spin.rotation.y = spinC + time * 0.12 + par.x * 0.35;
    canvas.style.opacity = Math.max(0, Math.min(1, st.o)).toFixed(3);

    // Sand animation
    const drain = 0.45 + Math.sin(time * 0.2) * 0.25;
    const topN = Math.floor(SANDN * (1 - drain));
    const botN = Math.floor(SANDN * drain);
    topSand.g.setDrawRange(0, topN);
    botSand.g.setDrawRange(0, botN);

    const floorY = botN > 0 ? botSand.ys[botN - 1] : -1.47;
    for (let i = 0; i < SN; i++) {
      const ph = (phase[i] + time * 0.9) % 1;
      sp[i * 3] = Math.sin(i * 12.9) * 0.012;
      sp[i * 3 + 1] = 0.02 - ph * (0.02 - floorY);
      sp[i * 3 + 2] = Math.cos(i * 7.3) * 0.012;
    }
    sg.attributes.position.needsUpdate = true;

    // Dust animation
    const dt = Math.min(0.05, ((now || lastT) - lastT) / 1000);
    lastT = now || lastT;
    for (let i = 0; i < DN; i++) {
      dpos[i * 3 + 1] -= dspd[i] * dt;
      dpos[i * 3] += Math.sin(time * 0.6 + i) * 0.002 - par.x * 0.002;
      if (dpos[i * 3 + 1] < -5.5) dpos[i * 3 + 1] = 5.5;
    }
    dg.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  };

    frameId = requestAnimationFrame(frame);

    internalOnChange = (d: number) => {
      spinT += d * Math.PI * 0.9;
      flipT += d * Math.PI * 2;
      pulse = 1;
    };

    if (queuedDir !== null) {
      internalOnChange(queuedDir);
      queuedDir = null;
    }

    internalDestroy = () => {
      destroyed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose?.();
    };
  };

  init();

  return {
    onChange: (d: number) => {
      if (internalOnChange) {
        internalOnChange(d);
      } else {
        queuedDir = d;
      }
    },
    destroy: () => {
      destroyed = true;
      internalDestroy?.();
    },
  };
}
