// ひとやすみ LP — フェードイン / 追従CTA / 計測
// ※ .jsゲートのclass付与はFOUC防止のため index.html の<head>内インラインscriptで行う

// ----------------------------------------------------------
// ハンバーガーナビ(全ページ共通)
// ----------------------------------------------------------
(() => {
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('site-nav');
  if (!menuBtn || !nav) return;

  const close = () => {
    nav.classList.remove('is-open');
    menuBtn.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  const toggle = () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-active', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  };

  menuBtn.addEventListener('click', toggle);
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
      menuBtn.focus();
    }
  });
})();

// ----------------------------------------------------------
// ヘッダー背景: ヒーローのあるページのみ、ヒーロー通過後に下地+ぼかしを付与
// (ヒーローのないページは body.page--sub のCSSで常時付与済み)
// ----------------------------------------------------------
(() => {
  const header = document.querySelector('.site-header');
  const hero = document.getElementById('hero');
  if (!header || !hero) return;
  new IntersectionObserver((entries) => {
    const passed = !entries[entries.length - 1].isIntersecting;
    header.classList.toggle('site-header--solid', passed);
  }).observe(hero);
})();

// ----------------------------------------------------------
// ヒーロー2枚目(恵比寿店): LCPと帯域を奪い合わないよう、
// ページロード完了後にsrcを注入し、画像ロード完了後にクロスフェード開始
// ----------------------------------------------------------
window.addEventListener('load', () => {
  const alt = document.querySelector('.hero__bg--alt');
  if (!alt || !alt.dataset.src) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const start = () => document.getElementById('hero').classList.add('hero--xfade');
  alt.addEventListener('load', start, { once: true });
  alt.srcset = alt.dataset.srcset;
  alt.src = alt.dataset.src;
});

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
// メソッド記事: 目次を通過したら「目次へ戻る」ボタンを表示
// ----------------------------------------------------------
(() => {
  const toc = document.getElementById('toc');
  const fab = document.querySelector('.toc-fab');
  if (!toc || !fab) return;
  new IntersectionObserver((entries) => {
    const show = !entries[entries.length - 1].isIntersecting;
    fab.classList.toggle('is-shown', show);
  }, { rootMargin: '-72px 0px 0px 0px' }).observe(toc);
})();

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
}, { threshold: 0, rootMargin: '0px 0px -12% 0px' }); // 背の高いセクションでも発火が遅れない

document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));

// ----------------------------------------------------------
// 追従CTA: ヒーロー通過後に表示、クロージングCTA可視中は非表示
// ----------------------------------------------------------
const stickyCta = document.getElementById('sticky-cta');
const hero = document.getElementById('hero');
const closing = document.getElementById('closing');

if (stickyCta && hero && closing) {
  // LPページ: ヒーロー通過後に表示、クロージングCTA可視中は非表示
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

  // コールバックは複数エントリをバッチで受け取ることがあるため、常に最新のエントリで判定する
  new IntersectionObserver((entries) => {
    heroPassed = !entries[entries.length - 1].isIntersecting;
    updateStickyCta();
  }).observe(hero);

  new IntersectionObserver((entries) => {
    closingVisible = entries[entries.length - 1].isIntersecting;
    updateStickyCta();
  }, { threshold: 0.2 }).observe(closing);
} else if (stickyCta) {
  // ヒーロー/クロージングのないページ(メソッド記事等): 一定量スクロールしたら表示
  const showAfter = 500;
  const update = () => {
    const show = window.scrollY > showAfter;
    stickyCta.classList.toggle('is-shown', show);
    stickyCta.setAttribute('aria-hidden', String(!show));
    stickyCta.querySelector('a').tabIndex = show ? 0 : -1;
    document.body.classList.toggle('has-sticky-cta', show);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}
