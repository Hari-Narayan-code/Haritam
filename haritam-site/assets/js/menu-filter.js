export function initMenuFiltering() {
  const container = document.getElementById('menu-cards');
  const filterBar = document.querySelector('.filters');
  if (!container || !filterBar) return;

  function applyFilter(filter) {
    const cards = Array.from(container.querySelectorAll('.menu-card'));
    cards.forEach((card) => {
      const cats = (card.getAttribute('data-category') || '').split(/\s+/);
      const show = filter === 'all' || cats.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  }

  filterBar.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches('[data-filter]')) return;
    filterBar.querySelectorAll('.chip').forEach((btn) => btn.classList.remove('is-active'));
    target.classList.add('is-active');
    const filter = target.getAttribute('data-filter') || 'all';
    applyFilter(filter);
  });
}