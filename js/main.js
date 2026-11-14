// 焼鶏 メジャー - common scripts
(function () {
  'use strict';

  // Hamburger menu (SP)
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('global-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  // Highlight current page in the global nav
  var path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('#global-nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '/') return;
    if (href === path || (href !== '/' && path.indexOf(href) === 0)) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
