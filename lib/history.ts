export const HISTORY_KEY_PREFIX = 'prozentrechner_history_';

export const HISTORY_LIMIT = 20;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  inputs: Record<string, number>;
  result: number;
  mode: string;
}

function buildKey(mode: string): string {
  return `${HISTORY_KEY_PREFIX}${mode}`;
}

function generateId(): string {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

export function getHistory(mode: string): HistoryEntry[] {
  const raw = globalThis.localStorage.getItem(buildKey(mode));
  if (raw === null) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as HistoryEntry[];
    }
  } catch {
    // fall through to empty result
  }

  return [];
}

export function addHistoryEntry(
  mode: string,
  inputs: Record<string, number>,
  result: number,
): void {
  const entry: HistoryEntry = {
    id: generateId(),
    timestamp: Date.now(),
    inputs,
    result,
    mode,
  };

  const history = [entry, ...getHistory(mode)].slice(0, HISTORY_LIMIT);
  globalThis.localStorage.setItem(buildKey(mode), JSON.stringify(history));
}

export function clearHistory(mode: string): void {
  globalThis.localStorage.removeItem(buildKey(mode));
}
