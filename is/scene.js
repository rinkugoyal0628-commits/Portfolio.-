/* Three.js hero scene. Exposes window.PortfolioScene.init(host) -> destroy() */
(function () {
  function init(host) {
    var mobile = matchMedia('(max-width: 860px)').matches || (navigator.hardwareConcurrency || 4) <= 4;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
    host.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0.3, 7);

    // Lights: dim ambient plus a spotlight from above
    scene.add(new THREE.AmbientLight(0x404838, 0.7));
    var spot = new THREE.SpotLight(0xe6edcc, 2.6, 25, 0.55, 0.7);
    spot.position.set(0, 8, 3); scene.add(spot); scene.add(spot.target);

    // Sensor-node object: core, wire shell, rings, orbiting nodes
    var node = new THREE.Group(); scene.add(node);
    var core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshStandardMaterial({ color: 0x1a1f12, metalness: 0.8, roughness: 0.3, flatShading: true }));
    var shell = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.45, 1)),
      new THREE.LineBasicMaterial({ color: 0x8f9e5c, transparent: true, opacity: 0.55 }));
    node.add(core, shell);
    var rings = [];
    [1.9, 2.4].forEach(function (r, i) {
      var m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0xb5c283, transparent: true, opacity: 0.7 }));
      m.rotation.x = Math.PI / 2 + i * 0.5; node.add(m); rings.push(m);
    });
    var dots = [];
    for (var i = 0; i < 3; i++) {
      var d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshBasicMaterial({ color: 0xdfe6c8 }));
      node.add(d); dots.push(d);
    }
    var floor = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.66, 64), new THREE.MeshBasicMaterial({ color: 0x8f9e5c, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.4; scene.add(floor);

    // Dust and stars
    var count = mobile ? 250 : 800, pos = new Float32Array(count * 3);
    for (var p = 0; p < pos.length; p++) pos[p] = (Math.random() - 0.5) * (p % 3 === 2 ? 10 : 16);
    var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var pm = new THREE.PointsMaterial({ color: 0xcfd6b8, size: 0.03, transparent: true, opacity: 0.6, depthWrite: false });
    var dust = new THREE.Points(pg, pm); scene.add(dust);

    var mx = 0, my = 0, raf = 0, visible = true, clock = new THREE.Clock();
    function onMove(e) { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; }
    function resize() {
      var w = host.clientWidth || 1, h = host.clientHeight || 1;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 9 : 7; camera.updateProjectionMatrix();
      if (reduce) renderer.render(scene, camera);
    }
    function onVis() { if (document.hidden) stop(); else if (visible) start(); }
    function frame() {
      raf = requestAnimationFrame(frame);
      var t = clock.getElapsedTime();
      node.rotation.y = t * 0.25 + mx * 0.3; node.rotation.x = my * 0.15;
      node.position.y = Math.sin(t) * 0.12;
      shell.rotation.y = -t * 0.15;
      rings.forEach(function (r, i) { r.rotation.z = t * (0.2 + i * 0.1); });
      dots.forEach(function (d, i) { var a = t * 0.8 + i * 2.1; d.position.set(Math.cos(a) * 1.9, Math.sin(a * 0.7) * 0.6, Math.sin(a) * 1.9); });
      dust.rotation.y = t * 0.01; dust.position.y = Math.sin(t * 0.3) * 0.1;
      camera.position.x += (mx * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (0.3 - my * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    function start() { if (!raf && !reduce) frame(); }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    var io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); });
    io.observe(host);
    var ro = new ResizeObserver(resize); ro.observe(host);
    if (matchMedia('(pointer: fine)').matches) addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    resize(); start();

    return function destroy() {
      stop(); io.disconnect(); ro.disconnect();
      removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis);
      scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }
  window.PortfolioScene = { init: init };
})();
