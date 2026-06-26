import * as React from 'react';

export type InputMap = Record<string, number | null>;

export interface CalculationStep {
  label: string;
  formula: string;
  result?: number;
}

export interface CalculationResult {
  inputs: InputMap;
  primaryResult: number | null;
  secondaryResults?: Record<string, number | null>;
  steps: CalculationStep[];
  formulaGeneral: string;
  formulaWithValues: string;
  warnings: string[];
}

export interface InputField {
  name: string;
  labelKey: string;
  suffix?: string;
  inputmode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
}

export interface ResultLabel {
  name: string;
  labelKey: string;
  suffix?: string;
  isPrimary?: boolean;
}

export interface CalculatorMode {
  id: string;
  path: string;
  labelKey: string;
  inputFields: InputField[];
  resultLabels: ResultLabel[];
  calculate: (inputs: InputMap) => CalculationResult;
}

export type ModeId =
  | 'prozentwert'
  | 'prozentsatz'
  | 'grundwert'
  | 'prozentuale-veraenderung'
  | 'rabatt-berechnen'
  | 'mehrwertsteuer'
  | 'abzunahme';
