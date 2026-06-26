'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { modesById } from '@/lib/calculations';
import type { ModeId } from '@/lib/calculations/types';

const MODE_EXAMPLES: Record<ModeId, string> = {
  prozentwert: 'Wie viel sind 20 % von 500 €?',
  prozentsatz: 'Wie viel Prozent sind 100 von 500?',
  grundwert: '500 sind 20 %. Wie hoch ist der Grundwert?',
  'prozentuale-veraenderung': 'Von 80 auf 100 — wie groß ist die Veränderung?',
  'rabatt-berechnen': '20 % Rabatt auf 70 €.',
  mehrwertsteuer: '119 € brutto bei 19 % MwSt.',
  abzunahme: '200 € erhöht um 15 %.',
};

export interface RelatedCalculatorsProps {
  modeIds: string[];
  title?: string;
}

export function RelatedCalculators({ modeIds, title }: RelatedCalculatorsProps) {
  const t = useTranslations('calculator');
  const sectionTitle = title ?? t('relatedCalculators.title');

  const modes = React.useMemo(
    () => modeIds.map((id) => modesById[id]).filter(Boolean),
    [modeIds]
  );

  if (modes.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="text-title-md text-ink mb-4">{sectionTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <Link
            key={mode.id}
            href={mode.path}
            className="rounded-xl border border-hairline bg-canvas p-6 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <h3 className="text-title-sm text-ink mb-1">
              {t(mode.labelKey as Parameters<typeof t>[0])}
            </h3>
            <p className="text-body-sm text-muted">
              {MODE_EXAMPLES[mode.id as ModeId] ?? ''}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
