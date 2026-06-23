# ProzentRechner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build a German-language percentage calculator website with real-time computation, step-by-step explanations, session history, and SEO-optimized pages for each of the 7 calculation modes.

**Architecture:** Statically generated Next.js 14 App Router site with `[locale]` routing (German-only at launch), client-side calculator components for interactivity, YAML content files as the single source of truth for page copy/FAQ/quiz/related modes, and a small calculation engine tested with Vitest. State is local React state plus localStorage for per-mode history; URL hash syncs inputs for sharing.

**Tech Stack:** Next.js 14+ (App Router, SSG), TypeScript, Tailwind CSS, shadcn/ui, next-intl, KaTeX, Lucide React, Inter + JetBrains Mono (next/font), Vitest, React Testing Library, Playwright, Lighthouse CI, Vercel.

---

## Reference Documents

- Design specification: `docs/superpowers/specs/2026-06-10-prozentrechner-design.md`
- Competitor research: `prozentrechner-net-research.md`
- Visual analysis: `DESIGN-cal.md`
- Prototypes (read-only, will be deleted before launch): `prototypes/`

---

## File Structure Map

| Path | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root layout without locale; redirects to default locale via middleware. |
| `app/[locale]/layout.tsx` | Locale-aware layout: fonts, metadata, JSON-LD globals, providers. |
| `app/[locale]/page.tsx` | Homepage with UniversalCalculator and SEO bands. |
| `app/[locale]/prozentwert/page.tsx` | Prozentwert calculator page (SSG, reads YAML). |
| `app/[locale]/prozentsatz/page.tsx` | Prozentsatz calculator page. |
| `app/[locale]/grundwert/page.tsx` | Grundwert calculator page. |
| `app/[locale]/prozentuale-veraenderung/page.tsx` | Prozentuale Veraenderung page. |
| `app/[locale]/rabatt-berechnen/page.tsx` | Rabatt page. |
| `app/[locale]/mehrwertsteuer/page.tsx` | Mehrwertsteuer page. |
| `app/[locale]/abzunahme/page.tsx` | Ab-/Zunahme page. |
| `app/[locale]/impressum/page.tsx` | Legal imprint page. |
| `app/[locale]/datenschutz/page.tsx` | Privacy policy page. |
| `app/[locale]/globals.css` | Tailwind directives, KaTeX CSS import, print styles. |
| `components/ui/*` | shadcn/ui primitives. |
| `components/layout/top-nav.tsx` | Sticky top navigation with mobile sheet. |
| `components/layout/footer.tsx` | Dark footer with link columns. |
| `components/layout/breadcrumb.tsx` | Schema.org BreadcrumbList + visual breadcrumb. |
| `components/calculator/calculator-card.tsx` | Per-mode calculator shell. |
| `components/calculator/number-input.tsx` | German-number-aware input. |
| `components/calculator/result-field.tsx` | Result display with copy button. |
| `components/calculator/explanation-panel.tsx` | Formula block + step-by-step + tip. |
| `components/calculator/history-drawer.tsx` | Per-mode history list. |
| `components/calculator/universal-calculator.tsx` | Homepage conversational calculator wall. |
| `components/calculator/calculator-client.tsx` | Client wrapper wiring card, panel, hash sync. |
| `components/quiz.tsx` | Interactive quiz with radio options. |
| `components/faq-band.tsx` | FAQ accordion + FAQPage JSON-LD. |
| `components/related-calculators.tsx` | 3-up related mode cards. |
| `components/schema/json-ld.tsx` | Helper to inject JSON-LD scripts. |
| `lib/calculations/*.ts` | Calculation engines and registry. |
| `lib/number-format.ts` | German number parsing/formatting. |
| `lib/history.ts` | localStorage history CRUD + cross-tab sync. |
| `lib/schema.ts` | Schema.org JSON-LD builders. |
| `lib/content.ts` | YAML content loader and validation. |
| `lib/hooks/use-debounce.ts` | Debounce hook. |
| `lib/hooks/use-url-hash.ts` | Sync input state to URL hash. |
| `lib/utils.ts` | Tailwind cn helper. |
| `content/calculators/*.de.yaml` | One YAML file per mode. |
| `messages/de.json` | next-intl UI strings. |
| `tests/unit/*.test.ts` | Vitest unit tests. |
| `tests/components/*.test.tsx` | React Testing Library tests. |
| `tests/e2e/*.spec.ts` | Playwright tests. |
| `middleware.ts` | next-intl locale negotiation. |
| `i18n.ts` | next-intl routing config. |
| `next.config.js` | Static export config. |
| `tailwind.config.ts` | Design tokens. |
| `vitest.config.ts` | Vitest setup. |
| `playwright.config.ts` | Playwright setup. |
| `lighthouserc.js` | Lighthouse CI assertions. |
| `.github/workflows/ci.yml` | CI workflow. |


---

## Phase 1 — Skeleton

### Task 1: Initialize Next.js project with TypeScript and Tailwind

**Files:**
- Create: project root (all generated files)

- [ ] **Step 1: Create Next.js project**

Run:

```bash
cd d:/Projects/Prozentrechner
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

Expected: `package.json`, `app/`, `public/`, `tailwind.config.ts`, `tsconfig.json`, etc. are created.

- [ ] **Step 2: Verify dev server**

Run:

```bash
npm run dev
```

Expected: Development server starts on `http://localhost:3000` and renders the default Next.js page.

- [ ] **Step 3: Commit skeleton**

```bash
git add .
git commit -m "chore: initialize Next.js 14 + TypeScript + Tailwind"
```

---

