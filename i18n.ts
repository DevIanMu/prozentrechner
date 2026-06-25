import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export default getRequestConfig(async ({ locale }) => {
  // During static export there is no active request, so next-intl can't
  // provide a locale. Fall back to the default locale for this German-only app.
  const activeLocale = locale ?? defaultLocale;
  if (!locales.includes(activeLocale as Locale)) notFound();
  const validLocale = activeLocale as Locale;
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
