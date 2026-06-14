'use strict';

/* ── 상수 ──────────────────────────────────────────── */
const DOW_KO = ['일','월','화','수','목','금','토'];
const MON_KO = ['1월','2월','3월','4월','5월','6월',
                '7월','8월','9월','10월','11월','12월'];

const PHOTO_ICON = `<svg viewBox="0 0 24 24"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;

/* ── 유틸 ──────────────────────────────────────────── */
function esc(t) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(t)));
  return d.innerHTML;
}
function el(id) { return document.getElementById(id); }

/* ── 슬라이드쇼 상태 ────────────────────────────────── */
let slidePhotos = [];
let slideIdx    = 0;
let slideTimer  = null;

/* ── 방명록 상태 ────────────────────────────────────── */
let db            = null;
let gbCol         = null;   // Firestore CollectionReference
let gbMessages    = [];

/* ── 진입점 ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const params    = new URLSearchParams(window.location.search);
  const weddingId = params.get('id');

  if (!weddingId || !CONFIGS[weddingId]) {
    showError(weddingId);
    return;
  }

  initApp(CONFIGS[weddingId], weddingId);
});

/* ── showError ──────────────────────────────────────── */
function showError(id) {
  document.body.innerHTML = `
    <div class="error-screen">
      <div class="error-inner">
        <p class="error-label">청첩장을 찾을 수 없습니다</p>
        <p class="error-id">${
          id
            ? `ID: <code>${esc(id)}</code>`
            : '<code>?id</code> 파라미터가 없습니다'
        }</p>
        <p class="error-hint">URL 끝에 올바른 <strong>?id=커플키</strong>를 입력해주세요.</p>
      </div>
    </div>`;
}

/* ── OG 태그 (KakaoTalk 미리보기) ─────────────────────── */
function setOgTags(CFG) {
  const d     = new Date(CFG.year, CFG.month, CFG.day);
  const title = `${CFG.groomName} ♡ ${CFG.brideName} 결혼합니다`;
  const desc  = `${CFG.year}년 ${MON_KO[CFG.month]} ${CFG.day}일 ${DOW_KO[d.getDay()]}요일 | ${CFG.venueName}`;
  const image = CFG.ogImage || (CFG.photos || []).find(Boolean) || '';

  document.title = title;
  ogMeta('og:title',       title);
  ogMeta('og:description', desc);
  ogMeta('og:url',         location.href);
  if (image) ogMeta('og:image', image);
}
function ogMeta(prop, content) {
  const m = document.querySelector(`meta[property="${prop}"]`);
  if (m) m.setAttribute('content', content);
}

/* ── initApp ────────────────────────────────────────── */
function initApp(CFG, weddingId) {
  setOgTags(CFG);
  buildHero(CFG);
  buildInvitation(CFG);
  buildSlideshow(CFG);
  buildDateSection(CFG);
  buildAccounts(CFG);
  gbInit(CFG, weddingId);
  buildFooter(CFG);
  initPetals();
  initScrollAnim();
}

/* ── HERO ───────────────────────────────────────────── */
function buildHero(CFG) {
  const d = new Date(CFG.year, CFG.month, CFG.day);

  el('heroNames').innerHTML =
    `<span class="groom">${CFG.groomName}</span>
     <span class="name-sep" aria-hidden="true"></span>
     <span class="bride">${CFG.brideName}</span>`;

  el('heroDate').textContent =
    `${CFG.year}년 ${MON_KO[CFG.month]} ${CFG.day}일 ${DOW_KO[d.getDay()]}요일`;

  document.title = `${CFG.groomName} ♡ ${CFG.brideName} 결혼합니다`;
}

/* ── INVITATION ─────────────────────────────────────── */
function buildInvitation(CFG) {
  el('invText').innerHTML = esc(CFG.inviteText).replace(/\n/g, '<br>');

  el('invFamilies').innerHTML = `
    <div class="fam-block">
      <p class="fam-rel">${esc(CFG.groomFather)} · ${esc(CFG.groomMother)}의 아들</p>
      <p class="fam-person">${CFG.groomName}</p>
    </div>
    <div class="fam-sep"></div>
    <div class="fam-block">
      <p class="fam-rel">${esc(CFG.brideFather)} · ${esc(CFG.brideMother)}의 딸</p>
      <p class="fam-person">${CFG.brideName}</p>
    </div>`;
}

/* ── SLIDESHOW ──────────────────────────────────────── */
function buildSlideshow(CFG) {
  slidePhotos = (CFG.photos || []).filter(Boolean);
  slideIdx    = 0;
  stopAutoPlay();

  const track   = el('slideTrack');
  const dots    = el('slideDots');
  const prevBtn = el('slidePrev');
  const nextBtn = el('slideNext');

  track.innerHTML = '';
  dots.innerHTML  = '';
  track.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';

  /* ── 사진 없음: 플레이스홀더 ── */
  if (!slidePhotos.length) {
    const ph = document.createElement('div');
    ph.className = 'slide-item';
    ph.innerHTML = `<div class="slide-ph">${PHOTO_ICON}<span>사진 준비 중</span></div>`;
    track.appendChild(ph);
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    dots.style.display    = 'none';
    return;
  }

  /* ── 슬라이드 생성 ── */
  slidePhotos.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide-item';
    const img = document.createElement('img');
    img.src     = src;
    img.alt     = `웨딩 사진 ${i + 1}`;
    img.loading = 'lazy';
    slide.appendChild(img);
    track.appendChild(slide);
  });

  /* ── 사진 1장: 버튼/도트 숨김 ── */
  if (slidePhotos.length === 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    dots.style.display    = 'none';
    return;
  }

  /* ── 도트 생성 ── */
  slidePhotos.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot';
    dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
    dot.addEventListener('click', () => goSlide(i));
    dots.appendChild(dot);
  });

  updateSlide();
  startAutoPlay();

  /* ── 버튼 이벤트 ── */
  prevBtn.addEventListener('click', () => moveSlide(-1));
  nextBtn.addEventListener('click', () => moveSlide(1));

  /* ── 터치 스와이프 ── */
  let touchStartX = 0;
  const wrap = el('slideshowWrap');
  wrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) moveSlide(dx < 0 ? 1 : -1);
  });

  /* ── hover 시 자동재생 정지 ── */
  const section = el('slideshowSection');
  section.addEventListener('mouseenter', stopAutoPlay);
  section.addEventListener('mouseleave', startAutoPlay);
}

function updateSlide() {
  el('slideTrack').style.transform = `translateX(-${slideIdx * 100}%)`;
  document.querySelectorAll('.slide-dot').forEach((d, i) => {
    d.classList.toggle('active', i === slideIdx);
  });
}

function goSlide(idx) {
  slideIdx = idx;
  updateSlide();
}

function moveSlide(dir) {
  slideIdx = (slideIdx + dir + slidePhotos.length) % slidePhotos.length;
  updateSlide();
}

function startAutoPlay() {
  stopAutoPlay();
  if (slidePhotos.length > 1) {
    slideTimer = setInterval(() => moveSlide(1), 4000);
  }
}

function stopAutoPlay() {
  if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
}

/* ── DATE SECTION ───────────────────────────────────── */
function buildDateSection(CFG) {
  const d  = new Date(CFG.year, CFG.month, CFG.day);
  const mm = String(CFG.month + 1).padStart(2, '0');
  const dd = String(CFG.day).padStart(2, '0');

  el('dateBig').innerHTML = `
    <div class="yr">${CFG.year}</div>
    <div class="md">${mm}<span>/</span>${dd}</div>
    <div class="time">${esc(CFG.timeLabel)}</div>`;

  buildMiniCal(CFG);

  el('venueWrap').innerHTML = `
    <div class="rule"><div class="rule-dot"></div></div>
    <p class="venue-name">${esc(CFG.venueName)}</p>
    <a href="${esc(CFG.mapUrl)}" target="_blank" rel="noopener" style="display: block; text-decoration: none;">
      <div class="map-box">
        <iframe 
          src="${CFG.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d166655.3082737667!2d-123.1335975!3d49.2577062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548673f143a94803%3A0xbb1a9a424097402!2sVancouver%2C%20BC%2C%20Canada!5e0!3m2!1sen!2sca!4v1716940000000!5m2!1sen!2sca'}" 
          width="100%" height="100%" style="border:0; border-radius: 6px; pointer-events: none;" 
          allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </a>
    <a class="btn-outline" href="${esc(CFG.mapUrl)}" target="_blank" rel="noopener">
      🗺 &nbsp;지도 앱으로 보기
    </a>`;
}

function openMap(url) {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener');
  } else {
    alert('config.js 의 mapUrl 에 지도 URL을 입력해주세요.');
  }
}

function buildMiniCal(CFG) {
  const cal      = el('miniCal');
  const firstDow = new Date(CFG.year, CFG.month, 1).getDay();
  const lastDay  = new Date(CFG.year, CFG.month + 1, 0).getDate();

  cal.innerHTML = '';

  DOW_KO.forEach((day, i) => {
    const h = document.createElement('div');
    h.className   = 'mc-h';
    if (i === 0) h.style.color = '#c07070';
    if (i === 6) h.style.color = '#7080c0';
    h.textContent = day;
    cal.appendChild(h);
  });

  for (let b = 0; b < firstDow; b++) {
    const blank = document.createElement('div');
    blank.className = 'mc-d';
    cal.appendChild(blank);
  }

  for (let day = 1; day <= lastDay; day++) {
    const dow  = (firstDow + day - 1) % 7;
    const cell = document.createElement('div');
    cell.className = 'mc-d';
    if (dow === 0) cell.classList.add('sun');
    if (dow === 6) cell.classList.add('sat');
    if (day === CFG.day) cell.classList.add('wedding');
    cell.textContent = day;
    cal.appendChild(cell);
  }
}

/* ── ACCOUNTS ───────────────────────────────────────── */
function buildAccounts(CFG) {
  const accSection = document.querySelector('.accounts');
  const accCards = el('accCards');

  if (!accSection || !accCards) return;

  const gAcc = CFG.groomAccounts || [];
  const bAcc = CFG.brideAccounts || [];

  if (gAcc.length === 0 && bAcc.length === 0) {
    accSection.style.display = 'none';
    return;
  }

  function makeCard(title, side, accounts, isGroom) {
    const rows = accounts.map(a => `
      <div class="acc-row">
        <div class="acc-bank">${esc(a.bank)}</div>
        <div class="acc-num">${esc(a.number)}</div>
        <div class="acc-name">예금주: ${esc(a.holder)}</div>
        <button class="btn-copy" onclick="copyNum('${esc(a.number)}', this)">
          📋 &nbsp;계좌번호 복사
        </button>
      </div>`).join('');

    return `
      <div class="acc-card">
        <div class="acc-head ${isGroom ? '' : 'bride'}">
          <div class="side">${esc(side)}</div>
          <div class="who">${esc(title)}</div>
        </div>
        <div class="acc-body">${rows}</div>
      </div>`;
  }

  el('accCards').innerHTML =
    makeCard(CFG.groomName + ' 측', '신랑 측', CFG.groomAccounts, true) +
    makeCard(CFG.brideName + ' 측', '신부 측', CFG.brideAccounts, false);
}

function copyNum(num, btn) {
  const orig = btn.innerHTML;
  const done = () => {
    btn.innerHTML = '✓ &nbsp;복사 완료!';
    btn.classList.add('ok');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('ok'); }, 2200);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(num).then(done).catch(() => fallbackCopy(num, done));
  } else {
    fallbackCopy(num, done);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); cb(); } catch (e) { alert('복사 실패: ' + text); }
  document.body.removeChild(ta);
}

/* ── GUESTBOOK (Firebase Firestore) ─────────────────── */
function gbInit(CFG, weddingId) {
  if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey) {
    el('gbList').innerHTML =
      '<div class="gb-empty">config.js 에 Firebase 설정을 입력해주세요.</div>';
    return;
  }

  /* 중복 초기화 방지 */
  if (firebase.apps.length === 0) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  db    = firebase.firestore();
  gbCol = db.collection('weddings').doc(weddingId).collection('guestbook');

  gbCol
    .orderBy('ts', 'desc')
    .onSnapshot(
      snap => {
        gbMessages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        gbRender();
      },
      err => console.error('Firestore 오류:', err)
    );
}

function gbRender() {
  const list = el('gbList');
  if (!gbMessages.length) {
    list.innerHTML = '<div class="gb-empty">첫 번째 축하 메시지를 남겨주세요 ♡</div>';
    return;
  }
  list.innerHTML = gbMessages.map(m => `
    <div class="gb-msg">
      <div class="gb-hd">
        <div class="gb-hd-left">
          <span class="gb-name">${esc(m.name)}</span>
        </div>
        <div class="gb-meta">
          <span class="gb-dt">${gbFmtDate(m.ts)}</span>
          <button class="gb-del" onclick="gbDel('${esc(m.id)}')" title="삭제">✕</button>
        </div>
      </div>
      <p class="gb-text">${esc(m.text).replace(/\n/g, '<br>')}</p>
    </div>`).join('');
}

function gbFmtDate(ts) {
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

async function gbSubmit() {
  const name = el('gbName').value.trim();
  const text = el('gbMsg').value.trim();

  if (!name) { alert('이름을 입력해주세요.'); el('gbName').focus(); return; }
  if (!text) { alert('메시지를 입력해주세요.'); el('gbMsg').focus(); return; }
  if (!gbCol) { alert('Firebase 설정이 필요합니다.'); return; }

  const btn = document.querySelector('.btn-submit');
  btn.disabled    = true;
  btn.textContent = '저장 중…';

  try {
    await gbCol.add({
      name, text,
      ts: firebase.firestore.FieldValue.serverTimestamp(),
    });
    el('gbName').value = '';
    el('gbMsg').value  = '';
    el('gbList').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    console.error(e);
  } finally {
    btn.disabled    = false;
    btn.textContent = '축하 메시지 남기기';
  }
}

async function gbDel(id) {
  if (!confirm('이 메시지를 삭제하시겠습니까?')) return;
  if (!gbCol) return;
  try {
    await gbCol.doc(id).delete();
  } catch (e) {
    alert('삭제에 실패했습니다.');
    console.error(e);
  }
}

function gbExport() {
  if (!gbMessages.length) { alert('저장된 메시지가 없습니다.'); return; }
  const lines = gbMessages.map(m =>
    `[${gbFmtDate(m.ts)}] ${m.name}\n${m.text}\n`);
  const blob = new Blob([lines.join('\n---\n\n')], { type: 'text/plain;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = '방명록_메시지.txt';
  a.click();
}

/* ── FOOTER ─────────────────────────────────────────── */
function buildFooter(CFG) {
  el('footer').innerHTML = `
    <span class="ft-names">${CFG.groomName.replace(/<br>/g, ' ')} ♡ ${CFG.brideName.replace(/<br>/g, ' ')}</span>
    결혼합니다
    <span style="display:block;margin-top:.3rem;">
      ${CFG.year}.${String(CFG.month + 1).padStart(2, '0')}.${String(CFG.day).padStart(2, '0')}
    </span>`;
}

/* ── PETALS ─────────────────────────────────────────── */
function initPetals() {
  const wrap = el('petals');
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    Object.assign(p.style, {
      left:              Math.random() * 100 + '%',
      animationDelay:    Math.random() * 9 + 's',
      animationDuration: (6 + Math.random() * 7) + 's',
      '--dx':            (Math.random() - .5) * 220 + 'px',
      '--r':             Math.random() * 360 + 'deg',
    });
    wrap.appendChild(p);
  }
}

/* ── SCROLL ANIMATIONS ──────────────────────────────── */
function initScrollAnim() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .1 });
  document.querySelectorAll('.fade-up').forEach(node => obs.observe(node));
}
ade-up').forEach(node => obs.observe(node));
}
