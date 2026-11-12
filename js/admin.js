import * as store from './store.js?v=1.6.0';
import { CONFIG, LIMITS, cleanPrizeList, nextMilestone } from './data.js?v=1.6.0';

const $ = (s) => document.querySelector(s);
const NAME = { korea: '한국', malaysia: '말레이시아' };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmt(ms) {
  if (!ms) return '-';
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function msg(t) { $('#adminMsg').textContent = t; }

async function load() {
  msg('');
  try {
    const [st, list, visitors] = await Promise.all([store.getStats(), store.listEntries(), store.getVisitors().catch(() => '-')]);
    const today = store.todayKey();
    const todayCount = list.filter(r => r.dateKey === today).length;
    $('#stats').innerHTML = `
      <div class="stat">한국 누적 실천<b>${st.korea}</b></div>
      <div class="stat">말레이시아 누적 실천<b>${st.malaysia}</b></div>
      <div class="stat">플레이 횟수<b>${st.plays}</b></div>
      <div class="stat">오늘 기록<b>${todayCount}</b></div>
      <div class="stat">방문자 수<b>${visitors}</b></div>`;
    const rows = $('#onlyToday').checked ? list.filter(r => r.dateKey === today) : list;
    $('#rows').innerHTML = rows.length ? rows.map(r => `
      <tr>
        <td>${fmt(r.createdAtMs)}</td>
        <td>${esc(r.nickname)}</td>
        <td class="${r.country === 'korea' ? 'ko' : 'my'}">${NAME[r.country] || ''}</td>
        <td>${r.mode === '2p' ? '2인' : '1인'}</td>
        <td>${r.actions}번</td>
        <td>${Number(r.score).toLocaleString()}</td>
        <td><button class="red small" data-del="${r.id}">삭제</button></td>
      </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;color:#8a96a8">기록이 없어요</td></tr>';
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
      if (!window.confirm('이 기록을 삭제할까요?')) return;
      try { await store.deleteEntry(b.dataset.del); load(); } catch (e) { msg('삭제 실패: ' + e.message); }
    }));
  } catch (e) {
    msg('불러오기 실패: ' + e.message);
  }
}

// ---------- 게임 설정 ----------
const DEFAULT_SET = {
  roundSec: CONFIG.ROUND_MS / 1000, rounds: CONFIG.ROUNDS,
  prizeOn: CONFIG.PRIZE.on, prizeList: CONFIG.PRIZE.list.slice(), prizeEvery: CONFIG.PRIZE.every, prizeMsg: CONFIG.PRIZE.msg
};
let curTotal = 0;

function showSet(v) {
  $('#setSec').value = v.roundSec;
  $('#setRounds').value = v.rounds;
  $('#prizeOn').checked = !!v.prizeOn;
  $('#prizeList').value = (v.prizeList || []).join(', ');
  $('#prizeEvery').value = v.prizeEvery ?? 0;
  $('#prizeMsg').value = v.prizeMsg || '';
  updSet();
}
function readSet() {
  return {
    roundSec: +$('#setSec').value,
    rounds: +$('#setRounds').value,
    prizeOn: $('#prizeOn').checked,
    prizeList: cleanPrizeList($('#prizeList').value),
    prizeEvery: Math.max(0, Math.min(100000, Math.round(+$('#prizeEvery').value || 0))),
    prizeMsg: $('#prizeMsg').value.trim().slice(0, 60)
  };
}
function updSet() {
  const v = readSet();
  $('#setSecVal').textContent = v.roundSec + '초';
  $('#setRoundsVal').textContent = v.rounds + '문제';
  const total = Math.round(3 + v.rounds * (v.roundSec + 1.7));
  $('#setEst').textContent = `한 판 최대 약 ${Math.floor(total / 60)}분 ${total % 60}초 (모두 시간을 다 쓸 때 기준)`;
  $('#prizeOnTxt').textContent = v.prizeOn ? '켜짐' : '꺼짐';
  const prize = { on: v.prizeOn, list: v.prizeList, every: v.prizeEvery };
  const nx = nextMilestone(curTotal, prize);
  const seq = [];
  if (v.prizeOn) { let t = curTotal; for (let i = 0; i < 5; i++) { const n = nextMilestone(t, prize); if (!n) break; seq.push(n); t = n; } }
  $('#prizePreview').innerHTML = !v.prizeOn ? '당첨 이벤트가 꺼져 있어요.'
    : `현재 누적 실천 <b>${curTotal}</b>번 → 다음 당첨: <b>${nx ?? '없음'}</b>번째` + (seq.length > 1 ? ` (그다음: ${seq.slice(1).join(', ')} …)` : '');
  $('#setMsg').textContent = '';
}
async function loadSet() {
  const [s, st] = await Promise.all([store.getSettings(), store.getStats().catch(() => ({}))]);
  curTotal = (st.korea || 0) + (st.malaysia || 0);
  showSet({ ...DEFAULT_SET, ...(s || {}) });
}

async function loadPrizes() {
  try {
    const list = await store.listPrizes();
    $('#prizeRows').innerHTML = list.length ? list.map(r => `
      <tr>
        <td>${fmt(r.createdAtMs)}</td>
        <td><b style="font-weight:normal;color:#e0566a">${r.milestone}번째</b></td>
        <td>${esc(r.nickname)}</td>
        <td>${String(r.country || '').split(',').map(c => NAME[c] || '').join(', ')}</td>
        <td>${r.mode === '2p' ? '2인' : '1인'}</td>
        <td><button class="red small" data-pdel="${r.id}">삭제</button></td>
      </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:#8a96a8">아직 당첨자가 없어요</td></tr>';
    document.querySelectorAll('[data-pdel]').forEach(b => b.addEventListener('click', async () => {
      if (!window.confirm('이 당첨 기록을 삭제할까요?')) return;
      try { await store.deletePrize(b.dataset.pdel); loadPrizes(); } catch (e) { msg('삭제 실패: ' + e.message); }
    }));
  } catch (e) {
    $('#prizeRows').innerHTML = `<tr><td colspan="6" style="color:#e04d4d">불러오기 실패: ${esc(e.code || e.message)}</td></tr>`;
  }
}

function bind() {
  $('#setSec').min = LIMITS.secMin; $('#setSec').max = LIMITS.secMax;
  $('#setRounds').min = LIMITS.roundsMin; $('#setRounds').max = LIMITS.roundsMax;
  ['#setSec', '#setRounds', '#prizeList', '#prizeEvery', '#prizeMsg'].forEach(id => { $(id).oninput = updSet; });
  $('#prizeOn').onchange = updSet;
  $('#btnPrizeTest').onclick = () => {
    const n = nextMilestone(curTotal, { on: true, list: readSet().prizeList, every: readSet().prizeEvery }) || 100;
    window.open('index.html?prizeTest=1&n=' + n, '_blank');
  };
  $('#btnDefaultSet').onclick = () => { showSet(DEFAULT_SET); $('#setMsg').textContent = '기본값(8초 · 10문제 · 당첨 50, 100, 200 / 100개마다)으로 바꿨어요. 저장을 눌러야 적용돼요.'; };
  $('#btnSaveSet').onclick = async () => {
    try {
      const v = readSet();
      if (v.prizeOn && !v.prizeList.length && !v.prizeEvery) throw new Error('당첨 숫자를 하나 이상 적거나 반복 간격을 정해 주세요.');
      await store.saveSettings(v);
      $('#prizeList').value = v.prizeList.join(', ');
      $('#setMsg').style.color = '';
      $('#setMsg').textContent = '✅ 저장했어요. 다음 판부터 바로 적용돼요.';
    } catch (e) {
      $('#setMsg').style.color = '#e04d4d';
      $('#setMsg').textContent = '저장 실패: ' + (e.code === 'permission-denied' ? 'Firestore 규칙에 settings 권한이 없어요 (README 참고)' : e.message);
    }
  };

  $('#btnReload').onclick = () => { load(); loadPrizes(); loadSet(); };
  $('#onlyToday').onchange = load;
  $('#btnDelToday').onclick = async () => {
    if (!window.confirm('오늘 기록을 모두 삭제할까요? 되돌릴 수 없어요.')) return;
    try { const n = await store.deleteAllEntries(true); msg(`${n}개 삭제했어요.`); load(); } catch (e) { msg('실패: ' + e.message); }
  };
  $('#btnDelAll').onclick = async () => {
    if (!window.confirm('전체 기록을 모두 삭제할까요? 되돌릴 수 없어요.')) return;
    try { const n = await store.deleteAllEntries(false); msg(`${n}개 삭제했어요.`); load(); } catch (e) { msg('실패: ' + e.message); }
  };
  $('#btnResetStats').onclick = async () => {
    if (!window.confirm('누적 실천 수를 0으로 되돌릴까요?')) return;
    try { await store.resetStats(); msg('초기화했어요.'); load(); } catch (e) { msg('실패: ' + e.message); }
  };
}

(async () => {
  const mode = await store.initStore();
  bind();
  if (mode === 'local') {
    $('#mode').textContent = '⚠️ 로컬 모드: Firebase 설정 전이라 이 컴퓨터 브라우저에 저장된 기록만 관리합니다.';
    $('#adminArea').classList.remove('hidden');
    load();
    loadSet();
    loadPrizes();
    return;
  }
  $('#mode').textContent = '온라인 모드 (Firebase)';
  await store.initAuth();
  $('#btnLogin').onclick = async () => {
    $('#loginMsg').textContent = '';
    try { await store.signIn($('#email').value.trim(), $('#pw').value); }
    catch (e) { $('#loginMsg').textContent = '로그인 실패: 이메일 또는 비밀번호를 확인하세요.'; }
  };
  $('#pw').addEventListener('keydown', e => { if (e.key === 'Enter') $('#btnLogin').click(); });
  $('#btnLogout').onclick = () => store.signOut();
  store.onAuth(user => {
    $('#loginBox').classList.toggle('hidden', !!user);
    $('#adminArea').classList.toggle('hidden', !user);
    $('#btnLogout').classList.toggle('hidden', !user);
    if (user) { load(); loadSet(); loadPrizes(); }
  });
})();
