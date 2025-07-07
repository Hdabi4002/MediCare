document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');

  toggle.addEventListener('click', () => {
    navList.classList.toggle('show');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navList.classList.remove('show');
      }
    });
  });
});
