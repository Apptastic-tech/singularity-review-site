// Native horizontal scrolling is the fallback when enhancement is unavailable.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-card-row]').forEach(row => {
    const track = row.querySelector('[data-row-track]');
    const arrows = row.querySelector('[data-row-arrows]');
    const previous = row.querySelector('[data-row-prev]');
    const next = row.querySelector('[data-row-next]');
    if (!track || !arrows || !previous || !next) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const end = Math.max(0, track.scrollWidth - track.clientWidth);
      arrows.hidden = end <= 1;
      previous.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= end - 1;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const advance = direction => {
      const card = track.querySelector('li');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };
    previous.addEventListener('click', () => advance(-1));
    next.addEventListener('click', () => advance(1));
    track.addEventListener('scroll', schedule, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        advance(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    window.addEventListener('resize', schedule, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(track);
    update();
  });
})();
