'use strict';

/* ── helpers ──────────────────────────────────────── */
function esc(t) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(t));
  return d.innerHTML;
}

function el(id) { return document.getElementById(id); }

const DOW_KO = ['일','월','화','수','목','금','토'];
const MON_KO = ['1월','2월','3월','4월','5월','6월',
                '7월','8월','9월','10월','11월','12월'];

/* ── boot ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildHero();
  buildInvitation();
  buildGallery();
  buildDateSection();
  buildAccounts();
  gbRender();
  buildFooter();
  initPetals();
  initScrollAnim();
});

/* ── HERO ─────────────────────────────────────────── */
function buildHero() {
  const d = new Date(CONFIG.year, CONFIG.month, CONFIG.day);
  el('heroNames').innerHTML =
    `<span class="groom">${esc(CONFIG.groomName)}</span>
     <span class="amp">&amp;</span>
     <span class="bride">${esc(CONFIG.brideName)}</span>`;

  el('heroDate').textContent =
    `${CONFIG.year}년 ${MON_KO[CONFIG.month]} ${CONFIG.day}일 ${DOW_KO[d.getDay()]}요일`;
}

/* ── INVITATION ───────────────────────────────────── */
function buildInvitation() {
  el('invText').innerHTML = esc(CONFIG.inviteText).replace(/\n/g, '<br>');

  el('invFamilies').innerHTML = `
    <div class="fam-block">
      <p class="fam-rel">${esc(CONFIG.groomFather)} · ${esc(CONFIG.groomMother)}의 아들</p>
      <p class="fam-person">${esc(CONFIG.groomName)}</p>
    </div>
    <div class="fam-sep"></div>
    <div class="fam-block">
      <p class="fam-rel">${esc(CONFIG.brideFather)} · ${esc(CONFIG.brideMother)}의 딸</p>
      <p class="fam-person">${esc(CONFIG.brideName)}</p>
    </div>`;
}

