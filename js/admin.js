import * as store from './store.js?v=1.4.0';
import { CONFIG, LIMITS } from './data.js?v=1.4.0';

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
    const [st, list] = await Promise.all([store.getStats(), store.listEntries()]);
    const today = store.todayKey();
    const todayCount = list.filter(r => r.dateKey === today).length;
    $('#stats').innerHTML = `
      <div class="stat">한국 누적 실천<b>${st.korea}</b></div>
      <div class="stat">말레이시아 누적 실천<b>${st.malaysia}</b></div>
      <div class="stat">플레이 횟수<b>${st.plays}</b></div>
      <div class="stat">오늘 기록<b>${todayCount}</b></div>`;
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
const DEFAULT_SET = { roundSec: CONFIG.ROUND_MS / 1000, rounds: CONFIG.ROUNDS };

function showSet(v) {
  $('#setSec').value = v.roundSec;
  $('#setRounds').value = v.rounds;
  updSet();
}
function updSet() {
  const sec = +$('#setSec').value, r = +$('#setRounds').value;
  $('#setSecVal').textContent = sec + '초';
  $('#setRoundsVal').textContent = r + '문제';
  const total = Math.round(3 + r * (sec + 1.7));
  $('#setEst').textContent = `한 판 최대 약 ${Math.floor(total / 60)}분 ${total % 60}초 (모두 시간을 다 쓸 때 기준)`;
  $('#setMsg').textContent = '';
}
async function loadSet() {
  const s = await store.getSettings();
  showSet({ ...DEFAULT_SET, ...(s || {}) });
}

function bind() {
  $('#setSec').min = LIMITS.secMin; $('#setSec').max = LIMITS.secMax;
  $('#setRounds').min = LIMITS.roundsMin; $('#setRounds').max = LIMITS.roundsMax;
  $('#setSec').oninput = updSet;
  $('#setRounds').oninput = updSet;
  $('#btnDefaultSet').onclick = () => { showSet(DEFAULT_SET); $('#setMsg').textContent = '기본값으로 바꿨어요. 저장을 눌러야 적용돼요.'; };
  $('#btnSaveSet').onclick = async () => {
    try {
      await store.saveSettings({ roundSec: +$('#setSec').value, rounds: +$('#setRounds').value });
      $('#setMsg').style.color = '';
      $('#setMsg').textContent = '✅ 저장했어요. 다음 판부터 바로 적용돼요.';
    } catch (e) {
      $('#setMsg').style.color = '#e04d4d';
      $('#setMsg').textContent = '저장 실패: ' + (e.code === 'permission-denied' ? 'Firestore 규칙에 settings 권한이 없어요 (README 참고)' : e.message);
    }
  };

  $('#btnReload').onclick = load;
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
    if (user) { load(); loadSet(); }
  });
})();
