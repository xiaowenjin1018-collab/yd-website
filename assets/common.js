/* YOU DESIGN — shared interactions for all 4 schemes */

document.addEventListener('DOMContentLoaded', function () {
  // WhatsApp deep link with pre-filled enquiry text — lowers the friction to start a B2B chat
  var waNumber = '8613434835596';
  var waText = encodeURIComponent("Hello! I'm interested in your custom furniture. Could you please send your catalogue and a quotation?");
  var waUrl = 'https://wa.me/' + waNumber + '?text=' + waText;
  var waIcon = '<svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.03a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.85 5.8 2.4a8.16 8.16 0 0 1 2.4 5.81c0 4.52-3.68 8.21-8.2 8.21zm4.5-6.14c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-1.34-1.51-1.5-1.71-1.71-.16-.2-.18-.34-.05-.46.1-.1.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.06s.89 2.39 1.02 2.56c.12.16 1.75 2.67 4.24 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.17.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>';

  // Mobile nav toggle — supports multiple headers on one page (preview shells)
  document.querySelectorAll('.nav-toggle').forEach(function(toggle){
    var header = toggle.closest('header');
    var nav = header ? (header.querySelector('.nav-links') || header.querySelector('.editorial-nav'))
                     : (document.querySelector('.nav-links') || document.querySelector('.editorial-nav'));
    if (!nav) return;
    function setNav(open){
      nav.classList.toggle('open',open);
      toggle.classList.toggle('active',open);
      document.body.classList.toggle('nav-open',open);
      toggle.setAttribute('aria-expanded',open?'true':'false');
    }
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape' && nav.classList.contains('open')) setNav(false);
    });
    document.addEventListener('click', function(e){
      if(nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
  });

  // RFQ modal — auto-inject if a page doesn't include it (multi-page sites)
  if (!document.getElementById('rfqModal')) {
    var m = document.createElement('div');
    m.className = 'rfq-modal';
    m.id = 'rfqModal';
    m.innerHTML = '<div class="rfq-overlay"></div><div class="rfq-card">' +
      '<button class="rfq-close" aria-label="Close">×</button>' +
      '<h3>Request a Quote</h3><p class="rfq-pre" id="rfqProductPre"></p>' +
      '<p class="rfq-sub">Send your specification — it will open in WhatsApp ready to send. Our team replies within one business day.</p>' +
      '<form class="rfq-form" id="rfqForm">' +
      '<label>Name</label><input required placeholder="Your full name">' +
      '<label>Company</label><input placeholder="Company / studio name">' +
      '<label>Email</label><input required type="email" placeholder="you@company.com">' +
      '<label>WhatsApp</label><input placeholder="+00 000 000 0000">' +
      '<label>Product of interest</label><input id="rfqProduct" placeholder="e.g. LD-S01 Lapiaz">' +
      '<label>Project type</label><select><option>Villa / Residential</option><option>Hospitality / Hotel</option><option>Interior Design Project</option><option>Other</option></select>' +
      '<label>Quantity &amp; timeline</label><textarea placeholder="Quantity, sizes, materials, delivery timeline..."></textarea>' +
      '<button type="submit">Send enquiry</button></form>' +
      '<div class="rfq-done" id="rfqDone"><div class="tick">✓</div><h4>One last step</h4><p>Your message is ready in WhatsApp. Press <b>Send</b> there to deliver it to our team.</p><a class="rfq-wa-fallback" id="rfqWaFallback" href="#" target="_blank" rel="noopener" style="display:inline-block;margin-top:14px;padding:12px 22px;background:#25D366;color:#fff;text-decoration:none;border-radius:2px;font:600 13px/1 Arial,Helvetica,sans-serif;letter-spacing:1px">Open WhatsApp →</a></div>' +
      '</div>';
    document.body.appendChild(m);
  }
  if (!document.querySelector('.wa-float')) {
    var wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = waUrl;
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat with us on WhatsApp');
    wa.innerHTML = waIcon + '<span class="wa-label">WhatsApp</span>';
    document.body.appendChild(wa);
  }

  // RFQ modal (existing markup, if present)
  var modal = document.getElementById('rfqModal');
  var closeBtn = document.querySelector('.rfq-close');
  var overlay = document.querySelector('.rfq-overlay');

  function openModal(product) {
    if (!modal) return;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (product) {
      var field = document.getElementById('rfqProduct');
      var pre = document.getElementById('rfqProductPre');
      if (field && pre) { field.value = product; pre.textContent = 'Re: ' + product; }
    }
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Event delegation: any [data-rfq] opens the modal (including injected mobile bar)
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-rfq]') : null;
    if (!el) return;
    e.preventDefault();
    openModal(el.getAttribute('data-rfq'));
  });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // Real submit — hand the enquiry to WhatsApp with all fields pre-filled.
  // Customer presses "Send enquiry" here, confirms in WhatsApp, and the message
  // is delivered to our WhatsApp number. No backend / no email required.
  var form = document.getElementById('rfqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var labels = form.querySelectorAll('label');
      var fields = form.querySelectorAll('input, select, textarea');
      var lines = ['Hello YOU DESIGN,', '', 'I would like to request a quotation:', ''];
      for (var i = 0; i < fields.length; i++) {
        var val = (fields[i].value || '').trim();
        if (!val) continue;
        var lab = labels[i] ? labels[i].textContent.replace('&', 'and').trim() : 'Info';
        lines.push(lab + ': ' + val);
      }
      lines.push('', 'Please send options, pricing and lead time. Thank you.');
      var text = lines.join('\n');
      var link = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text);
      var done = document.getElementById('rfqDone');
      var fallback = document.getElementById('rfqWaFallback');
      if (fallback) fallback.href = link;
      window.open(link, '_blank', 'noopener');
      if (done) { done.style.display = 'block'; form.style.display = 'none'; }
    });
  }

  // Mobile sticky quote bar — constant conversion hook on small screens
  if (!document.querySelector('.mobile-quote-bar')) {
    var bar = document.createElement('div');
    bar.className = 'mobile-quote-bar';
    bar.innerHTML = '<div class="mqb-txt"><b>YOU DESIGN</b><span>Custom-made to order</span></div>' +
      '<a class="mqb-wa" href="'+waUrl+'" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">'+waIcon+'</a>' +
      '<button class="mqb-cta" data-rfq>Request a Quote</button>';
    document.body.appendChild(bar);
  }

  // Cabinet collection carousel — autoplay, dots, arrows, swipe (no hover-pause: stays live for demo viewers)
  document.querySelectorAll('[data-carousel]').forEach(function (stage) {
    var slides = stage.querySelectorAll('.car-slide');
    var dots = stage.querySelectorAll('.car-dot');
    if (!slides.length) return;
    var idx = 0, timer = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var DELAY = 5000;

    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    function play() {
      if (reduce || timer) return;
      timer = setInterval(function () { show(idx + 1); }, DELAY);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    // Manual interaction resets the autoplay rhythm so it doesn't jump right after a click.
    function manual(n) { show(n); stop(); play(); }

    dots.forEach(function (d, i) { d.addEventListener('click', function () { manual(i); }); });
    var prev = stage.querySelector('.car-prev');
    var next = stage.querySelector('.car-next');
    if (prev) prev.addEventListener('click', function () { manual(idx - 1); });
    if (next) next.addEventListener('click', function () { manual(idx + 1); });

    // NOTE: removed pause-on-hover — demo viewers naturally rest the cursor on the
    // image to look closely, which made the carousel appear frozen. Keep autoplay
    // running regardless of pointer position; manual controls still work at any time.
    // Touch swipe
    var startX = null;
    stage.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) manual(idx + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
    // Pause when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else play();
    });

    show(0);
    play();
  });

  // Lazy-load below-the-fold images (except first hero visual)
  document.querySelectorAll('img').forEach(function (img, i) {
    if (i > 1) img.loading = 'lazy';
  });

  // Reveal on scroll (+ stagger groups)
  var reveals = document.querySelectorAll('.reveal');
  var staggers = document.querySelectorAll('.reveal-stagger');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
    staggers.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
    staggers.forEach(function (el) { el.classList.add('in'); });
  }

  // Lightweight parallax on desktop only (no layout thrash, rAF-throttled)
  var parallaxEls = document.querySelectorAll('.parallax');
  if (parallaxEls.length && window.innerWidth > 900 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var offset = (r.top + r.height / 2 - vh / 2) * -0.08;
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
    }, { passive: true });
    updateParallax();
  }
});
