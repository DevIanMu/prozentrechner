import { describe, it, expect } from 'vitest';
import {
  buildBreadcrumbListSchema,
  buildSoftwareApplicationSchema,
  buildFAQPageSchema,
  buildWebSiteSchema,
  buildOrganizationSchema,
} from '@/lib/schema';
import type { CalculatorContent, FAQ } from '@/lib/content';

const mockContent: CalculatorContent = {
  mode: 'prozentwert',
  metaTitle: 'Prozentwert berechnen',
  metaDescription: 'Berechne den Prozentwert.',
  h1: 'Prozentwert berechnen',
  intro: 'Intro',
  formulaGeneral: 'W = G \\times \\frac{p}{100}',
  educationTitle: 'Was ist der Prozentwert?',
  educationText: 'Text',
  tip: 'Tipp',
  faq: [
    {
      question: 'Was ist der Prozentwert?',
      answer: 'Der absolute Betrag.',
    },
  ],
  quiz: [
    {
      question: 'Frage?',
      options: ['A', 'B'],
      correctIndex: 0,
      explanation: 'Erklärung',
    },
  ],
  relatedModes: ['rabatt-berechnen'],
};

describe('schema builders', () => {
  it('builds BreadcrumbList schema', () => {
    const schema = buildBreadcrumbListSchema([
      { name: 'Startseite', url: 'https://example.com/' },
      { name: 'Prozentwert', url: 'https://example.com/prozentwert/' },
    ]);

    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Startseite',
      item: 'https://example.com/',
    });
  });

  it('builds SoftwareApplication schema', () => {
    const schema = buildSoftwareApplicationSchema(mockContent);

    expect(schema['@type']).toBe('SoftwareApplication');
    expect(schema.name).toBe('Prozentwert berechnen');
    expect(schema.applicationCategory).toBe('FinanceApplication');
  });

  it('builds FAQPage schema', () => {
    const faq: FAQ[] = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' },
    ];
    const schema = buildFAQPageSchema(faq);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: 'Q1',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A1',
      },
    });
  });

  it('builds WebSite schema', () => {
    const schema = buildWebSiteSchema('https://example.com/');

    expect(schema['@type']).toBe('WebSite');
    expect(schema.url).toBe('https://example.com/');
  });

  it('builds Organization schema', () => {
    const schema = buildOrganizationSchema('https://example.com/');

    expect(schema['@type']).toBe('Organization');
    expect(schema.url).toBe('https://example.com/');
  });
});
