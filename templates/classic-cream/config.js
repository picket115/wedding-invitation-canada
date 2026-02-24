'use strict';

// FIREBASE_CONFIG 는 firebase-config.js 에서 로드됩니다 (Netlify 환경변수 → 빌드 시 자동 생성)

// =====================================================
// 커플별 설정 맵
// 새 커플 추가 시 아래 객체에 키-값 쌍을 추가하세요.
// 접속 URL: /templates/classic-cream/?id=<키>
// =====================================================
const CONFIGS = {

  // ── 예시 커플 (테스트용) ─────────────────────────
  'default': {
    groomName:   '신랑이름',
    brideName:   '신부이름',

    /* 날짜 */
    year:        2025,
    month:       11,          // 0-indexed (0=1월 … 11=12월)
    day:         14,
    timeLabel:   '오후 1시 30분',

    /* 장소 */
    venueName:   '그랜드볼룸 웨딩홀',
    venueAddr:   '서울시 강남구 테헤란로 OOO',
    venueDetail: '지하철 2호선 OO역 3번 출구 도보 5분',
    mapUrl:      '#',         // 카카오맵 or 네이버지도 공유 URL

    /* 가족 */
    groomFather: '아버지이름',
    groomMother: '어머니이름',
    brideFather: '아버지이름',
    brideMother: '어머니이름',

    /* 초대글 */
    inviteText: `저희 두 사람이 사랑을 맺어\n한 가정을 이루려 합니다.\n\n소중한 분들을 모시고\n기쁨을 함께 나누고자 합니다.\n\n바쁘신 중에도 부디 오셔서\n자리를 빛내 주시면 감사하겠습니다.`,

    /* 축의금 계좌 */
    groomAccounts: [
      { bank: 'OO은행', number: '123-456-789012', holder: '신랑아버지' },
      { bank: 'OO은행', number: '123-456-789012', holder: '신랑이름'   },
    ],
    brideAccounts: [
      { bank: 'OO은행', number: '123-456-789012', holder: '신부어머니' },
      { bank: 'OO은행', number: '123-456-789012', holder: '신부이름'   },
    ],

    /* 사진 (빈 문자열은 플레이스홀더로 표시)
       예) './photos/01.jpg'  or  'https://...' */
    photos: ['', '', '', '', '', ''],

    /* 카카오톡 미리보기 대표 이미지 (선택)
       없으면 photos 첫 번째 사진이 자동 사용됩니다 */
    // ogImage: 'https://yoursite.com/og-thumbnail.jpg',
  },

  // ── 새 커플 추가 예시 ────────────────────────────
  // 'kim-lee-2025': {
  //   groomName: '김철수', brideName: '이영희',
  //   year: 2025, month: 5, day: 10,
  //   timeLabel: '오후 2시',
  //   venueName: '파크 웨딩홀',
  //   venueAddr: '서울시 서초구 ...',
  //   venueDetail: '3호선 OO역 ...',
  //   mapUrl: 'https://naver.me/...',
  //   groomFather: '김OO', groomMother: '박OO',
  //   brideFather: '이OO', brideMother: '최OO',
  //   inviteText: `...`,
  //   groomAccounts: [...],
  //   brideAccounts: [...],
  //   photos: ['./photos/kim-lee/01.jpg', '...'],
  // },

};
