import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { TopNav } from '@/components/layout/top-nav';
import Footer from '@/components/layout/footer';
import { UsercentricsLoaderScript } from '@/components/consent/usercentrics-script';
import { GA4Script } from '@/components/analytics/ga4-script';
import { buildCanonicalUrl } from '@/lib/navigation';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prozentrechner100.com';
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
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonical,
      siteName: 'ProzentRechner',
      locale: 'de_DE',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 512,
          height: 512,
          alt: 'ProzentRechner',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/og-image.png`],
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
    <>
      <UsercentricsLoaderScript />
      <GA4Script />
      <NextIntlClientProvider messages={messages} locale={locale}>
        <TopNav />
        <main>{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </>
  );
}
