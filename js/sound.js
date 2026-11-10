// 간단한 효과음 (외부 파일 없이 브라우저에서 직접 만들어요)
let ctx = null;
let on = true;
try { on = localStorage.getItem('ecoSea.sound') !== 'off'; } catch (e) { /* 무시 */ }

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type = 'sine', vol = 0.15, when = 0, slide = null) {
  if (!on) return;
  try {
    const c = ac();
    const o = c.createOscillator();
    const g = c.createGain();
    const t = c.currentTime + when;
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch (e) { /* 소리 실패는 무시 */ }
}

export const sfx = {
  click()  { tone(660, 0.08, 'triangle', 0.12); },
  good()   { tone(784, 0.12, 'triangle', 0.15); tone(1047, 0.18, 'triangle', 0.15, 0.1); },
  bad()    { tone(220, 0.25, 'sawtooth', 0.07, 0, 140); },
  down()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, 'sine', 0.13, i * 0.08)); },
  up()     { tone(320, 0.5, 'sine', 0.12, 0, 200); },
  bigUp()  { tone(260, 0.7, 'square', 0.05, 0, 110); tone(200, 0.7, 'sine', 0.1, 0.1, 90); },
  tick()   { tone(1200, 0.04, 'square', 0.03); },
  count()  { tone(880, 0.15, 'triangle', 0.15); },
  go()     { tone(1320, 0.3, 'triangle', 0.15); },
  fanfare(){ [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.14, i * 0.13)); },
  sad()    { [392, 349, 311, 262].forEach((f, i) => tone(f, 0.3, 'sine', 0.12, i * 0.2)); }
};

export function setSound(v) {
  on = v;
  try { localStorage.setItem('ecoSea.sound', v ? 'on' : 'off'); } catch (e) { /* 무시 */ }
}
export function isSoundOn() { return on; }
