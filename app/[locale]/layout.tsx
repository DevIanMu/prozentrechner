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
        <script
          dangerouslySetInnerHTML={{
            __html: `document.write(\`<link rel="preload" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css" as="style" onload="this.rel='stylesheet'" />\`);`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css" />
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