### Task 2: Configure static export

**Files:**
- Modify: `next.config.js`

- [ ] **Step 1: Replace generated config with static-export config**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
```

- [ ] **Step 2: Delete default `next.config.mjs` if it exists**

```bash
rm -f next.config.mjs
```

- [ ] **Step 3: Verify static build succeeds**

```bash
npm run build
```

Expected: Build completes and `dist/` contains static HTML.

- [ ] **Step 4: Commit**

```bash
git add next.config.js
git commit -m "chore: configure static export"
```

---

### Task 3: Initialize shadcn/ui

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/*`
- Modify: `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 1: Run shadcn init**

```bash
npx shadcn@latest init -y -d
```

Expected: `components.json`, `lib/utils.ts`, and updated Tailwind config are created.

- [ ] **Step 2: Install required shadcn components**

```bash
npx shadcn@latest add button input accordion sheet dropdown-menu separator label
```

Expected: Components exist in `components/ui/`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize shadcn/ui and add base components"
```

---

### Task 4: Map design tokens in Tailwind config

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace generated Tailwind config with design tokens**

Use the tokens from the design specification: colors primary #111111, surface-card #f5f5f5, etc. Define font sizes display-xl through caption, border radii xs through pill, spacing xxs through section, and box shadows card / card-hover. Reference `DESIGN-cal.md` for exact values.

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "chore: map Cal.com design tokens to Tailwind"
```

---

### Task 5: Add self-hosted Inter and JetBrains Mono fonts

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace default root layout**

```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'ProzentRechner',
  description: 'Kostenloser Online-Prozentrechner',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-canvas text-ink">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "chore: self-host Inter and JetBrains Mono via next/font"
```

---

### Task 6: Install and configure next-intl

**Files:**
- Create: `i18n.ts`, `middleware.ts`, `messages/de.json`
- Modify: `app/layout.tsx` (later `app/[locale]/layout.tsx`)

- [ ] **Step 1: Install next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Create i18n config**

Create `i18n.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return { messages: (await import(`./messages/${locale}.json`)).default };
});
```

- [ ] **Step 3: Create middleware**

Create `middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

export default createMiddleware({ locales, defaultLocale, localePrefix: 'always' });
export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] };
```

- [ ] **Step 4: Create German message file**

Create `messages/de.json` with keys for metadata, nav, calculator (result, copy, copied, history, clearHistory, showMore, showLess, formula, steps, tip, all input labels), errors, footer.

- [ ] **Step 5: Reorganize app folder for `[locale]` routing**

```bash
mkdir -p app/[locale]
mv app/page.tsx app/[locale]/page.tsx
mv app/layout.tsx app/[locale]/layout.tsx
mv app/globals.css app/[locale]/globals.css
```

- [ ] **Step 6: Update locale layout to use NextIntlClientProvider**

Use `getMessages` from `next-intl/server` and wrap children in `NextIntlClientProvider`.

- [ ] **Step 7: Add root layout fallback**

Create `app/layout.tsx` returning children.

- [ ] **Step 8: Build and verify**

```bash
npm run build
```

Expected: Build succeeds and `/de/` route is generated in `dist/`.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat(i18n): add next-intl with German-only locale routing"
```

---

### Task 7: Set up Vitest and React Testing Library

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install testing dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create Vitest config**

Create `vitest.config.ts` with react plugin, jsdom environment, globals, setup file, and `@` alias.

- [ ] **Step 3: Create test setup**

Create `tests/setup.ts` importing `@testing-library/jest-dom`.

- [ ] **Step 4: Add test scripts**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 5: Run smoke test**

```bash
npx vitest run --reporter=verbose
```

Expected: Vitest starts with 0 tests and exits successfully.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore(tests): setup Vitest and React Testing Library"
```

---

### Task 8: Set up Playwright

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create Playwright config**

Use baseURL `http://localhost:3000`, chromium project, webServer `npm run dev`.

- [ ] **Step 3: Create smoke E2E test**

Create `tests/e2e/smoke.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads in German locale', async ({ page }) => {
  await page.goto('/de/');
  await expect(page.locator('h1')).toContainText('ProzentRechner');
});
```

- [ ] **Step 4: Run smoke test**

```bash
npx playwright test tests/e2e/smoke.spec.ts
```

Expected: Test passes.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore(tests): setup Playwright and homepage smoke test"
```

---

### Task 9: Set up Lighthouse CI

**Files:**
- Create: `lighthouserc.js`, `.github/workflows/ci.yml`

- [ ] **Step 1: Install Lighthouse CI**

```bash
npm install -D @lhci/cli
```

- [ ] **Step 2: Create Lighthouse CI config**

Create `lighthouserc.js` collecting `/de/` and `/de/prozentwert/`. Assert performance >= 90 (warn), accessibility >= 95 (error), best-practices >= 100, seo >= 100.

- [ ] **Step 3: Create CI workflow**

Create `.github/workflows/ci.yml` running `npm ci`, `npm run lint`, `npx vitest run`, `npm run build`, `npx lhci autorun`.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore(ci): add Lighthouse CI and GitHub Actions workflow"
```

---

### Task 10: Create content file schema and loader

**Files:**
- Create: `lib/content.ts`, `content/calculators/prozentwert.de.yaml`
- Install: `js-yaml`, `@types/js-yaml`, `zod`

- [ ] **Step 1: Install dependencies**

```bash
npm install js-yaml zod
npm install -D @types/js-yaml
```

- [ ] **Step 2: Define content schema**

Create `lib/content.ts` with Zod schemas for quiz, faq, and calculator content. Export `CalculatorContent` type and `loadCalculatorContent(mode, locale)`.

