// ひとやすみ LP — フェードイン / 追従CTA / 計測
// JSが有効な時だけフェードインの初期非表示を適用する(.jsゲート)
document.documentElement.classList.add('js');

// ----------------------------------------------------------
// GA4 — 測定IDを設定すると有効になる。未設定なら何も読み込まない
// TODO: GA4プロパティ作成後にIDを設定(例: 'G-XXXXXXXXXX')
// ----------------------------------------------------------
const GA_MEASUREMENT_ID = '';

if (GA_MEASUREMENT_ID) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

function track(name, params) {
  if (window.gtag) window.gtag('event', name, params);
}

// ----------------------------------------------------------
// CTAクリック計測(cta_position: hero / mid_feature / mid_pricing / closing / sticky)
// ----------------------------------------------------------
document.querySelectorAll('[data-cta]').forEach((el) => {
  el.addEventListener('click', () => {
    track('line_cta_click', { cta_position: el.dataset.cta });
  });
});

// ----------------------------------------------------------
// スクロール深度(25/50/75/90% 各1回)
// ----------------------------------------------------------
const depths = [25, 50, 75, 90];
const fired = new Set();
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return;
  const pct = (window.scrollY / max) * 100;
  depths.forEach((d) => {
    if (pct >= d && !fired.has(d)) {
      fired.add(d);
      track('scroll_depth', { percent: d });
    }
  });
}, { passive: true });

// ----------------------------------------------------------
// フェードイン(IntersectionObserver)
// ----------------------------------------------------------
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));

// ----------------------------------------------------------
// 追従CTA: ヒーロー通過後に表示、クロージングCTA可視中は非表示
// ----------------------------------------------------------
const stickyCta = document.getElementById('sticky-cta');
const hero = document.getElementById('hero');
const closing = document.getElementById('closing');

let heroPassed = false;
let closingVisible = false;

function updateStickyCta() {
  const show = heroPassed && !closingVisible;
  stickyCta.classList.toggle('is-shown', show);
  stickyCta.setAttribute('aria-hidden', String(!show));
  // 非表示中はフォーカス対象から除外
  stickyCta.querySelector('a').tabIndex = show ? 0 : -1;
  document.body.classList.toggle('has-sticky-cta', show);
}

new IntersectionObserver(([entry]) => {
  heroPassed = !entry.isIntersecting;
  updateStickyCta();
}).observe(hero);

new IntersectionObserver(([entry]) => {
  closingVisible = entry.isIntersecting;
  updateStickyCta();
}, { threshold: 0.2 }).observe(closing);
