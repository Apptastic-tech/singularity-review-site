(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const desktop = matchMedia('(min-width: 960px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const inertRegions = [...document.querySelectorAll('main, .site-footer, .skip, .brand')];
  let menuOpen = false;
  let menuScrollY = 0;
  let bodyStyles = "";
  let previousY = Math.max(0, scrollY);
  let travel = 0;
  let direction = 0;
  let scheduled = false;
  let menuTimer = 0;

  const finishClose = () => {
    menu.hidden = true;
    menu.classList.remove('is-open', 'is-closing');
    menu.inert = false;
    document.documentElement.classList.remove('menu-open');
    document.body.style.cssText = bodyStyles;
    inertRegions.forEach(region => { region.inert = false; });
    window.scrollTo({ top: menuScrollY, behavior: 'instant' });
    previousY = Math.max(0, scrollY);
    menuTimer = 0;
  };
  const closeMenu = (restoreFocus = true, immediate = false) => {
    if (!menuOpen && !menuTimer) return;
    clearTimeout(menuTimer);
    menuOpen = false;
    menu.classList.remove('is-open');
    menu.classList.add('is-closing');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    if (restoreFocus) toggle.focus({ preventScroll: true });
    if (immediate || reducedMotion.matches) finishClose();
    else menuTimer = setTimeout(finishClose, 240);
  };
  if (toggle && menu) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      if (menuOpen) { closeMenu(); return; }
      const alreadyLocked = document.documentElement.classList.contains('menu-open');
      clearTimeout(menuTimer);
      menuTimer = 0;
      if (!alreadyLocked) {
        menuScrollY = Math.max(0, scrollY);
        bodyStyles = document.body.style.cssText;
      }
      const scrollbar = innerWidth - document.documentElement.clientWidth;
      menuOpen = true;
      menu.hidden = false;
      menu.inert = false;
      menu.classList.remove('is-closing');
      // Reading the existing box establishes the start of the sheet transition.
      menu.getBoundingClientRect();
      menu.classList.add('is-open');
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
    menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(false, true); });
    desktop.addEventListener('change', () => {
      if (desktop.matches && (menuOpen || menuTimer)) {
        closeMenu(false, true);
        header.querySelector('.desktop-nav [aria-current]')?.focus({ preventScroll: true });
      }
    });
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches && menuTimer) closeMenu(false, true);
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

  // Motion is an enhancement: elements stay visible without observers or JavaScript.
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reducedMotion.matches) entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08 }) : null;
  const observeReveals = region => {
    if (region.matches?.('[data-reveal]')) revealObserver?.observe(region);
    region.querySelectorAll('[data-reveal]').forEach(element => revealObserver?.observe(element));
  };
  document.querySelectorAll('.prose img').forEach(image => image.setAttribute('data-reveal', ''));
  observeReveals(document);
  const cover = document.querySelector('[data-cover]');
  const motionToggle = cover?.querySelector('[data-motion-toggle]');
  let coverVisible = true;
  let skyPaused = false;
  try { skyPaused = localStorage.getItem('sr-sky-paused') === 'true'; } catch { /* Storage may be unavailable. */ }
  const updateCover = () => {
    const running = coverVisible && !document.hidden && !skyPaused && !reducedMotion.matches && !navigator.connection?.saveData;
    cover?.classList.toggle('is-in-view', running);
    if (cover) {
      cover.dataset.skyMotion = running ? 'running' : 'paused';
      cover.dispatchEvent(new CustomEvent('sky-motion-change'));
    }
    if (motionToggle) {
      motionToggle.hidden = reducedMotion.matches || !!navigator.connection?.saveData;
      motionToggle.setAttribute('aria-pressed', String(skyPaused));
      motionToggle.setAttribute('aria-label', skyPaused ? 'Play sky animation' : 'Pause sky animation');
      motionToggle.querySelector?.('[data-motion-glyph]')?.setAttribute('d', skyPaused ? 'M8 5v14l11-7z' : 'M7 5h3v14H7zm7 0h3v14h-3z');
    }
  };
  if (cover) {
    updateCover();
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      coverVisible = entries[0].isIntersecting;
      updateCover();
    }).observe(cover);
    motionToggle?.addEventListener('click', () => {
      skyPaused = !skyPaused;
      try { localStorage.setItem('sr-sky-paused', String(skyPaused)); } catch { /* The current page still retains its state. */ }
      updateCover();
    });
    reducedMotion.addEventListener('change', updateCover);
    navigator.connection?.addEventListener?.('change', updateCover);
    document.addEventListener('visibilitychange', updateCover);
  }

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
        observeReveals(card);
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
