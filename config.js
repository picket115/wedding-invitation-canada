// =====================================================
// ✏️  여기서 청첩장 내용을 수정하세요
// =====================================================

const CONFIG = {
  groomName:   '신랑이름',    // ✏️ 신랑 이름
  brideName:   '신부이름',    // ✏️ 신부 이름

  /* 날짜 ✏️ */
  year:        2025,
  month:       11,   // 0 = 1월 … 11 = 12월
  day:         14,   // 결혼식 날짜
  timeLabel:   '오후 1시 30분',

  /* 장소 ✏️ */
  venueName:   '그랜드볼룸 웨딩홀',
  venueAddr:   '서울시 강남구 테헤란로 OOO',
  venueDetail: '지하철 2호선 OO역 3번 출구 도보 5분',
  mapUrl:      '#',  // ✏️ 카카오맵 or 네이버지도 공유 URL

  /* 가족 ✏️ */
  groomFather: '아버지이름',
  groomMother: '어머니이름',
  brideFather: '아버지이름',
  brideMother: '어머니이름',

  /* 초대글 ✏️ */
  inviteText: `저희 두 사람이 사랑을 맺어\n한 가정을 이루려 합니다.\n\n소중한 분들을 모시고\n기쁨을 함께 나누고자 합니다.\n\n바쁘신 중에도 부디 오셔서\n자리를 빛내 주시면 감사하겠습니다.`,

  /* 축의금 계좌 ✏️ */
  groomAccounts: [
    { bank: 'OO은행', number: '123-456-789012', holder: '신랑아버지' },
    { bank: 'OO은행', number: '123-456-789012', holder: '신랑이름'  },
  ],
  brideAccounts: [
    { bank: 'OO은행', number: '123-456-789012', holder: '신부어머니' },
    { bank: 'OO은행', number: '123-456-789012', holder: '신부이름'  },
  ],

  /* 갤러리 사진 ✏️
     실제 사진 경로 또는 URL을 입력하세요.
     비워두면 플레이스홀더가 표시됩니다.
     예) './photos/01.jpg'  또는  'https://...'  */
  photos: [
    '', '', '', '', '', '',
  ],

  /* Firebase ✏️
     Firebase 콘솔(console.firebase.google.com)에서 프로젝트 생성 후
     프로젝트 설정 > 내 앱 > SDK 설정의 값을 아래에 붙여넣으세요 */
  firebaseConfig: {
    apiKey:            'AIzaSyBtwO06KdJm1yaLd4HRdhx--T66iG6XWjo',
    authDomain:        'wedding-invitation-canada.firebaseapp.com',
    projectId:         'wedding-invitation-canada',
    storageBucket:     'wedding-invitation-canada.firebasestorage.app',
    messagingSenderId: '835221218755',
    appId:             '1:835221218755:web:e2459085c2d452a8d44976',
    measurementId:     'G-WRLYXBNWLC',
  },
};
