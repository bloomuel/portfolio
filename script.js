// Header navigation
const headerLinks = document.querySelectorAll('#main-nav a[data-page]');
const pages = document.querySelectorAll('.page');

headerLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pg = link.dataset.page;
    headerLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    pages.forEach(p => p.classList.remove('active-page'));
    if (pg === 'work') document.getElementById('home').classList.add('active-page');
    else {
      const pageEl = document.getElementById(pg);
      if (pageEl) pageEl.classList.add('active-page');
    }
  });
});

// View toggle
const viewBtns = document.querySelectorAll('.view-btn');
const gridView = document.getElementById('projectsGrid');
const listView = document.getElementById('projectsList');

viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (view === 'grid') {
      gridView.classList.remove('hidden');
      listView.classList.remove('active');
    } else {
      gridView.classList.add('hidden');
      listView.classList.add('active');
    }
  });
});

// Project navigation (both grid and list)
document.querySelectorAll('.project-card, .project-row').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.project;
    pages.forEach(p => p.classList.remove('active-page'));
    const projectSection = document.getElementById(`project-${id}`);
    if (projectSection) projectSection.classList.add('active-page');
    headerLinks.forEach(l => l.classList.remove('active'));
  });
});

// Back navigation
document.querySelectorAll('[data-back]').forEach(b => {
  b.addEventListener('click', () => {
    pages.forEach(p => p.classList.remove('active-page'));
    document.getElementById('home').classList.add('active-page');
    headerLinks.forEach(l => l.classList.toggle('active', l.dataset.page === 'work'));
  });
});

// Flip-dot display (Dieter Rams spacing)
(function() {
  const canvas = document.getElementById('dotsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const COLS = 56;
  const ROWS = 14;
  const DOT_RADIUS = 3;
  const SPACING = 12;

  let W = 700, H = 200, dpr = window.devicePixelRatio || 1;
  let positions = [];
  let dotStates = [];

  function resize() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    W = Math.min(rect.width, 700);
    H = Math.round((ROWS / COLS) * W * 0.85);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computePositions();
  }

  function computePositions() {
    positions = [];
    dotStates = [];
    const gridWidth = (COLS - 1) * SPACING;
    const gridHeight = (ROWS - 1) * SPACING;
    const startX = (W - gridWidth) / 2;
    const startY = (H - gridHeight) / 2;
    
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        positions.push({
          x: startX + c * SPACING,
          y: startY + r * SPACING,
          r, c
        });
        dotStates.push({
          color: Math.random() > 0.5 ? 1 : 0,
          nextFlip: Math.random() * 3000 + 1000
        });
      }
    }
  }

  let lastTime = performance.now();

  function draw(now) {
    const delta = now - lastTime;
    lastTime = now;

    ctx.clearRect(0, 0, W, H);

    positions.forEach((p, i) => {
      const state = dotStates[i];
      
      // Update flip timing
      state.nextFlip -= delta;
      if (state.nextFlip <= 0) {
        state.color = 1 - state.color;
        state.nextFlip = Math.random() * 4000 + 2000;
      }

      // Draw dot with flip-dot style
      const brightness = state.color === 1 ? 85 : 25;
      const color = `hsl(0, 0%, ${brightness}%)`;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Subtle edge
      ctx.strokeStyle = state.color === 1 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', () => {
    clearTimeout(window.__dotsResize);
    window.__dotsResize = setTimeout(resize, 120);
  });
  requestAnimationFrame(draw);
})();