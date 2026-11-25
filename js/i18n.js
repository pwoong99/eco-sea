// ===== 언어 (한국어 / English) =====
// 화면 문구는 모두 여기에서 관리합니다. 새 문구를 넣을 때는 ko와 en 둘 다 적어 주세요.
let LANG = 'ko';
try { LANG = localStorage.getItem('ecoSea.lang') === 'en' ? 'en' : 'ko'; } catch (e) { /* 무시 */ }

export function getLang() { return LANG; }
export function setLang(l) {
  LANG = l === 'en' ? 'en' : 'ko';
  try { localStorage.setItem('ecoSea.lang', LANG); } catch (e) { /* 무시 */ }
  document.documentElement.lang = LANG;
}

const D = {
  ko: {
    pageTitle: '함께 지키는 바다 - 한국 × 말레이시아 환경지킴이 게임',
    langBtn: '🌐 English',
    langTitle: 'Play in English',
    soundTitle: '소리 켜기/끄기',
    fullTitle: '전체 화면',
    // 시작
    badge: '한국 🤝 말레이시아',
    title: '<span>함께</span> <span>지키는</span> <span>바다</span>',
    subtitle: '두 나라가 함께 환경지킴이가 되면 바다가 내려가요!',
    mode1: '1인 모드', mode1Sub: '컴퓨터 친구와 함께',
    mode2: '2인 모드', mode2Sub: '친구와 한 나라씩',
    rankBtn: '🏆 환경지킴이 랭킹 보기',
    statsBanner: (k, m) => `지금까지 한국 친구들 <b>${k}</b>번 · 말레이시아 친구들 <b>${m}</b>번 환경을 지켰어요!`,
    statsFirst: '첫 번째 환경지킴이가 되어 보세요! 🌱',
    // 설정
    pickCountry: '어느 나라 환경지킴이가 될까요?',
    korea: '한국', malaysia: '말레이시아',
    withBandi: '반달가슴곰 반디와 함께', withTapi: '말레이맥 타피와 함께',
    myNick: '내 별명', nickPh: '별명 (최대 8글자)', nickPh2: '별명',
    home: '◀ 처음으로', next: '다음 ▶', back: '◀ 뒤로',
    oneEach: '한 명씩 나라를 맡아 주세요!',
    koFriend: '한국 친구', myFriend: '말레이시아 친구',
    nickEmpty: '별명을 적어 주세요.',
    nickLong: (n) => `별명은 ${n}글자까지 쓸 수 있어요.`,
    nickBad: '고운 말로 된 다른 별명을 써 주세요. 🙂',
    pickFirst: '나라를 먼저 골라 주세요.',
    // 게임 방법
    howTitle: '🌊 이렇게 해요',
    howLead: '상황 카드가 나오면 <b class="hl-good">환경을 지키는 행동</b>을 빨리 골라요!',
    ruleBoth: '두 나라 모두 실천', ruleBothRes: '바다가 <b>내려가요</b> ⬇',
    ruleOne: '한 나라만 실천', ruleOneRes: '바다가 <b>조금</b> 올라가요 ⬆',
    ruleNone: '둘 다 안 함', ruleNoneRes: '바다가 <b>많이</b> 올라가요 ⬆⬆',
    howTip: (sec, n) => `⏱ 한 문제에 <b>${sec}초</b>, 모두 <b>${n}문제</b>예요. 시간 안에 고르지 못하면 실천하지 않은 것으로 쳐요. 빨리 고를수록 점수가 더 높아요!`,
    howKeys1: (name, country, keys) => `${name} 친구는 <b>${country}</b> 환경지킴이!<br>${keys} 키나 마우스로 골라요. 다른 나라는 <b>컴퓨터 친구</b>가 맡아요.`,
    howKeys2: (ko, my) => `${ko} : <kbd>A</kbd> 왼쪽 / <kbd>D</kbd> 오른쪽<br>${my} : <kbd>←</kbd> 왼쪽 / <kbd>→</kbd> 오른쪽<br><small>마우스로 눌러도 돼요!</small>`,
    play: '시작! <small>(Enter)</small>',
    // 게임
    round: '라운드', seaLevel: '해수면', quit: '그만하기',
    seaSafe: '안전 😊', seaNormal: '보통 🙂', seaDanger: '위험 😟', seaVery: '아주 위험 😱',
    cpu: '컴퓨터 친구', cpuTag: '🤖 컴퓨터',
    withMascot: (m) => `${m}와 함께`,
    actCount: '실천 <b class="act">0</b>번',
    cpuThinking: '컴퓨터 친구가 고민 중이에요',
    go: '시작!',
    timeout: '⏰ 시간 초과!',
    toastBoth: '💙 함께 실천했어요!', toastBothSub: '바다가 내려가요',
    toastOne: (c) => `🌊 ${c}만 실천했어요`, toastOneSub: '바다가 조금 올라가요… 함께해야 해요!',
    toastNone: '😱 아무도 실천하지 않았어요!', toastNoneSub: '바다가 많이 올라가요',
    // 결과
    resGood: '바다를 지켜냈어요!', resGoodMsg: '두 나라가 함께 실천해서 해수면이 내려갔어요. 최고의 환경지킴이!',
    resMid: '휴, 아슬아슬해요!', resMidMsg: '조금만 더 함께 실천하면 바다를 지킬 수 있어요.',
    resBad: '마을이 물에 잠기고 있어요…', resBadMsg: '한 나라만 노력해서는 부족해요. 두 나라가 함께해야 바다를 지킬 수 있어요!',
    together: (n, m) => `🤝 두 나라가 함께 실천한 횟수: ${n} / ${m}번`,
    cpuFriend: '🤖 컴퓨터 친구',
    guardian: (c) => `${c} 환경지킴이`,
    actions: (n) => `실천 <b>${n}</b>번`,
    score: (n) => `점수 ${n}점`,
    ranking: '랭킹 등록 중…',
    rankResult: (t, a, hot) => `🏆 오늘 <b class="${hot ? 'new' : ''}">${t}등</b> · 전체 ${a}등`,
    rankFail: '⚠️ 랭킹 저장에 실패했어요 (인터넷 확인)',
    toHome: '🏠 처음으로', toRank: '🏆 랭킹 보기', again: '🔁 다시 하기',
    // 랭킹
    rankTitle: '🏆 환경지킴이 랭킹',
    today: '오늘', all: '전체',
    rankNote: '실천 횟수가 같으면 더 빨리 고른 친구가 위에 있어요.',
    loading: '불러오는 중… 🌊',
    ctKo: (n) => `한국 친구들의 실천<b>${n}번</b>`,
    ctMy: (n) => `말레이시아 친구들의 실천<b>${n}번</b>`,
    rankEmpty: '아직 기록이 없어요. 첫 번째 환경지킴이가 되어 보세요! 🌱',
    rankActs: (n) => `실천 ${n}번`,
    rankScore: (n) => `${n}점`,
    rankErr: '랭킹을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.',
    // 당첨
    prizeRibbon: '🎉 당첨! 🎉', prizeSub: '모두 함께 지킨 바다',
    prizeNum: '<span>누적</span> <b id="prizeNum">0</b><span>번째</span>',
    prizeTitle: '환경 실천의 주인공!',
    ok: '확인 <small>(Enter)</small>',
    // 아래쪽
    maker: '만든이: 푸르이든', adminTitle: '관리자 페이지',
    visits: '👀 방문', visitsTitle: '사이트 접속 + 게임 플레이 횟수',
    online: '🟢 온라인 랭킹 연결됨', local: '🟠 로컬 랭킹 (이 컴퓨터에만 저장)',
    // 섬 위 이름표
    tagKo: '반달가슴곰 반디', tagMy: '말레이맥 타피',
    mascotKo: '반디', mascotMy: '타피'
  },
  en: {
    pageTitle: 'Saving Our Sea Together - Korea × Malaysia Eco Game',
    langBtn: '🌐 한국어',
    langTitle: '한국어로 하기',
    soundTitle: 'Sound on/off',
    fullTitle: 'Full screen',
    badge: 'Korea 🤝 Malaysia',
    title: '<span>Saving</span> <span>Our Sea</span> <span>Together</span>',
    subtitle: 'When both countries protect nature, the sea goes down!',
    mode1: '1 Player', mode1Sub: 'With a computer friend',
    mode2: '2 Players', mode2Sub: 'One country each',
    rankBtn: '🏆 See the Eco Rankings',
    statsBanner: (k, m) => `Korean friends <b>${k}</b> times · Malaysian friends <b>${m}</b> times protected nature so far!`,
    statsFirst: 'Be the very first eco guardian! 🌱',
    pickCountry: 'Which country will you protect?',
    korea: 'Korea', malaysia: 'Malaysia',
    withBandi: 'With Bandi the Moon Bear', withTapi: 'With Tapi the Malayan Tapir',
    myNick: 'My nickname', nickPh: 'Nickname (max 8)', nickPh2: 'Nickname',
    home: '◀ Home', next: 'Next ▶', back: '◀ Back',
    oneEach: 'Each player picks a country!',
    koFriend: 'Korea player', myFriend: 'Malaysia player',
    nickEmpty: 'Please write a nickname.',
    nickLong: (n) => `A nickname can be up to ${n} letters.`,
    nickBad: 'Please choose a kind nickname. 🙂',
    pickFirst: 'Please pick a country first.',
    howTitle: '🌊 How to Play',
    howLead: 'When a card appears, quickly choose <b class="hl-good">the eco-friendly action</b>!',
    ruleBoth: 'Both countries act', ruleBothRes: 'The sea goes <b>down</b> ⬇',
    ruleOne: 'Only one acts', ruleOneRes: 'The sea rises <b>a little</b> ⬆',
    ruleNone: 'Nobody acts', ruleNoneRes: 'The sea rises <b>a lot</b> ⬆⬆',
    howTip: (sec, n) => `⏱ <b>${sec} seconds</b> per question, <b>${n} questions</b> in total. If time runs out, it counts as no action. The faster you choose, the higher your score!`,
    howKeys1: (name, country, keys) => `${name} protects <b>${country}</b>!<br>Use the ${keys} keys or the mouse. A <b>computer friend</b> plays the other country.`,
    howKeys2: (ko, my) => `${ko} : <kbd>A</kbd> left / <kbd>D</kbd> right<br>${my} : <kbd>←</kbd> left / <kbd>→</kbd> right<br><small>You can click with the mouse, too!</small>`,
    play: 'Start! <small>(Enter)</small>',
    round: 'Round', seaLevel: 'Sea level', quit: 'Quit',
    seaSafe: 'Safe 😊', seaNormal: 'OK 🙂', seaDanger: 'Danger 😟', seaVery: 'Big danger 😱',
    cpu: 'Computer friend', cpuTag: '🤖 Computer',
    withMascot: (m) => `with ${m}`,
    actCount: 'Actions <b class="act">0</b>',
    cpuThinking: 'Computer friend is thinking',
    go: 'Go!',
    timeout: '⏰ Time\'s up!',
    toastBoth: '💙 You acted together!', toastBothSub: 'The sea goes down',
    toastOne: (c) => `🌊 Only ${c} acted`, toastOneSub: 'The sea rises a little… Let\'s act together!',
    toastNone: '😱 Nobody acted!', toastNoneSub: 'The sea rises a lot',
    resGood: 'You saved the sea!', resGoodMsg: 'Both countries acted together and the sea went down. Super eco guardians!',
    resMid: 'Phew, that was close!', resMidMsg: 'Act together a little more and you can save the sea.',
    resBad: 'The villages are flooding…', resBadMsg: 'One country alone is not enough. We need both countries to save the sea!',
    together: (n, m) => `🤝 Times both countries acted: ${n} / ${m}`,
    cpuFriend: '🤖 Computer friend',
    guardian: (c) => `${c} Eco Guardian`,
    actions: (n) => `Actions <b>${n}</b>`,
    score: (n) => `Score ${n}`,
    ranking: 'Saving your ranking…',
    rankResult: (t, a, hot) => `🏆 Today <b class="${hot ? 'new' : ''}">#${t}</b> · All-time #${a}`,
    rankFail: '⚠️ Could not save your ranking (check the internet)',
    toHome: '🏠 Home', toRank: '🏆 Rankings', again: '🔁 Play Again',
    rankTitle: '🏆 Eco Guardian Rankings',
    today: 'Today', all: 'All-time',
    rankNote: 'If actions are tied, the faster player ranks higher.',
    loading: 'Loading… 🌊',
    ctKo: (n) => `Korean friends' actions<b>${n}</b>`,
    ctMy: (n) => `Malaysian friends' actions<b>${n}</b>`,
    rankEmpty: 'No records yet. Be the first eco guardian! 🌱',
    rankActs: (n) => `${n} actions`,
    rankScore: (n) => `${n} pts`,
    rankErr: 'Could not load rankings. Please check the internet.',
    prizeRibbon: '🎉 You Win! 🎉', prizeSub: 'The sea we saved together',
    prizeNum: '<span>Total actions</span> <b id="prizeNum">0</b><span>!</span>',
    prizeTitle: 'You are the eco hero!',
    prizeMsgEn: 'Please see the booth teacher for your prize!',
    ok: 'OK <small>(Enter)</small>',
    maker: 'Made by 푸르이든', adminTitle: 'Admin page',
    visits: '👀 Visits', visitsTitle: 'Site visits + games played',
    online: '🟢 Online rankings connected', local: '🟠 Local rankings (this computer only)',
    tagKo: 'Bandi the Moon Bear', tagMy: 'Tapi the Malayan Tapir',
    mascotKo: 'Bandi', mascotMy: 'Tapi'
  }
};

// 문구 가져오기: t('key') 또는 t('key', 인자...)
export function t(key, ...args) {
  const v = D[LANG][key] ?? D.ko[key];
  if (v === undefined) return key;
  return typeof v === 'function' ? v(...args) : v;
}

// index.html의 data-i18n 속성이 붙은 요소에 문구 넣기
//  data-i18n="key"        → 내용(HTML)
//  data-i18n-ph="key"     → placeholder
//  data-i18n-title="key"  → title
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.title = t('pageTitle');
  document.documentElement.lang = LANG;
}
