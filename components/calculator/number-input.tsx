'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { parseGermanNumber, formatGermanNumber } from '@/lib/number-format';

export interface NumberInputProps {
  id: string;
  label: React.ReactNode;
  value: number | null;
  onChange: (value: number | null) => void;
  suffix?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  suffix,
  placeholder,
  inputMode = 'decimal',
}: NumberInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rawValue, setRawValue] = React.useState<string>(() =>
    value === null ? '' : formatGermanNumber(value)
  );

  React.useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setRawValue(value === null ? '' : formatGermanNumber(value));
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextRawValue = event.target.value;
    setRawValue(nextRawValue);
    onChange(parseGermanNumber(nextRawValue));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-body-sm font-medium text-body"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode={inputMode}
          value={rawValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'h-10 w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-md text-ink placeholder:text-muted-soft',
            'focus:border-ink focus:outline-none',
            suffix && 'pr-8'
          )}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-body-md text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
