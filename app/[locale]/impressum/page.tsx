import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { JsonLd } from '@/components/schema/json-ld';
import { buildBreadcrumbListSchema } from '@/lib/schema';
import { locales } from '@/i18n';
import { buildCanonicalUrl } from '@/lib/navigation';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prozentrechner100.com';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'impressum' });
  const baseUrl = getBaseUrl();
  const canonical = buildCanonicalUrl(baseUrl, locale, '/impressum/');

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
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

export default async function ImpressumPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'impressum' });
  const tNav = await getTranslations('nav');
  const baseUrl = getBaseUrl();
  const canonical = buildCanonicalUrl(baseUrl, locale, '/impressum/');

  const breadcrumbItems = [
    { name: tNav('home'), url: buildCanonicalUrl(baseUrl, locale, '/') },
    { name: t('title'), url: canonical },
  ];

  /*
    NOTE: The legal details below are placeholder values read from
    messages/de.json under the `impressum.placeholders` object.
    Update messages/de.json with the real data before launch.
  */

  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbItems)} />

      <section className="bg-canvas py-12 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-display-sm text-ink">{t('title')}</h1>

          <div className="mt-8 max-w-3xl space-y-8">
            <p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-body-md text-ink">
              {t('placeholderNotice')}
            </p>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.owner')}
              </h2>
              <p className="text-body-md text-body">
                {t('placeholders.ownerName')}
              </p>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.address')}
              </h2>
              <address className="not-italic text-body-md text-body">
                <p>{t('placeholders.street')}</p>
                <p>{t('placeholders.city')}</p>
                <p>{t('placeholders.country')}</p>
              </address>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.contact')}
              </h2>
              <p className="text-body-md text-body">
                {t('emailLabel')}{' '}
                <a
                  href={`mailto:${t('placeholders.email')}`}
                  className="text-brand-accent hover:underline"
                >
                  {t('placeholders.email')}
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.responsible')}
              </h2>
              <p className="text-body-md text-body">
                {t('placeholders.responsiblePerson')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
