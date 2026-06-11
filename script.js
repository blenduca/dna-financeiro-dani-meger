// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(el => el.classList.contains('reveal') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 0.8;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 40}%;
      animation-duration: ${Math.random() * 14 + 12}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== REPORT BAR ANIMATION =====
const reportBars = document.querySelectorAll('.report-bar-fill');
if (reportBars.length) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        if (width) entry.target.style.width = width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  reportBars.forEach(bar => barObserver.observe(bar));
}

// ===== SUBTLE PARALLAX =====
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const img = document.querySelector('.hero-image img');
  if (img && y < window.innerHeight) {
    img.style.transform = `translateY(${y * 0.12}px)`;
  }
}, { passive: true });

// ===== FORM SUBMISSION & WEBHOOK =====
const leadForm = document.getElementById('lead-form');
if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(leadForm);
      const payload = Object.fromEntries(formData.entries());

      // Captura parâmetros UTM da URL
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.forEach((value, key) => {
        if (key.startsWith('utm_')) {
          payload[key] = value;
        }
      });

      const response = await fetch('https://automacao.bagents.cloud/webhook/dna-dani-meger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Diagnóstico solicitado com sucesso! Em breve entraremos em contato.');
        leadForm.reset();
      } else {
        throw new Error('Erro na resposta do webhook.');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.');
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}
