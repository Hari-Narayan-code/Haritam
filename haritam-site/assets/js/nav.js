function getFocusable(container) {
  return Array.from(container.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

export function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const drawer = document.getElementById('mobile-menu');
  if (!toggle || !drawer) return;

  let lastActive = null;

  function open() {
    lastActive = document.activeElement;
    drawer.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const focusables = getFocusable(drawer);
    focusables[0]?.focus();
    drawer.addEventListener('keydown', trap);
    drawer.addEventListener('click', onBackdrop);
  }

  function close() {
    drawer.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    drawer.removeEventListener('keydown', trap);
    drawer.removeEventListener('click', onBackdrop);
    if (lastActive) (lastActive).focus();
  }

  function trap(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const focusables = getFocusable(drawer);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function onBackdrop(e) {
    if (e.target === drawer) close();
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  // Close on nav link click
  drawer.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.matches('a.nav__link')) close();
  });
}