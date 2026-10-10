// Executable local bootstrap, with its own decision gate rather than a marketing-only gate.
(() => {
  const config = document.currentScript?.dataset || {};
  const preview = config.adPreview === 'true';
  const client = config.adClient || '';
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  // This must run before any Google tag is inserted, including for saved decisions.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied',
    ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500,
  });
  const slots = [...document.querySelectorAll('[data-ad-slot]')];
  const near = new Set(), filled = new Set(), entered = new Set();
  let decision = null, requested = false, ready = false;
  const inViewport = slot => {
    const rect = slot.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  };
  for (const slot of slots) if (inViewport(slot)) entered.add(slot);
  const collapseUnfilled = slot => {
    if (inViewport(slot)) entered.add(slot);
    // A slot already seen or above the reader keeps its space, including on rejection.
    if (!entered.has(slot) && slot.getBoundingClientRect().top >= innerHeight &&
      (slot.dataset.adStatus === 'unfilled' || slot.querySelector('[data-ad-status="unfilled"]'))) {
      slot.classList.add('ad-slot--collapsed');
    }
  };
  const fill = slot => {
    if (preview || !decision || !ready || filled.has(slot) || slot.classList.contains('ad-slot--collapsed')) return;
    const unit = slot.dataset.adUnit;
    // Never submit the documented placeholder as a real unit.
    if (!/^\d+$/.test(unit || '')) return;
    filled.add(slot);
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.dataset.adClient = client;
    ad.dataset.adSlot = unit;
    ad.dataset.adFormat = 'auto';
    ad.dataset.fullWidthResponsive = 'true';
    slot.querySelector('.ad-slot-reserved').appendChild(ad);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  };
  const loadGoogle = () => {
    if (preview || !decision || requested || !/^ca-pub-\d+$/.test(client)) return;
    requested = true;
    const tag = document.createElement('script');
    tag.async = true;
    tag.crossOrigin = 'anonymous';
    tag.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
    tag.onload = () => { ready = true; for (const slot of near) fill(slot); };
    document.head.appendChild(tag);
  };
  const update = record => {
    decision = record?.necessary === true && typeof record.marketing === 'boolean' && typeof record.analytics === 'boolean' ? record : null;
    gtag('consent', 'update', {
      ad_storage: decision?.marketing ? 'granted' : 'denied',
      ad_user_data: decision?.marketing ? 'granted' : 'denied',
      ad_personalization: decision?.marketing ? 'granted' : 'denied',
      analytics_storage: decision?.analytics ? 'granted' : 'denied',
    });
    // Explicit non-personalised requests supplement the denied Consent Mode signals.
    (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = decision?.marketing ? 0 : 1;
    loadGoogle();
    for (const slot of near) fill(slot);
  };
  window.addEventListener('sr:consent', event => update(event.detail));
  update(window.srConsent?.get() || null);
  if ('IntersectionObserver' in window) {
    const viewport = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) entered.add(entry.target);
    });
    const lazy = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { near.add(entry.target); fill(entry.target); }
    }, { rootMargin: '600px' });
    for (const slot of slots) { viewport.observe(slot); lazy.observe(slot); }
  } else {
    const scan = () => {
      for (const slot of slots) {
        if (inViewport(slot)) entered.add(slot);
        const rect = slot.getBoundingClientRect();
        if (rect.top < innerHeight + 600 && rect.bottom > -600) { near.add(slot); fill(slot); }
      }
    };
    window.addEventListener('scroll', scan, { passive: true });
    window.addEventListener('resize', scan, { passive: true });
    scan();
  }
  const status = new MutationObserver(records => {
    for (const record of records) {
      const slot = record.target.closest('[data-ad-slot]');
      if (slot) collapseUnfilled(slot);
    }
  });
  for (const slot of slots) status.observe(slot, { attributes: true, subtree: true, attributeFilter: ['data-ad-status'] });
})();