/* ── GALLERY ──────────────────────────────────────── */
const PHOTO_ICON = `<svg viewBox="0 0 24 24"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
const EYE_ICON  = `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>`;

let lbImages = [];
let lbIdx    = 0;

function buildGallery() {
  const grid = el('galleryGrid');
  grid.innerHTML = '';

  CONFIG.photos.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'g-item';
    item.dataset.index = i;

    if (src) {
      item.innerHTML = `
        <img src="${esc(src)}" alt="웨딩 사진 ${i + 1}" loading="lazy" />
        <div class="g-overlay">${EYE_ICON}</div>`;
      item.addEventListener('click', () => openLb(i));
    } else {
      item.innerHTML = `
        <div class="g-ph">${PHOTO_ICON}<span>사진 추가</span></div>`;
    }

    grid.appendChild(item);
  });

  lbImages = CONFIG.photos.filter(Boolean);
}

function openLb(rawIdx) {
  const realIdx = CONFIG.photos.slice(0, rawIdx + 1).filter(Boolean).length - 1;
  if (realIdx < 0 || lbImages.length === 0) return;
  lbIdx = realIdx;
  updateLb();
  el('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLb() {
  el('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function updateLb() {
  el('lbImg').src = lbImages[lbIdx];
  el('lbCount').textContent = `${lbIdx + 1} / ${lbImages.length}`;
}

function moveLb(d) {
  lbIdx = (lbIdx + d + lbImages.length) % lbImages.length;
  updateLb();
}

el('lbClose').addEventListener('click', closeLb);
el('lbPrev').addEventListener('click', () => moveLb(-1));
el('lbNext').addEventListener('click', () => moveLb(1));
el('lightbox').addEventListener('click', e => { if (e.target === el('lightbox')) closeLb(); });
document.addEventListener('keydown', e => {
  if (!el('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape')     closeLb();
  if (e.key === 'ArrowLeft')  moveLb(-1);
  if (e.key === 'ArrowRight') moveLb(1);
});

/* ── DATE SECTION ─────────────────────────────────── */
function buildDateSection() {
  const d  = new Date(CONFIG.year, CONFIG.month, CONFIG.day);
  const mm = String(CONFIG.month + 1).padStart(2, '0');
  const dd = String(CONFIG.day).padStart(2, '0');

  el('dateBig').innerHTML = `
    <div class="yr">${CONFIG.year}</div>
    <div class="md">${mm}<span>/</span>${dd}</div>
    <div class="dow">${CONFIG.year}년 ${MON_KO[CONFIG.month]} ${CONFIG.day}일 ${DOW_KO[d.getDay()]}요일</div>
    <div class="time">${esc(CONFIG.timeLabel)}</div>`;

  buildMiniCal();

  el('venueWrap').innerHTML += `
    <p class="venue-name">${esc(CONFIG.venueName)}</p>
    <p class="venue-addr">${esc(CONFIG.venueAddr)}<br/>${esc(CONFIG.venueDetail)}</p>
    <div class="map-box" onclick="openMap()">
      📍 &nbsp;지도 클릭으로 이동
    </div>
    <a class="btn-outline" href="${esc(CONFIG.mapUrl)}" target="_blank" rel="noopener">
      🗺 &nbsp;지도 앱으로 보기
    </a>`;
}

function openMap() {
  if (CONFIG.mapUrl && CONFIG.mapUrl !== '#') {
    window.open(CONFIG.mapUrl, '_blank', 'noopener');
  } else {
    alert('config.js 의 mapUrl 에 지도 URL을 입력해주세요.');
  }
}

function buildMiniCal() {
  const cal      = el('miniCal');
  const firstDow = new Date(CONFIG.year, CONFIG.month, 1).getDay();
  const lastDay  = new Date(CONFIG.year, CONFIG.month + 1, 0).getDate();

  cal.innerHTML = '';

  DOW_KO.forEach((d, i) => {
    const h = document.createElement('div');
    h.className = 'mc-h';
    if (i === 0) h.style.color = '#c07070';
    if (i === 6) h.style.color = '#7080c0';
    h.textContent = d;
    cal.appendChild(h);
  });

  for (let b = 0; b < firstDow; b++) {
    const blank = document.createElement('div');
    blank.className = 'mc-d';
    cal.appendChild(blank);
  }

  for (let d = 1; d <= lastDay; d++) {
    const dow  = (firstDow + d - 1) % 7;
    const cell = document.createElement('div');
    cell.className = 'mc-d';
    if (dow === 0) cell.classList.add('sun');
    if (dow === 6) cell.classList.add('sat');
    if (d === CONFIG.day) cell.classList.add('wedding');
    cell.textContent = d;
    cal.appendChild(cell);
  }
}

/* ── ACCOUNTS ─────────────────────────────────────── */
function buildAccounts() {
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
    makeCard(CONFIG.groomName + ' 측', '신랑 측', CONFIG.groomAccounts, true) +
    makeCard(CONFIG.brideName + ' 측', '신부 측', CONFIG.brideAccounts, false);
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

/* ── GUESTBOOK ────────────────────────────────────── */
const GB_KEY = 'wedding_gb_v1';

function gbLoad() {
  try { return JSON.parse(localStorage.getItem(GB_KEY)) || []; }
  catch (e) { return []; }
}

function gbSave(msgs) {
  localStorage.setItem(GB_KEY, JSON.stringify(msgs));
}

function gbRender() {
  const list = el('gbList');
  const msgs = gbLoad();

  if (!msgs.length) {
    list.innerHTML = '<div class="gb-empty">첫 번째 축하 메시지를 남겨주세요 ♡</div>';
    return;
  }

  list.innerHTML = msgs.map(m => `
    <div class="gb-msg">
      <div class="gb-hd">
        <div class="gb-hd-left">
          <span class="gb-name">${esc(m.name)}</span>
          ${m.rel ? `<span class="gb-rel">${esc(m.rel)}</span>` : ''}
        </div>
        <div class="gb-meta">
          <span class="gb-dt">${gbFmtDate(m.ts)}</span>
          <button class="gb-del" onclick="gbDel('${m.id}')" title="삭제">✕</button>
        </div>
      </div>
      <p class="gb-text">${esc(m.text).replace(/\n/g, '<br>')}</p>
    </div>`).join('');
}

function gbFmtDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function gbSubmit() {
  const name = el('gbName').value.trim();
  const rel  = el('gbRel').value.trim();
  const text = el('gbMsg').value.trim();

  if (!name) { alert('이름을 입력해주세요.'); el('gbName').focus(); return; }
  if (!text) { alert('메시지를 입력해주세요.'); el('gbMsg').focus(); return; }

  const msgs = gbLoad();
  msgs.unshift({
    id:   Date.now().toString(36) + Math.random().toString(36).slice(2),
    name, rel, text,
    ts:   Date.now(),
  });
  gbSave(msgs);
  gbRender();

  el('gbName').value = '';
  el('gbRel').value  = '';
  el('gbMsg').value  = '';
  el('gbList').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function gbDel(id) {
  if (!confirm('이 메시지를 삭제하시겠습니까?')) return;
  gbSave(gbLoad().filter(m => m.id !== id));
  gbRender();
}

function gbExport() {
  const msgs = gbLoad();
  if (!msgs.length) { alert('저장된 메시지가 없습니다.'); return; }
  const lines = msgs.map(m =>
    `[${gbFmtDate(m.ts)}] ${m.name}${m.rel ? ` (${m.rel})` : ''}\n${m.text}\n`);
  const blob = new Blob([lines.join('\n---\n\n')], { type: 'text/plain;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = '방명록_메시지.txt';
  a.click();
}

/* ── FOOTER ───────────────────────────────────────── */
function buildFooter() {
  const ft = document.querySelector('footer');
  ft.querySelector('.ft-names').textContent =
    `${CONFIG.groomName}  ♡  ${CONFIG.brideName}`;
  ft.insertAdjacentHTML('beforeend',
    `<span style="display:block;margin-top:.3rem;">${CONFIG.year}.${String(CONFIG.month + 1).padStart(2, '0')}.${String(CONFIG.day).padStart(2, '0')}</span>`);
}

/* ── PETALS ───────────────────────────────────────── */
function initPetals() {
  const wrap = el('petals');
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    Object.assign(p.style, {
      left:             Math.random() * 100 + '%',
      animationDelay:   Math.random() * 9 + 's',
      animationDuration: (6 + Math.random() * 7) + 's',
      '--dx':           (Math.random() - .5) * 220 + 'px',
      '--r':            Math.random() * 360 + 'deg',
    });
    wrap.appendChild(p);
  }
}

/* ── SCROLL ANIMATIONS ────────────────────────────── */
function initScrollAnim() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .1 });
  document.querySelectorAll('.fade-up').forEach(node => obs.observe(node));
}
