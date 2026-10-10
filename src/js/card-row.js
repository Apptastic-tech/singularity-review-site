// Native horizontal scrolling is the fallback when enhancement is unavailable.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-card-row]').forEach(row => {
    const track = row.querySelector('[data-row-track]');
    const previous = row.querySelector('[data-row-prev]');
    const next = row.querySelector('[data-row-next]');
    if (!track || !previous || !next) return;
    let frame = 0;
    const update = (position = track.scrollLeft) => {
      const end = Math.max(0, track.scrollWidth - track.clientWidth);
      previous.disabled = position <= 1;
      next.disabled = position >= end - 1;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); });
    };
    const advance = direction => {
      const card = track.querySelector('li');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const end = Math.max(0, track.scrollWidth - track.clientWidth);
      const target = Math.max(0, Math.min(end, track.scrollLeft + direction * (card.getBoundingClientRect().width + gap)));
      track.scrollBy({ left: target - track.scrollLeft, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      // Smooth scrolling can begin later. Reflect the clamped destination now.
      update(target);
    };
    previous.addEventListener('click', () => advance(-1));
    next.addEventListener('click', () => advance(1));
    track.addEventListener('scroll', schedule, { passive: true });
    // Unsupported scrollend events are harmless; scroll remains the fallback.
    track.addEventListener('scrollend', () => update(), { passive: true });
    track.addEventListener('focusin', event => {
      const card = event.target.closest('li');
      if (!card || card.parentElement !== track) return;
      const bounds = track.getBoundingClientRect();
      const style = getComputedStyle(track);
      const start = parseFloat(style.scrollPaddingInlineStart) || 0;
      const end = parseFloat(style.scrollPaddingInlineEnd) || 0;
      const cardBounds = card.getBoundingClientRect();
      if (cardBounds.left < bounds.left + start || cardBounds.right > bounds.right - end) {
        card.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
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
