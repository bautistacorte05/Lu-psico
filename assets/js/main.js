/* =====================================================
   MAIN.JS — Interactividad y animaciones
   Landing Page: Psicología · Dra. Valentina Cruz
   ===================================================== */

// ---- Navbar: cambiar estilo al hacer scroll ----
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- Menú hamburguesa (mobile) ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  hamburger.querySelector('.material-icons-round').textContent = isOpen ? 'close' : 'menu';
});

// Cerrar menú mobile al hacer clic en un enlace
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelector('.material-icons-round').textContent = 'menu';
  });
});

// Cerrar al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelector('.material-icons-round').textContent = 'menu';
  }
});

// ---- Intersection Observer: animaciones de entrada ----
const fadeElements = document.querySelectorAll(
  '.subject-card, .review-card, .method-step, .about-text, .about-visual, .stat-item, .hero-content, .hero-image-wrapper, .contact-form-wrapper, .contact-info'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Pequeño delay escalonado para elementos en grid
      const siblings = [...(entry.target.parentElement?.children || [])];
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

fadeElements.forEach(el => observer.observe(el));

// ---- Active nav link en scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));


// Inyectar keyframe spin para el loader
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .nav-link.active { color: var(--primary) !important; }
`;
document.head.appendChild(style);
