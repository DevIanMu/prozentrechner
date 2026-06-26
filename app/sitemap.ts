import type { MetadataRoute } from 'next';
import { defaultLocale } from '@/i18n';
import { buildCanonicalUrl } from '@/lib/navigation';

const PATHS = [
  { path: '/', priority: 1.0 },
  { path: '/prozentwert/', priority: 0.8 },
  { path: '/prozentsatz/', priority: 0.8 },
  { path: '/grundwert/', priority: 0.8 },
  { path: '/prozentuale-veraenderung/', priority: 0.8 },
  { path: '/rabatt-berechnen/', priority: 0.8 },
  { path: '/mehrwertsteuer/', priority: 0.8 },
  { path: '/abzunahme/', priority: 0.8 },
  { path: '/impressum/', priority: 0.6 },
  { path: '/datenschutz/', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prozentrechner.de';
  const locale = defaultLocale;

  return PATHS.map(({ path, priority }) => ({
    url: buildCanonicalUrl(baseUrl, locale, path),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }));
}
