// ===== 버전 (수정할 때마다 올리기, 기록은 README.md) =====
export const VERSION = 'v1.5.1';

// ===== 게임 설정 (여기 숫자만 바꾸면 게임 난이도가 바뀝니다) =====
export const CONFIG = {
  ROUNDS: 10,            // 한 판 문제 수 기본값 (관리자 페이지에서 3~20 사이로 변경 가능)
  ROUND_MS: 8000,        // 한 문제 제한 시간 기본값 (관리자 페이지에서 3~20초 사이로 변경 가능)
  START_LEVEL: 40,       // 시작 해수면 (0 = 아주 낮음, 100 = 마을이 잠김)
  DELTA: {
    both: -7,            // 두 나라 모두 실천 → 해수면 내려감
    one: +4,             // 한 나라만 실천 → 조금 올라감
    none: +9             // 둘 다 실천 안 함 → 많이 올라감
  },
  CPU_GOOD_RATE: 0.7,    // 1인 모드에서 컴퓨터 친구가 실천할 확률
  IDLE_RETURN_MS: 90000, // 결과·랭킹 화면에서 아무 입력 없으면 처음으로 (부스용)
  NICK_MAX: 8,
  // 누적 실천 수 당첨 이벤트 기본값 (관리자 페이지에서 변경)
  PRIZE: {
    on: true,                 // 사용 여부
    list: [50, 100, 200],     // 당첨 숫자
    every: 100,               // 마지막 당첨 숫자 뒤로 이 간격마다 계속 당첨 (0이면 반복 없음)
    msg: '부스 선생님께 와서 선물을 받아 가세요!'
  }
};

// 관리자 설정 허용 범위
export const LIMITS = { secMin: 3, secMax: 20, roundsMin: 3, roundsMax: 20 };

// 관리자 설정 값을 CONFIG에 반영 (범위를 벗어나면 잘라냄)
export function applySettings(s) {
  if (!s) return;
  const sec = Math.round(Number(s.roundSec));
  const r = Math.round(Number(s.rounds));
  if (sec >= LIMITS.secMin && sec <= LIMITS.secMax) CONFIG.ROUND_MS = sec * 1000;
  if (r >= LIMITS.roundsMin && r <= LIMITS.roundsMax) CONFIG.ROUNDS = r;
  if (typeof s.prizeOn === 'boolean') CONFIG.PRIZE.on = s.prizeOn;
  if (Array.isArray(s.prizeList)) CONFIG.PRIZE.list = cleanPrizeList(s.prizeList);
  if (Number.isInteger(s.prizeEvery) && s.prizeEvery >= 0) CONFIG.PRIZE.every = s.prizeEvery;
  if (typeof s.prizeMsg === 'string') CONFIG.PRIZE.msg = s.prizeMsg;
}

// "50, 100, 200" 같은 입력을 정리 → [50, 100, 200] (중복 제거·오름차순·양의 정수만)
export function cleanPrizeList(v) {
  const arr = Array.isArray(v) ? v : String(v).split(/[^0-9]+/);
  return [...new Set(arr.map(Number).filter(n => Number.isInteger(n) && n > 0 && n <= 1000000))].sort((a, b) => a - b).slice(0, 30);
}

// 누적 실천 수가 before → after 로 늘어날 때 지나간 당첨 숫자들
export function milestonesBetween(before, after, prize = CONFIG.PRIZE) {
  if (!prize.on || after <= before) return [];
  const hit = prize.list.filter(m => m > before && m <= after);
  if (prize.every > 0) {
    const base = prize.list.length ? prize.list[prize.list.length - 1] : 0;
    for (let m = base + prize.every; m <= after; m += prize.every) if (m > before) hit.push(m);
  }
  return hit;
}

// 지금 누적 수 다음에 오는 당첨 숫자 (없으면 null)
export function nextMilestone(total, prize = CONFIG.PRIZE) {
  if (!prize.on) return null;
  const n = prize.list.find(m => m > total);
  if (n) return n;
  if (prize.every > 0) {
    const base = prize.list.length ? prize.list[prize.list.length - 1] : 0;
    if (total < base) return base;
    return base + (Math.floor((total - base) / prize.every) + 1) * prize.every;
  }
  return null;
}

export const COUNTRY = {
  korea:    { name: '한국',     mascot: '반디', mascotDesc: '아기 반달가슴곰', color: '#ff7a8a' },
  malaysia: { name: '말레이시아', mascot: '타피', mascotDesc: '아기 말레이맥',   color: '#3fb6a8' }
};

