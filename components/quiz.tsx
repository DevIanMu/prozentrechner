'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';
import type { Quiz } from '@/lib/content';
import { sendQuizAnswerEvent } from '@/lib/analytics';

export interface QuizProps {
  items: Quiz[];
  mode?: string;
}

interface QuizState {
  selectedIndex: number | null;
  isCorrect: boolean | null;
}

export function Quiz({ items, mode }: QuizProps) {
  const t = useTranslations('calculator');
  const [answers, setAnswers] = React.useState<Record<number, QuizState>>({});

  const liveMessage = React.useMemo(() => {
    const messages: string[] = [];
    items.forEach((_, itemIndex) => {
      const state = answers[itemIndex];
      if (state?.isCorrect === true) {
        messages.push(t('quiz.correct'));
      } else if (state?.isCorrect === false) {
        messages.push(t('quiz.incorrect'));
      }
    });
    return messages.join(' ');
  }, [answers, items, t]);

  const handleSelect = (itemIndex: number, optionIndex: number, correctIndex: number) => {
    const isCorrect = optionIndex === correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [itemIndex]: {
        selectedIndex: optionIndex,
        isCorrect,
      },
    }));

    if (mode) {
      sendQuizAnswerEvent(mode, itemIndex, isCorrect);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={"quiz-band w-full" /* print hook */}>
      <div aria-live="polite" className="sr-only" data-testid="quiz-live-region">
        {liveMessage}
      </div>
      <div className="space-y-6">
        {items.map((item, itemIndex) => {
          const state = answers[itemIndex];
          const hasAnswered = state !== undefined;

          return (
            <fieldset
              key={itemIndex}
              className="rounded-xl border border-hairline bg-canvas p-6"
            >
              <legend className="sr-only">{item.question}</legend>
              <p className="text-title-sm text-ink mb-4" aria-hidden="true">
                {item.question}
              </p>
              <div className="space-y-3">
                {item.options.map((option, optionIndex) => {
                  const isSelected = state?.selectedIndex === optionIndex;
                  const isCorrect = optionIndex === item.correctIndex;
                  const isWrongSelected = hasAnswered && isSelected && !isCorrect;
                  const isDisabled = hasAnswered && !isCorrect;

                  const labelClasses = [
                    'flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors',
                    isCorrect && hasAnswered
                      ? 'border-success bg-success/10 text-success'
                      : isWrongSelected
                        ? 'border-error bg-error/10 text-error'
                        : 'border-hairline bg-surface-soft hover:border-muted-soft',
                    isDisabled ? 'opacity-60 cursor-not-allowed' : '',
                  ].join(' ');

                  return (
                    <label key={optionIndex} className={labelClasses}>
                      <input
                        type="radio"
                        name={`quiz-${itemIndex}`}
                        value={optionIndex}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleSelect(itemIndex, optionIndex, item.correctIndex)}
                        className="h-4 w-4 accent-primary shrink-0"
                      />
                      <span className="flex-1 text-body-md">{option}</span>
                      {isCorrect && hasAnswered && (
                        <Check className="h-5 w-5 text-success shrink-0" aria-hidden="true" />
                      )}
                      {isWrongSelected && (
                        <X className="h-5 w-5 text-error shrink-0" aria-hidden="true" />
                      )}
                    </label>
                  );
                })}
              </div>
              {hasAnswered && (
                <div className="mt-4 pt-4 border-t border-hairline">
                  <p className="text-caption text-muted mb-1">{t('quiz.explanation')}</p>
                  <p className="text-body-md text-body">{item.explanation}</p>
                </div>
              )}
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}