- [ ] **Step 3: Create first content file**

Create `content/calculators/prozentwert.de.yaml` with mode, metaTitle, metaDescription, h1, intro, formulaGeneral, educationTitle, educationText, tip, faq array, quiz array, relatedModes array.

- [ ] **Step 4: Add unit test**

Create `tests/unit/content.test.ts` asserting content loads and validates.

- [ ] **Step 5: Run test**

```bash
npx vitest run tests/unit/content.test.ts
```

Expected: Test passes.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat(content): add YAML content schema, loader and first mode content"
```


---

## Phase 2 — Calculation Core (TDD)

### Task 11: Implement German number parsing and formatting (tests first)

**Files:**
- Create: `lib/number-format.ts`, `tests/unit/number-format.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/number-format.test.ts` covering:
- integer parsing
- comma decimal separator
- dot decimal separator
- percent suffix stripping
- euro suffix stripping
- empty string returns null
- invalid input returns null
- thousands separator rejection
- formatGermanNumber with de-DE
- em dash for null
- formatCurrency
- formatPercent

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run tests/unit/number-format.test.ts
```

Expected: FAIL - modules not found.

- [ ] **Step 3: Implement utilities**

Create `lib/number-format.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run tests/unit/number-format.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): add German number parsing and formatting with tests"
```

---

### Task 12: Define calculation types

**Files:**
- Create: `lib/calculations/types.ts`

- [ ] **Step 1: Create types**

Create `lib/calculations/types.ts` with:
- `InputMap = Record<string, number | null>`
- `CalculationStep { label, formula, result? }`
- `CalculationResult { inputs, primaryResult, secondaryResults?, steps, formulaGeneral, formulaWithValues, warnings }`
- `InputField { name, labelKey, suffix?, inputmode?, placeholder? }`
- `ResultLabel { name, labelKey, suffix?, isPrimary? }`
- `CalculatorMode { id, path, labelKey, inputFields, resultLabels, calculate }`
- `ModeId` union of all 7 modes

- [ ] **Step 2: Commit**

```bash
git add lib/calculations/types.ts
git commit -m "feat(core): define calculation types and mode interfaces"
```

---

### Task 13: Implement Prozentwert calculation (tests first)

**Files:**
- Create: `lib/calculations/prozentwert.ts`, `tests/unit/prozentwert.test.ts`

- [ ] **Step 1: Write tests**

Test 20% of 500 = 100, missing inputs return null, step breakdown present, mode has 2 input fields.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/calculations/prozentwert.ts` exporting `calculateProzentwert` and `prozentwertMode`.
Formula: W = G * p / 100. Inputs G with euro suffix, p with percent suffix. Result W with euro suffix, primary.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): implement Prozentwert calculation with tests"
```

---

### Task 14: Implement Prozentsatz calculation (tests first)

**Files:**
- Create: `lib/calculations/prozentsatz.ts`, `tests/unit/prozentsatz.test.ts`

- [ ] **Step 1: Write tests**

Test 100 of 500 = 20%, missing inputs null, division by zero warning.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/calculations/prozentsatz.ts`. Formula: p% = W / G * 100. Inputs W and G both with euro suffix. Result p% with percent suffix.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): implement Prozentsatz calculation with tests"
```

---

### Task 15: Implement Grundwert calculation (tests first)

**Files:**
- Create: `lib/calculations/grundwert.ts`, `tests/unit/grundwert.test.ts`

- [ ] **Step 1: Write tests**

Test 20% = 100 gives 500, zero percentage warns.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/calculations/grundwert.ts`. Formula: G = W / p * 100.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): implement Grundwert calculation with tests"
```

---

### Task 16: Implement Prozentuale Veraenderung calculation (tests first)

**Files:**
- Create: `lib/calculations/veraenderung.ts`, `tests/unit/veraenderung.test.ts`

- [ ] **Step 1: Write tests**

Test 80 to 100 = 25%, 100 to 80 = -20%, old value zero warns.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/calculations/veraenderung.ts`. Formula: p% = (W2 - W1) / W1 * 100.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): implement Prozentuale Veraenderung calculation with tests"
```

---

### Task 17: Implement Rabatt calculation (tests first)

**Files:**
- Create: `lib/calculations/rabatt.ts`, `tests/unit/rabatt.test.ts`

- [ ] **Step 1: Write tests**

Test 20% discount on 70 = 14 discount, endpreis 56.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/calculations/rabatt.ts`. Primary result Rabatt, secondary result Endpreis.

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): implement Rabatt calculation with tests"
```

---

### Task 18: Implement Mehrwertsteuer calculation (tests first)

**Files:**
- Create: `lib/calculations/mehrwertsteuer.ts`, `tests/unit/mehrwertsteuer.test.ts`

- [ ] **Step 1: Write tests**

Test 119 brutto at 19% = 19 MwSt, 100 netto. 107 at 7% = 7 MwSt. Invalid -100 warns.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/calculations/mehrwertsteuer.ts`. Formula: MwSt = brutto * satz / (100 + satz).

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): implement Mehrwertsteuer calculation with tests"
```

---

### Task 19: Implement Ab-/Zunahme calculation (tests first)

**Files:**
- Create: `lib/calculations/abzunahme.ts`, `tests/unit/abzunahme.test.ts`

- [ ] **Step 1: Write tests**

Test 80 + 7% = 85.6, 80 - 7% = 74.4.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/calculations/abzunahme.ts`. Formula: E = G * (1 + p / 100).

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): implement Ab-/Zunahme calculation with tests"
```

