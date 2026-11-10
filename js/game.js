import { CONFIG, CARDS, COUNTRY, BAD_WORDS, VERSION } from './data.js';
import { buildScene, setLevel, effect, mascotSVG, cheerMascot } from './scene.js';
import * as store from './store.js';
import { sfx, setSound, isSoundOn } from './sound.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const SIDES = ['korea', 'malaysia'];
const KEYS = { korea: ['A', 'D'], malaysia: ['←', '→'] };

let current = 'start';
let prevSetup = 'setup1';
let idleTimer = null;
let lastSaved = { ids: [], period: 'today' };

// ---------- 게임 상태 ----------
const S = {
  mode: '1p',
  human: { korea: true, malaysia: false },
  names: { korea: '', malaysia: '' },
  round: 0,
  level: CONFIG.START_LEVEL,
  deck: { korea: [], malaysia: [] },
  goodIdx: { korea: 0, malaysia: 0 },
  choice: { korea: null, malaysia: null },
  stats: { korea: { actions: 0, score: 0 }, malaysia: { actions: 0, score: 0 } },
  together: 0,
  running: false,
  roundStart: 0,
  raf: 0,
  timers: [],
  lastTickSec: -1
};

// ---------- 화면 전환 ----------
function show(name) {
  $$('.screen').forEach(el => el.classList.toggle('active', el.id === 'scr-' + name));
  current = name;
  document.body.classList.toggle('in-game', name === 'game');
  document.body.classList.toggle('on-start', name === 'start');
  resetIdle();
  if (name === 'start') { refreshStats(); setLevel(CONFIG.START_LEVEL); }
  if (name === 'ranking') loadRanking(lastSaved.period);
  if (name === 'setup1') setTimeout(() => $('#nick1').focus(), 50);
  if (name === 'setup2') setTimeout(() => $('#nickKo').focus(), 50);
}

