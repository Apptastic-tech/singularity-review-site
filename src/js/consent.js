// Necessary preferences only. Non-essential scripts must use the inert gate below.
(() => {
  const CONSENT_VERSION = '2026-10-10';
  const CONSENT_KEY = 'sr-consent';
  const banner = document.querySelector('[data-consent-banner]');
  const dialog = document.querySelector('[data-consent-dialog]');
  const form = document.querySelector('[data-consent-form]');
  if (!banner || !dialog || !form) return;
  let previousFocus = null;
  const validRecord = value => value && value.version === CONSENT_VERSION && value.necessary === true &&
    typeof value.analytics === 'boolean' && typeof value.marketing === 'boolean' &&
    typeof value.decidedAt === 'string' && Number.isFinite(Date.parse(value.decidedAt));
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(CONSENT_KEY));
      return validRecord(value) ? value : null;
    } catch { return null; }
  };
  let decision = read();
  const get = () => decision ? { ...decision } : null;
  const activateScripts = () => {
    if (!decision) return;
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(placeholder => {
      const category = placeholder.dataset.consent;
      if (!['analytics', 'marketing'].includes(category) || !decision[category] || placeholder.dataset.activated) return;
      placeholder.dataset.activated = 'true';
      const script = document.createElement('script');
      // Copy safe script attributes, retaining the category for subsequent inspection.
      for (const name of ['nonce', 'integrity', 'crossorigin', 'referrerpolicy']) {
        if (placeholder.hasAttribute(name)) script.setAttribute(name, placeholder.getAttribute(name));
      }
      script.dataset.consent = category;
      if (placeholder.dataset.scriptType === 'module') script.type = 'module';
      if (placeholder.dataset.src) script.src = placeholder.dataset.src;
      else script.textContent = placeholder.textContent;
      placeholder.after(script);
    });
  };
  const publish = () => {
    banner.hidden = !!decision;
    activateScripts();
    window.dispatchEvent(new CustomEvent('sr:consent', { detail: get() }));
  };
  const close = () => dialog.close();
  const open = () => {
    if (dialog.open) return;
    previousFocus = document.activeElement;
    // Finish the reader's mobile-menu interaction before opening another focus trap.
    document.querySelector('[data-menu-toggle][aria-expanded="true"]')?.click();
    form.elements.analytics.checked = decision?.analytics === true;
    form.elements.marketing.checked = decision?.marketing === true;
    dialog.showModal();
    dialog.querySelector('#consent-heading').focus({ preventScroll: true });
  };
  const save = (analytics, marketing) => {
    decision = { version: CONSENT_VERSION, necessary: true, analytics, marketing, decidedAt: new Date().toISOString() };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(decision)); } catch { /* Retain the decision on this page when storage is blocked. */ }
    if (dialog.open) close();
    // Move only a focus that would otherwise be left inside a disappearing control.
    if (banner.contains(document.activeElement)) document.querySelector('#main')?.focus({ preventScroll: true });
    publish();
  };
  window.srConsent = {
    get, open,
    onChange(callback) {
      const handler = event => callback(event.detail ? { ...event.detail } : null);
      window.addEventListener('sr:consent', handler);
      return () => window.removeEventListener('sr:consent', handler);
    },
  };
  document.querySelectorAll('[data-consent-open]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', open);
  });
  document.querySelectorAll('[data-consent-choice]').forEach(button => {
    button.addEventListener('click', () => save(button.dataset.consentChoice === 'accept', button.dataset.consentChoice === 'accept'));
  });
  dialog.querySelector('[data-consent-close]').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => {
    const target = previousFocus?.isConnected && !previousFocus.closest('[hidden]') ? previousFocus : document.querySelector('#main');
    target?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, input:not([disabled]), a[href]')];
    const first = controls[0], last = controls.at(-1), current = document.activeElement;
    if (event.shiftKey && (current === first || !controls.includes(current))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (current === last || !controls.includes(current))) { event.preventDefault(); first.focus(); }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    save(form.elements.analytics.checked, form.elements.marketing.checked);
  });
  window.addEventListener('storage', event => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    decision = read();
    publish();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { decision = read(); publish(); }
  });
  publish();
})();
