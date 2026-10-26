/* WELSTAND® Wellness — script.js */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '919887047862';
  var BRAND = 'WELSTAND\u00AE Wellness';
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.add('js');

  /* ---------- WhatsApp helpers ---------- */
  function buildWhatsAppUrl(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function openWhatsApp(message) {
    var win = window.open(buildWhatsAppUrl(message), '_blank');
    if (win) { win.opener = null; }
    return win;
  }

  // Generates the link for a single service enquiry
  function buildServiceEnquiryUrl(serviceName) {
    var message = 'Hello ' + BRAND + ', I would like to enquire about your ' + serviceName +
      ' service. Please share the details and available appointment slots.';
    return buildWhatsAppUrl(message);
  }

  function enquireAboutService(serviceName) {
    var win = window.open(buildServiceEnquiryUrl(serviceName), '_blank');
    if (win) { win.opener = null; } else { window.location.href = buildServiceEnquiryUrl(serviceName); }
  }

  function initWhatsAppLinks() {
    var generalMessage = 'Hello ' + BRAND + ', I would like to make a general enquiry about your services and appointments.';
    document.querySelectorAll('[data-whatsapp="general"]').forEach(function (link) {
      link.setAttribute('href', buildWhatsAppUrl(generalMessage));
    });
    document.querySelectorAll('button[data-service]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        enquireAboutService(btn.getAttribute('data-service'));
      });
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('primaryNav');
    if (!toggle || !nav) { return; }

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960) { setOpen(false); }
    });
  }

  /* ---------- Smooth scrolling ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (!id || id.length < 2) { return; }
        var target = document.querySelector(id);
        if (!target) { return; }
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        if (history.pushState) { history.pushState(null, '', id); }
        if (!target.hasAttribute('tabindex')) { target.setAttribute('tabindex', '-1'); }
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- Sticky header + active nav ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var links = document.querySelectorAll('.nav-link');
    if (!('IntersectionObserver' in window) || !links.length) { return; }
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
          map[entry.target.id].classList.add('is-active');
          map[entry.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) { observer.observe(section); }
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) { return; }
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Image fallbacks ---------- */
  function initImageFallbacks() {
    document.querySelectorAll('img[data-fallback]').forEach(function (img) {
      var fallback = img.getAttribute('data-fallback');
      function useFallback() {
        if (fallback && img.getAttribute('src') !== fallback) {
          img.setAttribute('src', fallback);
        } else {
          img.style.visibility = 'hidden';
        }
      }
      img.addEventListener('error', useFallback);
      if (img.complete && img.naturalWidth === 0) { useFallback(); }
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initAccordion() {
    var buttons = document.querySelectorAll('.accordion-trigger');
    buttons.forEach(function (btn, index) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) { return; }
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown') { next = buttons[(index + 1) % buttons.length]; }
        if (e.key === 'ArrowUp') { next = buttons[(index - 1 + buttons.length) % buttons.length]; }
        if (e.key === 'Home') { next = buttons[0]; }
        if (e.key === 'End') { next = buttons[buttons.length - 1]; }
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var box = document.getElementById('lightbox');
    var boxImg = document.getElementById('lightboxImg');
    var closeBtn = document.getElementById('lightboxClose');
    var triggers = document.querySelectorAll('[data-lightbox]');
    if (!box || !boxImg || !closeBtn || !triggers.length) { return; }
    var lastFocus = null;

    function close() {
      box.hidden = true;
      boxImg.setAttribute('src', '');
      document.body.style.overflow = '';
      if (lastFocus) { lastFocus.focus(); }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var img = trigger.querySelector('img');
        if (!img) { return; }
        lastFocus = trigger;
        boxImg.setAttribute('src', img.currentSrc || img.getAttribute('src'));
        boxImg.setAttribute('alt', img.getAttribute('alt') || '');
        box.hidden = false;
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      });
    });
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) { close(); } });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) { return; }
      if (e.key === 'Escape') { close(); }
      if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
    });
  }

  /* ---------- Enquiry form ---------- */
  function normaliseIndianMobile(raw) {
    var digits = String(raw).replace(/[\s\-().]/g, '');
    if (digits.indexOf('+91') === 0) { digits = digits.slice(3); }
    else if (digits.indexOf('0091') === 0) { digits = digits.slice(4); }
    else if (digits.length === 12 && digits.indexOf('91') === 0) { digits = digits.slice(2); }
    else if (digits.length === 11 && digits.charAt(0) === '0') { digits = digits.slice(1); }
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
  }

  function todayString() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function formatDate(value) {
    if (!value) { return 'Not specified'; }
    var parts = value.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function formatTime(value) {
    if (!value) { return 'Not specified'; }
    var parts = value.split(':');
    var h = parseInt(parts[0], 10);
    var suffix = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + parts[1] + ' ' + suffix;
  }

  function initForm() {
    var form = document.getElementById('enquiryForm');
    if (!form) { return; }
    var submitBtn = document.getElementById('submitBtn');
    var status = document.getElementById('formStatus');
    var fields = {
      fullName: document.getElementById('fullName'),
      mobile: document.getElementById('mobile'),
      service: document.getElementById('service'),
      prefDate: document.getElementById('prefDate'),
      prefTime: document.getElementById('prefTime'),
      message: document.getElementById('message'),
      consent: document.getElementById('consent')
    };
    var busy = false;

    if (fields.prefDate) { fields.prefDate.setAttribute('min', todayString()); }

    function setError(name, text) {
      var input = fields[name];
      var errorEl = document.getElementById(name + '-error');
      if (!input || !errorEl) { return; }
      var wrapper = input.closest('.field');
      errorEl.textContent = text || '';
      if (wrapper) { wrapper.classList.toggle('has-error', !!text); }
      if (text) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
    }

    function validate() {
      var firstInvalid = null;
      function fail(name, text) {
        setError(name, text);
        if (!firstInvalid) { firstInvalid = fields[name]; }
      }

      var name = fields.fullName.value.trim();
      if (name.length < 2) { fail('fullName', 'Please enter your full name.'); } else { setError('fullName', ''); }

      if (!fields.mobile.value.trim()) {
        fail('mobile', 'Please enter your mobile number.');
      } else if (!normaliseIndianMobile(fields.mobile.value)) {
        fail('mobile', 'Enter a valid 10-digit Indian mobile number (starting with 6, 7, 8 or 9).');
      } else { setError('mobile', ''); }

      if (!fields.service.value) { fail('service', 'Please select a service.'); } else { setError('service', ''); }

      if (fields.prefDate.value && fields.prefDate.value < todayString()) {
        fail('prefDate', 'Please choose today or a future date.');
      } else { setError('prefDate', ''); }

      if (!fields.consent.checked) { fail('consent', 'Please agree to continue.'); } else { setError('consent', ''); }

      if (firstInvalid) { firstInvalid.focus(); return false; }
      return true;
    }

    function buildMessage() {
      var mobile = normaliseIndianMobile(fields.mobile.value);
      var extra = fields.message.value.trim() || 'None';
      return [
        'Hello ' + BRAND + ',',
        '',
        'I would like to enquire about an appointment.',
        '',
        'Name: ' + fields.fullName.value.trim(),
        'Mobile: +91 ' + mobile,
        'Service: ' + fields.service.value,
        'Preferred Date: ' + formatDate(fields.prefDate.value),
        'Preferred Time: ' + formatTime(fields.prefTime.value),
        'Additional Message: ' + extra,
        '',
        'Please share the available appointment slots and service details.',
        '',
        'Thank you.'
      ].join('\n');
    }

    function showStatus(blocked, url) {
      status.hidden = false;
      status.classList.toggle('is-warning', blocked);
      while (status.firstChild) { status.removeChild(status.firstChild); }

      var p1 = document.createElement('p');
      p1.textContent = blocked
        ? 'WhatsApp could not be opened automatically (your browser may have blocked the new window). Your details are still here.'
        : 'WhatsApp should now be open with your message ready. Please press Send in WhatsApp to complete your enquiry.';
      status.appendChild(p1);

      var p2 = document.createElement('p');
      p2.textContent = 'Your enquiry is not sent until you press Send, and an appointment is confirmed only after the centre replies. ';
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = blocked ? 'Tap here to open WhatsApp' : 'WhatsApp did not open? Tap here';
      p2.appendChild(link);
      status.appendChild(p2);
      status.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) { return; }
      if (!validate()) { return; }
      busy = true;
      submitBtn.disabled = true;
      var message = buildMessage();
      var url = buildWhatsAppUrl(message);
      var win = window.open(url, '_blank');
      if (win) { win.opener = null; }
      showStatus(!win, url);
      setTimeout(function () { busy = false; submitBtn.disabled = false; }, 2500);
    });

    ['fullName', 'mobile', 'service', 'prefDate', 'consent'].forEach(function (key) {
      var el = fields[key];
      if (!el) { return; }
      el.addEventListener('input', function () { setError(key, ''); });
      el.addEventListener('change', function () { setError(key, ''); });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  /* ---------- Init ---------- */
  initWhatsAppLinks();
  initNav();
  initSmoothScroll();
  initHeader();
  initReveal();
  initImageFallbacks();
  initAccordion();
  initLightbox();
  initForm();
  initYear();
})();
