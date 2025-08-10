let lightboxRoot;
let imgEl;
let captionEl;
let closeBtn;
let lastActive;

function ensureLightbox() {
  lightboxRoot = document.getElementById('lightbox');
  if (!lightboxRoot) {
    lightboxRoot = document.createElement('div');
    lightboxRoot.id = 'lightbox';
    lightboxRoot.className = 'lightbox';
    lightboxRoot.hidden = true;
    lightboxRoot.setAttribute('aria-modal', 'true');
    lightboxRoot.setAttribute('role', 'dialog');
    lightboxRoot.innerHTML = `
      <button class="lightbox__close" aria-label="Close viewer">&times;</button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" alt="" />
        <figcaption class="lightbox__caption"></figcaption>
      </figure>`;
    document.body.appendChild(lightboxRoot);
  }
  imgEl = lightboxRoot.querySelector('.lightbox__img');
  captionEl = lightboxRoot.querySelector('.lightbox__caption');
  closeBtn = lightboxRoot.querySelector('.lightbox__close');
}

function openLightbox(src, caption) {
  lastActive = document.activeElement;
  lightboxRoot.hidden = false;
  document.body.style.overflow = 'hidden';
  imgEl.src = src;
  captionEl.textContent = caption || '';
  closeBtn.focus();
}

function closeLightbox() {
  lightboxRoot.hidden = true;
  document.body.style.overflow = '';
  imgEl.removeAttribute('src');
  if (lastActive) (lastActive).focus();
}

export function initLightbox() {
  ensureLightbox();

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const trigger = t.closest('[data-lightbox]');
    if (trigger && trigger instanceof HTMLAnchorElement) {
      e.preventDefault();
      const href = trigger.getAttribute('href');
      const caption = trigger.getAttribute('data-caption') || '';
      if (href) openLightbox(href, caption);
    }
  });

  lightboxRoot.addEventListener('click', (e) => {
    if (e.target === lightboxRoot || e.target === closeBtn) {
      e.preventDefault();
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (lightboxRoot.hidden) return;
    if (e.key === 'Escape') closeLightbox();
  });
}