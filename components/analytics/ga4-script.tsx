const PLACEHOLDER_GA4_ID = 'YOUR_GA4_ID';
const GA4_ID_REGEX = /^G-[A-Z0-9]+$/i;

function isValidGa4Id(id: string): boolean {
  return GA4_ID_REGEX.test(id);
}

export function GA4Script() {
  const envId = process.env.NEXT_PUBLIC_GA4_ID?.trim();
  const gaId = envId || PLACEHOLDER_GA4_ID;

  if (!gaId || gaId === PLACEHOLDER_GA4_ID || !isValidGa4Id(gaId)) {
    return null;
  }

  const inlineSnippet = `
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('config', '${gaId}');

    window.addEventListener('ucEvent', function (event) {
      if (!event.detail || event.detail.event !== 'consent_status' || event.detail.type !== 'explicit') {
        return;
      }

      var detail = event.detail;
      var consentUpdate = {};
      var serviceMap = {
        'Google Analytics 4': 'analytics_storage',
        'Google Analytics': 'analytics_storage',
        'Google Ads': 'ad_storage',
        'Google Ads Conversion Tracking': 'ad_storage',
        'Google Ads Remarketing': 'ad_storage',
        'Display & Video 360': 'ad_storage',
        'Google Campaign Manager 360': 'ad_storage',
        'Search Ads 360': 'ad_storage',
        'Conversion Linker': 'ad_storage'
      };
      var directKeys = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'];

      function toConsent(value) {
        if (value === true || value === 'granted') return 'granted';
        if (value === false || value === 'denied') return 'denied';
        return undefined;
      }

      var sources = [detail, detail.dataServices, detail.data];
      for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        if (!source || typeof source !== 'object') continue;
        Object.keys(source).forEach(function (key) {
          var value = toConsent(source[key]);
          if (value === undefined) return;
          if (serviceMap[key]) {
            consentUpdate[serviceMap[key]] = value;
          } else if (directKeys.indexOf(key) !== -1) {
            consentUpdate[key] = value;
          }
        });
      }

      if (consentUpdate.ad_storage !== undefined) {
        if (consentUpdate.ad_user_data === undefined) {
          consentUpdate.ad_user_data = consentUpdate.ad_storage;
        }
        if (consentUpdate.ad_personalization === undefined) {
          consentUpdate.ad_personalization = consentUpdate.ad_storage;
        }
      }

      if (Object.keys(consentUpdate).length > 0) {
        window.gtag('consent', 'update', consentUpdate);
      }
    });
  `;

  return (
    <>
      <script id="gtag-init" dangerouslySetInnerHTML={{ __html: inlineSnippet }} />
      <script
        id="gtag-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        async
      />
    </>
  );
}
