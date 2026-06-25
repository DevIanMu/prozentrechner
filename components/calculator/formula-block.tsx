'use client';

import * as React from 'react';
import katex from 'katex';
import { cn } from '@/lib/utils';

export interface FormulaBlockProps {
  latex: string;
  className?: string;
}

export function FormulaBlock({ latex, className }: FormulaBlockProps) {
  const html = React.useMemo(
    () =>
      katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      }),
    [latex]
  );

  return (
    <div
      aria-hidden="true"
      className={cn(
        'overflow-x-auto rounded-md border border-hairline bg-canvas p-4 font-mono text-code text-ink',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
