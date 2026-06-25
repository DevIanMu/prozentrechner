import { describe, it, expect } from 'vitest';
import {
  parseGermanNumber,
  formatGermanNumber,
  formatCurrency,
  formatPercent,
} from '@/lib/number-format';

describe('parseGermanNumber', () => {
  it('parses integer input', () => {
    expect(parseGermanNumber('500')).toBe(500);
  });

  it('parses comma decimal separator', () => {
    expect(parseGermanNumber('12,5')).toBe(12.5);
  });

  it('parses dot decimal separator', () => {
    expect(parseGermanNumber('12.5')).toBe(12.5);
  });

  it('strips percent suffix', () => {
    expect(parseGermanNumber('20%')).toBe(20);
  });

  it('strips euro suffix', () => {
    expect(parseGermanNumber('100 €')).toBe(100);
  });

  it('returns null for empty string', () => {
    expect(parseGermanNumber('')).toBeNull();
  });

  it('returns null for invalid input', () => {
    expect(parseGermanNumber('abc')).toBeNull();
  });

  it('rejects thousands separator', () => {
    expect(parseGermanNumber('1.234')).toBeNull();
  });
});

describe('formatGermanNumber', () => {
  it('formats a number with de-DE locale', () => {
    expect(formatGermanNumber(1234.56)).toBe('1.234,56');
  });

  it('returns an em dash for null', () => {
    expect(formatGermanNumber(null)).toBe('-');
  });
});

describe('formatCurrency', () => {
  it('formats a number as EUR currency', () => {
    expect(formatCurrency(100)).toBe('100,00\u00a0€');
  });
});

describe('formatPercent', () => {
  it('formats a number as percent', () => {
    expect(formatPercent(25)).toBe('25,00 %');
  });
});
