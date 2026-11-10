# 🌊 함께 지키는 바다

한국 × 말레이시아 환경지킴이 협동 게임 (국외교류 기후위기 공동수업 연계 부스 체험용)

- 두 나라가 **함께** 환경지킴이 행동을 고르면 해수면이 내려가고, 한쪽만 하면 조금, 둘 다 안 하면 많이 올라갑니다.
- **1인 모드**: 내가 한 나라, 컴퓨터 친구가 다른 나라
- **2인 모드**: 노트북 한 대에서 한국 `A`/`D`, 말레이시아 `←`/`→` (마우스도 가능)
- 별명으로 랭킹 등록 (오늘 / 전체), 나라별 누적 실천 수 표시

만든이: 푸르이든

## 파일 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 게임 화면 |
| `admin.html` | 관리자 (기록 삭제·초기화) |
| `css/style.css` | 디자인 |
| `js/data.js` | **게임 설정(라운드 수, 시간, 해수면 변화량)과 상황 카드** — 내용 수정은 여기서 |
| `js/game.js` | 게임 진행 |
| `js/scene.js` | 배경 그래픽(SVG) |
| `js/store.js` | 랭킹 저장 (Firebase / 로컬) |
| `js/firebase-config.js` | Firebase 연결 정보 |
| `firestore.rules` | Firestore 보안 규칙 |

## Firebase 연결 방법

Firebase 설정 전에는 **로컬 모드**(이 컴퓨터 브라우저에만 랭킹 저장)로 그대로 동작합니다.

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 만들기
2. **Firestore Database** 만들기 (위치: `asia-northeast3` 서울)
3. **프로젝트 설정 → 내 앱 → 웹 앱 추가** → 나오는 `firebaseConfig` 값을 `js/firebase-config.js`에 붙여 넣기
4. **Firestore → 규칙** 탭에 `firestore.rules` 내용 붙여 넣기 → `관리자이메일@example.com`을 본인 이메일로 바꾸고 게시
5. (관리자 페이지용) **Authentication → 이메일/비밀번호** 사용 설정 → 사용자 추가에서 위 이메일과 비밀번호 등록

## GitHub Pages 배포

저장소 **Settings → Pages → Branch: `main` / `(root)`** 저장 → 1~2분 뒤 `https://pwoong99.github.io/저장소이름/` 로 접속
