'use strict';

// FIREBASE_CONFIG 는 firebase-config.js 에서 로드됩니다 (Netlify 환경변수 → 빌드 시 자동 생성)

// =====================================================
// 커플별 설정 맵
// 새 커플 추가 시 아래 객체에 키-값 쌍을 추가하세요.
// 접속 URL: /template/?id=<키>
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
    timeLabel:   '오후 1시 30분',

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
    inviteText: `서로 다른 색으로 살아온 두 사람이 \n 이제 하나의 빛으로 새로운 시작을 하려 합니다. \n 저희의 뜻깊은 출발의 자리에 오셔서 \n 따뜻한 축복으로 함께해 주시면 감사하겠습니다.`,

    /* 축의금 계좌 */
    groomAccounts: [],
    brideAccounts: [],

    /* 사진 (빈 문자열은 자동 제외)
       예) './photos/01.jpg'  or  'https://...' */
    photos: [ 
       '/templates/classic-cream/images/KakaoTalk_20260528_230250008.jpg',
       '/templates/classic-cream/images/KakaoTalk_20260528_230250008_01.jpg',
       '/templates/classic-cream/images/KakaoTalk_20260528_230250008_02.jpg'
    ],
    /* 카카오톡 미리보기 대표 이미지 (선택) */
    ogImage: '/templates/classic-cream/images/KakaoTalk_20260528_230250008_01.jpg',
  },

};
