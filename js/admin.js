import * as store from './store.js?v=1.3.1';

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

function bind() {
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
    if (user) load();
  });
})();
