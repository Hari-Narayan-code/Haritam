import { initMobileNav } from './nav.js';
import { initMenuFiltering } from './menu-filter.js';
import { initLightbox } from './gallery.js';
import { initForms } from './forms.js';

function revealOnScroll() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });
  revealElements.forEach((el) => obs.observe(el));
}

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

window.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initMenuFiltering();
  initLightbox();
  initForms();
  revealOnScroll();
  setYear();
});