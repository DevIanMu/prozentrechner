const INVALID_THOUSANDS_SEPARATOR = /\d{1,3}\.\d{3}/;

export function parseGermanNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const cleaned = trimmed
    .replace(/[\s\u20ac%]/g, '')
    .replace(/,/g, '.');
  if (INVALID_THOUSANDS_SEPARATOR.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function formatGermanNumber(value: number | null, options?: Intl.NumberFormatOptions): string {
  if (value === null || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, ...options }).format(value);
}

export function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatPercent(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '-';
  return `${formatGermanNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
}
