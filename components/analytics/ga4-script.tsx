const PLACEHOLDER_GA4_ID = 'YOUR_GA4_ID';

export function GA4Script() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID?.trim() || PLACEHOLDER_GA4_ID;

  if (!gaId || gaId === PLACEHOLDER_GA4_ID) {
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
