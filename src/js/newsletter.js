(() => {
  const NEWSLETTER_DELAY_MS = 60 * 1000;
  const NEWSLETTER_DISMISS_MS = 30 * 24 * 60 * 60 * 1000;
  const NEWSLETTER_KEY = 'sr-newsletter';
  const SESSION_KEY = 'sr-newsletter-session';
  const CONSENT_TEXT_VERSION = 'newsletter-2026-10-10';
  const CONSENT_TEXT = 'Send me the Singularity Review newsletter. Unsubscribe anytime.';
  const SUCCESS_TEXT = "Thanks. We'll email you to confirm your subscription before sending anything.";
  const RETRY_TEXT = 'Could not subscribe. Please try again shortly.';
  const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/apptastic-mobi/databases/(default)/documents';
  const prompt = document.querySelector('[data-newsletter-prompt]');
  const announcement = document.querySelector('[data-newsletter-announcement]');
  const forms = [...document.querySelectorAll('[data-newsletter-form]')];
  if (!prompt || !window.srConsent) return;
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
  const tick = () => {
    clearTimeout(timer);
    if (seen && shownAt !== null && Date.now() - shownAt >= NEWSLETTER_DISMISS_MS) seen = false;
    persistSession();
    if (document.hidden || excludedPage || suppressed() || seen || !window.srConsent.get() ||
      document.querySelector('[data-consent-dialog]')?.open || document.documentElement.classList.contains('menu-open')) {
      // Retry while a dialog or mobile menu is open, without stealing focus.
      if (!document.hidden && !excludedPage && !seen && !suppressed()) timer = setTimeout(tick, 1000);
      return;
    }
    if (currentTime() < delay) { timer = setTimeout(tick, Math.min(1000, delay - currentTime())); return; }
    seen = true;
    shownAt = Date.now();
    persistSession();
    prompt.hidden = false;
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
  window.srConsent.onChange(value => {
    if (!value) hidePrompt();
    tick();
  });
  const complete = form => {
    remember('subscribed');
    clearTimeout(timer);
    if (form.dataset.source !== 'prompt') hidePrompt();
    forms.forEach(other => {
      other.querySelector('[data-newsletter-fields]').disabled = true;
      other.querySelector('[data-newsletter-status]').textContent = SUCCESS_TEXT;
      other.elements.email.value = '';
    });
  };
  forms.forEach(form => {
    const fields = form.querySelector('[data-newsletter-fields]');
    fields.disabled = false;
    let busy = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      const email = form.elements.email.value.trim().toLowerCase();
      const status = form.querySelector('[data-newsletter-status]');
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Enter a valid email address.';
        form.elements.email.focus(); return;
      }
      if (!form.elements.newsletterConsent.checked) {
        status.textContent = 'Please tick the newsletter consent checkbox.';
        form.elements.newsletterConsent.focus(); return;
      }
      if (form.elements.website.value) { complete(form); return; }
      busy = true;
      fields.disabled = true;
      status.textContent = 'Submitting...';
      try {
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email));
        const id = [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        let response;
        try {
          response = await fetch(`${FIRESTORE_BASE}:commit`, {
            method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ writes: [{
              update: {
                name: `projects/apptastic-mobi/databases/(default)/documents/sr_newsletter/${id}`,
                fields: {
                  email: { stringValue: email },
                  consentTextVersion: { stringValue: CONSENT_TEXT_VERSION },
                  consentText: { stringValue: CONSENT_TEXT },
                  sourcePage: { stringValue: location.pathname.slice(0, 200) },
                  source: { stringValue: form.dataset.source },
                  status: { stringValue: 'pending' },
                },
              },
              updateTransforms: [{ fieldPath: 'consentAt', setToServerValue: 'REQUEST_TIME' }],
              currentDocument: { exists: false },
            }] }),
          });
        } finally { clearTimeout(timeout); }
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          // This write has only one precondition: the address document must not exist.
          if (!['ALREADY_EXISTS', 'FAILED_PRECONDITION'].includes(error.error?.status)) throw new Error('Subscription unavailable');
        }
        complete(form);
      } catch {
        status.textContent = RETRY_TEXT;
        fields.disabled = false;
      } finally { busy = false; }
    });
  });
  tick();
})();