---

### Task 20: Create calculation mode registry

**Files:**
- Create: `lib/calculations/index.ts`, `tests/unit/calculation-registry.test.ts`

- [ ] **Step 1: Implement registry**

Create `lib/calculations/index.ts` exporting `modes` array, `modesById` map, and `getModeById(id)`.

- [ ] **Step 2: Add test**

Test that modes has length 7 and getModeById('prozentwert') returns correct mode.

- [ ] **Step 3: Run tests and commit**

```bash
npx vitest run tests/unit/calculation-registry.test.ts
git add .
git commit -m "feat(core): add calculation mode registry"
```

---

### Task 21: Implement history storage with cross-tab sync

**Files:**
- Create: `lib/history.ts`, `tests/unit/history.test.ts`

- [ ] **Step 1: Write tests**

Test add entry, FIFO limit of 20, clear history.

- [ ] **Step 2: Run tests to verify failure**

- [ ] **Step 3: Implement**

Create `lib/history.ts`:

```typescript
export const HISTORY_KEY_PREFIX = 'prozentrechner_history_';
export const HISTORY_LIMIT = 20;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  inputs: Record<string, number>;
  result: number;
  mode: string;
}

export function getHistory(mode: string): HistoryEntry[] { ... }
export function addHistoryEntry(mode: string, inputs: Record<string, number>, result: number): void { ... }
export function clearHistory(mode: string): void { ... }
```

- [ ] **Step 4: Run tests to verify pass**

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(core): add per-mode localStorage history with FIFO limit"
```


---

## Phase 3 — First 3 Modes (Prozentwert, Rabatt, Mehrwertsteuer)

### Task 22: Create reusable NumberInput component

**Files:**
- Create: `components/calculator/number-input.tsx`, `tests/components/number-input.test.tsx`

- [ ] **Step 1: Implement component**

Create `components/calculator/number-input.tsx` as a client component. It accepts id, label, value, onChange, suffix, placeholder, inputmode. Uses `parseGermanNumber`. Renders a 40px input with hairline border, focus border ink, optional suffix as absolute positioned text.

- [ ] **Step 2: Add component test**

Test renders label/suffix and parses comma decimal input.

- [ ] **Step 3: Run tests and commit**

```bash
npx vitest run tests/components/number-input.test.tsx
git add .
git commit -m "feat(ui): add German-number-aware NumberInput component"
```

---

### Task 23: Create KaTeX formula renderer

**Files:**
- Create: `components/calculator/formula-block.tsx`
- Install: `katex`, `@types/katex`
- Modify: `app/[locale]/globals.css`

- [ ] **Step 1: Install KaTeX**

```bash
npm install katex
npm install -D @types/katex
```

- [ ] **Step 2: Implement FormulaBlock**

Create client component using `katex.renderToString(latex, { throwOnError: false })` and `dangerouslySetInnerHTML`. Add `aria-hidden="true"`.

- [ ] **Step 3: Import KaTeX CSS**

Append `@import 'katex/dist/katex.min.css';` to `app/[locale]/globals.css`.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat(ui): add KaTeX formula renderer"
```

---

### Task 24: Create ExplanationPanel component

**Files:**
- Create: `components/calculator/explanation-panel.tsx`

- [ ] **Step 1: Implement component**

Client component accepting result, generalFormula, tip, warningTip, compact, onToggleCompact. Renders formula blocks, expandable steps list (max 3 initially), tip with warning color support, and compact mobile bar.

- [ ] **Step 2: Commit**

```bash
git add components/calculator/explanation-panel.tsx
git commit -m "feat(ui): add ExplanationPanel component"
```

---

### Task 25: Create ResultField with copy-to-clipboard

**Files:**
- Create: `components/calculator/result-field.tsx`, `tests/components/result-field.test.tsx`

- [ ] **Step 1: Implement component**

Client component with label, value, copyText. Uses `navigator.clipboard.writeText`. Shows Copy icon and brief "Kopiert!" feedback.

- [ ] **Step 2: Add test**

Test renders value and copy button.

- [ ] **Step 3: Run tests and commit**

```bash
npx vitest run tests/components/result-field.test.tsx
git add .
git commit -m "feat(ui): add ResultField with copy-to-clipboard"
```

---

### Task 26: Create HistoryDrawer component

**Files:**
- Create: `components/calculator/history-drawer.tsx`

- [ ] **Step 1: Implement component**

Client component accepting mode and onSelect. Loads history from `getHistory`, listens to `storage` event for cross-tab sync, renders collapsible list, supports clear.

- [ ] **Step 2: Commit**

```bash
git add components/calculator/history-drawer.tsx
git commit -m "feat(ui): add HistoryDrawer component with cross-tab sync"
```

---

### Task 27: Create CalculatorCard shell

**Files:**
- Create: `components/calculator/calculator-card.tsx`, `lib/hooks/use-debounce.ts`

- [ ] **Step 1: Create useDebounce hook**

Create `lib/hooks/use-debounce.ts`.

- [ ] **Step 2: Implement CalculatorCard**

