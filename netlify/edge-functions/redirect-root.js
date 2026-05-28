// =====================================================
// 루트 경로를 환경변수 기반 템플릿으로 리다이렉트
// Netlify 환경변수 설정:
// - DEFAULT_TEMPLATE: 기본 템플릿명 (classic-cream, white-gold, vintage 중 선택)
// - DEFAULT_ID: 기본 커플 ID (기본값: default)
// =====================================================

export default async function handler(request, context) {
  const url = new URL(request.url);
  
  // 루트 경로만 처리 (/, /index.html)
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  const defaultTemplate = Netlify.env.get('DEFAULT_TEMPLATE') || 'classic-cream';
  const defaultId = Netlify.env.get('DEFAULT_ID') || 'default';

  // 리다이렉트 URL 구성
  const redirectUrl = `${url.origin}/templates/${defaultTemplate}/?id=${defaultId}`;

  return new Response(null, {
    status: 301,
    headers: {
      'Location': redirectUrl,
    },
  });
}

export const config = {
  path: '/*',
};
