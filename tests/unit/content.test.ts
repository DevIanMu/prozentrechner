import { describe, it, expect } from 'vitest';
import { loadCalculatorContent } from '@/lib/content';

describe('loadCalculatorContent', () => {
  it('loads and validates the prozentwert.de content', () => {
    const content = loadCalculatorContent('prozentwert', 'de');

    expect(content.mode).toBe('prozentwert');
    expect(content.h1).toBe('Prozentwert berechnen');
    expect(content.metaTitle).toBeTruthy();
    expect(content.metaDescription).toBeTruthy();
    expect(content.intro).toBeTruthy();
    expect(content.formulaGeneral).toBeTruthy();
    expect(content.educationTitle).toBeTruthy();
    expect(content.educationText).toBeTruthy();
    expect(content.tip).toBeTruthy();
    expect(content.faq.length).toBeGreaterThanOrEqual(5);
    expect(content.quiz.length).toBeGreaterThanOrEqual(3);
    expect(content.relatedModes.length).toBeGreaterThanOrEqual(1);
  });

  it('throws for a missing content file', () => {
    expect(() => loadCalculatorContent('nonexistent', 'de')).toThrow(
      'Calculator content not found'
    );
  });
});
