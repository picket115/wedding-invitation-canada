// =====================================================
// OG 태그 서버 주입 (카카오톡 미리보기용)
// 새 커플 추가 시 아래 TEMPLATE_CONFIGS 도 함께 업데이트하세요.
// =====================================================

const DOW_KO = ['일','월','화','수','목','금','토'];
const MON_KO = ['1월','2월','3월','4월','5월','6월',
                '7월','8월','9월','10월','11월','12월'];

const TEMPLATE_CONFIGS = {

  'classic-cream': {
    'default': {
      groomName: '신랑이름',
      brideName: '신부이름',
      year: 2025, month: 11, day: 14,
      venueName: '그랜드볼룸 웨딩홀',
      ogImage: '',   // 절대 URL 입력 시 카카오 이미지 미리보기 표시
    },
  },

  'white-gold': {
    'default': {
      groomName: '신랑이름',
      brideName: '신부이름',
      year: 2025, month: 11, day: 14,
      venueName: '그랜드볼룸 웨딩홀',
      ogImage: '',
    },
  },

  'vintage': {
    'default': {
      groomName: '신랑이름',
      brideName: '신부이름',
      year: 2025, month: 11, day: 14,
      venueName: '그랜드볼룸 웨딩홀',
      ogImage: '',
    },
  },

};

export default async function handler(request, context) {
  const url     = new URL(request.url);
  const id      = url.searchParams.get('id');
  const parts   = url.pathname.split('/').filter(Boolean);
  const tplName = parts[1]; // 'classic-cream' or 'white-gold'

  // 원본 HTML 응답 가져오기
  const response = await context.next();
  if (response.status !== 200) return response;

  const cfg = TEMPLATE_CONFIGS[tplName]?.[id];
  if (!cfg) return response;

  const d     = new Date(cfg.year, cfg.month, cfg.day);
  const title = `${cfg.groomName} ♡ ${cfg.brideName} 결혼합니다`;
  const desc  = `${cfg.year}년 ${MON_KO[cfg.month]} ${cfg.day}일 ${DOW_KO[d.getDay()]}요일 | ${cfg.venueName}`;

  let html = await response.text();

  // OG 태그 값 교체
  html = html
    .replace(/(<title>)[^<]*(<\/title>)/,                              `$1${title}$2`)
    .replace(/(<meta property="og:title"\s+content=")[^"]*(")/,       `$1${title}$2`)
    .replace(/(<meta property="og:description"\s+content=")[^"]*(")/,`$1${desc}$2`)
    .replace(/(<meta property="og:url"\s+content=")[^"]*(")/,         `$1${url.href}$2`);

  if (cfg.ogImage) {
    html = html.replace(/(<meta property="og:image"\s+content=")[^"]*(")/,`$1${cfg.ogImage}$2`);
  }

  // Content-Length 제거 (HTML 수정으로 길이 달라짐)
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(html, { status: response.status, headers });
}

export const config = {
  path: ['/templates/classic-cream/', '/templates/white-gold/'],
};
