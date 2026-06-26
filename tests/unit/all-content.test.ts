import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { modes } from '@/lib/calculations';
import { loadCalculatorContent } from '@/lib/content';

describe('all calculator content files', () => {
  it('loads and validates content for every registered mode', () => {
    expect(modes.length).toBeGreaterThan(0);

    for (const mode of modes) {
      const content = loadCalculatorContent(mode.id, 'de');

      expect(content.mode).toBe(mode.id);

      expect(content.metaTitle).toEqual(expect.any(String));
      expect(content.metaTitle.trim()).not.toBe('');

      expect(content.metaDescription).toEqual(expect.any(String));
      expect(content.metaDescription.trim()).not.toBe('');

      expect(content.h1).toEqual(expect.any(String));
      expect(content.h1.trim()).not.toBe('');

      expect(content.intro).toEqual(expect.any(String));
      expect(content.intro.trim()).not.toBe('');

      expect(content.formulaGeneral).toEqual(expect.any(String));
      expect(content.formulaGeneral.trim()).not.toBe('');

      expect(content.educationTitle).toEqual(expect.any(String));
      expect(content.educationTitle.trim()).not.toBe('');

      expect(content.educationText).toEqual(expect.any(String));
      expect(content.educationText.trim()).not.toBe('');

      expect(content.tip).toEqual(expect.any(String));
      expect(content.tip.trim()).not.toBe('');

      expect(Array.isArray(content.faq)).toBe(true);
      expect(content.faq.length).toBeGreaterThanOrEqual(1);
      for (const faq of content.faq) {
        expect(faq.question).toEqual(expect.any(String));
        expect(faq.question.trim()).not.toBe('');
        expect(faq.answer).toEqual(expect.any(String));
        expect(faq.answer.trim()).not.toBe('');
      }

      expect(Array.isArray(content.quiz)).toBe(true);
      expect(content.quiz.length).toBeGreaterThanOrEqual(1);
      for (const quiz of content.quiz) {
        expect(quiz.question).toEqual(expect.any(String));
        expect(quiz.question.trim()).not.toBe('');

        expect(Array.isArray(quiz.options)).toBe(true);
        expect(quiz.options.length).toBeGreaterThanOrEqual(2);
        for (const option of quiz.options) {
          expect(option).toEqual(expect.any(String));
          expect(option.trim()).not.toBe('');
        }

        expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
        expect(quiz.correctIndex).toBeLessThan(quiz.options.length);

        expect(quiz.explanation).toEqual(expect.any(String));
        expect(quiz.explanation.trim()).not.toBe('');
      }

      expect(Array.isArray(content.relatedModes)).toBe(true);
      expect(content.relatedModes.length).toBeGreaterThanOrEqual(3);
      for (const relatedMode of content.relatedModes) {
        expect(relatedMode).toEqual(expect.any(String));
        expect(relatedMode.trim()).not.toBe('');
      }
    }
  });

  it('has exactly one content file per registered mode', () => {
    const calculatorsDir = path.join(process.cwd(), 'content', 'calculators');
    const files = fs
      .readdirSync(calculatorsDir)
      .filter((file) => file.endsWith('.de.yaml'));

    expect(files).toHaveLength(modes.length);
    expect(files).toHaveLength(7);

    for (const mode of modes) {
      expect(files).toContain(`${mode.id}.de.yaml`);
    }
  });
});
