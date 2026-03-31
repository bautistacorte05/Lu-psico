/* =====================================================
   MAIN.JS — Interactividad y animaciones
   Landing Page: Psicología · Dra. Valentina Cruz
   ===================================================== */

// ---- Navbar: cambiar estilo al hacer scroll ----
const navbar = document.getElementById('navbar');
const fab = document.getElementById('fab');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  fab.classList.toggle('visible', window.scrollY > 400);
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

// ---- Formulario de contacto ----
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validación básica
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nombre) {
    showFieldError('nombre', 'Por favor, ingresa tu nombre.');
    return;
  }
  if (!email || !emailRegex.test(email)) {
    showFieldError('email', 'Por favor, ingresa un email válido.');
    return;
  }

  // Simular envío
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span style="display:inline-block;animation:spin 1s linear infinite;font-size:1.1rem" class="material-icons-round">sync</span>
    Enviando...
  `;

  await new Promise(r => setTimeout(r, 1800));

  // Éxito
  form.innerHTML = `
    <div style="text-align:center;padding:2.5rem 1rem;">
      <span class="material-icons-round" style="font-size:3.5rem;color:var(--primary);display:block;margin-bottom:1rem;">check_circle</span>
      <h3 style="font-family:var(--font-headline);font-size:1.4rem;font-weight:800;color:var(--on-surface);margin-bottom:0.75rem;">¡Mensaje enviado!</h3>
      <p style="color:var(--on-surface-variant);font-size:0.95rem;max-width:35ch;margin:0 auto;line-height:1.6;">
        Gracias, <strong>${nombre}</strong>. Te contactaré a <strong>${email}</strong> en menos de 24 horas.
      </p>
    </div>
  `;
});

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = 'var(--error)';
  field.style.background = 'var(--error-container)';
  field.focus();

  let errorEl = field.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('field-error')) {
    errorEl = document.createElement('p');
    errorEl.className = 'field-error';
    errorEl.style.cssText = 'font-size:0.8rem;color:var(--error);margin-top:0.35rem;';
    field.parentNode.insertBefore(errorEl, field.nextSibling);
  }
  errorEl.textContent = message;
  errorEl.setAttribute('role', 'alert');

  field.addEventListener('input', () => {
    field.style.borderColor = '';
    field.style.background = '';
    if (errorEl) errorEl.remove();
  }, { once: true });
}

// Inyectar keyframe spin para el loader
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .nav-link.active { color: var(--primary) !important; }
`;
document.head.appendChild(style);
