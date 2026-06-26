import { createNavigation } from 'next-intl/navigation';
import { locales } from '@/i18n';

export const { Link, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix: 'always',
});

export function buildCanonicalUrl(baseUrl: string, locale: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const withLocale = normalizedPath === '/' ? `/${locale}/` : `/${locale}${normalizedPath}`;
  return `${normalizedBase}${withLocale}`;
}
