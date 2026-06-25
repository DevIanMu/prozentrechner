import { locales } from '@/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-display-sm">ProzentRechner</h1>
      <p className="text-body-md text-muted mt-4">Kostenloser Online-Prozentrechner</p>
    </main>
  );
}
