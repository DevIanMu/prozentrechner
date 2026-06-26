import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { JsonLd } from '@/components/schema/json-ld';
import { buildBreadcrumbListSchema } from '@/lib/schema';
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
  const t = await getTranslations({ locale, namespace: 'datenschutz' });
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}/datenschutz/`;

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

export default async function DatenschutzPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'datenschutz' });
  const tNav = await getTranslations('nav');
  const baseUrl = getBaseUrl();

  const breadcrumbItems = [
    { name: tNav('home'), url: `${baseUrl}/` },
    { name: t('title'), url: `${baseUrl}/datenschutz/` },
  ];

  /*
    NOTE: The legal details below are placeholder values read from
    messages/de.json under the `datenschutz.placeholders` object.
    Update messages/de.json with the real data before launch.
  */

  const scopeParagraphs = t.raw('scopeText') as string[];
  const responsibleParagraphs = t.raw('responsibleText') as string[];
  const serverLogsParagraphs = t.raw('serverLogsText') as string[];
  const localStorageParagraphs = t.raw('localStorageText') as string[];
  const googleAnalyticsParagraphs = t.raw('googleAnalyticsText') as string[];
  const usercentricsParagraphs = t.raw('usercentricsText') as string[];
  const noPiiParagraphs = t.raw('noPiiText') as string[];
  const userRightsParagraphs = t.raw('userRightsText') as string[];
  const contactParagraphs = t.raw('contactText') as string[];
  const legalReviewParagraphs = t.raw('legalReviewText') as string[];

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
                {t('sections.scope')}
              </h2>
              <div className="space-y-4">
                {scopeParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.responsible')}
              </h2>
              <div className="space-y-4">
                {responsibleParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
                <p className="text-body-md text-body">
                  {t('placeholders.responsibleParty')}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.serverLogs')}
              </h2>
              <div className="space-y-4">
                {serverLogsParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
                <p className="text-body-md text-body">
                  {t('placeholders.hostingProvider')}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.localStorage')}
              </h2>
              <div className="space-y-4">
                {localStorageParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.googleAnalytics')}
              </h2>
              <div className="space-y-4">
                {googleAnalyticsParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.usercentrics')}
              </h2>
              <div className="space-y-4">
                {usercentricsParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.noPii')}
              </h2>
              <div className="space-y-4">
                {noPiiParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.userRights')}
              </h2>
              <div className="space-y-4">
                {userRightsParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.contact')}
              </h2>
              <div className="space-y-4">
                {contactParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
                <p className="text-body-md text-body">
                  <a
                    href={`mailto:${t('placeholders.email')}`}
                    className="text-brand-accent hover:underline"
                  >
                    {t('placeholders.email')}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-title-sm text-ink mb-2">
                {t('sections.legalReview')}
              </h2>
              <div className="space-y-4">
                {legalReviewParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-md text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
