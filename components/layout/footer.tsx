import { Percent } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { modes } from '@/lib/calculations';

export default async function Footer() {
  const tFooter = await getTranslations('footer');
  const tCalculator = await getTranslations('calculator');

  return (
    <footer className={"site-footer bg-surface-dark text-on-dark py-16" /* print hook */}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Logo + wordmark */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-title-sm">
              <Percent className="h-5 w-5" aria-hidden="true" />
              <span>ProzentRechner</span>
            </Link>
            <p className="text-body-sm text-on-dark-soft">
              {tFooter('tagline')}
            </p>
          </div>

          {/* Rechner */}
          <div className="flex flex-col gap-4">
            <h3 className="text-title-sm">{tFooter('calculators')}</h3>
            <nav className="flex flex-col gap-2">
              {modes.map((mode) => (
                <Link
                  key={mode.id}
                  href={mode.path}
                  className="text-body-sm text-on-dark-soft hover:text-on-dark transition-colors"
                >
                  {tCalculator(mode.labelKey as Parameters<typeof tCalculator>[0])}
                </Link>
              ))}
            </nav>
          </div>

          {/* Rechtliches */}
          <div className="flex flex-col gap-4">
            <h3 className="text-title-sm">{tFooter('legal')}</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/impressum"
                className="text-body-sm text-on-dark-soft hover:text-on-dark transition-colors"
              >
                {tFooter('impressum')}
              </Link>
              <Link
                href="/datenschutz"
                className="text-body-sm text-on-dark-soft hover:text-on-dark transition-colors"
              >
                {tFooter('datenschutz')}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-on-dark-soft/20">
          <p className="text-caption text-on-dark-soft">
            {tFooter('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
