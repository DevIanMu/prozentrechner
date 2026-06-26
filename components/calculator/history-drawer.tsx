'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  getHistory,
  clearHistory,
  type HistoryEntry,
} from '@/lib/history';
import { formatGermanNumber } from '@/lib/number-format';

export interface HistoryDrawerProps {
  mode: string;
  onSelect: (inputs: Record<string, number>) => void;
}

function formatHistoryItem(item: HistoryEntry): string {
  const inputs = Object.entries(item.inputs)
    .map(([key, value]) => `${key}=${formatGermanNumber(value)}`)
    .join(', ');
  return `${inputs} → ${formatGermanNumber(item.result)}`;
}

export function HistoryDrawer({ mode, onSelect }: HistoryDrawerProps) {
  const t = useTranslations('calculator');
  const [expanded, setExpanded] = React.useState(false);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);

  const refresh = React.useCallback(() => {
    setHistory(getHistory(mode));
  }, [mode]);

  React.useEffect(() => {
    refresh();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === `prozentrechner_history_${mode}`) {
        refresh();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [mode, refresh]);

  const handleClear = () => {
    clearHistory(mode);
    setHistory([]);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-hairline bg-surface-card">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-4 py-3 text-left',
          'text-body-md font-medium text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        aria-expanded={expanded}
      >
        <span>
          {t('history')} ({history.length})
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-hairline-soft px-4 py-3">
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.inputs)}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left text-body-sm text-body',
                    'hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
                  )}
                >
                  {formatHistoryItem(item)}
                </button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="mt-3 text-error"
          >
            <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t('clearHistory')}
          </Button>
        </div>
      )}
    </div>
  );
}
