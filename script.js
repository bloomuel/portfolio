// Simple Scrollspy to highlight Nav items based on scroll position
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('main > div, main > section');
  const navItems = document.querySelectorAll('.nav-item');
  
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    // Offset calculation for active state trigger
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href').includes(current)) {
      item.classList.add('active');
    }
  });
});