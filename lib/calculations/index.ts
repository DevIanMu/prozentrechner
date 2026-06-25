import type { CalculatorMode } from './types';
import { abzunahmeMode } from './abzunahme';
import { grundwertMode } from './grundwert';
import { mehrwertsteuerMode } from './mehrwertsteuer';
import { prozentsatzMode } from './prozentsatz';
import { prozentwertMode } from './prozentwert';
import { rabattMode } from './rabatt';
import { veraenderungMode } from './veraenderung';

export const modes: CalculatorMode[] = [
  prozentwertMode,
  prozentsatzMode,
  grundwertMode,
  veraenderungMode,
  rabattMode,
  mehrwertsteuerMode,
  abzunahmeMode,
];

export const modesById: Record<string, CalculatorMode> = Object.fromEntries(
  modes.map((mode) => [mode.id, mode])
);

export function getModeById(id: string): CalculatorMode | undefined {
  return modesById[id];
}
