'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { sendCopyResultEvent } from '@/lib/analytics';

export interface ResultFieldProps {
  label: React.ReactNode;
  value: string;
  copyText?: string;
  mode?: string;
}

const COPY_FEEDBACK_MS = 2000;

export function ResultField({ label, value, copyText, mode }: ResultFieldProps) {
  const t = useTranslations('calculator');
  const [showCopied, setShowCopied] = React.useState(false);

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }

    const text = copyText ?? value;
    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);
    if (mode) {
      sendCopyResultEvent(mode);
    }
    setShowCopied(true);
    window.setTimeout(() => setShowCopied(false), COPY_FEEDBACK_MS);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-title-sm text-body">{label}</div>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex h-10 flex-1 items-center rounded-md border border-hairline bg-canvas px-3 py-2',
            'text-title-lg text-ink'
          )}
        >
          {value}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label={`${showCopied ? t('copied') : t('copy')}: ${value}`}
          className="shrink-0"
        >
          <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {showCopied ? t('copied') : t('copy')}
        </Button>
      </div>
    </div>
  );
}