Client component accepting mode, values, onChange, calculation. Maps input fields to NumberInput, result labels to ResultField, includes HistoryDrawer. Writes to history after 2s debounce when all inputs valid.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(ui): add CalculatorCard shell and useDebounce hook"
```

---

### Task 28: Implement URL hash sync hook

**Files:**
- Create: `lib/hooks/use-url-hash.ts`

- [ ] **Step 1: Implement hook**

Create `useUrlHash<T>(serialize, deserialize)` returning `[values, setValues]`. Reads hash on mount, listens to hashchange, writes via `history.replaceState`.

- [ ] **Step 2: Commit**

```bash
git add lib/hooks/use-url-hash.ts
git commit -m "feat(core): add URL hash sync hook"
```

---

### Task 29: Create CalculatorClient wrapper

**Files:**
- Create: `components/calculator/calculator-client.tsx`

- [ ] **Step 1: Implement wrapper**

Client component accepting mode and content. Uses `useUrlHash` to derive input values from URL hash, calls `mode.calculate(values)`, renders page hero h1/intro, two-column layout with CalculatorCard and ExplanationPanel.

- [ ] **Step 2: Commit**

```bash
git add components/calculator/calculator-client.tsx
git commit -m "feat(ui): add CalculatorClient wrapper"
```

---

### Task 30: Create Schema.org JSON-LD helpers

**Files:**
- Create: `components/schema/json-ld.tsx`, `lib/schema.ts`

- [ ] **Step 1: Create JsonLd component**

Renders one or more `<script type="application/ld+json">` tags.

- [ ] **Step 2: Create schema builders**

Create `lib/schema.ts` exporting:
- `buildBreadcrumbListSchema(items)`
- `buildSoftwareApplicationSchema(content)`
- `buildFAQPageSchema(faq)`
- `buildWebSiteSchema()`
- `buildOrganizationSchema()`

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(seo): add Schema.org JSON-LD helpers"
```

---

### Task 31: Build Prozentwert page

**Files:**
- Create: `app/[locale]/prozentwert/page.tsx`

- [ ] **Step 1: Implement page**

Server component that loads content, gets mode, exports `generateMetadata` with title/description/canonical/hreflang, renders JsonLd with breadcrumb, SoftwareApplication, FAQPage schemas, and CalculatorClient.

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: `/de/prozentwert/` generated.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(page): add Prozentwert calculator page"
```

---

### Task 32: Build Rabatt page

**Files:**
- Create: `content/calculators/rabatt.de.yaml`, `app/[locale]/rabatt-berechnen/page.tsx`

- [ ] **Step 1: Create content file**

YAML with mode rabatt-berechnen, meta, h1, intro, formulaGeneral, education, tip, faq, quiz, relatedModes.

- [ ] **Step 2: Create page**

Follow Task 31 pattern, canonical `/rabatt-berechnen`.

- [ ] **Step 3: Build and commit**

```bash
npm run build
git add .
git commit -m "feat(page): add Rabatt calculator page"
```

---

### Task 33: Build Mehrwertsteuer page with tax-rate selector

**Files:**
- Create: `content/calculators/mehrwertsteuer.de.yaml`, `app/[locale]/mehrwertsteuer/page.tsx`
- Modify: `components/calculator/calculator-card.tsx`

- [ ] **Step 1: Create content file**

YAML with mode mehrwertsteuer, warningTip about MwSt.-Falle, faq, quiz, relatedModes.

- [ ] **Step 2: Add tax-rate selector to CalculatorCard**

When `mode.id === 'mehrwertsteuer'`, render a `<select>` with options 19%, 7%, 20%, 8.1%.

- [ ] **Step 3: Create page**

Follow Task 31 pattern, canonical `/mehrwertsteuer`.

- [ ] **Step 4: Build and commit**

```bash
npm run build
git add .
git commit -m "feat(page): add Mehrwertsteuer page with tax-rate selector"
```


---

## Phase 4 — Remaining Modes + Homepage

### Task 34: Build Prozentsatz, Grundwert, Prozentuale Veraenderung, Ab-/Zunahme pages

For each remaining mode, create a YAML content file and a page component following Task 31 exactly.

#### Task 34a: Prozentsatz

**Files:**
- Create: `content/calculators/prozentsatz.de.yaml`, `app/[locale]/prozentsatz/page.tsx`

- [ ] **Step 1: Create content file**

YAML with mode prozentsatz, formulaGeneral `p% = W / G x 100`, education text, faq, quiz, 3 relatedModes.

- [ ] **Step 2: Create page**

Canonical `/prozentsatz`, load mode `prozentsatz`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(page): add Prozentsatz calculator page"
```

#### Task 34b: Grundwert

**Files:**
- Create: `content/calculators/grundwert.de.yaml`, `app/[locale]/grundwert/page.tsx`

- [ ] **Step 1: Create content file**

YAML with mode grundwert, formulaGeneral `G = W / p x 100`.

- [ ] **Step 2: Create page**

Canonical `/grundwert`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(page): add Grundwert calculator page"
```

#### Task 34c: Prozentuale Veraenderung

**Files:**
- Create: `content/calculators/veraenderung.de.yaml`, `app/[locale]/prozentuale-veraenderung/page.tsx`

- [ ] **Step 1: Create content file**

YAML with mode prozentuale-veraenderung, formulaGeneral `p% = (W2 - W1) / W1 x 100`.

- [ ] **Step 2: Create page**

Canonical `/prozentuale-veraenderung`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(page): add Prozentuale Veraenderung calculator page"
```

#### Task 34d: Ab-/Zunahme

**Files:**
- Create: `content/calculators/abzunahme.de.yaml`, `app/[locale]/abzunahme/page.tsx`

- [ ] **Step 1: Create content file**

YAML with mode abzunahme, formulaGeneral `E = G x (1 +/- p / 100)`.

- [ ] **Step 2: Create page**

