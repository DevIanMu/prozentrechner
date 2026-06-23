# ProzentRechner — Design Specification

> **Status:** Approved  
> **Date:** 2026-06-10  
> **Target:** Direct competitor to prozentrechner.net with best-in-class calculator experience  

---

## 1. Project Overview

### 1.1 Purpose
Build a German-language percentage calculator website that directly competes with prozentrechner.net. The core differentiator is a superior calculator experience: real-time computation, interactive step-by-step explanations, live formula rendering, and session history.

### 1.2 Target Audience
- German-speaking users in DACH region (Germany, Austria, Switzerland)
- Students learning percentage calculations
- Everyday users needing quick percentage math (discounts, VAT, tips)

### 1.3 Success Criteria
- Calculator result appears without clicking a button (real-time)
- Step-by-step math explanation is visible on the same screen as the calculator
- Each calculation mode has its own SEO-optimized landing page
- Page loads fast (Lighthouse Performance > 90)
- Works seamlessly on mobile and desktop

---

## 2. Visual Design System

Based on `DESIGN-cal.md` (Cal.com design analysis), adapted for a calculator tool site.

### 2.1 Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#111111` | Primary CTAs, h1/h2 headlines |
| `primary-active` | `#242424` | Button press state |
| `ink` | `#111111` | Primary text |
| `body` | `#374151` | Body text |
| `muted` | `#6b7280` | Secondary text, placeholders |
| `muted-soft` | `#898989` | Tertiary text, captions |
| `hairline` | `#e5e7eb` | Input borders, dividers |
| `hairline-soft` | `#f3f4f6` | Section dividers |
| `canvas` | `#ffffff` | Page background |
| `surface-soft` | `#f8f9fa` | Nav pill group background |
| `surface-card` | `#f5f5f5` | Feature cards, explanation panel, footer CTA |
| `surface-strong` | `#e5e7eb` | Disabled states |
| `surface-dark` | `#101010` | Footer background |
| `surface-dark-elevated` | `#1a1a1a` | Nested dark surfaces |
| `on-primary` | `#ffffff` | Text on primary buttons |
| `on-dark` | `#ffffff` | Text on dark footer |
| `on-dark-soft` | `#a1a1aa` | Footer body text |
| `brand-accent` | `#3b82f6` | Inline links (sparingly) |
| `success` | `#10b981` | Confirmation states |
| `warning` | `#f59e0b` | Warning callouts |
| `error` | `#ef4444` | Validation errors |

### 2.2 Typography

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `display-xl` | Inter | 64px | 600 | 1.05 | -2px | Homepage hero h1 |
| `display-lg` | Inter | 48px | 600 | 1.1 | -1.5px | Section heads |
| `display-md` | Inter | 36px | 600 | 1.15 | -1px | Sub-section heads |
| `display-sm` | Inter | 28px | 600 | 1.2 | -0.5px | CTA band heads, calculator page titles |
| `title-lg` | Inter | 22px | 600 | 1.3 | -0.3px | Calculator result display |
| `title-md` | Inter | 18px | 600 | 1.4 | 0 | Feature card titles |
| `title-sm` | Inter | 16px | 600 | 1.4 | 0 | Small card titles, input labels |
| `body-md` | Inter | 16px | 400 | 1.5 | 0 | Default body text |
| `body-sm` | Inter | 14px | 400 | 1.5 | 0 | Footer body, fine print |
| `caption` | Inter | 13px | 500 | 1.4 | 0 | Badge labels, hints |
| `code` | JetBrains Mono | 14px | 400 | 1.5 | 0 | Code snippets, formula blocks |
| `button` | Inter | 14px | 600 | 1.0 | 0 | Button labels |
| `nav-link` | Inter | 14px | 500 | 1.4 | 0 | Navigation items |

**Font loading:** Inter and JetBrains Mono are self-hosted via `next/font` to eliminate an external request and improve privacy. `font-display: swap` is still applied.

### 2.3 Spacing

