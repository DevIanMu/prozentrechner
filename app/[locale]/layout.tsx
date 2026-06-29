import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { TopNav } from '@/components/layout/top-nav';
import Footer from '@/components/layout/footer';
import { UsercentricsScript } from '@/components/consent/usercentrics-script';
import { GA4Script } from '@/components/analytics/ga4-script';
import { buildCanonicalUrl } from '@/lib/navigation';
import './globals.css';

const KATEX_CSS = 'https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css';
const KATEX_CSS_INTEGRITY = 'sha384-OLBgp1GsljhM2TJ+sbHjaiH9txEUvgdDTAzHv2P24donTt6/529l+9Ua0vFImLlb';

const inter = localFont({
  src: '../fonts/Inter-latin.woff2',
  variable: '--font-inter',
  display: 'swap',
});
const jetbrainsMono = localFont({
  src: '../fonts/JetBrainsMono-latin.woff2',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prozentrechner.de';
  const canonical = buildCanonicalUrl(baseUrl, locale, '/');
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        'de-DE': canonical,
        'de-AT': canonical,
        'de-CH': canonical,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://app.usercentrics.eu" />
        <link rel="preconnect" href="https://app.usercentrics.eu" crossOrigin="anonymous" />
        <link rel="preload" href={KATEX_CSS} as="style" integrity={KATEX_CSS_INTEGRITY} crossOrigin="anonymous" />
        <link
          id="katex-style"
          rel="stylesheet"
          href={KATEX_CSS}
          media="print"
          integrity={KATEX_CSS_INTEGRITY}
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.getElementById('katex-style');if(l){l.onload=function(){this.media='all';};if(l.sheet){l.media='all';}}})();`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href={KATEX_CSS} integrity={KATEX_CSS_INTEGRITY} crossOrigin="anonymous" />
        </noscript>
        <UsercentricsScript />
        <GA4Script />
      </head>
      <body className="font-sans antialiased bg-canvas text-ink">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <TopNav />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
