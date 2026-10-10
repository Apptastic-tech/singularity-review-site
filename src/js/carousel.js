(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
    const controls = carousel.querySelector('[data-carousel-controls]');
    if (!track || slides.length < 2 || !controls) return;
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const play = carousel.querySelector('[data-carousel-play]');
    const status = carousel.querySelector('[data-carousel-status]');
    let timer;
    let userPaused = false;
    let hovering = false;
    let touching = false;
    let positions = [];

    const measure = () => {
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      const start = track.getBoundingClientRect().left;
      positions = [...new Set(slides.map(slide => Math.round(Math.min(max,
        slide.getBoundingClientRect().left - start + track.scrollLeft))))];
      previous.disabled = next.disabled = max < 2;
    };
    const paused = () => userPaused || reducedMotion.matches || hovering || touching ||
      carousel.matches(':focus-within') || document.hidden || positions.length < 2;
    const schedule = () => {
      clearTimeout(timer);
      if (!paused()) timer = setTimeout(() => { advance(1, false); }, 5000);
    };
    const advance = (step, announce = true) => {
      if (positions.length < 2) return;
      const current = positions.reduce((best, value, index) =>
        Math.abs(value - track.scrollLeft) < Math.abs(positions[best] - track.scrollLeft) ? index : best, 0);
      const target = positions[(current + step + positions.length) % positions.length];
      track.scrollTo({ left: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      if (announce) {
        const index = slides.findIndex(slide => Math.round(slide.getBoundingClientRect().left -
          track.getBoundingClientRect().left + track.scrollLeft) >= target);
        status.textContent = `Featured article ${Math.max(0, index) + 1} of ${slides.length}.`;
      }
      schedule();
    };
    const updatePlay = () => {
      play.disabled = reducedMotion.matches;
      play.textContent = reducedMotion.matches ? 'Auto-advance off' :
        userPaused ? 'Play auto-advance' : 'Pause auto-advance';
      schedule();
    };
    controls.hidden = false;
    previous.addEventListener('click', () => advance(-1));
    next.addEventListener('click', () => advance(1));
    play.addEventListener('click', () => { userPaused = !userPaused; updatePlay(); });
    track.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      advance(event.key === 'ArrowRight' ? 1 : -1);
    });
    carousel.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; schedule(); } });
    carousel.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovering = false; schedule(); } });
    carousel.addEventListener('focusin', schedule);
    carousel.addEventListener('focusout', () => requestAnimationFrame(schedule));
    carousel.addEventListener('pointerdown', () => { touching = true; schedule(); }, { passive: true });
    const release = () => { if (touching) { touching = false; schedule(); } };
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });
    track.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', updatePlay);
    const resize = () => { measure(); schedule(); };
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
    else window.addEventListener('resize', resize, { passive: true });
    measure();
    updatePlay();
  });
})();
