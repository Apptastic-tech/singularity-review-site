(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const desktop = matchMedia('(min-width: 960px)');
  const inertRegions = [...document.querySelectorAll('main, .site-footer, .skip, .brand')];
  let menuOpen = false;
  let menuScrollY = 0;
  let bodyStyles = "";
  let previousY = Math.max(0, scrollY);
  let travel = 0;
  let direction = 0;
  let scheduled = false;

  const closeMenu = (restoreFocus = true) => {
    if (!menuOpen) return;
    menuOpen = false;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.documentElement.classList.remove('menu-open');
    document.body.style.cssText = bodyStyles;
    inertRegions.forEach(region => { region.inert = false; });
    window.scrollTo({ top: menuScrollY, behavior: 'instant' });
    if (restoreFocus) toggle.focus({ preventScroll: true });
    previousY = Math.max(0, scrollY);
  };
  if (toggle && menu) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      if (menuOpen) { closeMenu(); return; }
      menuScrollY = Math.max(0, scrollY);
      bodyStyles = document.body.style.cssText;
      const scrollbar = innerWidth - document.documentElement.clientWidth;
      menuOpen = true;
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      header.classList.remove('is-hidden');
      document.documentElement.classList.add('menu-open');
      Object.assign(document.body.style, { position: 'fixed', top: `-${menuScrollY}px`, width: '100%', overflow: 'hidden', paddingRight: `${scrollbar}px` });
      inertRegions.forEach(region => { region.inert = true; });
      menu.querySelector('a').focus({ preventScroll: true });
    });
    document.addEventListener('keydown', event => {
      if (!menuOpen) return;
      if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
      if (event.key !== 'Tab') return;
      const focusable = [toggle, ...menu.querySelectorAll('a[href]')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(false); });
    desktop.addEventListener('change', () => {
      if (desktop.matches && menuOpen) {
        closeMenu(false);
        header.querySelector('.desktop-nav [aria-current]')?.focus({ preventScroll: true });
      }
    });
    document.addEventListener('focusin', event => {
      if (menuOpen && event.target !== toggle && !menu.contains(event.target)) {
        menu.querySelector('a').focus({ preventScroll: true });
      }
    });
  }
  header?.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const currentY = Math.max(0, scrollY);
      const delta = currentY - previousY;
      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) travel = 0;
      direction = nextDirection;
      travel += Math.abs(delta);
      if (header && !menuOpen && !header.querySelector(':focus-visible')) {
        header.classList.toggle('is-condensed', currentY > 100);
        if (currentY < 100 || (delta < 0 && travel > 8)) header.classList.remove('is-hidden');
        else if (delta > 0 && travel > 12) header.classList.add('is-hidden');
      }
      previousY = currentY;
      scheduled = false;
    });
  }, { passive: true });

  const feed = document.querySelector('[data-feed]');
  const link = document.querySelector('[data-load-more]');
  const sentinel = document.querySelector('[data-sentinel]');
  const status = document.querySelector('[data-load-status]');
  if (!feed || !link || !sentinel || !('IntersectionObserver' in window)) return;
  let busy = false;
  let automatic = true;
  const observer = new IntersectionObserver(entries => {
    if (automatic && entries.some(entry => entry.isIntersecting)) load(false);
  }, { rootMargin: '240px 0px' });
  const load = async fromClick => {
    if (busy) return;
    busy = true;
    observer.unobserve(sentinel);
    link.setAttribute('aria-disabled', 'true');
    feed.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading more stories…';
    const next = new URL(link.href, location.href);
    try {
      if (next.origin !== location.origin) throw new Error('Invalid next page');
      const response = await fetch(next.href, { credentials: 'same-origin' });
      if (!response.ok) throw new Error('Page unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const cards = [...doc.querySelectorAll('[data-feed] > [data-card]')];
      if (!cards.length) throw new Error('No articles found');
      const existing = new Set([...feed.querySelectorAll('.card-link')].map(card => card.getAttribute('href')));
      const appended = [];
      cards.forEach(card => {
        if (existing.has(card.querySelector('.card-link').getAttribute('href'))) return;
        const image = card.querySelector('img');
        if (image) { image.loading = 'lazy'; image.setAttribute('fetchpriority', 'auto'); }
        feed.append(card);
        appended.push(card);
      });
      status.textContent = `${appended.length} more stories loaded.`;
      if (fromClick && appended.length) appended[0].querySelector('a').focus({ preventScroll: true });
      const nextLink = doc.querySelector('[data-load-more]');
      if (nextLink) {
        link.href = new URL(nextLink.getAttribute('href'), next.href).href;
        automatic = true;
        observer.observe(sentinel);
      } else {
        observer.disconnect();
        sentinel.remove();
        link.remove();
        status.textContent += ' You are all caught up.';
      }
    } catch {
      automatic = false;
      status.textContent = 'Could not load more stories. Use Load more to try again.';
      // Keep a real page link available when enhancement fails.
      if (fromClick) location.assign(next.href);
    } finally {
      busy = false;
      link.removeAttribute('aria-disabled');
      feed.removeAttribute('aria-busy');
    }
  };
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    load(true);
  });
  observer.observe(sentinel);
})();
