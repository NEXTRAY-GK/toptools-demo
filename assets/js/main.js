/* トップ工業 リニューアルデモ — UI */
(function () {
  'use strict';

  /* ---- header state ---- */
  var hd = document.querySelector('.hd');
  var ptop = document.querySelector('.ptop');
  var isTop = document.body.classList.contains('is-top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (hd) hd.classList.toggle('is-solid', y > (isTop ? 80 : 20));
    if (ptop) ptop.classList.toggle('is-on', y > 600);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- drawer ---- */
  var burger = document.querySelector('.hd__burger');
  if (burger) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', document.body.classList.contains('nav-open'));
    });
    document.querySelectorAll('.drawer a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ---- reveal ---- */
  var rv = document.querySelectorAll('[data-rv]');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var d = e.target.getAttribute('data-rv-d');
        if (d) e.target.style.transitionDelay = d + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- count up ---- */
  var nums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && nums.length) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, to = parseFloat(el.getAttribute('data-count')), t0 = null, dur = 1500;
        var fmt = el.getAttribute('data-fmt') === 'comma';
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          var v = Math.floor(to * (1 - Math.pow(1 - p, 3)));
          el.textContent = fmt ? v.toLocaleString('ja-JP') : String(v);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io2.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---- accordion (FAQ) ---- */
  document.querySelectorAll('.acc__q').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = b.closest('.acc__i');
      i.classList.toggle('is-open');
      b.setAttribute('aria-expanded', i.classList.contains('is-open'));
    });
  });

  /* ---- tabs (FAQ category) ---- */
  var tabBtns = document.querySelectorAll('[data-tab]');
  if (tabBtns.length) {
    tabBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-tab');
        tabBtns.forEach(function (x) { x.classList.toggle('is-on', x === b); });
        document.querySelectorAll('[data-tab-panel]').forEach(function (p) {
          p.hidden = p.getAttribute('data-tab-panel') !== key;
        });
        var f = document.getElementById('faq-filter');
        if (f) { f.value = ''; runFaqFilter(''); }
      });
    });
  }

  /* ---- faq keyword filter ---- */
  function runFaqFilter(q) {
    q = (q || '').trim().toLowerCase();
    var panels = document.querySelectorAll('[data-tab-panel]');
    if (!panels.length) return;
    if (!q) {
      panels.forEach(function (p) {
        p.querySelectorAll('.acc__i').forEach(function (i) { i.hidden = false; });
      });
      document.querySelectorAll('[data-tab]').forEach(function (b, idx) {
        b.classList.toggle('is-on', idx === 0);
      });
      panels.forEach(function (p, idx) { p.hidden = idx !== 0; });
      var e = document.getElementById('faq-empty'); if (e) e.hidden = true;
      return;
    }
    var hit = 0;
    panels.forEach(function (p) {
      p.hidden = false;
      p.querySelectorAll('.acc__i').forEach(function (i) {
        var m = i.textContent.toLowerCase().indexOf(q) !== -1;
        i.hidden = !m;
        if (m) hit++;
      });
    });
    var empty = document.getElementById('faq-empty');
    if (empty) empty.hidden = hit > 0;
  }
  var ff = document.getElementById('faq-filter');
  if (ff) {
    ff.addEventListener('input', function () { runFaqFilter(ff.value); });
    var ffForm = ff.closest('form');
    if (ffForm) ffForm.addEventListener('submit', function (e) { e.preventDefault(); runFaqFilter(ff.value); });
  }

  /* ---- product filter (category page / index) ---- */
  var pf = document.getElementById('prod-filter');
  if (pf) {
    var run = function () {
      var q = pf.value.trim().toLowerCase();
      var n = 0;
      document.querySelectorAll('[data-prod]').forEach(function (el) {
        var m = !q || el.getAttribute('data-prod').toLowerCase().indexOf(q) !== -1;
        el.hidden = !m;
        if (m) n++;
      });
      var c = document.getElementById('prod-count');
      if (c) c.textContent = n;
      var e = document.getElementById('prod-empty');
      if (e) e.hidden = n > 0;
    };
    pf.addEventListener('input', run);
    var pform = pf.closest('form');
    if (pform) pform.addEventListener('submit', function (e) { e.preventDefault(); run(); });
  }

  /* ---- dealer region filter ---- */
  var dl = document.getElementById('dealer-filter');
  if (dl) {
    dl.addEventListener('input', function () {
      var q = dl.value.trim().toLowerCase();
      var total = 0;
      document.querySelectorAll('.region').forEach(function (r) {
        var shown = 0;
        r.querySelectorAll('.pref').forEach(function (p) {
          var s = 0;
          p.querySelectorAll('.shop').forEach(function (sh) {
            var m = !q || sh.textContent.toLowerCase().indexOf(q) !== -1;
            sh.style.display = m ? '' : 'none';
            if (m) s++;
          });
          p.hidden = s === 0;
          shown += s;
        });
        r.hidden = shown === 0;
        total += shown;
      });
      var c = document.getElementById('dealer-count');
      if (c) c.textContent = total;
    });
  }

  /* ---- smooth anchor ---- */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    });
  });

  /* ---- page top ---- */
  if (ptop) ptop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---- demo form guard ---- */
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = f.querySelector('[data-demo-note]');
      if (n) { n.hidden = false; n.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  });
})();