// ===== 생활 속 상황 카드 =====
// sit: 상황, good: [이모지, 환경지킴이 행동], bad: [이모지, 편하지만 환경에 나쁜 행동]
export const CARDS = {
  korea: [
    { emoji: '❄️', sit: '추운 겨울, 집 안이 쌀쌀해요.', good: ['🧣', '내복 입고 난방 1도 낮추기'], bad: ['🔥', '반팔 입고 난방 세게 틀기'] },
    { emoji: '🥤', sit: '쉬는 시간, 목이 말라요.', good: ['🫙', '텀블러에 물 담아 마시기'], bad: ['🥡', '일회용 컵 계속 쓰기'] },
    { emoji: '🏫', sit: '학교 가는 길이 가까워요.', good: ['🚶', '친구랑 걸어서 가기'], bad: ['🚗', '자동차 태워 달라고 하기'] },
    { emoji: '🥛', sit: '우유를 다 마셨어요.', good: ['♻️', '헹궈서 종이팩 분리배출'], bad: ['🗑️', '일반 쓰레기통에 휙!'] },
    { emoji: '💡', sit: '방에서 나가려고 해요.', good: ['🌙', '불 끄고 나가기'], bad: ['💡', '불 켜 두고 나가기'] },
    { emoji: '🦀', sit: '순천만 갯벌에 놀러 왔어요.', good: ['🧺', '쓰레기 주워서 가져오기'], bad: ['🍬', '과자 봉지 두고 오기'] },
    { emoji: '🛒', sit: '엄마랑 장 보러 가요.', good: ['👜', '장바구니 챙기기'], bad: ['🛍️', '비닐봉지 여러 장 받기'] },
    { emoji: '🪥', sit: '이를 닦을 시간이에요.', good: ['🥛', '컵에 물 받아 양치하기'], bad: ['🚿', '물 틀어 놓고 양치하기'] },
    { emoji: '🍚', sit: '맛있는 급식 시간이에요.', good: ['😋', '먹을 만큼 받아 다 먹기'], bad: ['🍱', '잔뜩 받고 남기기'] },
    { emoji: '☀️', sit: '한여름, 너무 더워요.', good: ['🪭', '선풍기 먼저 켜기'], bad: ['🥶', '에어컨 18도로 틀기'] },
    { emoji: '🔌', sit: '충전이 다 끝났어요.', good: ['✋', '플러그 뽑아 두기'], bad: ['🔋', '계속 꽂아 두기'] },
    { emoji: '📄', sit: '연습할 종이가 필요해요.', good: ['📝', '이면지 다시 쓰기'], bad: ['📃', '새 종이 한 줄 쓰고 버리기'] },
    { emoji: '🌳', sit: '학교 화단이 비어 있어요.', good: ['🌱', '나무와 꽃 심기'], bad: ['🧱', '시멘트로 덮어 버리기'] },
    { emoji: '👕', sit: '작아진 옷이 생겼어요.', good: ['🎁', '동생·친구에게 물려주기'], bad: ['🗑️', '그냥 버리기'] },
    // --- 순천 지역 카드 ---
    { emoji: '🐦', sit: '순천만에 흑두루미가 날아왔어요.', good: ['🤫', '멀리서 조용히 지켜보기'], bad: ['📢', '가까이 가서 소리 지르기'] },
    { emoji: '⚡', sit: '흑두루미가 전깃줄에 다칠 수 있어요.', good: ['🙌', '전봇대 옮기기에 찬성!'], bad: ['🤷', '상관없다고 넘어가기'] },
    { emoji: '🐟', sit: '순천만 갯벌에서 짱뚱어를 만났어요.', good: ['👀', '눈으로만 관찰하기'], bad: ['🪣', '잡아서 집에 가져가기'] },
    { emoji: '🌾', sit: '순천만 갈대밭을 산책해요.', good: ['🚶', '정해진 길로만 걷기'], bad: ['🌾', '갈대밭 안으로 들어가기'] },
    { emoji: '🌷', sit: '순천만국가정원에 왔어요.', good: ['📸', '꽃은 사진으로만 담기'], bad: ['✂️', '예쁜 꽃 꺾어 가기'] },
    { emoji: '🏞️', sit: '동천 물가에서 놀고 있어요.', good: ['🧺', '물가 쓰레기 줍기'], bad: ['🫗', '남은 음료 냇물에 붓기'] },
    { emoji: '🧺', sit: '순천 아랫장에 장 보러 가요.', good: ['👜', '장바구니 들고 가기'], bad: ['🛍️', '검은 비닐봉지 잔뜩 받기'] },
    { emoji: '🏡', sit: '낙안읍성 초가마을을 구경해요.', good: ['🗑️', '쓰레기는 쓰레기통에'], bad: ['🍭', '담장 밑에 몰래 버리기'] },
    { emoji: '⛰️', sit: '조계산에 등산을 왔어요.', good: ['🎒', '쓰레기 되가져오기'], bad: ['🌲', '나뭇가지 꺾으며 걷기'] },
    { emoji: '🚲', sit: '국가정원까지 가까워요.', good: ['🚲', '자전거 타고 가기'], bad: ['🚗', '자동차로 데려다 달라기'] },
    { emoji: '🍂', sit: '가을 낙엽이 많이 쌓였어요.', good: ['🌱', '모아서 퇴비 만들기'], bad: ['🔥', '모아서 태워 버리기'] },
    { emoji: '🎁', sit: '친구 생일 선물을 포장해요.', good: ['📰', '신문지·천으로 포장하기'], bad: ['🎀', '비닐로 여러 겹 포장하기'] },
    { emoji: '🎪', sit: '학교 축제 간식 시간이에요.', good: ['🥤', '내 컵 가져와서 쓰기'], bad: ['🥡', '종이컵 여러 개 쓰기'] },
    { emoji: '🪟', sit: '난방 중인데 창문이 열려 있어요.', good: ['🪟', '창문 닫기'], bad: ['🔥', '열어 둔 채 난방 세게'] },
    { emoji: '🖥️', sit: '컴퓨터를 다 썼어요.', good: ['⏻', '전원 끄고 가기'], bad: ['💤', '켜 둔 채 집에 가기'] },
    { emoji: '🍎', sit: '사과 껍질이 생겼어요.', good: ['♻️', '음식물 쓰레기로 분리'], bad: ['🗑️', '일반 쓰레기에 섞기'] }
  ],
  malaysia: [
    { emoji: '🌞', sit: '무더운 오후, 땀이 나요.', good: ['❄️', '에어컨 26도로 맞추기'], bad: ['🥶', '에어컨 18도로 틀기'] },
    { emoji: '🧃', sit: '시원한 음료를 샀어요.', good: ['👄', '빨대 없이 마시기'], bad: ['🥤', '플라스틱 빨대 받기'] },
    { emoji: '🌿', sit: '바닷가 맹그로브 숲이에요.', good: ['🌱', '맹그로브 묘목 심기'], bad: ['🪓', '숲 베고 건물 짓기'] },
    { emoji: '🏖️', sit: '바닷가로 소풍을 왔어요.', good: ['🧺', '쓰레기 다시 가져오기'], bad: ['🫗', '모래에 쓰레기 묻기'] },
    { emoji: '🐢', sit: '모래밭에 바다거북 알이 있어요.', good: ['🛡️', '둥지 지켜 주기'], bad: ['👣', '모르는 척 밟고 지나가기'] },
    { emoji: '🛒', sit: '시장에 과일 사러 가요.', good: ['👜', '장바구니 챙기기'], bad: ['🛍️', '비닐봉지 여러 장 받기'] },
    { emoji: '🏫', sit: '학교에 가야 해요.', good: ['🚌', '스쿨버스 타기'], bad: ['🚗', '혼자 자동차 타기'] },
    { emoji: '🌴', sit: '열대우림 근처에 살아요.', good: ['🌳', '나무 지키기 캠페인'], bad: ['🪚', '나무 마구 베어 내기'] },
    { emoji: '🌧️', sit: '오늘도 비가 많이 와요.', good: ['🪣', '빗물 모아 화분에 주기'], bad: ['🚰', '수돗물 틀어 놓고 물 주기'] },
    { emoji: '🍛', sit: '나시르막을 포장해 가요.', good: ['🍱', '도시락통 가져가기'], bad: ['📦', '스티로폼 용기 받기'] },
    { emoji: '👕', sit: '빨래가 다 끝났어요.', good: ['☀️', '햇볕에 말리기'], bad: ['🌀', '건조기 오래 돌리기'] },
    { emoji: '💡', sit: '교실에서 나가려고 해요.', good: ['🌙', '불·선풍기 끄고 나가기'], bad: ['💡', '그냥 켜 두고 나가기'] },
    { emoji: '🐠', sit: '바다 산호초를 구경해요.', good: ['👀', '눈으로만 보기'], bad: ['✋', '산호 꺾어 가져오기'] },
    { emoji: '🍾', sit: '페트병이 생겼어요.', good: ['♻️', '라벨 떼고 분리배출'], bad: ['🌊', '강에 휙 던지기'] },
    // --- 말레이시아 지역 카드 ---
    { emoji: '✨', sit: '맹그로브 숲에 반딧불이가 반짝여요.', good: ['🔦', '불빛 끄고 조용히 보기'], bad: ['📸', '플래시 터뜨려 사진 찍기'] },
    { emoji: '🌾', sit: '케다주 논에서 벼를 다 거뒀어요.', good: ['🌱', '볏짚을 거름으로 쓰기'], bad: ['🔥', '논에서 볏짚 태우기'] },
    { emoji: '🦧', sit: '보르네오 숲에 오랑우탄이 살아요.', good: ['🌳', '숲 지키기 캠페인'], bad: ['🪓', '숲 베고 농장 만들기'] },
    { emoji: '🍜', sit: '호커센터 음식을 포장해요.', good: ['🍱', '도시락통에 담아 가기'], bad: ['🛍️', '비닐봉지에 꽁꽁 담기'] },
    { emoji: '🏙️', sit: '쿠알라룸푸르 시내에 가요.', good: ['🚇', '지하철(LRT) 타기'], bad: ['🚗', '혼자 자동차 타기'] },
    { emoji: '🏝️', sit: '랑카위 바닷가에 놀러 왔어요.', good: ['🐚', '조개껍데기는 그대로'], bad: ['🎒', '조개·산호 잔뜩 줍기'] },
    { emoji: '🦜', sit: '숲에서 코뿔새를 만났어요.', good: ['🤫', '멀리서 조용히 보기'], bad: ['🪨', '돌 던져 쫓아내기'] },
    { emoji: '🌧️', sit: '몬순 철, 비가 쏟아져요.', good: ['🧹', '배수구 쓰레기 치우기'], bad: ['🗑️', '배수구에 쓰레기 버리기'] },
    { emoji: '🌫️', sit: '연기 때문에 하늘이 뿌예요.', good: ['🚫', '쓰레기 태우지 않기'], bad: ['🔥', '마당에서 쓰레기 태우기'] },
    { emoji: '🎉', sit: '하리라야 잔치에 초대받았어요.', good: ['🍽️', '다회용 그릇 쓰기'], bad: ['🥡', '일회용 접시 잔뜩 쓰기'] },
    { emoji: '🍃', sit: '카메론 하이랜드 차밭에 왔어요.', good: ['🚶', '길로만 다니기'], bad: ['🌿', '찻잎 마구 뜯기'] },
    { emoji: '🐯', sit: '말레이호랑이가 줄어들고 있어요.', good: ['📣', '보호 캠페인 알리기'], bad: ['🤷', '나랑 상관없다 하기'] },
    { emoji: '🥥', sit: '코코넛 음료를 다 마셨어요.', good: ['🪴', '껍데기로 화분 만들기'], bad: ['🌊', '바닷가에 던지기'] },
    { emoji: '🏪', sit: '가까운 가게에 가요.', good: ['🚶', '걸어서 다녀오기'], bad: ['🛵', '오토바이 타고 가기'] },
    { emoji: '🍃', sit: '간식을 싸 가야 해요.', good: ['🍌', '바나나잎에 싸 가기'], bad: ['📦', '스티로폼에 싸 가기'] },
    { emoji: '🧼', sit: '손을 씻고 있어요.', good: ['🚰', '비누칠할 땐 물 잠그기'], bad: ['🚿', '물 계속 틀어 놓기'] }
  ]
};

// 별명 비속어 필터 (필요하면 단어 추가)
export const BAD_WORDS = [
  '시발', '씨발', '씨바', 'ㅅㅂ', 'ㅆㅂ', '병신', 'ㅂㅅ', '개새', '새끼', '존나', 'ㅈㄴ', '좆', '지랄',
  '미친', '꺼져', '닥쳐', '애미', '느금', '엠창', '섹스', '야동', 'fuck', 'shit', 'sex', 'bitch'
];
