import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { loadCalculatorContent } from '@/lib/content';
import { CalculatorClient } from '@/components/calculator/calculator-client';
import { JsonLd } from '@/components/schema/json-ld';
import {
  buildBreadcrumbListSchema,
  buildSoftwareApplicationSchema,
  buildFAQPageSchema,
} from '@/lib/schema';
import { locales } from '@/i18n';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://prozentrechner.de';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const content = loadCalculatorContent('rabatt-berechnen', locale);
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}/rabatt-berechnen/`;

  return {
    title: content.metaTitle,
    description: content.metaDescription,
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

export default async function RabattPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = loadCalculatorContent('rabatt-berechnen', locale);
  const t = await getTranslations('nav');
  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbListSchema([
            { name: t('home'), url: `${baseUrl}/` },
            { name: content.h1, url: `${baseUrl}/rabatt-berechnen/` },
          ]),
          buildSoftwareApplicationSchema(content),
          buildFAQPageSchema(content.faq),
        ]}
      />
      <CalculatorClient modeId="rabatt-berechnen" content={content} />
    </>
  );
}