| Token | Value |
|---|---|
| `xxs` | 4px |
| `xs` | 8px |
| `sm` | 12px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `xxl` | 48px |
| `section` | 96px |

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Badge accents |
| `sm` | 6px | Small inline buttons |
| `md` | 8px | Standard buttons, text inputs, category tabs |
| `lg` | 12px | Content cards (feature, testimonial, calculator cards) |
| `xl` | 16px | Hero mockup containers |
| `pill` | 9999px | Nav pill groups, badges |
| `full` | 9999px | Avatars, icon buttons |

### 2.5 Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, top nav, hero bands |
| Soft hairline | 1px `hairline` border | Inputs, table dividers |
| Card surface | `surface-card` background, no shadow | Feature cards, explanation panel |
| Subtle shadow | `0 1px 2px rgba(0,0,0,0.05)` | Calculator card, pricing cards |
| Elevated hover | `0 4px 12px rgba(0,0,0,0.08)` | Card hover states |

---

## 3. Page Architecture

Every calculation mode gets its own statically-generated page. All pages share a common template.

### 3.1 Shared Page Template

```
┌─────────────────────────────────────────┐
│  TOP NAV                                │  ← sticky, 64px, white canvas
│  (Logo | Prozentwert | Rabatt | MwSt. …) │
├─────────────────────────────────────────┤
│                                         │
│  HERO / CALCULATOR BAND                 │  ← white canvas, 96px vertical padding
│  ┌─────────────┐ ┌─────────────────┐    │
│  │             │ │                 │    │
│  │ CALCULATOR  │ │ EXPLANATION     │    │
│  │ CARD        │ │ PANEL           │    │
│  │ (left 55%)  │ │ (right 45%)     │    │
│  │             │ │                 │    │
│  └─────────────┘ └─────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  STEP-BY-STEP BREAKDOWN (expandable)    │  ← surface-card background
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  RELATED CALCULATORS                    │  ← canvas background
│  (Tool matrix: 3-up cards)              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  EDUCATION BAND                         │  ← surface-card background
│  (Formula deep-dive, examples, quiz)    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  FAQ + SCHEMA                           │  ← canvas background
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  FOOTER                                 │  ← surface-dark, 64px padding
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 URL Structure

| URL | Page Title | Calculation Mode |
|---|---|---|
| `/` | ProzentRechner — Kostenlos & Online | Homepage / overview |
| `/prozentwert` | Prozentwert berechnen | Percentage value (W = G × p / 100) |
| `/prozentsatz` | Prozentsatz berechnen | Percentage rate (p% = W / G × 100) |
| `/grundwert` | Grundwert berechnen | Base value (G = W / p × 100) |
| `/prozentuale-veraenderung` | Prozentuale Veränderung | Percentage change |
| `/rabatt-berechnen` | Rabatt berechnen | Discount calculation |
| `/mehrwertsteuer` | Mehrwertsteuer berechnen | VAT extraction |
| `/abzunahme` | Prozentuelle Ab- und Zunahme | Increase/decrease |

**URL state strategy:**
- Normal user input is synced to the URL **hash** (e.g. `/prozentwert#g=500&p=20`) for easy sharing without creating additional crawlable URLs.
- Curated SEO examples may use a limited set of **query** parameters (e.g. `/prozentwert?beispiel=studentenrabatt`). These URLs must include a canonical link to the base path to avoid thin-content indexing.
- On page load, the calculator reads hash values first, then query parameters as a fallback.

### 3.3 Responsive Behavior

| Breakpoint | Key Changes |
|---|---|
| Mobile (< 768px) | Split-screen collapses to stacked (calculator first, explanation below). Explanation starts collapsed to a compact bar. Feature grids 1-up. Footer 1 column. |
| Tablet (768–1024px) | Top nav stays horizontal but tightens. Feature grids 2-up. Explanation panel may stack. |
| Desktop (1024–1440px) | Full split-screen layout. Feature grids 3-up. Footer 3-4 columns. |
| Wide (> 1440px) | Same as desktop, max content width caps at 1200px. |

### 3.4 Homepage

The homepage targets the head term "ProzentRechner" and serves two user intents at once:

