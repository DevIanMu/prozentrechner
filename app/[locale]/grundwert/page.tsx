import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { loadCalculatorContent } from '@/lib/content';
import { CalculatorClient } from '@/components/calculator/calculator-client';
import { JsonLd } from '@/components/schema/json-ld';
import {
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
  const content = loadCalculatorContent('grundwert', locale);
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}/grundwert/`;

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

export default async function GrundwertPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const content = loadCalculatorContent('grundwert', locale);
  const t = await getTranslations('nav');
  const baseUrl = getBaseUrl();
  const breadcrumbItems = [
    { name: t('home'), url: `${baseUrl}/` },
    { name: content.h1, url: `${baseUrl}/grundwert/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildSoftwareApplicationSchema(content),
          buildFAQPageSchema(content.faq),
        ]}
      />
      <CalculatorClient
        modeId="grundwert"
        content={content}
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
}
