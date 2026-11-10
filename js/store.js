// ===== 랭킹 저장소 =====
// firebase-config.js가 채워져 있으면 Firestore, 아니면 이 브라우저(localStorage)에 저장합니다.
import { FIREBASE_CONFIG } from './firebase-config.js';

const BASE = 'https://www.gstatic.com/firebasejs/10.12.2/';
const LS_R = 'ecoSea.rankings';
const LS_S = 'ecoSea.stats';

let app = null, db = null, F = null, A = null, auth = null;
let mode = 'local';

export function getMode() { return mode; }

// 한국 시간 기준 날짜 (예: 2026-11-10)
export function todayKey() {
  return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
}

function configured() {
  const c = FIREBASE_CONFIG;
  return c && c.apiKey && c.projectId && !String(c.apiKey).startsWith('여기에');
}

export async function initStore() {
  if (!configured()) { mode = 'local'; return mode; }
  try {
    const m = await import(BASE + 'firebase-app.js');
    F = await import(BASE + 'firebase-firestore.js');
    app = m.initializeApp(FIREBASE_CONFIG);
    db = F.getFirestore(app);
    mode = 'firebase';
  } catch (e) {
    console.warn('Firebase 연결 실패 → 로컬 모드로 동작', e);
    mode = 'local';
  }
  return mode;
}

// ---------- 로컬 저장 ----------
function lsGet(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch (e) { return def; }
}
function lsSet(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* 무시 */ }
}

// ---------- 저장 ----------
// entries: [{nickname, country, actions, together, score, finalLevel, mode}]
export async function saveEntries(entries) {
  const inc = { korea: 0, malaysia: 0 };
  entries.forEach(e => { inc[e.country] += e.actions; });

  if (mode === 'firebase') {
    const ids = [];
    for (const e of entries) {
      const ref = await F.addDoc(F.collection(db, 'rankings'), {
        ...e, dateKey: todayKey(), createdAt: F.serverTimestamp()
      });
      ids.push(ref.id);
    }
    try {
      await F.setDoc(F.doc(db, 'stats', 'global'), {
        korea: F.increment(inc.korea),
        malaysia: F.increment(inc.malaysia),
        plays: F.increment(1)
      }, { merge: true });
    } catch (e) { console.warn('누적 통계 저장 실패', e); }
    return ids;
  }

  const list = lsGet(LS_R, []);
  const ids = entries.map(e => {
    const id = 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    list.push({ id, ...e, dateKey: todayKey(), createdAt: Date.now() });
    return id;
  });
  lsSet(LS_R, list);
  const st = lsGet(LS_S, { korea: 0, malaysia: 0, plays: 0 });
  st.korea += inc.korea; st.malaysia += inc.malaysia; st.plays += 1;
  lsSet(LS_S, st);
  return ids;
}

const byScore = (a, b) => (b.score - a.score) || ((a.createdAtMs || 0) - (b.createdAtMs || 0));

function normalize(id, d) {
  const ts = d.createdAt;
  const ms = ts && typeof ts.toMillis === 'function' ? ts.toMillis() : (typeof ts === 'number' ? ts : 0);
  return { id, ...d, createdAtMs: ms };
}

async function todayList() {
  if (mode === 'firebase') {
    const q = F.query(F.collection(db, 'rankings'), F.where('dateKey', '==', todayKey()), F.limit(2000));
    const snap = await F.getDocs(q);
    return snap.docs.map(d => normalize(d.id, d.data())).sort(byScore);
  }
  return lsGet(LS_R, []).filter(r => r.dateKey === todayKey()).map(r => normalize(r.id, r)).sort(byScore);
}

// period: 'today' | 'all'
export async function getRanking(period = 'today', n = 10) {
  if (period === 'today') return (await todayList()).slice(0, n);
  if (mode === 'firebase') {
    const q = F.query(F.collection(db, 'rankings'), F.orderBy('score', 'desc'), F.limit(n));
    const snap = await F.getDocs(q);
    return snap.docs.map(d => normalize(d.id, d.data())).sort(byScore);
  }
  return lsGet(LS_R, []).map(r => normalize(r.id, r)).sort(byScore).slice(0, n);
}

// 내 점수가 오늘/전체 몇 등인지
export async function getRanks(score) {
  const today = await todayList();
  const todayRank = 1 + today.filter(r => r.score > score).length;
  let allRank;
  if (mode === 'firebase') {
    const q = F.query(F.collection(db, 'rankings'), F.where('score', '>', score));
    const c = await F.getCountFromServer(q);
    allRank = 1 + c.data().count;
  } else {
    allRank = 1 + lsGet(LS_R, []).filter(r => r.score > score).length;
  }
  return { todayRank, allRank };
}

export async function getStats() {
  if (mode === 'firebase') {
    const s = await F.getDoc(F.doc(db, 'stats', 'global'));
    return { korea: 0, malaysia: 0, plays: 0, ...(s.exists() ? s.data() : {}) };
  }
  return lsGet(LS_S, { korea: 0, malaysia: 0, plays: 0 });
}

// ---------- 관리자 ----------
export async function initAuth() {
  if (mode !== 'firebase') return null;
  A = await import(BASE + 'firebase-auth.js');
  auth = A.getAuth(app);
  return auth;
}
export function onAuth(cb) {
  if (!auth) { cb(null); return; }
  A.onAuthStateChanged(auth, cb);
}
export function signIn(email, pw) { return A.signInWithEmailAndPassword(auth, email, pw); }
export function signOut() { return A.signOut(auth); }

export async function listEntries() {
  if (mode === 'firebase') {
    const q = F.query(F.collection(db, 'rankings'), F.orderBy('createdAt', 'desc'), F.limit(1000));
    const snap = await F.getDocs(q);
    return snap.docs.map(d => normalize(d.id, d.data()));
  }
  return lsGet(LS_R, []).map(r => normalize(r.id, r)).sort((a, b) => b.createdAtMs - a.createdAtMs);
}

export async function deleteEntry(id) {
  if (mode === 'firebase') return F.deleteDoc(F.doc(db, 'rankings', id));
  lsSet(LS_R, lsGet(LS_R, []).filter(r => r.id !== id));
}

// onlyToday=true 이면 오늘 기록만 삭제
export async function deleteAllEntries(onlyToday = false) {
  if (mode === 'firebase') {
    let total = 0;
    while (true) {
      const base = F.collection(db, 'rankings');
      const q = onlyToday ? F.query(base, F.where('dateKey', '==', todayKey()), F.limit(400)) : F.query(base, F.limit(400));
      const snap = await F.getDocs(q);
      if (snap.empty) break;
      const batch = F.writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      total += snap.size;
    }
    return total;
  }
  const list = lsGet(LS_R, []);
  const keep = onlyToday ? list.filter(r => r.dateKey !== todayKey()) : [];
  lsSet(LS_R, keep);
  return list.length - keep.length;
}

export async function resetStats() {
  if (mode === 'firebase') return F.setDoc(F.doc(db, 'stats', 'global'), { korea: 0, malaysia: 0, plays: 0 });
  lsSet(LS_S, { korea: 0, malaysia: 0, plays: 0 });
}