1. **Users who know what they want** → click through to a dedicated mode page.
2. **Users who just want to "calculate a percentage"** → use the conversational universal calculator without choosing a mode first.

**Structure:**
1. **Hero band** — H1 "ProzentRechner — Kostenlos & Online", subtitle.
2. **Universal Calculator (Client Component)** — a stacked, conversational calculator wall (Variant B) that exposes all 7 common percentage questions as inline sentence forms. Each card calculates in real time and links to its dedicated mode page for deeper explanation.
3. **Differentiator band** — 3 selling points (real-time calculation, step-by-step explanations, session history).
4. **All calculators grid** — cards for all 7 calculation modes.
5. **Education + FAQ** — short educational text and a small FAQ section.
6. **Footer**.

**Rationale for the hybrid:** Dedicated per-mode pages remain the default for SEO and focused UX; the universal calculator on the homepage captures users who do not know which formula to use and would otherwise bounce.

---

## 4. Component Specifications

### 4.1 Top Navigation

- **Height:** 64px
- **Background:** `canvas` (#ffffff)
- **Position:** Sticky top
- **Content:**
  - Left: Logo + wordmark "ProzentRechner"
  - Center: Horizontal nav links to the 4 most important calculator pages (`Prozentwert`, `Rabatt`, `Mehrwertsteuer`, `Prozentuale Veränderung`)
  - Right: "Alle Rechner" dropdown listing all 7 calculation modes. A language selector is **not** included in the MVP because the launch is German-only; it will be added when English / `.com` expansion begins.
- **Typography:** `nav-link` (Inter 14px / 500)
- **Mobile:** Collapses to hamburger menu, opens as full-screen sheet

### 4.2 Calculator Card

- **Background:** `canvas` (#ffffff)
- **Border:** 1px `hairline` + subtle shadow `0 1px 2px rgba(0,0,0,0.05)`
- **Border radius:** `lg` (12px)
- **Padding:** `xl` (32px)
- **Width:** 100% of its container (55% on desktop)

**Internal structure:**

```
┌─────────────────────────────────────────┐
│  [Title]                          [i]   │  ← title-sm, info icon tooltip
│  [One-line description]                   │  ← body-md, muted
├─────────────────────────────────────────┤
│                                         │
│  [Input Label 1]                        │  ← title-sm
│  ┌─────────────────────────────────┐    │
│  │ [Value]              [suffix]   │    │  ← text-input + inline suffix
│  └─────────────────────────────────┘    │
│                                         │
│  [Input Label 2]                        │
│  ┌─────────────────────────────────┐    │
│  │ [Value]              [suffix]   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ─────────────────────────────────────  │  ← hairline divider
│                                         │
│  [Result Label]                         │  ← title-sm
│  ┌─────────────────────────────────┐    │
│  │ [Result Value]         [suffix] │    │  ← title-lg (22px / 600)
│  └─────────────────────────────────┘    │
│  [📋 Kopieren]                          │  ← button-secondary or icon button
│                                         │
│  [▼ Verlauf (3)]                        │  ← expandable history trigger
│  • 20% von 500 = 100,00 €               │
│  • 15% von 200 = 30,00 €                │
│                                         │
└─────────────────────────────────────────┘
```

**Input fields:**
- Style: `text-input` — 40px height, `md` (8px) radius, 1px `hairline` border
- Focus state: border shifts to `ink` (#111111)
- Input mode: `inputmode="decimal"` for mobile numeric keyboard
- Suffixes: "%" for percentages, "€" for currency, none for pure numbers
- Validation: non-numeric input rejected at field level
- **German number input:** Users may type either comma or dot as the decimal separator (e.g. `12,5` or `12.5`). Both are normalized to a JavaScript number internally. The `%` and `€` suffixes are accepted and stripped automatically. Thousands separators are **not** allowed in inputs to avoid parsing ambiguity; they are added only when formatting results.
- **Result formatting:** Results are displayed with German locale formatting via `Intl.NumberFormat('de-DE')` — e.g. `1.234,56 €`, `25,00 %`.

**Result field:**
- Same visual container as inputs
- Text: `title-lg` (22px / 600), `ink` color
- Updates in real-time (150ms debounce)

**Copy button:**
- Copies full result string to clipboard: "20% von 500 = 100,00 €"
- Visual feedback: button text briefly changes to "Kopiert!"

**History drawer:**
- Collapsed by default
- Expands on click of "Verlauf (N)" button
- Shows last 20 calculations for this mode
- Each item shows: inputs → result
- Clicking a history item restores those inputs to the calculator

### 4.3 Explanation Panel

- **Background:** `surface-card` (#f5f5f5)
- **Border radius:** `lg` (12px)
- **Padding:** `xl` (32px)
- **Width:** 100% of its container (45% on desktop)

**Internal structure:**

```
┌─────────────────────────────────────────┐
│                                         │
│  Formel                                 │  ← title-md
│  ┌─────────────────────────────────┐    │
│  │  W = G × p / 100                │    │  ← KaTeX rendered
│  │                                 │    │
│  │  W = 500 × 20 / 100             │    │  ← with current values
│  │  W = 100                        │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Schritt für Schritt                    │  ← title-md
│  1. Grundwert und Prozentsatz           │  ← body-md
│     eingeben                            │
│  2. Multipliziere: 500 × 20 = 10.000   │
│  3. Teile durch 100: 10.000 / 100 = 100│
│                                         │
│  [Mehr anzeigen]                        │  ← text-link, expands full derivation
│                                         │
│  💡 Tipp                                │  ← caption, warning color if caution
│  Verdopple den Prozentsatz, halbiere    │  ← body-sm
│  den Grundwert — das Ergebnis bleibt    │
│  gleich.                                │
│                                         │
└─────────────────────────────────────────┘
```

**Formula block:**
- Background: `canvas` (#ffffff)
- Border: 1px `hairline`
- Border radius: `md` (8px)
- Font: `code` (JetBrains Mono)
- KaTeX renders the general formula, then the specific instance with substituted values

**Step-by-step list:**
- Numbered steps in `body-md`
- Initially shows 2-3 key steps
- "Mehr anzeigen" expands to full derivation
- Updates in real-time as user types

**Tip section:**
- Contextual tips based on calculation mode
- Warning tips (e.g., "MwSt.-Falle") use `warning` color
- Regular tips use `muted-soft`

**Mobile behavior:**
- Collapses to a compact bar displayed directly below the calculator card.
- The compact bar shows the general formula and the current result when inputs are valid: "Formel: W = G × p / 100 | Ergebnis: 100,00 €".
- It does **not** auto-expand; instead it subtly highlights when a valid calculation is available, inviting the user to tap.
- Tap expands the full panel with a smooth 200–300ms animation.

### 4.4 Step-by-Step Breakdown Band

- **Background:** `surface-card` (#f5f5f5)
- **Padding:** `section` (96px) vertical

**Content:**
- Title: `display-sm` (28px / 600)
- Full mathematical derivation in a formula block
- "Wie kommt man auf diese Formel?" expandable section with deeper explanation

**Purpose:** SEO + education. Captures "prozentrechnung erklärung" queries.

**Print styles:** A `@media print` stylesheet hides the top navigation, footer, related calculators, quiz, and history drawer. It keeps the calculator inputs/result, formula blocks, step-by-step explanation, and educational text visible. The explanation panel auto-expands when printed. No separate print-only page is built.

### 4.5 Related Calculators Band

- **Background:** `canvas` (#ffffff)
- **Padding:** `section` (96px) vertical

**Layout:** 3-up grid on desktop, 2-up on tablet, 1-up on mobile. Gap: `lg` (24px).

**Selection:** Each page displays exactly **3 related modes**, chosen for relevance to the current calculator (defined in the mode's content file). Full discovery of all 7 modes is provided by the top navigation and footer.

**Card structure (`feature-card`):**
- Background: `surface-card` (#f5f5f5)
- Border radius: `lg` (12px)
- Padding: `xl` (32px)
- Entire card is clickable
- Content:
  - Title: `title-md` (e.g., "Rabatt berechnen")
  - One-line example: `body-md`, muted (e.g., "20% von 70€ = ?")

### 4.6 Education Band

- **Background:** `surface-card` (#f5f5f5)
- **Padding:** `section` (96px) vertical

**Content:**
- Title: `display-sm`
- 300-500 words of educational content in `body-md`
- Topics: definition, when to use, common mistakes, real-world examples

**Quiz component (`product-mockup-card`):**
- Background: `canvas` (#ffffff)
- Border: 1px `hairline`
- Border radius: `lg` (12px)
- Interactive: click an answer → instant feedback (green check / red X) + explanation
- Unlike prozentrechner.net's static quiz
- **Behavior:** Users may retry after a wrong answer; the selected wrong option is disabled and highlighted in red, while remaining options can still be chosen until the correct answer is selected.
- **No score summary:** The goal is learning, not testing. Aggregate correctness may be tracked anonymously via GA4 (after consent), but no per-user score is stored.
- **Accessibility:** Options are implemented as native `<input type="radio">` with associated `<label>` elements; explanations are announced via an `aria-live` region.

### 4.7 FAQ Band

- **Background:** `canvas` (#ffffff)
- **Padding:** `section` (96px) vertical

**Structure:**
- Title: `display-sm`
- Accordion items using `<details>` / `<summary>` or lightweight JS accordion
- Each item: question (`title-md`) + answer (`body-md`)
- Minimum 5-7 questions per page

**Schema.org:** `FAQPage` structured data injected as JSON-LD for rich snippets.

### 4.8 Footer

- **Background:** `surface-dark` (#101010)
- **Text color:** `on-dark-soft` (#a1a1aa)
- **Padding:** 64px vertical
- **Layout:** 3-4 column link grid on desktop, stacks on mobile

**Content:**
- Logo + wordmark at top-left in `on-dark`
- Columns: Calculators, Learn, About Us
- Copyright line at bottom

**The dark footer is the only dark surface on any page.**

### 4.9 Universal Calculator (Homepage Only)

A stacked, conversational calculator wall that lets users solve common percentage problems without first choosing a calculation mode. It is inspired by competitor layouts (e.g. blitzrechner.de) but keeps the real-time, no-button behaviour.

- **Background:** `surface-soft` (#f8f9fa)
- **Border:** 1px solid `hairline`
- **Border radius:** `lg` (12px)
- **Padding:** `xl` (32px)
- **Layout:** Vertical stack of mode cards, one per common question type.

**Mode card structure:**
- Small `caption`-style mode label at top (e.g. "Prozentwert")
- A single sentence with inline inputs and dropdowns, e.g.:
  > Wie viel sind `[20]` % von `[500]` € ?
- Result line below the sentence showing the computed value and a compact formula
- A "Mehr erfahren →" link to the dedicated mode page for full step-by-step explanation

**Input behaviour:**
- Same parsing rules as the per-mode calculator: comma/dot accepted, `%`/`€` suffixes stripped, no thousands separators in input.
- Results update in real time (150ms debounce).
- Each mode card operates independently.

**Mobile:** Cards stack vertically with the same sentence layout; inputs shrink to fit.

---

## 5. Interaction & Data Flow

### 5.1 Real-Time Calculation Flow

```
User types in Input Field
        │
        ▼
   Debounce (150ms)
        │
        ▼
   Sanitize Input (allow: 0-9, ., -, comma handled as decimal)
        │
        ▼
   Validate (numeric, range check)
        │
        ├──► Invalid? Show error state / warning badge
        │
        ▼
   Execute Calculation
        │
        ├──► Update Result Display
        ├──► Update Explanation Panel (KaTeX re-render)
        ├──► Update Step-by-Step Breakdown
        ├──► Update URL Hash (#g=500&p=20)
        └──► Push to History (localStorage, after 2s idle or blur)
```

**Debounce:** 150ms after last keystroke. Feels instant but prevents excessive recalculation.

**No submit button:** This is the core UX differentiator from prozentrechner.net.

**URL state:** Normal user input is synced to the URL hash (e.g. `/prozentwert#g=500&p=20`) so calculations can be shared without creating crawlable thin-content URLs. Curated SEO examples may use a small set of query parameters (e.g. `/prozentwert?beispiel=studentenrabatt`), with canonical self-references pointing to the base path.

### 5.2 State Management (Per Page)

Each calculator page maintains local React state:

```typescript
interface CalculatorState {
  inputs: Record<string, number | null>;
  result: number | null;
  isExplanationExpanded: boolean;
  isHistoryVisible: boolean;
}

interface HistoryEntry {
  id: string;           // crypto.randomUUID() or timestamp-based
  timestamp: number;    // Date.now()
  inputs: Record<string, number>;
  result: number;
  mode: string;         // e.g., "prozentwert"
}
```

**No global state manager.** `useState` + `useEffect` + `localStorage` is sufficient.

### 5.3 History & Persistence

- **Scope:** Per-calculation-mode. Rabatt history is separate from MwSt. history.
- **Storage:** `localStorage`
- **Key format:** `prozentrechner_history_{mode}`
- **Limit:** 20 entries per mode. FIFO eviction.
- **Schema:** `HistoryEntry[]` serialized as JSON
- **Write trigger:** Entries are written only after all required inputs are valid and either (a) no input has changed for 2 seconds, or (b) an input field loses focus (`blur`). This prevents spamming history while the user is still typing.
- **Cross-tab sync:** The history list listens to the `window.storage` event and updates in real time across open tabs.
- **Clear action:** Each history drawer provides a "Verlauf löschen" control to clear the current mode's history.
- **Privacy:** No PII. Numbers and timestamps only.

### 5.4 Error Handling

| Scenario | Behavior |
|---|---|
| Empty input | Result shows "—" (em dash). No error styling. |
| Invalid characters | Rejected at input level via `inputmode="decimal"` + JS sanitization. |
| Division by zero | Result shows "∞" with tooltip: "Division durch Null nicht möglich." |
| Negative result where unexpected | Result shown with `warning` badge: "Negativer Wert — prüfen Sie die Eingabe." |
| Calculation overflow | Result shows "Fehler" with `error` badge. |

---

## 6. Content Strategy

### 6.1 Page Content Requirements

Each calculator page must include:

1. **Calculator** (above the fold)
2. **Live formula + steps** (above the fold, right panel)
3. **Detailed step-by-step breakdown** (below fold)
4. **Related calculators** (3 cards)
5. **Educational content** (300-500 words)
6. **Interactive quiz** (3-5 questions)
7. **FAQ** (5-7 questions with Schema.org markup)

**Content source of truth:** Every mode is described by a structured content file (e.g. `content/calculators/prozentwert.de.yaml`) containing at least:

```yaml
mode: prozentwert
metaTitle: "Prozentwert berechnen — Kostenloser Online-Rechner"
metaDescription: "Berechne den Prozentwert mit der Formel W = G × p / 100."
h1: "Prozentwert berechnen"
intro: "..."
educationText: "..."
faq:
  - question: "..."
    answer: "..."
quiz:
  - question: "..."
    options: ["...", "...", "..."]
    correctIndex: 1
    explanation: "..."
relatedModes: ["rabatt-berechnen", "prozentuale-veraenderung", "abzunahme"]
```

The page component, FAQ JSON-LD, and related-calculator cards all consume this file, ensuring consistency. Content is produced AI-assisted and human-reviewed for German terminology, mathematical accuracy, and SEO.

### 6.2 SEO Requirements

- **Meta title:** Action-oriented, includes primary keyword. Max 60 chars.
  - Example: "Prozentwert berechnen — Kostenloser Online-Rechner"
- **Meta description:** Includes formula + use case. Max 160 chars.
- **H1:** Matches the page's primary keyword.
- **Canonical URL:** Self-referencing. URLs with curated query parameters must canonicalize to the base path to avoid thin-content indexing.
- **Structured data:**
  - `FAQPage` schema on all calculator pages
  - `SoftwareApplication` schema on calculator pages
  - `WebSite` + `Organization` schema on the homepage
  - `BreadcrumbList` on every page
- **Hreflang:** `de-DE`, `de-AT`, `de-CH` all point to the same German URL because DACH regions share the same content and page.

### 6.3 Internal Linking

- Every calculator page links to 3 curated related calculator pages via the "Related Calculators" band; full mode discovery is available through the top navigation and footer.
- Footer provides persistent navigation to all major pages.
- Education content should naturally link to related concepts (e.g., from "Rabatt" page, link to "Prozentuale Veränderung").

---

## 7. Technical Architecture

### 7.1 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Formula Rendering | KaTeX |
| Fonts | Inter + JetBrains Mono (self-hosted via `next/font`) |
| Icons | Lucide React |
| Deployment | Vercel |
| i18n | `next-intl` (German-only at launch, externalized from day one) |
| Analytics | Google Analytics 4 |
| Consent Management | Usercentrics CMP (required for planned AdSense within 6 months) |
| Error Tracking | Sentry (or Vercel native error tracking) |

### 7.2 Why This Stack

**Next.js (App Router):**
- Static generation at build time → SEO-optimized HTML per URL
- Client components for calculator interactivity
- Automatic code splitting
- Image/font optimization built-in

**Tailwind CSS:**
- Token-based design system maps 1:1 to Tailwind config
- No runtime CSS-in-JS overhead
- Purged unused styles = small bundle

**shadcn/ui:**
- Headless, accessible primitives
- No heavy component library dependency
- Full styling control via Tailwind

**KaTeX:**
- Faster than MathJax
- Server-renderable
- Perfect for the formula explanation panels

**`next-intl`:**
- Externalizes all UI and content strings from day one
- Makes future English / `.com` expansion a configuration change rather than a rewrite

**Google Analytics 4 + Usercentrics CMP:**
- GA4 provides standard web analytics
- Usercentrics is widely used in the DACH market and supports the IAB TCF framework required for AdSense

**Sentry:**
- Catches client-side errors in calculation and rendering logic without exposing PII

### 7.3 Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| Time to Interactive (TTI) | < 2s |
| First Contentful Paint (FCP) | < 1s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| First-party JS budget (gzipped) | < 150 KB for above-the-fold bundle |

**Performance guardrails:**
- Load KaTeX CSS asynchronously; generic formulas are pre-rendered at build time.
- Load the CMP script asynchronously/deferred; do not block the critical render path.
- AdSense scripts are injected only after analytics consent is granted and never on the critical path.
- Run Lighthouse CI on pull requests; block merges if Performance < 90 or Accessibility < 95.

### 7.4 Accessibility

- All inputs have associated `<label>` elements
- Color contrast meets WCAG AA minimum (4.5:1 for body text)
- Keyboard navigation works for calculator inputs, history, and quiz
- Focus states visible on all interactive elements
- Screen reader announcements for result updates (aria-live region)
- Each rendered formula is accompanied by a visually-hidden plain-text description for screen readers (e.g. "W gleich G mal p durch 100")
- Quiz options use native `<input type="radio">` so they are fully keyboard operable

### 7.5 Testing Strategy

Automated testing is required to guarantee mathematical correctness and UX reliability.

| Layer | Tool | Scope |
|---|---|---|
| Unit tests | Vitest | All calculation functions, number parsing, and German locale formatting. Must cover normal cases, division by zero, negative numbers, percentages > 100%, and comma/dot decimal inputs. |
| Component tests | React Testing Library | Calculator card, input validation/sanitization, history drawer, copy button, quiz feedback. |
| E2E tests | Playwright | Critical user journey: open `/prozentwert`, enter values, assert real-time result, click copy, switch mode. |
| Performance / a11y | Lighthouse CI | Run on every pull request. Block merges if Performance < 90, Accessibility < 95, Best Practices < 100, or SEO < 100. |

Visual regression testing is **not** required for the MVP.

### 7.6 Analytics, CMP & Legal Compliance

- **Analytics:** Google Analytics 4 is loaded only after the user grants analytics consent.
- **Consent management:** Usercentrics CMP is used from day one because AdSense is planned within 6 months. The banner presents two layers: **Erforderlich** (necessary) and **Statistiken** (analytics/ads). GA and AdSense scripts are injected only after consent.
- **GA configuration:** IP anonymization enabled; advertising personalization signals disabled by default.
- **Tracking events (anonymous only):** page views, copy-to-clipboard clicks, mode switches, quiz answer correctness. Specific input values are never tracked.
- **Legal pages:** `/impressum` and `/datenschutz` are required and linked in the footer.
- **Error tracking:** Sentry (or Vercel native error tracking) captures client-side calculation and rendering errors. PII is excluded.

---

## 8. Calculation Modes

### 8.1 Core Modes (MVP)

| Mode | Formula | Inputs | URL |
|---|---|---|---|
| Prozentwert | W = G × p / 100 | G (Grundwert), p% (Prozentsatz) | `/prozentwert` |
| Prozentsatz | p% = W / G × 100 | W (Prozentwert), G (Grundwert) | `/prozentsatz` |
| Grundwert | G = W / p × 100 | W (Prozentwert), p% (Prozentsatz) | `/grundwert` |
| Prozentuale Veränderung | p% = (W₂ - W₁) / W₁ × 100 | W₁ (Alter Wert), W₂ (Neuer Wert) | `/prozentuale-veraenderung` |
| Rabatt | Rabatt = G × p / 100, Endpreis = G - Rabatt | G (Preis), p% (Rabatt) | `/rabatt-berechnen` |
| Mehrwertsteuer | MwSt. = Brutto × s / (100 + s), Netto = Brutto - MwSt. | Brutto (Bruttopreis), Steuersatz s | `/mehrwertsteuer` |
| Ab-/Zunahme | Ergebnis = G × (1 ± p / 100) | G (Ausgangswert), p% (Änderung) | `/abzunahme` |

**VAT rate selector:** The `Mehrwertsteuer` calculator provides a visible tax-rate selector with presets: 19% (Germany, default), 7% (Germany reduced), 20% (Austria), and 8.1% (Switzerland). The selected rate is encoded in the URL hash (e.g. `#brutto=119&satz=19`).

### 8.2 Future Modes (Post-MVP)

| Mode | Description |
|---|---|
| Ausgangswert finden | Given result after increase/decrease, find original value |
| Zinseszins | Compound interest calculator |
| Gewinnspanne | Profit margin / markup calculation |
| Zusammengesetzte Rabatte | Sequential discounts (20% + 10% = 28%, not 30%) |

---

## 9. Resolved Decisions

The following open questions from the initial design review have been resolved:

| # | Question | Resolution |
|---|---|---|
| 1 | i18n preparation | Use `next-intl` and externalize all strings from day one; keep German-only URLs for the MVP. |
| 2 | Currency symbol | € is the default for launch. The VAT selector handles Switzerland/Austria tax rates; a currency switcher is not in the MVP. |
| 3 | Print stylesheet | Implemented via `@media print`: hides chrome and auto-expands the explanation panel. No separate print page. |
| 4 | Shareable links | User input syncs to URL `hash`; curated SEO examples use a limited set of `query` parameters with canonical to the base path. |

## 10. Implementation Phases

| Phase | Focus | Deliverable |
|---|---|---|
| 1. Skeleton | Next.js + Tailwind + shadcn/ui + `next-intl` + content file schema + CI/Lighthouse | Runnable empty site |
| 2. Calculation core | Calculation functions, German number parsing/formatting, state management, history | Math-correct engine with passing unit tests |
| 3. First 3 modes | `Prozentwert`, `Rabatt`, `Mehrwertsteuer` full pages | Core traffic pages live |
| 4. Remaining modes + homepage | `Prozentsatz`, `Grundwert`, `Prozentuale Veränderung`, `Ab-/Zunahme`, `/` | Complete site structure |
| 5. Content & SEO | Education text, FAQ, quiz, Schema.org JSON-LD, Impressum, Datenschutz | SEO-ready pages |
| 6. Pre-launch | Usercentrics CMP, GA4, performance/a11y polish, Vercel deployment | Public launch |

---

*Design approved 2026-06-10. Updated with grill-me review decisions.*
