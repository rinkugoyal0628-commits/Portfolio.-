/* App logic. Edit PROJECTS and FORM_ENDPOINT below. */
document.documentElement.classList.add('js');

// ---- Edit your projects here. status: "Demo", "In progress" or "Completed". Leave github/live as "" until real. ----
var PROJECTS = [
  { title: 'Personal Portfolio Website', status: 'In progress', desc: 'This site: a responsive 3D portfolio built with Three.js and GSAP.', tech: ['HTML', 'CSS', 'JavaScript', 'Three.js'], github: '', live: '' },
  { title: 'IoT Monitoring Dashboard', status: 'Demo', desc: 'Planned dashboard showing sample sensor readings such as temperature and humidity.', tech: ['IoT', 'Python', 'Sample data'], github: '', live: '' },
  { title: 'Python Data Analysis Project', status: 'Demo', desc: 'Placeholder for a dataset cleaning and visualization project.', tech: ['Python', 'Excel'], github: '', live: '' },
  { title: 'SQL Data Exploration Project', status: 'Demo', desc: 'Placeholder for querying and summarizing a sample database.', tech: ['SQL'], github: '', live: '' },
  { title: 'Power BI Analytics Dashboard', status: 'Demo', desc: 'Placeholder for an interactive business dashboard.', tech: ['Power BI', 'Excel'], github: '', live: '' }
];
// ---- To receive messages, paste a Formspree-style URL here (see README). Empty = not connected. ----
var FORM_ENDPOINT = '';

function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }

function renderProjects() {
  var grid = document.getElementById('project-grid');
  PROJECTS.forEach(function (p) {
    var c = el('article', 'card tilt'); c.setAttribute('data-reveal', '');
    c.appendChild(el('span', 'badge', p.status));
    c.appendChild(el('h3', '', p.title));
    c.appendChild(el('p', '', p.desc));
    var tags = el('div', 'tags'); p.tech.forEach(function (t) { tags.appendChild(el('span', '', t)); }); c.appendChild(tags);
    var links = el('div', 'plinks');
    [['Code', p.github], ['Live demo', p.live]].forEach(function (l) {
      if (l[1]) { var a = el('a', '', l[0]); a.href = l[1]; a.target = '_blank'; a.rel = 'noopener'; links.appendChild(a); }
      else links.appendChild(el('span', 'off', l[0] + ': not yet available'));
    });
    c.appendChild(links); grid.appendChild(c);
  });
}

function setupNav() {
  var btn = document.getElementById('menu-btn'), nav = document.getElementById('links');
  function set(open) { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
}

function setupForm() {
  var form = document.getElementById('form'), status = document.getElementById('form-status');
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Write a message of at least 10 characters.'; }
  };
  var ids = { name: 'e-name', email: 'e-email', message: 'e-msg' };
  function check(f) { var i = form.elements[f], m = rules[f](i.value); document.getElementById(ids[f]).textContent = m; i.setAttribute('aria-invalid', !!m); return !m; }
  Object.keys(rules).forEach(function (f) { form.elements[f].addEventListener('blur', function () { check(f); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); status.textContent = '';
    var ok = Object.keys(rules).map(check).every(Boolean); if (!ok) return;
    if (!FORM_ENDPOINT) { status.textContent = 'The form is not connected to a service yet, so nothing was sent. Please email me directly.'; return; }
    status.textContent = 'Sending…';
    fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      .then(function (r) { if (!r.ok) throw 0; form.reset(); status.textContent = 'Message sent. Thank you.'; })
      .catch(function () { status.textContent = 'Sending failed. Please try again or email me directly.'; });
  });
}

function webglOK() { try { var c = document.createElement('canvas'); return !!(window.THREE && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }

document.addEventListener('DOMContentLoaded', function () {
  var msgs = ['Booting sensors…', 'Compiling pixels…', 'Calibrating the spotlight…'], i = 0;
  var msgEl = document.getElementById('loader-msg');
  var timer = setInterval(function () { msgEl.textContent = msgs[++i % msgs.length]; }, 500);
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProjects(); setupNav(); setupForm();

  var destroy = null;
  if (webglOK()) {
    try { destroy = PortfolioScene.init(document.getElementById('scene')); }
    catch (e) { console.error('3D scene failed:', e); document.getElementById('fallback').hidden = false; }
  } else document.getElementById('fallback').hidden = false;
  addEventListener('pagehide', function () { if (destroy) destroy(); });

  var finished = false;
  function finish() {
    if (finished) return; finished = true;
    clearInterval(timer);
    document.getElementById('loader').classList.add('done');
    PortfolioAnim.reveal(); PortfolioAnim.tilt();
  }
  var go = function () { setTimeout(finish, 900); };
  document.readyState === 'complete' ? go() : addEventListener('load', go);
  setTimeout(finish, 4000);
});
