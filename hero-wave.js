(() => {
  const canvas = document.querySelector('.hero-wave');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastDraw = 0;
  const start = performance.now();

  function draw(seconds = 0) {
    ctx.clearRect(0, 0, width, height);
    const mobile = width < 700;
    const left = width * (mobile ? .08 : .14);
    const right = width * (mobile ? .92 : .86);
    const baseline = height * (mobile ? .72 : .7);
    const count = mobile ? 48 : 78;
    const strands = 9;

    for (let strand = 0; strand < strands; strand++) {
      const depth = strand - (strands - 1) / 2;
      for (let point = 0; point < count; point++) {
        const u = point / (count - 1);
        const envelope = Math.sin(Math.PI * u) ** 1.3;
        const phase = u * Math.PI * 2.2 + seconds * .38;
        const x = left + (right - left) * u + depth * 1.5;
        const y = baseline + envelope * (Math.sin(phase) * (mobile ? 27 : 43) + depth * (mobile ? 8 : 12));
        const fade = Math.sin(Math.PI * u) ** .8;
        const radius = (strand === 4 ? 2.5 : 1.75) * (mobile ? .85 : 1) * (.8 + .2 * Math.cos(phase));
        const alpha = fade * (strand === 4 ? .65 : .36);
        const hue = 220 + u * 42;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 44%, 58%, ${alpha})`;
        ctx.fill();
      }
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(reducedMotion.matches ? 0 : (performance.now() - start) / 1000);
  }

  function animate(now) {
    if (document.hidden || reducedMotion.matches) { frame = 0; return; }
    if (now - lastDraw > 40) {
      draw((now - start) / 1000);
      lastDraw = now;
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reducedMotion.matches) draw(0);
    else if (!document.hidden) frame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  resize();
  syncMotion();
})();
