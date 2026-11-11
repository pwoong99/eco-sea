// ===== 폭죽 + 꽃가루 효과 (캔버스) =====
// 화면 왼쪽·오른쪽 아래에서 폭죽이 번갈아 올라가 터지고, 위에서 꽃가루가 떨어집니다.
const COLORS = ['#ff5d73', '#ffb13b', '#ffe066', '#5fd38d', '#4fc3f7', '#7c8cff', '#ff8ad8', '#ffffff'];

let cv = null, ctx = null, raf = 0, running = false;
let rockets = [], sparks = [], confetti = [];
let lastLaunch = 0, side = 0, W = 0, H = 0, dpr = 1;
let onBoom = null;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function launch() {
  // 0: 왼쪽, 1: 오른쪽 번갈아
  const fromLeft = side++ % 2 === 0;
  const x = fromLeft ? rand(W * 0.04, W * 0.22) : rand(W * 0.78, W * 0.96);
  const tx = fromLeft ? rand(W * 0.1, W * 0.4) : rand(W * 0.6, W * 0.9);
  const ty = rand(H * 0.12, H * 0.42);
  const t = rand(55, 70); // 올라가는 프레임 수
  rockets.push({ x, y: H + 10, vx: (tx - x) / t, vy: (ty - H) / t, life: t, color: pick(COLORS), trail: [] });
}

function explode(r) {
  const n = Math.round(rand(55, 85));
  const c2 = pick(COLORS);
  const ring = Math.random() < 0.35;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
    const sp = ring ? rand(4.6, 5.2) : rand(1.2, 6);
    sparks.push({
      x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: rand(55, 85), max: 85, color: Math.random() < 0.5 ? r.color : c2, size: rand(1.8, 3.2)
    });
  }
  if (onBoom) onBoom();
}

function addConfetti(n) {
  for (let i = 0; i < n; i++) {
    confetti.push({
      x: rand(0, W), y: rand(-H * 0.5, -10), vx: rand(-0.6, 0.6), vy: rand(1.4, 3),
      rot: rand(0, Math.PI * 2), vr: rand(-0.15, 0.15), w: rand(7, 13), h: rand(4, 8), color: pick(COLORS), sway: rand(0, 6.28)
    });
  }
}

function frame(ts) {
  if (!running) return;
  raf = requestAnimationFrame(frame);
  if (ts - lastLaunch > 420) { launch(); lastLaunch = ts; }
  if (confetti.length < 160) addConfetti(4);

  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  rockets = rockets.filter(r => {
    r.trail.push([r.x, r.y]); if (r.trail.length > 8) r.trail.shift();
    r.x += r.vx; r.y += r.vy; r.life--;
    ctx.strokeStyle = r.color; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); r.trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineTo(r.x, r.y); ctx.stroke();
    if (r.life <= 0) { explode(r); return false; }
    return true;
  });

  sparks = sparks.filter(p => {
    p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.06; p.x += p.vx; p.y += p.vy; p.life--;
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    return p.life > 0;
  });

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  confetti = confetti.filter(c => {
    c.sway += 0.05; c.x += c.vx + Math.sin(c.sway) * 0.8; c.y += c.vy; c.rot += c.vr;
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
    ctx.fillStyle = c.color; ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h * Math.abs(Math.cos(c.sway)));
    ctx.restore();
    return c.y < H + 20;
  });
}

export function startFireworks(canvas, boomCallback) {
  cv = canvas; ctx = cv.getContext('2d');
  onBoom = boomCallback || null;
  resize();
  window.addEventListener('resize', resize);
  rockets = []; sparks = []; confetti = [];
  addConfetti(60);
  running = true; lastLaunch = 0; side = 0;
  // 시작하자마자 양쪽에서 한 발씩
  launch(); launch();
  raf = requestAnimationFrame(frame);
}

export function stopFireworks() {
  running = false;
  cancelAnimationFrame(raf);
  window.removeEventListener('resize', resize);
  if (ctx) ctx.clearRect(0, 0, W, H);
  rockets = []; sparks = []; confetti = [];
}
