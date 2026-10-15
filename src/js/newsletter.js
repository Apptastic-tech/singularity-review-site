(() => {
  const NEWSLETTER_DELAY_MS = 60 * 1000;
  const NEWSLETTER_DISMISS_MS = 30 * 24 * 60 * 60 * 1000;
  const NEWSLETTER_KEY = 'sr-newsletter';
  const SESSION_KEY = 'sr-newsletter-session';
  // Signups are handled by the beehiiv embed form. Its loader is fetched only when a signup is shown.
  const BEEHIIV_ORIGIN = 'https://subscribe-forms.beehiiv.com';
  const BEEHIIV_LOADER = BEEHIIV_ORIGIN + '/v3/loader.js';
  const BEEHIIV_FORM = 'e785ea2e-cba3-470a-8d47-87fb1c73e623';
  const EMBED_TIMEOUT_MS = 10000;
  // First-party attribution cookies written by the beehiiv loader or attribution.js. Kept only with analytics consent.
  const ATTRIBUTION_COOKIES = ['bhv_attribution', 'attribution_data'];
  const prompt = document.querySelector('[data-newsletter-prompt]');
  const announcement = document.querySelector('[data-newsletter-announcement]');
  const embeds = [...document.querySelectorAll('[data-newsletter-embed]')];
  if (!prompt || !window.srConsent) return;
  const analyticsGranted = () => window.srConsent.get()?.analytics === true;
  const clearAttribution = () => {
    if (analyticsGranted()) return;
    const present = String(document.cookie || '').split(/;\s*/).map(item => item.split('=')[0]);
    // Expire only; this never stores a value.
    ATTRIBUTION_COOKIES.filter(name => present.includes(name)).forEach(name => { document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax'; });
  };
  clearAttribution();
  const mount = embed => {
    if (!embed || (embed.dataset.state && embed.dataset.state !== 'idle')) return;
    if (!analyticsGranted()) { embed.dataset.state = 'fallback'; return; }
    embed.dataset.state = 'loading';
    const frame = embed.querySelector('[data-newsletter-frame]');
    const ready = () => {
      if (!frame.querySelector('iframe[data-bhv-sized]')) return false;
      embed.dataset.state = 'ready'; clearAttribution(); return true;
    };
    // No sized form in time: keep any iframe (it may be showing a bot check) and add the link to beehiiv.
    const fail = () => { if (embed.dataset.state === 'loading') embed.dataset.state = frame.querySelector('iframe') ? 'slow' : 'fallback'; };
    const fallbackTimer = setTimeout(fail, EMBED_TIMEOUT_MS);
    if (typeof MutationObserver === 'function') {
      const watch = new MutationObserver(() => { if (ready()) { clearTimeout(fallbackTimer); watch.disconnect(); } });
      watch.observe(frame, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-bhv-sized'] });
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = BEEHIIV_LOADER;
    script.setAttribute('data-beehiiv-form', BEEHIIV_FORM);
    script.addEventListener('load', clearAttribution);
    script.addEventListener('error', () => { clearTimeout(fallbackTimer); embed.dataset.state = 'fallback'; });
    frame.appendChild(script);
  };
  embeds.forEach(embed => { embed.dataset.state = 'idle'; });
  const promptEmbed = embeds.find(embed => embed.dataset.source === 'prompt');
  const inlineEmbeds = embeds.filter(embed => embed !== promptEmbed);
  if (typeof IntersectionObserver === 'function') {
    const nearby = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { nearby.unobserve(entry.target); mount(entry.target); }
    }), { rootMargin: '300px 0px' });
    inlineEmbeds.forEach(embed => nearby.observe(embed));
  } else inlineEmbeds.forEach(mount);
  const read = (storage, key) => {
    try { return JSON.parse(window[storage].getItem(key)); } catch { return null; }
  };
  let preference = read('localStorage', NEWSLETTER_KEY);
  const savedSession = read('sessionStorage', SESSION_KEY);
  let visibleMs = Number.isFinite(savedSession?.visibleMs) && savedSession.visibleMs >= 0 ? savedSession.visibleMs : 0;
  let seen = savedSession?.seen === true;
  let shownAt = Number.isFinite(savedSession?.shownAt) ? savedSession.shownAt : null;
  let visibleSince = document.hidden ? null : performance.now();
  let timer = 0;
  const localhost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const override = localhost ? Number(new URLSearchParams(location.search).get('nl-delay')) : 0;
  const delay = override > 0 && Number.isFinite(override) ? override * 1000 : NEWSLETTER_DELAY_MS;
  const excludedPage = /^\/(privacy|cookies)(?:\/|$)/.test(location.pathname);
  const currentTime = () => visibleMs + (visibleSince === null ? 0 : Math.max(0, performance.now() - visibleSince));
  const persistSession = () => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ visibleMs: currentTime(), seen, shownAt })); } catch { /* Continue on this page. */ }
  };
  const suppressed = () => {
    const at = Date.parse(preference?.at);
    if (!Number.isFinite(at)) return false;
    if (preference?.state === 'subscribed') return true;
    return preference?.state === 'dismissed' && Date.now() - at < NEWSLETTER_DISMISS_MS;
  };
  const remember = state => {
    preference = { state, at: new Date().toISOString() };
    try { localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(preference)); } catch { /* Retain the choice on this page. */ }
  };
  const hidePrompt = () => {
    const focused = prompt.contains(document.activeElement);
    prompt.hidden = true;
    announcement.textContent = '';
    if (focused) document.querySelector('#main')?.focus({ preventScroll: true });
  };
  const dismiss = () => { remember('dismissed'); hidePrompt(); };
  const consentVisible = () => {
    const banner = document.querySelector('[data-consent-banner]');
    return (banner && !banner.hidden) || document.querySelector('[data-consent-dialog]')?.open;
  };
  const tick = () => {
    clearTimeout(timer);
    if (seen && shownAt !== null && Date.now() - shownAt >= NEWSLETTER_DISMISS_MS) seen = false;
    persistSession();
    if (document.hidden || excludedPage || suppressed() || seen || !window.srConsent.get() ||
      consentVisible() || document.documentElement.classList.contains('menu-open')) {
      // Retry while a dialog or mobile menu is open, without stealing focus.
      if (!document.hidden && !excludedPage && !seen && !suppressed()) timer = setTimeout(tick, 1000);
      return;
    }
    if (currentTime() < delay) { timer = setTimeout(tick, Math.min(1000, delay - currentTime())); return; }
    seen = true;
    shownAt = Date.now();
    persistSession();
    prompt.hidden = false;
    mount(promptEmbed);
    announcement.textContent = 'Get the newsletter. A subscription form is available at the bottom of the page.';
  };
  // Never move focus on appearance. A click on the prompt's non-interactive copy focuses its heading.
  prompt.addEventListener('click', event => {
    if (!event.target.closest('a, button, input, label, form')) prompt.querySelector('h2').focus({ preventScroll: true });
  });
  prompt.querySelector('[data-newsletter-close]').addEventListener('click', dismiss);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !prompt.hidden && !document.querySelector('[data-consent-dialog]')?.open) {
      event.preventDefault(); dismiss();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      visibleMs = currentTime(); visibleSince = null;
    } else visibleSince = performance.now();
    tick();
  });
  window.addEventListener('pagehide', () => {
    clearTimeout(timer);
    visibleMs = currentTime(); visibleSince = null;
    persistSession();
    // Leaving a page with the prompt open counts as dismissing that invitation.
    if (!prompt.hidden) dismiss();
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    preference = read('localStorage', NEWSLETTER_KEY);
    visibleSince = document.hidden ? null : performance.now();
    if (suppressed() || !window.srConsent.get()) hidePrompt();
    tick();
  });
  window.addEventListener('storage', event => {
    if (event.key === NEWSLETTER_KEY || event.key === null) {
      preference = read('localStorage', NEWSLETTER_KEY);
      if (suppressed()) hidePrompt();
      tick();
    }
  });
  window.addEventListener('sr:consent-ui', () => {
    if (consentVisible()) hidePrompt();
    tick();
  });
  window.srConsent.onChange(value => {
    if (!value || consentVisible()) hidePrompt();
    clearAttribution();
    if (analyticsGranted()) {
      // Only slots already shown or approached may load after a later Accept.
      embeds.filter(embed => embed.dataset.state === 'fallback').forEach(embed => { embed.dataset.state = 'idle'; mount(embed); });
    }
    tick();
  });
  // beehiiv reports a completed signup from its own iframe; remember it so the prompt stays away.
  window.addEventListener('message', event => {
    if (event.origin !== BEEHIIV_ORIGIN || event.data?.type !== 'beehiiv:submitted') return;
    if (!embeds.some(embed => embed.querySelector('iframe')?.contentWindow === event.source)) return;
    remember('subscribed');
    clearTimeout(timer);
  });
  tick();
})();
