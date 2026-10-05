(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    var el = $('#toast');
    if (!el) return;
    el.innerHTML = msg;
    el.classList.add('is-show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('is-show'); }, 3200);
  }
  window.bbToast = toast;

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1900;
    var start = null;

    function fmt(v) {
      return Math.round(v).toLocaleString('en-IN') + suffix;
    }

    if (reduced) { el.textContent = fmt(target); return; }

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initHeader() {
    var header = $('#header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initMobileMenu() {
    var burger = $('#burger');
    var menu = $('#mobileMenu');
    if (!burger || !menu) return;

    function close() {
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('is-locked');
    }

    function open() {
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('is-locked');
    }

    burger.addEventListener('click', function () {
      if (menu.hidden) open(); else close();
    });

    $$('a', menu).forEach(function (a) { a.addEventListener('click', close); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { close(); burger.focus(); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1140 && !menu.hidden) close();
    });
  }

  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    if (!('IntersectionObserver' in window)) {
      nums.forEach(countUp);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    nums.forEach(function (el) { io.observe(el); });
  }

  function initToTop() {
    var btn = $('#toTop');
    if (!btn) return;
    var onScroll = function () {
      btn.classList.toggle('is-show', window.scrollY > 620);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  function initActiveNav() {
    var path = window.location.pathname.replace(/index\.html$/, '');
    var file = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav__list a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var target = href.split('?')[0];
      if (target === file || (target === 'pages/find-businesses.html' && path.indexOf('find-businesses') > -1)) {
        a.classList.add('is-active');
      }
    });
  }

  var catalogue = [
    { t: 'CNC Machine', k: 'product', s: 'Machinery' },
    { t: 'CNC Job Work', k: 'service', s: 'Machinery' },
    { t: 'Solar Panel', k: 'product', s: 'Electronics' },
    { t: 'Solar Panel Installation', k: 'service', s: 'Electronics' },
    { t: 'Packaging Boxes', k: 'product', s: 'Manufacturing' },
    { t: 'Corrugated Packaging', k: 'product', s: 'Manufacturing' },
    { t: 'Textile Manufacturer', k: 'business', s: 'Textile' },
    { t: 'Cotton Fabric Bulk', k: 'product', s: 'Textile' },
    { t: 'Hospital Equipment', k: 'product', s: 'Healthcare' },
    { t: 'Hospital Equipment Dealer', k: 'business', s: 'Healthcare' },
    { t: 'Digital Marketing Agency', k: 'service', s: 'Marketing' },
    { t: 'SEO Services', k: 'service', s: 'Marketing' },
    { t: 'Construction Material', k: 'product', s: 'Construction' },
    { t: 'Building Contractor', k: 'business', s: 'Construction' },
    { t: 'Industrial Machinery', k: 'product', s: 'Machinery' },
    { t: 'Hydraulic Press', k: 'product', s: 'Machinery' },
    { t: 'LED Lighting', k: 'product', s: 'Electronics' },
    { t: 'Switchgear Panel', k: 'product', s: 'Electronics' },
    { t: 'Automotive Spare Parts', k: 'product', s: 'Automotive' },
    { t: 'Tyre Manufacturer', k: 'business', s: 'Automotive' },
    { t: 'Apparel Manufacturer', k: 'business', s: 'Textile' },
    { t: 'Dyeing & Printing', k: 'service', s: 'Textile' },
    { t: 'Food Processing Unit', k: 'business', s: 'Food' },
    { t: 'Spice Manufacturer', k: 'business', s: 'Food' },
    { t: 'Beverage Bottling', k: 'service', s: 'Food' },
    { t: 'Steel Suppliers', k: 'business', s: 'Construction' },
    { t: 'Cement Distributor', k: 'business', s: 'Construction' },
    { t: 'Freight & Logistics', k: 'service', s: 'Logistics' },
    { t: 'Warehouse Rental', k: 'service', s: 'Logistics' },
    { t: 'Cold Chain Supply', k: 'service', s: 'Logistics' },
    { t: 'Interior Designer', k: 'service', s: 'Construction' },
    { t: 'Packaging Printing', k: 'service', s: 'Manufacturing' },
    { t: 'Custom Software', k: 'service', s: 'Technology' },
    { t: 'CA & Tax Consultants', k: 'service', s: 'Professional' }
  ];

  var kindMap = { business: 'Businesses', product: 'Products', service: 'Services' };
  var BASE = /\/pages\//i.test(window.location.pathname) ? '' : 'pages/';
  var kindIcon = {
    business: 'M3 21h18M5 21V8l5-3v16M14 21V11l5 2.5V21',
    product: 'M20.5 8.5 12 4 3.5 8.5 12 13l8.5-4.5zM3.5 12.5 12 17l8.5-4.5',
    service: 'M4 6h16v9H8l-4 3.5V6zM8 10h8'
  };

  function buildSuggest(box, type) {
    var input = $('input[type="search"]', box.closest('form') || box.parentNode);
    if (!input) return;
    var q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.hidden = true; return; }

    var hits = catalogue.filter(function (item) {
      if (type && type !== 'all' && item.k !== type) return false;
      return item.t.toLowerCase().indexOf(q) > -1;
    }).slice(0, 7);

    if (!hits.length) {
      box.innerHTML = '<a href="#" data-fallback="1">Search all listings for &ldquo;' + input.value.trim().replace(/[<>&"]/g, '') + '&rdquo;</a>';
    } else {
      box.innerHTML = hits.map(function (item) {
        var page = item.k === 'business' ? 'find-businesses.html' : item.k === 'product' ? 'find-products.html' : 'find-services.html';
        return '<a href="' + BASE + page + '?q=' + encodeURIComponent(item.t) + '" data-kind="' + item.k + '">' +
          '<svg viewBox="0 0 24 24" style="width:15px;height:15px;flex:none;color:var(--ink-400)"><path d="' + kindIcon[item.k] + '"/></svg>' +
          item.t + '<span>' + kindMap[item.k] + ' &middot; ' + item.s + '</span></a>';
      }).join('');
    }
    box.hidden = false;

    var fallback = $('[data-fallback]', box);
    if (fallback) {
      fallback.addEventListener('click', function (e) {
        e.preventDefault();
        runSearch(input.value, '', box.closest('form'));
      });
    }
  }

  function runSearch(q, loc, form) {
    var type = 'all';
    if (form && form.id === 'heroSearch') {
      var tab = $('.hero__tab.is-active', form);
      if (tab) type = tab.getAttribute('data-type');
    }
    var locEl = form ? $('select[name="location"]', form) : null;
    if (locEl && locEl.value) loc = locEl.value;

    var page = type === 'business' ? 'find-businesses.html'
      : type === 'product' ? 'find-products.html'
        : type === 'service' ? 'find-services.html'
          : 'find-businesses.html';

    if (!q || !q.trim()) {
      toast('Please enter what you are looking for, e.g. <b>CNC Machine</b>');
      return;
    }

    var url = BASE + page + '?q=' + encodeURIComponent(q.trim());
    if (loc && loc !== 'All India') url += '&loc=' + encodeURIComponent(loc);
    window.location.href = url;
  }

  function initSearch() {
    var form = $('#heroSearch');
    if (form) {
      var type = 'all';
      var box = $('#heroSuggest');
      var input = $('input[type="search"]', form);

      $$('.hero__tab', form).forEach(function (tab) {
        tab.addEventListener('click', function () {
          $$('.hero__tab', form).forEach(function (t) {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          type = tab.getAttribute('data-type');
          if (input.value.trim().length > 1) buildSuggest(box, type);
        });
      });

      input.addEventListener('input', debounce(function () { buildSuggest(box, type); }, 140));
      input.addEventListener('focus', function () { if (input.value.trim().length > 1) buildSuggest(box, type); });

      $$('.hero__quick button', form).forEach(function (btn) {
        btn.addEventListener('click', function () {
          input.value = btn.getAttribute('data-q');
          input.focus();
          buildSuggest(box, type);
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        runSearch(input.value, '', form);
      });

      document.addEventListener('click', function (e) {
        if (!form.contains(e.target)) box.hidden = true;
      });
    }

    ['#headerSearch', '#mobileSearch'].forEach(function (sel) {
      var f = $(sel);
      if (!f) return;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        runSearch($('input[type="search"]', f).value, '', f);
      });
    });

    var hInput = $('#headerSearch input[type="search"]');
    var hBox = $('#headerSuggest');
    if (hInput && hBox) {
      hInput.addEventListener('input', debounce(function () { buildSuggest(hBox, null); }, 140));
      hInput.addEventListener('focus', function () { if (hInput.value.trim().length > 1) buildSuggest(hBox, null); });
      document.addEventListener('click', function (e) {
        if (!e.target.closest || !e.target.closest('#headerSearch')) hBox.hidden = true;
      });
    }
  }

  function initCategoryFilter() {
    var bar = $('#catFilter');
    var grid = $('#catGrid');
    var empty = $('#catEmpty');
    if (!bar || !grid) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      $$('.chip', bar).forEach(function (c) { c.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var f = btn.getAttribute('data-filter');
      var shown = 0;
      $$('.cat', grid).forEach(function (card) {
        var match = f === 'all' || card.getAttribute('data-cat') === f;
        card.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'fadeUp .45s var(--ease-out)';
        }
      });
      if (empty) empty.hidden = shown > 0;
    });

    document.addEventListener('click', function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute('data-reset')) {
        var all = $('[data-filter="all"]', bar);
        if (all) all.click();
      }
    });
  }

  function initQuotes() {
    var wrap = $('#quotes');
    var dots = $('#quoteDots');
    if (!wrap || !dots) return;
    var slides = $$('.quote', wrap);
    var btns = $$('button', dots);
    var idx = 0;
    var timer = null;

    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === idx); });
      btns.forEach(function (b, n) {
        b.classList.toggle('is-active', n === idx);
        b.setAttribute('aria-selected', n === idx ? 'true' : 'false');
      });
    }

    function play() {
      if (reduced) return;
      clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }

    btns.forEach(function (b, n) {
      b.addEventListener('click', function () { go(n); play(); });
    });

    wrap.addEventListener('mouseenter', function () { clearInterval(timer); });
    wrap.addEventListener('mouseleave', play);

    go(0);
    play();
  }

  function initGenericForms() {
    $$('form[data-demo]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = f.getAttribute('data-demo') || 'Thanks! We will get back to you shortly.';
        toast(msg);
        f.reset();
      });
    });

    $$('button[data-demo]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        toast(b.getAttribute('data-demo') || 'This is a demo build.');
      });
    });

    $$('.acctabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.acctabs button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        var target = b.getAttribute('data-tab');
        $$('[data-panel]').forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== target;
        });
      });
    });

    var priceToggle = $('#billingToggle');
    if (priceToggle) {
      priceToggle.addEventListener('click', function () {
        var yearly = priceToggle.getAttribute('data-mode') === 'yearly';
        $$('[data-monthly]').forEach(function (el) {
          var v = yearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
          var small = el.querySelector('[data-period]');
          if (small) {
            if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.nodeValue = v;
            else el.insertBefore(document.createTextNode(v), small);
          } else {
            el.textContent = v;
          }
        });
        $$('[data-period]').forEach(function (el) {
          el.textContent = yearly ? '/year' : '/month';
        });
        priceToggle.setAttribute('data-mode', yearly ? 'monthly' : 'yearly');
        priceToggle.querySelector('span').textContent = yearly ? 'Switch to yearly billing' : 'Switch to monthly billing';
      });
    }
  }

  function initCtaButtons() {
    $$('a[href="#"], a:not([href])').forEach(function (a) {
      if (a.closest('#header') || a.closest('.footer')) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        toast('This is a demo build — connect your backend to make it live.');
      });
    });
  }

  function init() {
    initHeader();
    initMobileMenu();
    initReveal();
    initCounters();
    initToTop();
    initActiveNav();
    initSearch();
    initCategoryFilter();
    initQuotes();
    initGenericForms();
    initCtaButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
