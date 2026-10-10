// Register before first paint: pagereveal can fire before a deferred site script runs.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // A story may occur twice, in the feed and carousel. Give only one photo the shared name.
  const transitionPhoto = route => {
    document.querySelectorAll('[data-story-link] img, [data-article-hero] img').forEach(image => {
      image.style.viewTransitionName = 'none';
    });
    document.querySelectorAll('.story-block-image').forEach(image => {
      image.style.viewTransitionName = 'none';
    });
    const hero = document.querySelector('[data-article-hero] img');
    const links = [...document.querySelectorAll('[data-story-link]')];
    const focused = document.activeElement?.closest('[data-story-link]');
    const link = focused?.getAttribute('href') === route ? focused : links.find(link => link.getAttribute('href') === route);
    const image = hero || link?.querySelector('img') || link?.closest('.story-block')?.querySelector('img');
    if (image) image.style.viewTransitionName = 'article-photo';
    return image;
  };
  const clearAfter = (transition, image) => transition.finished.finally(() => {
    if (image) image.style.viewTransitionName = 'none';
  }).catch(() => {});
  addEventListener('pageswap', event => {
    if (!event.viewTransition) return;
    if (reducedMotion.matches) { event.viewTransition.skipTransition(); return; }
    if (!event.activation) return;
    const destination = new URL(event.activation.entry.url);
    if (destination.origin !== location.origin) return;
    // Clear outgoing names after the snapshot so BFCache cannot retain a stale selection.
    clearAfter(event.viewTransition, transitionPhoto(destination.pathname));
  });
  addEventListener('pagereveal', event => {
    if (!event.viewTransition) return;
    if (reducedMotion.matches) { event.viewTransition.skipTransition(); return; }
    const previous = window.navigation?.activation?.from?.url;
    clearAfter(event.viewTransition, transitionPhoto(previous ? new URL(previous).pathname : location.pathname));
  });
})();
