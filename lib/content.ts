import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import * as yaml from 'js-yaml';

const FAQ_SCHEMA = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const QUIZ_SCHEMA = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1),
});

export const CALCULATOR_CONTENT_SCHEMA = z.object({
  mode: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  h1: z.string().min(1),
  intro: z.string().min(1),
  formulaGeneral: z.string().min(1),
  educationTitle: z.string().min(1),
  educationText: z.string().min(1),
  tip: z.string().min(1),
  warningTip: z.string().min(1).optional(),
  faq: z.array(FAQ_SCHEMA).min(1),
  quiz: z.array(QUIZ_SCHEMA).min(1),
  relatedModes: z.array(z.string().min(1)).min(1),
});

export type FAQ = z.infer<typeof FAQ_SCHEMA>;
export type Quiz = z.infer<typeof QUIZ_SCHEMA>;
export type CalculatorContent = z.infer<typeof CALCULATOR_CONTENT_SCHEMA>;

/**
 * Loads and validates a calculator content YAML file.
 *
 * @param mode - The calculation mode identifier (e.g. 'prozentwert').
 * @param locale - The locale identifier (e.g. 'de').
 * @returns Parsed and validated calculator content.
 * @throws When the file is missing or its contents fail validation.
 */
export function loadCalculatorContent(mode: string, locale: string): CalculatorContent {
  const filePath = path.join(process.cwd(), 'content', 'calculators', `${mode}.${locale}.yaml`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Calculator content not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = yaml.load(raw);

  const result = CALCULATOR_CONTENT_SCHEMA.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Invalid calculator content for ${mode}.${locale}: ${result.error.message}`
    );
  }

  return result.data;
}
