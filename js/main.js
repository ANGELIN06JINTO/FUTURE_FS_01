document.addEventListener('DOMContentLoaded', () => {
const API_URL = 'http://localhost:5000/api/contact';

(function initCursor() {
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  if (!cursor || !cursorFollower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const interactiveSelectors = 'a, button, input, textarea, .project-card, .skill-tag, .about-card';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      cursorFollower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      cursorFollower.classList.remove('hovering');
    });
  });
})();

(function initNav() {
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }
})();

(function initReveal() {
  
  const heroElements = document.querySelectorAll('.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4');
  
  
  setTimeout(() => {
    heroElements.forEach(el => {
      if (isInViewport(el)) el.classList.add('in');
    });
  }, 100);

  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const revealSelectors = [
    '.section-heading', '.section-label',
    '.about-card', '.about-facts', '.about-text p',
    '.skill-category', '.bar-item',
    '.project-card',
    '.timeline-item',
    '.contact-item', '.form-group',
    '.contact-intro',
    '.reveal', '.reveal-delay-1', '.reveal-delay-2', '.reveal-delay-3', '.reveal-delay-4',
  ];

  document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
    if (!isInViewport(el)) {
      observer.observe(el);
    }
  });

  function handleVisible(entries, obs) {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        obs.unobserve(entry.target);
      }
    });
  }

  const staggerObserver = new IntersectionObserver(handleVisible, {
    threshold: 0.1, rootMargin: '0px 0px -30px 0px',
  });
})();

(function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();

(function initContactForm() {
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');
  const submitBtn   = form ? form.querySelector('button[type="submit"]') : null;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject ? form.subject.value.trim() : '';
    const message = form.message.value.trim();

    let hasError = false;

    if (name.length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      hasError = true;
    }
    if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      hasError = true;
    }
    if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      hasError = true;
    }

    if (hasError) return;
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Server-side validation errors
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(err => showError(err.field, err.message));
        } else {
          showGlobalError(data.message || 'Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }

      form.reset();
      showSuccess();

    } catch (error) {
      console.error('Form submit error:', error);
      showGlobalError(
        'Could not connect to the server. Please check your internet connection or try again later.'
      );
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading) {
    if (!submitBtn) return;
    if (loading) {
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';
      submitBtn.style.opacity = '0.7';
    } else {
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = 'Send Message <span class="send-arrow">→</span>';
      submitBtn.style.opacity = '1';
    }
  }

  function showSuccess() {
    if (!successMsg) return;
    successMsg.classList.add('show');
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => successMsg.classList.remove('show'), 7000);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    
    field.style.borderColor = '#ff6a8e';

    
    const errEl = document.createElement('span');
    errEl.className  = 'field-error';
    errEl.textContent = message;
    errEl.style.cssText = 'display:block;color:#ff6a8e;font-size:0.78rem;margin-top:4px;';
    field.parentNode.appendChild(errEl);
  }

  function showGlobalError(message) {
    const existing = form.querySelector('.global-error');
    if (existing) existing.remove();

    const errEl = document.createElement('div');
    errEl.className  = 'global-error';
    errEl.textContent = message;
    errEl.style.cssText = 'padding:12px 16px;background:rgba(255,106,142,0.08);border:1px solid rgba(255,106,142,0.3);border-radius:8px;color:#ff6a8e;font-size:0.88rem;';
    submitBtn.insertAdjacentElement('beforebegin', errEl);
  }

  function clearErrors() {
    form.querySelectorAll('.field-error, .global-error').forEach(el => el.remove());
    ['name', 'email', 'subject', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.borderColor = '';
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}
});