// --- PAGE NAVIGATION ---
const scrollLinks = document.querySelectorAll('.scroll-link');
scrollLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const el = document.querySelector(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

const viewBtns = document.querySelectorAll('.view-btn');
const gridView = document.getElementById('projectsGrid');
const listView = document.getElementById('projectsList');
viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(btn.dataset.view === 'grid') {
      gridView.classList.remove('hidden');
      listView.classList.remove('active');
    } else {
      gridView.classList.add('hidden');
      listView.classList.add('active');
    }
  });
});

// Select the other main sections to control their visibility
const aboutSection = document.getElementById('about');
const contactSection = document.getElementById('contact');

// UPDATED to select all project pages
const projectPages = document.querySelectorAll('.project-page');
document.querySelectorAll('.project-card, .project-row').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.project;
    const target = document.getElementById(`project-${id}`);
    if(target) {
      // Hide Work, About, and Contact sections
      document.getElementById('work').style.display = 'none';
      aboutSection.style.display = 'none';
      contactSection.style.display = 'none';
      
      target.classList.add('active-page');
      window.scrollTo(0,0);
    }
  });
});

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => {
    projectPages.forEach(p => p.classList.remove('active-page'));
    
    // Show Work, About, and Contact sections again
    document.getElementById('work').style.display = 'block';
    aboutSection.style.display = 'block';
    contactSection.style.display = 'block';
    
    document.getElementById('work').scrollIntoView();
  });
});