function resetIdle() {
  clearTimeout(idleTimer);
  if (current === 'result' || current === 'ranking' || current.startsWith('setup') || current === 'howto') {
    idleTimer = setTimeout(() => show('start'), CONFIG.IDLE_RETURN_MS);
  }
}
['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, resetIdle, true));

// ---------- 시작 화면 통계 ----------
async function refreshStats() {
  try {
    const s = await store.getStats();
    $('#statsBanner').innerHTML = (s.korea + s.malaysia) > 0
      ? `지금까지 한국 친구들 <b>${s.korea}</b>번 · 말레이시아 친구들 <b>${s.malaysia}</b>번 환경을 지켰어요!`
      : '첫 번째 환경지킴이가 되어 보세요! 🌱';
  } catch (e) { $('#statsBanner').textContent = ''; }
}

// ---------- 별명 확인 ----------
function checkNick(v) {
  const n = (v || '').trim().replace(/\s+/g, ' ');
  if (!n) return { ok: false, msg: '별명을 적어 주세요.' };
  if (n.length > CONFIG.NICK_MAX) return { ok: false, msg: `별명은 ${CONFIG.NICK_MAX}글자까지 쓸 수 있어요.` };
  const plain = n.toLowerCase().replace(/[\s._\-~!@#$%^&*0-9]/g, '');
  if (BAD_WORDS.some(w => plain.includes(w))) return { ok: false, msg: '고운 말로 된 다른 별명을 써 주세요. 🙂' };
  return { ok: true, value: n };
}

// ---------- 설정 화면 ----------
let pickCountry = null;
function setupScreens() {
  $('#pickKorea').innerHTML = mascotSVG('korea');
  $('#pickMalaysia').innerHTML = mascotSVG('malaysia');
  $('#pick2Korea').innerHTML = mascotSVG('korea');
  $('#pick2Malaysia').innerHTML = mascotSVG('malaysia');

  $$('[data-go]').forEach(b => b.addEventListener('click', () => { sfx.click(); show(b.dataset.go); }));

  $$('.country-pick').forEach(b => b.addEventListener('click', () => {
    sfx.click();
    pickCountry = b.dataset.country;
    $$('.country-pick').forEach(x => x.classList.toggle('selected', x === b));
    $('#msg1').textContent = '';
    $('#nick1').focus();
  }));

  const go1 = () => {
    if (!pickCountry) { $('#msg1').textContent = '나라를 먼저 골라 주세요.'; return; }
    const c = checkNick($('#nick1').value);
    if (!c.ok) { $('#msg1').textContent = c.msg; return; }
    S.mode = '1p';
    S.human = { korea: pickCountry === 'korea', malaysia: pickCountry === 'malaysia' };
    S.names = { korea: '', malaysia: '' };
    S.names[pickCountry] = c.value;
    $('#msg1').textContent = '';
    prevSetup = 'setup1';
    sfx.click();
    openHowto();
  };
  $('#go1').addEventListener('click', go1);
  $('#nick1').addEventListener('keydown', e => { if (e.key === 'Enter') go1(); });

  const go2 = () => {
    const a = checkNick($('#nickKo').value);
    if (!a.ok) { $('#msg2').textContent = '한국 친구: ' + a.msg; $('#nickKo').focus(); return; }
    const b = checkNick($('#nickMy').value);
    if (!b.ok) { $('#msg2').textContent = '말레이시아 친구: ' + b.msg; $('#nickMy').focus(); return; }
    S.mode = '2p';
    S.human = { korea: true, malaysia: true };
    S.names = { korea: a.value, malaysia: b.value };
    $('#msg2').textContent = '';
    prevSetup = 'setup2';
    sfx.click();
    openHowto();
  };
  $('#go2').addEventListener('click', go2);
  $('#nickKo').addEventListener('keydown', e => { if (e.key === 'Enter') $('#nickMy').focus(); });
  $('#nickMy').addEventListener('keydown', e => { if (e.key === 'Enter') go2(); });

  $('#howtoBack').addEventListener('click', () => { sfx.click(); show(prevSetup); });
  $('#btnPlay').addEventListener('click', () => { sfx.click(); startGame(); });
  $('#btnAgain').addEventListener('click', () => { sfx.click(); openHowto(); });
  $('#btnQuit').addEventListener('click', () => { sfx.click(); stopGame(); show('start'); });

  $$('.tab').forEach(t => t.addEventListener('click', () => { sfx.click(); lastSaved.period = t.dataset.period; loadRanking(t.dataset.period); }));

  // 소리 / 전체화면
  const updSound = () => { $('#btnSound').textContent = isSoundOn() ? '🔊' : '🔇'; };
  updSound();
  $('#btnSound').addEventListener('click', () => { setSound(!isSoundOn()); updSound(); sfx.click(); });
  $('#btnFull').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  });
}

function openHowto() {
  if (S.mode === '1p') {
    const me = S.human.korea ? 'korea' : 'malaysia';
    const keys = me === 'korea' ? '<kbd>A</kbd> <kbd>D</kbd>' : '<kbd>←</kbd> <kbd>→</kbd>';
    $('#howtoKeys').innerHTML =
      `<span class="${me === 'korea' ? 'ko' : 'my'}">${escapeHtml(S.names[me])}</span> 친구는 <b>${COUNTRY[me].name}</b> 환경지킴이!<br>
       ${keys} 키나 마우스로 골라요. 다른 나라는 <b>컴퓨터 친구</b>가 맡아요.`;
  } else {
    $('#howtoKeys').innerHTML =
      `<span class="ko">한국 · ${escapeHtml(S.names.korea)}</span> : <kbd>A</kbd> 왼쪽 / <kbd>D</kbd> 오른쪽<br>
       <span class="my">말레이시아 · ${escapeHtml(S.names.malaysia)}</span> : <kbd>←</kbd> 왼쪽 / <kbd>→</kbd> 오른쪽<br>
       <small>마우스로 눌러도 돼요!</small>`;
  }
  show('howto');
}

// ---------- 게임 진행 ----------
function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

function later(fn, ms) { const t = setTimeout(fn, ms); S.timers.push(t); return t; }

function stopGame() {
  S.running = false;
  resolving = false;
  S.timers.forEach(clearTimeout);
  S.timers = [];
  cancelAnimationFrame(S.raf);
  $('#countdown').classList.remove('show');
  $('#roundToast').classList.remove('show');
}

function buildPanel(side) {
  const human = S.human[side];
  const nm = human ? S.names[side] : '컴퓨터 친구';
  $('#panel-' + side).innerHTML = `
    <div class="p-head">
      <svg viewBox="-50 -125 100 135">${mascotSVG(side)}</svg>
      <div>
        <div class="p-country">${COUNTRY[side].name}${human ? '' : '<span class="cpu-tag">🤖 컴퓨터</span>'}</div>
        <div class="p-name">${escapeHtml(nm)} · ${COUNTRY[side].mascot}와 함께</div>
      </div>
      <div class="p-score">실천 <b class="act">0</b>번</div>
    </div>
    <div class="p-situation"><span class="sit-emoji"></span><span class="sit-text"></span></div>
    <div class="p-choices">
      <button class="choice" data-idx="0">${human ? `<span class="key">${KEYS[side][0]}</span>` : ''}<span class="c-emoji"></span><span class="c-text"></span></button>
      <button class="choice" data-idx="1">${human ? `<span class="key">${KEYS[side][1]}</span>` : ''}<span class="c-emoji"></span><span class="c-text"></span></button>
    </div>
    <div class="p-status"><div>컴퓨터 친구가 고민 중이에요</div><div class="thinking-dots"><span>🤔</span><span>·</span><span>·</span></div></div>`;
  $$('#panel-' + side + ' .choice').forEach(btn => {
    btn.addEventListener('click', () => { if (S.human[side]) pick(side, +btn.dataset.idx); });
    if (!human) btn.disabled = true;
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function startGame() {
  stopGame();
  S.round = 0;
  S.level = CONFIG.START_LEVEL;
  S.together = 0;
  S.stats = { korea: { actions: 0, score: 0 }, malaysia: { actions: 0, score: 0 } };
  SIDES.forEach(side => {
    let d = shuffle(CARDS[side]);
    while (d.length < CONFIG.ROUNDS) d = d.concat(shuffle(CARDS[side]));
    S.deck[side] = d.slice(0, CONFIG.ROUNDS);
    buildPanel(side);
  });
  $('#roundMax').textContent = CONFIG.ROUNDS;
  updateGauge();
  setLevel(S.level, true);
  show('game');
  // 첫 카드를 미리 보여 주고 카운트다운
  fillCards();
  $$('.choice').forEach(b => { b.disabled = true; });
  const cd = $('#countdown');
  const steps = ['3', '2', '1', '시작!'];
  steps.forEach((t, i) => later(() => {
    cd.textContent = t;
    cd.classList.remove('show'); void cd.offsetWidth; cd.classList.add('show');
    i < 3 ? sfx.count() : sfx.go();
  }, i * 800));
  later(() => { cd.classList.remove('show'); S.running = true; startRound(); }, steps.length * 800);
}

function fillCards() {
  SIDES.forEach(side => {
    const card = S.deck[side][S.round];
    const p = $('#panel-' + side);
    p.querySelector('.sit-emoji').textContent = card.emoji;
    p.querySelector('.sit-text').textContent = card.sit;
    S.goodIdx[side] = Math.random() < 0.5 ? 0 : 1;
    const btns = p.querySelectorAll('.choice');
    btns.forEach((b, i) => {
      const opt = i === S.goodIdx[side] ? card.good : card.bad;
      b.querySelector('.c-emoji').textContent = opt[0];
      b.querySelector('.c-text').textContent = opt[1];
      b.classList.remove('picked', 'good', 'bad', 'dim');
      b.querySelector('.verdict')?.remove();
      b.disabled = !S.human[side];
    });
    p.classList.remove('timeout', 'thinking');
  });
}

function startRound() {
  $('#roundNo').textContent = S.round + 1;
  S.choice = { korea: null, malaysia: null };
  fillCards();
  S.roundStart = performance.now();
  S.lastTickSec = -1;
  // 컴퓨터 친구
  SIDES.forEach(side => {
    if (S.human[side]) return;
    const p = $('#panel-' + side);
    p.classList.add('thinking');
    const delay = 900 + Math.random() * 2200;
    later(() => {
      p.classList.remove('thinking');
      const good = Math.random() < CONFIG.CPU_GOOD_RATE;
      pick(side, good ? S.goodIdx[side] : 1 - S.goodIdx[side], true);
    }, delay);
  });
  tickTimer();
}

function tickTimer() {
  cancelAnimationFrame(S.raf);
  const loop = () => {
    if (!S.running) return;
    const el = performance.now() - S.roundStart;
    const left = Math.max(0, CONFIG.ROUND_MS - el);
    const fill = $('#timerFill');
    fill.style.width = (left / CONFIG.ROUND_MS * 100) + '%';
    fill.classList.toggle('hurry', left < 2000);
    const sec = Math.ceil(left / 1000);
    if (left < 3000 && sec !== S.lastTickSec) { S.lastTickSec = sec; sfx.tick(); }
    if (left <= 0) { timeUp(); return; }
    if (S.choice.korea && S.choice.malaysia) return;
    S.raf = requestAnimationFrame(loop);
  };
  S.raf = requestAnimationFrame(loop);
}

function timeUp() {
  SIDES.forEach(side => {
    if (!S.choice[side]) {
      S.choice[side] = { good: false, timeout: true };
      const p = $('#panel-' + side);
      p.classList.remove('thinking');
      p.classList.add('timeout');
      p.querySelectorAll('.choice').forEach(b => { b.disabled = true; b.classList.add('dim'); });
    }
  });
  sfx.bad();
  resolveRound();
}

function pick(side, idx, fromCpu = false) {
  if (!S.running || S.choice[side]) return;
  if (!fromCpu && !S.human[side]) return;
  const elapsed = performance.now() - S.roundStart;
  if (elapsed > CONFIG.ROUND_MS) return;
  const good = idx === S.goodIdx[side];
  S.choice[side] = { good, t: elapsed };

  const p = $('#panel-' + side);
  p.querySelectorAll('.choice').forEach((b, i) => {
    b.disabled = true;
    if (i === idx) {
      b.classList.add('picked', good ? 'good' : 'bad');
      const v = document.createElement('span');
      v.className = 'verdict';
      v.textContent = good ? '⭕' : '❌';
      b.appendChild(v);
    } else b.classList.add('dim');
  });

  if (good) {
    S.stats[side].actions++;
    const bonus = Math.round((1 - elapsed / CONFIG.ROUND_MS) * 600);
    S.stats[side].score += 1000 + Math.max(0, bonus);
    p.querySelector('.act').textContent = S.stats[side].actions;
    cheerMascot(side);
    sfx.good();
  } else sfx.bad();

  if (S.choice.korea && S.choice.malaysia) {
    cancelAnimationFrame(S.raf);
    later(resolveRound, 450);
  }
}

function updateGauge() {
  $('#seaMark').style.left = Math.max(3, Math.min(97, S.level)) + '%';
  $('#seaState').textContent = S.level < 30 ? '안전 😊' : S.level < 55 ? '보통 🙂' : S.level < 75 ? '위험 😟' : '아주 위험 😱';
}

let resolving = false;
function resolveRound() {
  if (resolving) return;
  resolving = true;
  const k = S.choice.korea.good, m = S.choice.malaysia.good;
  let kind, delta, msg, sub;
  if (k && m) {
    kind = 'good'; delta = CONFIG.DELTA.both; S.together++;
    msg = '💙 함께 실천했어요!'; sub = '바다가 내려가요';
    sfx.down();
  } else if (k || m) {
    kind = 'half'; delta = CONFIG.DELTA.one;
    msg = `🌊 ${k ? '한국' : '말레이시아'}만 실천했어요`; sub = '바다가 조금 올라가요… 함께해야 해요!';
    sfx.up();
  } else {
    kind = 'bad'; delta = CONFIG.DELTA.none;
    msg = '😱 아무도 실천하지 않았어요!'; sub = '바다가 많이 올라가요';
    sfx.bigUp();
  }
  S.level = Math.max(0, Math.min(100, S.level + delta));
  setLevel(S.level);
  updateGauge();
  effect(kind);

  const toast = $('#roundToast');
  toast.className = 'round-toast ' + kind;
  toast.innerHTML = `${msg}<small>${sub}</small>`;
  void toast.offsetWidth;
  toast.classList.add('show');

  later(() => {
    toast.classList.remove('show');
    resolving = false;
    S.round++;
    if (S.round >= CONFIG.ROUNDS) endGame();
    else startRound();
  }, 1700);
}

// ---------- 결과 ----------
async function endGame() {
  S.running = false;
  const L = S.level;
  let banner, msg;
  if (L <= CONFIG.START_LEVEL - 15) {
    banner = '<span class="rb-emoji">🌈</span>바다를 지켜냈어요!';
    msg = '두 나라가 함께 실천해서 해수면이 내려갔어요. 최고의 환경지킴이!';
    sfx.fanfare();
  } else if (L <= CONFIG.START_LEVEL + 15) {
    banner = '<span class="rb-emoji">🌤️</span>휴, 아슬아슬해요!';
    msg = '조금만 더 함께 실천하면 바다를 지킬 수 있어요.';
    sfx.good();
  } else {
    banner = '<span class="rb-emoji">🌧️</span>마을이 물에 잠기고 있어요…';
    msg = '한 나라만 노력해서는 부족해요. 두 나라가 함께해야 바다를 지킬 수 있어요!';
    sfx.sad();
  }
  $('#resultBanner').innerHTML = banner;
  $('#resultMsg').textContent = msg;
  $('#togetherLine').textContent = `🤝 두 나라가 함께 실천한 횟수: ${S.together} / ${CONFIG.ROUNDS}번`;

  const box = $('#resultPlayers');
  box.innerHTML = SIDES.map(side => `
    <div class="rp ${side}">
      <svg viewBox="-50 -125 100 135">${mascotSVG(side)}</svg>
      <div class="rp-name">${S.human[side] ? escapeHtml(S.names[side]) : '🤖 컴퓨터 친구'}</div>
      <div class="rp-country">${COUNTRY[side].name} 환경지킴이</div>
      <div class="rp-actions">실천 <b>${S.stats[side].actions}</b>번</div>
      <div class="rp-score">점수 ${S.stats[side].score.toLocaleString()}점</div>
      <div class="rp-rank" id="rank-${side}">${S.human[side] ? '랭킹 등록 중…' : ''}</div>
    </div>`).join('');

  show('result');

  // 랭킹 저장 (사람만)
  const entries = SIDES.filter(s => S.human[s]).map(s => ({
    nickname: S.names[s],
    country: s,
    actions: S.stats[s].actions,
    together: S.together,
    score: S.stats[s].score,
    finalLevel: Math.round(S.level),
    mode: S.mode
  }));
  try {
    const ids = await store.saveEntries(entries);
    lastSaved = { ids, period: 'today' };
    for (const e of entries) {
      const r = await store.getRanks(e.score);
      const el = $('#rank-' + e.country);
      if (el) el.innerHTML = `🏆 오늘 <b class="${r.todayRank <= 3 ? 'new' : ''}">${r.todayRank}등</b> · 전체 ${r.allRank}등`;
    }
  } catch (err) {
    console.error(err);
    SIDES.forEach(s => { const el = $('#rank-' + s); if (el && S.human[s]) el.textContent = '⚠️ 랭킹 저장에 실패했어요 (인터넷 확인)'; });
  }
}

// ---------- 랭킹 ----------
async function loadRanking(period = 'today') {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.period === period));
  const list = $('#rankList');
  list.innerHTML = '<li class="empty">불러오는 중… 🌊</li>';
  try {
    const [rows, st] = await Promise.all([store.getRanking(period, 10), store.getStats()]);
    $('#countryTotal').innerHTML = `
      <div class="ct korea">한국 친구들의 실천<b>${st.korea.toLocaleString()}번</b></div>
      <div class="ct malaysia">말레이시아 친구들의 실천<b>${st.malaysia.toLocaleString()}번</b></div>`;
    if (!rows.length) { list.innerHTML = '<li class="empty">아직 기록이 없어요. 첫 번째 환경지킴이가 되어 보세요! 🌱</li>'; return; }
    const medal = ['🥇', '🥈', '🥉'];
    list.innerHTML = rows.map((r, i) => `
      <li class="${lastSaved.ids.includes(r.id) ? 'me' : ''}">
        <span class="rk">${medal[i] || (i + 1)}</span>
        <span class="nm">${escapeHtml(r.nickname)}</span>
        <span class="cn ${r.country}">${COUNTRY[r.country]?.name || ''}</span>
        <span class="ac">실천 ${r.actions}번</span>
        <span class="sc">${Number(r.score).toLocaleString()}점</span>
      </li>`).join('');
  } catch (e) {
    console.error(e);
    list.innerHTML = '<li class="empty">랭킹을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.</li>';
  }
}

// ---------- 키보드 ----------
window.addEventListener('keydown', (e) => {
  if (current === 'game') {
    const code = e.code;
    let side = null, idx = null;
    if (code === 'KeyA') { side = 'korea'; idx = 0; }
    else if (code === 'KeyD') { side = 'korea'; idx = 1; }
    else if (code === 'ArrowLeft') { side = 'malaysia'; idx = 0; }
    else if (code === 'ArrowRight') { side = 'malaysia'; idx = 1; }
    if (side === null) return;
    e.preventDefault();
    // 1인 모드는 어느 키든 내 나라로
    if (S.mode === '1p') side = S.human.korea ? 'korea' : 'malaysia';
    pick(side, idx);
    return;
  }
  if (e.key === 'Enter') {
    if (current === 'howto') { e.preventDefault(); sfx.click(); startGame(); }
    else if (current === 'result') { e.preventDefault(); sfx.click(); openHowto(); }
  }
  if (e.key === 'Escape' && current !== 'start') show('start');
});

// ---------- 시작 ----------
(async function init() {
  buildScene($('#scene'));
  setupScreens();
  const mode = await store.initStore();
  const ver = $('#versionLabel');
  ver.textContent = VERSION;
  // 연결 상태는 화면에 표시하지 않고, 마우스를 올리면만 보이게
  ver.title = mode === 'firebase' ? '온라인 랭킹 연결됨' : '로컬 랭킹(이 컴퓨터에만 저장)';
  show('start');
})();
