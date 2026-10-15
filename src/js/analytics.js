// Local bootstrap only. No vendor code or requests until Analytics is accepted.
(() => {
  if (!window.srConsent) return;
  const config = document.currentScript?.dataset || {};
  const ga4 = (config.ga4Id || '').trim();
  const clarityId = (config.clarityId || '').trim();
  const hasGA4 = /^G-[A-Z0-9]+$/.test(ga4) && !/^G-X+$/.test(ga4);
  const hasClarity = /^[a-z0-9]+$/i.test(clarityId) && !/^X+$/i.test(clarityId);
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  // Share the default with ads.js so saved acceptance is never reset to denied.
  if (!window.srGoogleConsentInitialized) {
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied',
      ad_personalization: 'denied', analytics_storage: 'denied',
    });
    window.srGoogleConsentInitialized = true;
  }
  let gaLoaded = false, clarityLoaded = false, wasGranted = false, reloading = false;
  const inject = src => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  };
  const update = decision => {
    if (reloading) return;
    const granted = decision?.analytics === true;
    if (hasGA4) window['ga-disable-' + ga4] = !granted;
    gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    if (granted && hasGA4 && !gaLoaded) {
      gaLoaded = true;
      gtag('js', new Date());
      gtag('config', ga4);
      inject('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4));
    }
    if (granted && hasClarity && !clarityLoaded) {
      clarityLoaded = true;
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      // Analytics acceptance does not grant Microsoft's advertising storage.
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
      inject('https://www.clarity.ms/tag/' + encodeURIComponent(clarityId));
    } else if (clarityLoaded) {
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: granted ? 'granted' : 'denied' });
    }
    // Denied vendor modes can still send cookieless traffic. Discard executed
    // libraries and pending loads on withdrawal; the saved decision gates reload.
    if (wasGranted && !granted) {
      reloading = true;
      window.location.reload();
    }
    wasGranted = granted;
  };
  window.srConsent.onChange(update);
  update(window.srConsent.get());
})();