Canonical `/abzunahme`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(page): add Ab-/Zunahme calculator page"
```

---

### Task 35: Create TopNav component

**Files:**
- Create: `components/layout/top-nav.tsx`

- [ ] **Step 1: Implement component**

Sticky 64px nav with logo + wordmark left, 4 priority calculator links center, "Alle Rechner" dropdown right. Mobile hamburger opens full-screen sheet. Use shadcn Sheet and DropdownMenu.

- [ ] **Step 2: Commit**

```bash
git add components/layout/top-nav.tsx
git commit -m "feat(layout): add TopNav component"
```

---

### Task 36: Create Footer component

**Files:**
- Create: `components/layout/footer.tsx`

- [ ] **Step 1: Implement component**

Dark surface (#101010) footer with 64px vertical padding, logo, 3-4 link columns (Calculators, Learn, About Us), copyright line.

- [ ] **Step 2: Commit**

```bash
git add components/layout/footer.tsx
git commit -m "feat(layout): add dark Footer component"
```

---

### Task 37: Create Breadcrumb component

**Files:**
- Create: `components/layout/breadcrumb.tsx`

- [ ] **Step 1: Implement component**

Renders visual breadcrumb trail and injects BreadcrumbList JSON-LD.

- [ ] **Step 2: Commit**

```bash
git add components/layout/breadcrumb.tsx
git commit -m "feat(layout): add Breadcrumb component"
```

---

### Task 38: Wire layout with TopNav and Footer

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Update layout**

Import TopNav and Footer. Wrap children with `<TopNav />` and `<Footer />`.

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: All pages include nav and footer in static HTML.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat(layout): wire TopNav and Footer into root layout"
```

---

### Task 39: Create RelatedCalculators component

**Files:**
- Create: `components/related-calculators.tsx`

- [ ] **Step 1: Implement component**

Accepts array of related mode ids. Renders 3-up grid of feature cards linking to each mode. Each card shows mode title and one-line example.

- [ ] **Step 2: Commit**

```bash
git add components/related-calculators.tsx
git commit -m "feat(ui): add RelatedCalculators component"
```

---

### Task 40: Create FAQBand component

**Files:**
- Create: `components/faq-band.tsx`

- [ ] **Step 1: Implement component**

Accepts FAQ items. Renders accordion using native `<details>`/`<summary>` or shadcn Accordion. Injects FAQPage JSON-LD.

- [ ] **Step 2: Commit**

```bash
git add components/faq-band.tsx
git commit -m "feat(ui): add FAQBand accordion component"
```

---

### Task 41: Create Quiz component

**Files:**
- Create: `components/quiz.tsx`, `tests/components/quiz.test.tsx`

- [ ] **Step 1: Implement component**

Interactive quiz using native radio inputs. On selection: instant green check / red X feedback, disabled wrong options, explanation shown, `aria-live` region for announcements. No score summary.

- [ ] **Step 2: Add component test**

Test selecting correct option shows success; selecting wrong shows failure and keeps other options enabled.

- [ ] **Step 3: Run tests and commit**

```bash
npx vitest run tests/components/quiz.test.tsx
git add .
git commit -m "feat(ui): add interactive Quiz component with a11y"
```

---

### Task 42: Extend CalculatorClient with below-the-fold bands

**Files:**
- Modify: `components/calculator/calculator-client.tsx`

- [ ] **Step 1: Add education, related, FAQ, quiz bands**

After the hero calculator section, add sections for:
- Step-by-step breakdown band (surface-card background)
- Related calculators band
- Education band + Quiz
- FAQ band

- [ ] **Step 2: Commit**

```bash
git add components/calculator/calculator-client.tsx
git commit -m "feat(ui): extend calculator pages with education, related, FAQ, quiz bands"
```

---

### Task 43: Create UniversalCalculator homepage component

**Files:**
- Create: `components/calculator/universal-calculator.tsx`

- [ ] **Step 1: Implement component**

Stacked conversational calculator wall on surface-soft background. Each mode card shows a sentence with inline inputs (e.g. "Wie viel sind [20] % von [500] Euro ?"), real-time result, compact formula, and "Mehr erfahren" link to dedicated page. Uses the same calculation functions and NumberInput.

- [ ] **Step 2: Commit**

```bash
git add components/calculator/universal-calculator.tsx
git commit -m "feat(ui): add UniversalCalculator homepage component"
```

---

### Task 44: Build homepage

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Implement homepage**

