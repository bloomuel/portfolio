// Header tab switching (Work/Resume/About/Contact)
const headerLinks = document.querySelectorAll('#main-nav a[data-page]');
const pages = document.querySelectorAll('.page');

headerLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pg = link.dataset.page;
    headerLinks.forEach(l=>l.classList.remove('active'));
    link.classList.add('active');
    pages.forEach(p => p.classList.remove('active-page'));
    if (pg === 'work') document.getElementById('home').classList.add('active-page');
    else {
      const pageEl = document.getElementById(pg);
      if (pageEl) pageEl.classList.add('active-page');
    }
  });
});

// Project list -> open project page
document.querySelectorAll('.project-row').forEach(row => {
  row.addEventListener('click', () => {
    const id = row.dataset.project;
    pages.forEach(p => p.classList.remove('active-page'));
    const projectSection = document.getElementById(`project-${id}`);
    if (projectSection) projectSection.classList.add('active-page');
    headerLinks.forEach(l => l.classList.remove('active'));
  });
});

// back links
document.querySelectorAll('[data-back]').forEach(b => {
  b.addEventListener('click', () => {
    pages.forEach(p => p.classList.remove('active-page'));
    document.getElementById('home').classList.add('active-page');
    headerLinks.forEach(l => l.classList.toggle('active', l.dataset.page === 'work'));
  });
});

// -----------------------------
// Flip-dot grid (static positions with oscillating gradient colors)
(function(){
  const canvas = document.getElementById('dotsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  // grid config (tweak COLS/ROWS to taste)
  const COLS = 36;
  const ROWS = 24;
  const DOT_RADIUS = 6;
  const SPACING = 18;
  const COLOR_SPEED = 0.0009;

  let W = 800, H = 520, dpr = window.devicePixelRatio || 1;
  let positions = [];

  function resize(){
    const rect = canvas.getBoundingClientRect();
    const width = Math.min(rect.width || 560, 760);
    const height = Math.round((ROWS / COLS) * width + 0.12 * width);
    W = width; H = height;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computePositions();
  }

  function computePositions(){
    positions = [];
    const gridWidth = (COLS - 1) * SPACING;
    const gridHeight = (ROWS - 1) * SPACING;
    const startX = (W - gridWidth) / 2;
    const startY = (H - gridHeight) / 2;
    for (let r=0; r<ROWS; r++){
      for (let c=0; c<COLS; c++){
        positions.push({
          x: startX + c*SPACING,
          y: startY + r*SPACING,
          r, c
        });
      }
    }
  }

  let start = performance.now();

  function draw(now){
    const t = now - start;
    ctx.clearRect(0,0,W,H);

    // optional subtle panel background inside canvas
    // draw each dot with hue based on column/row + time (flowing gradient)
    positions.forEach(p => {
      const hue = ( (p.c / COLS) * 320 + (p.r / ROWS) * 40 + (t * COLOR_SPEED * 360) ) % 360;
      const light = 45 + 8 * Math.sin((p.r + p.c) * 0.3 + t * 0.002);
      const sat = 60 + 12 * Math.cos((p.c - p.r) * 0.2 + t * 0.001);

      // radial gradient per dot for subtle flip-dot look
      const rad = DOT_RADIUS;
      const grad = ctx.createRadialGradient(p.x - rad*0.28, p.y - rad*0.28, rad*0.15, p.x, p.y, rad);
      grad.addColorStop(0, `hsl(${hue} ${sat}% ${Math.min(100, light+8)}%)`);
      grad.addColorStop(1, `hsl(${hue} ${sat}% ${Math.max(8, light-12)}%)`);
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, rad, 0, Math.PI*2);
      ctx.fill();

      // subtle edge
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  // initialize
  resize();
  window.addEventListener('resize', () => { clearTimeout(window.__dotsResize); window.__dotsResize = setTimeout(resize, 120); });
  requestAnimationFrame(draw);
})();
