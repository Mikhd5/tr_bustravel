(() => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const bookingForm = document.getElementById('bookingForm');

  // Reveal content as it enters the viewport. The fallback keeps everything visible.
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motionQuery.matches && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.section-heading, .service-card, .service-note, .schedule-card, .route-card, .about-image, .about-copy, .fleet-feature, .fleet-detail, .benefit-card, .booking-copy, .booking-form, .contact-layout > *'
    );
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal');
      const staggerGroup = element.closest('.service-grid, .schedule-cards, .fleet-side, .benefit-grid');
      if (staggerGroup) {
        const siblings = [...staggerGroup.children];
        element.style.setProperty('--reveal-delay', `${siblings.indexOf(element) * 90}ms`);
      } else {
        element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 45}ms`);
      }
    });
    if (revealTargets.length) {
      document.documentElement.classList.add('has-motion');
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
      revealTargets.forEach(element => revealObserver.observe(element));
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Відкрити меню');
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const serviceField = document.getElementById('service');
      if (serviceField) serviceField.value = link.dataset.service;
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;
      const formData = new FormData(bookingForm);
      const lines = [
        'Добрий день! Хочу залишити заявку на TR BUS TRAVEL.',
        '',
        `Ім’я: ${formData.get('name')}`,
        `Телефон: ${formData.get('phone')}`,
        `Послуга: ${formData.get('service')}`,
        `Звідки: ${formData.get('from') || 'Не вказано'}`,
        `Куди: ${formData.get('to') || 'Не вказано'}`,
        `Бажана дата: ${formData.get('date') || 'Не вказано'}`,
        `Кількість пасажирів / місць: ${formData.get('people') || '1'}`,
        `Додаткова інформація: ${formData.get('details') || 'Немає'}`
      ];
      const whatsappUrl = `https://wa.me/380689612990?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();
