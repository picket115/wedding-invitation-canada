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
    groomName:   '최재혁',
    brideName:   'Erin Christine Mary Hunt',

    /* 날짜 */
    year:        2026,
    month:       6,          // 0-indexed (0=1월 … 11=12월)
    day:         25,

    /* 장소 */
    venueName:   'Kedron Dells Golf Club',
    venueAddr:   '2400 Ritson Rd N, Oshawa, ON L1H 0N8',
    venueDetail: '2400 Ritson Rd N, Oshawa, ON L1H 0N8',
    mapUrl:      'https://www.google.com/maps/search/?api=1&query=Kedron+Dells+Golf+Club',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2871.444444444444!2d-78.8888888!3d43.9666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d51b9999999999%3A0x1234567890abcdef!2sKedron%20Dells%20Golf%20Club!5e0!3m2!1sen!2sca!4v1718345678901!5m2!1sen!2sca',

    /* 가족 */
    groomFather: '최우호',
    groomMother: '서정주',
    brideFather: 'Robert Hunt',
    brideMother: 'Marcelle Birgeneau',

    /* 초대글 */
    inviteText: `저희 두 사람이 먼 해외에서 \n소중한 결혼식을 올리게 되었습니다.\n 직접 모시고 축하를 나누지 못해 정말 아쉬운 마음입니다.\n 비록 몸은 멀리 떨어져 있지만,\n 보내주시는 따뜻한 축복을 마음 깊이 새기며 \n 예쁘게 잘 살겠습니다.`,

    /* 축의금 계좌 */
    groomAccounts: [
      { bank: '대구은행', number: '508-11-670692-2', holder: '서정주' },
      { bank: '농협은행', number: '150076-52-090767', holder: '최우호' },
    ],

    /* 사진 (빈 문자열은 플레이스홀더로 표시)
       예) './photos/01.jpg'  or  'https://...' */
    photos: [ 
       'images/KakaoTalk_20260528_230250008.jpg',
       'images/KakaoTalk_20260528_230250008_01.jpg',
       'images/KakaoTalk_20260528_230250008_02.jpg'
    ],


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
