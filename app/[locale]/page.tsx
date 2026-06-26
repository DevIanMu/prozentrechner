import type { Metadata } from 'next';
import { getTranslations, getMessages } from 'next-intl/server';
import { UniversalCalculator } from '@/components/calculator/universal-calculator';
import { RelatedCalculators } from '@/components/related-calculators';
import { FAQBand } from '@/components/faq-band';
import { JsonLd } from '@/components/schema/json-ld';
import { buildWebSiteSchema, buildOrganizationSchema } from '@/lib/schema';
import { locales } from '@/i18n';
import { buildCanonicalUrl } from '@/lib/navigation';
import type { FAQ } from '@/lib/content';

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
  const t = await getTranslations({ locale, namespace: 'home' });
  const baseUrl = getBaseUrl();
  const canonical = buildCanonicalUrl(baseUrl, locale, '/');

  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
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

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const messages = await getMessages({ locale });
  const baseUrl = getBaseUrl();

  const differentiators = t.raw('differentiators') as Array<{
    title: string;
    description: string;
  }>;
  const educationParagraphs = (t('educationText') as string)
    .split('\n\n')
    .filter(Boolean);
  const faqItems = (messages.home?.faq as FAQ[]) ?? [];

  return (
    <>
      <JsonLd
        data={[buildWebSiteSchema(baseUrl), buildOrganizationSchema(baseUrl)]}
      />

      {/* Hero band */}
      <section className="bg-canvas py-12 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-display-md text-ink">{t('heroTitle')}</h1>
          <p className="mt-4 text-body-md text-muted max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Universal calculator */}
      <UniversalCalculator />

      {/* Differentiator band */}
      <section className="bg-canvas py-12 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-title-md text-ink mb-8 text-center">
            {t('differentiatorTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-hairline bg-surface-card p-6"
              >
                <h3 className="text-title-sm text-ink mb-2">{item.title}</h3>
                <p className="text-body-md text-body">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All calculators grid */}
      <section className="bg-surface-soft py-12 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-title-md text-ink mb-8">
            {t('allCalculatorsTitle')}
          </h2>
          <RelatedCalculators
            modeIds={[
              'prozentwert',
              'prozentsatz',
              'grundwert',
              'prozentuale-veraenderung',
              'rabatt-berechnen',
              'mehrwertsteuer',
              'abzunahme',
            ]}
          />
        </div>
      </section>

      {/* Education + FAQ band */}
      <section className="bg-canvas py-12 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-title-md text-ink mb-4">
              {t('educationTitle')}
            </h2>
            <div className="space-y-4">
              {educationParagraphs.map((paragraph, index) => (
                <p key={index} className="text-body-md text-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <FAQBand items={faqItems} />
        </div>
      </section>
    </>
  );
}
