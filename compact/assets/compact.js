/* YOU DESIGN — compact independent site interactions */
(function () {
  'use strict';
  var P = window.SP_PRODUCTS || [];

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Carry the current sharecode onto every internal link (host requires it; without => 403).
  var m = location.search.match(/[?&]sharecode=([^&]+)/);
  var sc = m ? decodeURIComponent(m[1]) : '';
  function carrySharecode() {
    if (!sc) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!h || /^(https?:|mailto:|tel:|#)/i.test(h)) return;
      if (/[?&]sharecode=/.test(h)) return;
      // split off hash so the query is appended to the path, not after '#'
      var hash = '', qpos, hpos = h.indexOf('#');
      if (hpos >= 0) { hash = h.slice(hpos); h = h.slice(0, hpos); }
      qpos = h.indexOf('?');
      a.href = h + (qpos >= 0 ? '&' : '?') + 'sharecode=' + encodeURIComponent(sc) + hash;
    });
  }

  // Products grid (products.html)
  var grid = document.getElementById('spProdGrid');
  if (grid) {
    grid.innerHTML = P.map(function (p) {
      return '<article class="pcard"><div class="im"><a class="prod-link" href="product.html?id=' + esc(p.id) + '">' +
        '<img src="../refs/' + esc(p.img) + '" alt="' + esc(p.name) + '"></a></div>' +
        '<div class="body"><div class="row"><span class="tag">' + esc(p.cat) + '</span><span class="code">' + esc(p.code) + '</span></div>' +
        '<h4>' + esc(p.name) + '</h4><p>' + esc(p.desc) + '</p>' +
        '<div class="actions"><a class="btn-spec" href="product.html?id=' + esc(p.id) + '" style="display:flex;align-items:center;justify-content:center;text-decoration:none">View spec</a>' +
        '<button class="btn-inq" data-rfq="' + esc(p.name) + '">Inquire</button></div></div></article>';
    }).join('');
  }

  // Product detail (product.html) — read ?id=
  if (document.getElementById('pdName')) {
    var q = location.search.match(/[?&]id=([^&]+)/);
    var id = q ? decodeURIComponent(q[1]) : '';
    var p = null;
    for (var i = 0; i < P.length; i++) { if (P[i].id === id) { p = P[i]; break; } }
    if (!p) p = P[0];
    document.getElementById('pdCrumb').textContent = p.name;
    document.getElementById('pdName').textContent = p.name;
    document.getElementById('pdDesc').textContent = p.desc;
    var main = document.getElementById('pdMain');
    main.src = '../refs/' + p.img;
    main.alt = p.name;
    document.getElementById('pdCode').textContent = p.code + ' · ' + p.cat;
    document.getElementById('pdTitle').textContent = p.name;
    document.getElementById('pdLead').textContent = p.desc;
    var dims = (p.paras || []).filter(function (x) { return /Dimensions|CM|IN\b/.test(x); });
    document.getElementById('pdMeta').innerHTML =
      '<div>Code<b>' + esc(p.code) + '</b></div><div>Category<b>' + esc(p.cat) + '</b></div>' +
      '<div>Configuration<b>Made to order</b></div><div>MOQ<b>1 piece</b></div>' +
      (dims.length ? '<div style="grid-column:1/-1">Dimensions<b>' + esc(dims[0].replace(/\s+/g, ' ')) + '</b></div>' : '');
    document.getElementById('pdRfq').setAttribute('data-rfq', p.name + ' / ' + p.code);
    var g = (p.gallery || []).filter(function (x) { return x && x !== p.img; });
    document.getElementById('pdGallery').innerHTML = g.length ? g.map(function (x) {
      return '<figure><img src="../refs/' + esc(x) + '" alt="' + esc(p.name) + ' view" loading="lazy">' +
        '<figcaption>' + esc(p.name) + ' · detail view</figcaption></figure>';
    }).join('') : '<figure><img src="../refs/' + esc(p.img) + '" alt="' + esc(p.name) + '"><figcaption>' + esc(p.name) + '</figcaption></figure>';
    document.getElementById('pdParas').innerHTML = (p.paras || []).map(function (x) {
      return '<p>' + esc(x) + '</p>';
    }).join('') || '<p>' + esc(p.desc) + '</p>';
  }

  // In-page hash links scroll smoothly (cross-page nav uses real href + sharecode).
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var el = id ? document.getElementById(id) : null;
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carrySharecode);
  } else {
    carrySharecode();
  }
})();