Server component with:
- Hero band: H1 "ProzentRechner - Kostenlos & Online", subtitle
- UniversalCalculator client component
- Differentiator band (3 selling points)
- All calculators grid (7 cards)
- Short education + FAQ
- Footer (already in layout)
- WebSite + Organization JSON-LD

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: `/de/` homepage generated with universal calculator.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(page): add homepage with UniversalCalculator"
```


---

## Phase 5 — Content & SEO

### Task 45: Create remaining calculator content files

**Files:**
- Create: content files for all modes not yet created

- [ ] **Step 1: Ensure all 7 YAML files exist**

Verify or create `content/calculators/{prozentwert,prozentsatz,grundwert,veraenderung,rabatt-berechnen,mehrwertsteuer,abzunahme}.de.yaml`. Each must contain metaTitle, metaDescription, h1, intro, formulaGeneral, educationTitle, educationText, tip, optional warningTip, faq array, quiz array, relatedModes array.

- [ ] **Step 2: Validate all content files**

Create `tests/unit/all-content.test.ts` that loads each mode and asserts required fields.

- [ ] **Step 3: Run tests and commit**

```bash
npx vitest run tests/unit/all-content.test.ts
git add .
git commit -m "feat(content): complete and validate all calculator content files"
```

---

### Task 46: Add print styles

**Files:**
- Modify: `app/[locale]/globals.css`

- [ ] **Step 1: Add print media query**

```css
@media print {
  nav, footer, .related-calculators, .quiz-band, .history-drawer {
    display: none !important;
  }
  .explanation-panel {
    display: block !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/globals.css
git commit -m "feat(a11y): add print stylesheet"
```

---

### Task 47: Create Impressum page

**Files:**
- Create: `app/[locale]/impressum/page.tsx`

- [ ] **Step 1: Implement page**

Static legal imprint page with required German Impressum fields: site owner name, address, contact email, responsible person. Use placeholder data and mark with comment for manual update before launch.

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/impressum/page.tsx
git commit -m "feat(legal): add Impressum page"
```

---

### Task 48: Create Datenschutz page

**Files:**
- Create: `app/[locale]/datenschutz/page.tsx`

- [ ] **Step 1: Implement page**

Static privacy policy page covering localStorage, GA4 (consent-gated), Usercentrics CMP, no PII storage, user rights. Mark placeholders for legal review.

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/datenschutz/page.tsx
git commit -m "feat(legal): add Datenschutz page"
```

---

### Task 49: Add hreflang and canonical links globally

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Update metadata**

Add `alternates` with canonical base path and `languages` for de-DE, de-AT, de-CH pointing to the same URL.

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat(seo): add global hreflang and canonical metadata"
```

---

### Task 50: Add robots.txt and sitemap

**Files:**
- Create: `app/robots.ts`, `app/sitemap.ts`

- [ ] **Step 1: Create robots.ts**

Allow all, point sitemap to `/sitemap.xml`.

- [ ] **Step 2: Create sitemap.ts**

Generate sitemap entries for `/`, `/prozentwert/`, `/prozentsatz/`, `/grundwert/`, `/prozentuale-veraenderung/`, `/rabatt-berechnen/`, `/mehrwertsteuer/`, `/abzunahme/`, `/impressum/`, `/datenschutz/`.

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: `dist/robots.txt` and `dist/sitemap.xml` generated.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat(seo): add robots.txt and sitemap"
```

---

## Phase 6 — Pre-launch

### Task 51: Integrate Usercentrics CMP

**Files:**
- Create: `components/consent/usercentrics-script.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create CMP script component**

Client component that injects the Usercentrics loader script asynchronously with your settings ID (replace `YOUR_SETTINGS_ID`). Load with `strategy="beforeInteractive"` or `afterInteractive` depending on Usercentrics docs, but never block critical render path.

- [ ] **Step 2: Add to layout**

Include `<UsercentricsScript />` in the locale layout `<head>`.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(consent): integrate Usercentrics CMP loader"
```

---

### Task 52: Integrate Google Analytics 4 with consent gate

**Files:**
- Create: `components/analytics/ga4-script.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create GA4 provider**

Client component that reads Usercentrics consent state (e.g. via `window.Usercentrics` or custom event) and injects GA4 script only after analytics consent is granted. Replace `YOUR_GA4_ID`.

- [ ] **Step 2: Add to layout**

Include `<GA4Script />` in the locale layout.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(analytics): add consent-gated GA4 integration"
```

---

### Task 53: Add analytics event helpers

**Files:**
- Create: `lib/analytics.ts`

- [ ] **Step 1: Implement helpers**

Create `sendGAEvent(eventName, params?)` that checks `window.gtag` exists and sends event. Use for copy-to-clipboard, mode switch, quiz answer (no input values).

- [ ] **Step 2: Wire events**

Call `sendGAEvent('copy_result')` in ResultField copy handler, `sendGAEvent('quiz_answer', { correct })` in Quiz.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(analytics): add GA4 event helpers and wire key interactions"
```

---

### Task 54: Performance optimization pass

**Files:**
- Modify: `app/[locale]/layout.tsx`, `app/[locale]/globals.css`

- [ ] **Step 1: Lazy-load KaTeX CSS**

Instead of `@import` at top of CSS, load KaTeX CSS via `<link rel="preload" as="style" href="..." onload="this.rel='stylesheet'">` in layout.

- [ ] **Step 2: Preconnect to Usercentrics domain**

Add `<link rel="preconnect" href="https://app.usercentrics.eu">`.

- [ ] **Step 3: Verify bundle budget**

Run build and inspect `dist/_next/static/chunks` sizes. First-party JS above-the-fold should stay under 150 KB gzipped.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "perf: lazy-load KaTeX and preconnect CMP"
```

---

### Task 55: Accessibility optimization pass

**Files:**
- Modify: relevant components

- [ ] **Step 1: Add aria-live region for result updates**

Add a visually hidden `aria-live="polite"` region in CalculatorClient announcing "Ergebnis: X" when result changes.

- [ ] **Step 2: Add visually-hidden formula descriptions**

Each FormulaBlock should be accompanied by a visually hidden text description of the formula for screen readers.

- [ ] **Step 3: Verify focus states**

Ensure all interactive elements have visible focus rings. shadcn defaults usually sufficient; adjust if needed.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "a11y: add live region and formula descriptions"
```

---

### Task 56: Configure Vercel deployment

**Files:**
- Create: `vercel.json` (if needed)

- [ ] **Step 1: Link project to Vercel**

Run:

```bash
npx vercel
```

Follow prompts to link or create project.

- [ ] **Step 2: Set environment variables**

In Vercel dashboard set:
- `NEXT_PUBLIC_GA4_ID`
- `NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID`

- [ ] **Step 3: Configure build settings**

Ensure build command is `npm run build` and output directory is `dist`.

- [ ] **Step 4: Commit**

```bash
git add vercel.json 2>/dev/null || true
git commit -m "chore(deploy): configure Vercel project"
```

---

### Task 57: Final QA run

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
npx playwright test
npm run build
npx lhci autorun
```

Expected: All tests pass, Lighthouse assertions pass (with performance warning threshold).

- [ ] **Step 2: Fix any failures**

Iterate on failing tests, build errors, or Lighthouse assertions.

- [ ] **Step 3: Delete prototypes directory**

```bash
rm -rf prototypes
```

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: final QA fixes and remove prototypes"
```


---

## Risks & Blockers

| Risk | Impact | Mitigation |
|------|--------|------------|
| `next-intl` + static export with `[locale]` routing causes unexpected build errors | High | Test build after Task 6; fallback to root-level locale sub-paths or remove `localePrefix: 'always'` if needed. |
| KaTeX bundle size pushes above-the-fold JS over 150 KB | Medium | Lazy-load KaTeX CSS; consider server-side pre-rendering of generic formulas and only client-render value substitutions. |
| Usercentrics CMP delays interactivity or fails in static export | Medium | Load CMP script asynchronously; test consent banner on Vercel preview. |
| Lighthouse performance < 90 due to third-party scripts | Medium | Defer CMP/GA4; keep them out of critical render path. |
| German legal text for Impressum/Datenschutz incorrect | High | Mark placeholders clearly; require human legal review before launch. |
| Number parsing ambiguity with comma/dot | Medium | Enforce rejection of thousands separators; document behavior in FAQ. |
| Playwright E2E flaky due to dev server startup | Low | Use `reuseExistingServer: !process.env.CI` and adequate timeout. |

---

## MVP Cuts (if timeline is tight)

1. **Quiz** - Can be reduced to static questions without interactive feedback, or removed entirely; education text still captures SEO value.
2. **History drawer** - Keep localStorage write/read but drop cross-tab sync or clear action.
3. **Related calculators band** - Hard-code 3 links instead of deriving from YAML.
4. **UniversalCalculator on homepage** - Replace with static grid of calculator links; dedicated mode pages remain fully functional.
5. **Step-by-step breakdown band below fold** - Collapse into ExplanationPanel only.
6. **Usercentrics CMP + GA4** - Defer to post-MVP if legal review not complete; but keep script placeholders.
7. **Print styles** - Low effort, keep; but can be cut if needed.
8. **Lighthouse CI blocking** - Start as warning-only; enforce error thresholds after optimization pass.

---

## Self-Review

### Spec Coverage Check

| Design Section | Covered By |
|----------------|------------|
| Visual design tokens | Task 4 (Tailwind config) |
| Page architecture / URL structure | File Structure Map + Tasks 31-34, 44 |
| Top Navigation | Task 35 |
| Calculator Card | Tasks 22-27 |
| Explanation Panel | Task 24 |
| Step-by-step breakdown | Task 42 |
| Related Calculators | Task 39 |
| Education band + Quiz | Tasks 41-42 |
| FAQ band | Task 40 |
| Footer | Task 36 |
| Universal Calculator | Tasks 43-44 |
| Real-time calculation flow | Tasks 22, 25, 27 |
| State management | Tasks 27-29 |
| History & persistence | Task 21 |
| Error handling | Calculation core tasks + NumberInput |
| Content file schema | Tasks 10, 45 |
| SEO / Schema.org | Tasks 30, 49, 50 |
| Tech stack decisions | Header + all tasks |
| Accessibility | Tasks 22, 41, 55 |
| Testing strategy | Tasks 7-9, all TDD tasks |
| Analytics / CMP | Tasks 51-53 |
| Legal pages | Tasks 47-48 |
| All 7 calculation modes | Tasks 13-19, 31-34 |

### Gaps

1. **Currency symbol decision**: Design says Euro default. Plan uses Euro suffix throughout. No MVP currency switcher.
2. **Sentry**: Design mentions Sentry or Vercel native error tracking. Plan omits explicit Sentry setup; add post-MVP or use Vercel native monitoring.
3. **Expert persona / E-E-A-T**: Research suggests adding founder bio. Design says MVP focuses on tool UX. Plan defers founder bio to post-MVP content phase.
4. **TOC / Inhaltsverzeichnis**: Design does not require TOC; plan does not add one.
5. **News/Neuigkeiten section**: Post-MVP.

### Placeholder Scan

No TBD/TODO/"later" language allowed in execution steps. Every task references existing files or provides exact file paths. Code snippets are complete where applicable.

### Type Consistency

- `InputMap` used consistently across calculations and hooks.
- `CalculatorMode.calculate` returns `CalculationResult` in all modes.
- `NumberInput` suffix type matches `InputField.suffix` (`'%' | 'Euro'`).
- History keys use `HISTORY_KEY_PREFIX` constant.

---

## First-Day Executable Tasks

Start with these tasks in order on day one:

1. **Task 1**: Initialize Next.js project.
2. **Task 2**: Configure static export.
3. **Task 3**: Initialize shadcn/ui.
4. **Task 4**: Map Tailwind design tokens.
5. **Task 5**: Add self-hosted fonts.
6. **Task 6**: Install and configure next-intl.
7. **Task 7**: Set up Vitest.
8. **Task 8**: Set up Playwright.
9. **Task 9**: Set up Lighthouse CI.
10. **Task 10**: Create content schema and first YAML file.
11. **Task 11**: Implement number parsing/formatting with tests.
12. **Task 12**: Define calculation types.
13. **Task 13**: Implement Prozentwert calculation with tests.

These tasks produce a runnable empty site with a tested calculation core by end of day one.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-22-prozentrechner-implementation.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach would you like?**

