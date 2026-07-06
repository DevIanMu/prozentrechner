'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import type { FAQ } from '@/lib/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FAQBandProps {
  items: FAQ[];
}

export function FAQBand({ items }: FAQBandProps) {
  const t = useTranslations('calculator');

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-title-md text-ink mb-4">{t('faq.title')}</h2>
      <Accordion type="single" collapsible>
        {items.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-title-sm text-ink text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-body-md text-body">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
