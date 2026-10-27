/* GSAP animations. Falls back to plain visibility if GSAP failed to load. */
(function () {
  function reveal() {
    var items = document.querySelectorAll('[data-reveal]');
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap || !window.ScrollTrigger || reduce) {
      items.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch(items, {
      start: 'top 88%', once: true,
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }); }
    });
    gsap.from('.hero-copy > *', { opacity: 0, y: 30, duration: 1, stagger: 0.15, delay: 0.2, ease: 'power3.out' });
  }
  // Subtle 3D tilt on cards (mouse only)
  function tilt() {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.tilt'); if (!c) return;
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = 'perspective(700px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg)';
    });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('.tilt'); if (c) c.style.transform = '';
    });
  }
  window.PortfolioAnim = { reveal: reveal, tilt: tilt };
})();
