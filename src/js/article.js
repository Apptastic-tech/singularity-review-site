// Article page extras: native share, copy link, and anonymous reactions (Firestore REST, no SDK).
(() => {
  document.querySelectorAll('[data-share-native]').forEach((btn) => {
    if (typeof navigator.share !== 'function') return;
    btn.hidden = false;
    btn.addEventListener('click', () => {
      navigator.share({ title: btn.dataset.title, url: btn.dataset.url }).catch(() => {});
    });
  });

  document.querySelectorAll('[data-share-copy]').forEach((btn) => {
    const label = btn.querySelector('[data-copy-label]');
    const original = label.textContent;
    btn.addEventListener('click', async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(btn.dataset.url);
        ok = true;
      } catch {
        const area = document.createElement('textarea');
        area.value = btn.dataset.url;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.append(area);
        area.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        area.remove();
      }
      label.textContent = ok ? 'Link copied' : 'Copy failed';
      setTimeout(() => { label.textContent = original; }, 2000);
    });
  });

  const box = document.querySelector('[data-reactions]');
  if (!box || !window.fetch) return;
  const slug = box.dataset.slug;
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return;
  const base = 'https://firestore.googleapis.com/v1/projects/apptastic-mobi/databases/(default)/documents';
  const docName = `projects/apptastic-mobi/databases/(default)/documents/sr_reactions/${slug}`;
  const keyFor = (k) => `sr-react:${slug}:${k}`;
  const mine = {
    has: (k) => { try { return localStorage.getItem(keyFor(k)) === '1'; } catch { return false; } },
    set: (k, on) => { try { on ? localStorage.setItem(keyFor(k), '1') : localStorage.removeItem(keyFor(k)); } catch { /* storage blocked */ } },
  };
  const buttons = [...box.querySelectorAll('[data-key]')];
  const counts = {};

  const render = () => {
    buttons.forEach((b) => {
      const k = b.dataset.key;
      const n = Math.max(0, counts[k] || 0);
      b.querySelector('[data-count]').textContent = n ? n.toLocaleString('en-US') : '';
      b.setAttribute('aria-pressed', String(mine.has(k)));
      b.setAttribute('aria-label', n ? `${b.dataset.label}, ${n}` : b.dataset.label);
    });
  };

  const load = async () => {
    try {
      const res = await fetch(`${base}/sr_reactions/${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        Object.entries(json.fields || {}).forEach(([k, v]) => { counts[k] = Number(v.integerValue || 0); });
      }
    } catch { /* offline: show without counts */ }
    render();
  };

  const send = async (k, delta) => {
    const res = await fetch(`${base}:commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes: [{ transform: { document: docName, fieldTransforms: [{ fieldPath: k, increment: { integerValue: String(delta) } }] } }] }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const value = json.writeResults?.[0]?.transformResults?.[0]?.integerValue;
    if (value !== undefined) counts[k] = Number(value);
  };

  const busy = new Set();
  buttons.forEach((b) => b.addEventListener('click', async () => {
    const k = b.dataset.key;
    if (busy.has(k)) return;
    busy.add(k);
    const turningOn = !mine.has(k);
    mine.set(k, turningOn);
    counts[k] = Math.max(0, (counts[k] || 0) + (turningOn ? 1 : -1));
    render();
    try {
      await send(k, turningOn ? 1 : -1);
    } catch {
      if (turningOn) mine.set(k, false);
      await load();
    }
    busy.delete(k);
    render();
  }));

  box.hidden = false;
  render();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); }
    }, { rootMargin: '600px 0px' });
    io.observe(box);
  } else {
    load();
  }
})();
