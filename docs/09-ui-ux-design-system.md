# GCC AI Credit Scoring & Risk Platform — UI/UX Enhancement Package

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

## 1. FULL UI/UX ENHANCEMENT DOCUMENT

### UX Principles for GCC Banking
*   **Trust & Clarity First:** Financial data must be presented without ambiguity. Explanations for AI decisions (e.g., credit scores) must be accessible and easy to understand.
*   **Cultural Alignment:** Respectful, formal tone. Layout must natively support RTL (Right-to-Left) reading patterns without breaking component anatomy.
*   **Efficiency:** Credit officers and risk managers operate in high-pressure environments. Tasks like reviewing applications or investigating fraud must require minimal clicks.
*   **Contextual Assistance:** AI Copilot should be a companion, not an obstacle. It should offer proactive insights without overriding human autonomy.

### User States

| State | Visual Treatment | Interaction Rules |
|-------|------------------|-------------------|
| **Loading** | Skeleton loaders honoring the layout structure. | Avoid blocking spinners for data fetching; use inline skeletons for cards and tables. |
| **Empty** | Illustration with clear call-to-action or explanation. | E.g., "No active fraud alerts", "Search for an applicant to begin." |
| **Error** | Clear error boundary with recovery action ("Retry", "Contact Support"). | Explanations must be non-technical and professional. |
| **Pending Review** | Amber indicators with clear SLA countdowns. | E.g., "Review required: 2 hours remaining." |

### Page-Level Interaction Flows

*   **Dashboard:** KPI summary ➔ Click into specific metric (e.g., NPL) ➔ Deep dive into Risk Analytics.
*   **Applications:** Filter queue ➔ Select application ➔ View detailed Scoring page.
*   **Credit Scoring:** Review applicant profile ➔ See SHAP explainers ➔ Consult Copilot ➔ Make decision.
*   **SME Lending:** Review business profile ➔ Drill down into Financial Health / Sector Risk ➔ View Copilot summary.
*   **Risk Analytics:** View macro trends ➔ Identify segment deterioration ➔ Trigger alert.
*   **Fraud & AML:** Triage alerts by severity ➔ Assign case ➔ Review transaction timeline.
*   **AI Copilot:** Floating action or inline prompt ➔ Conversational interface with context ➔ Actionable output.
*   **Regulations RAG:** Search query ➔ Ranked document results ➔ Inline highlights ➔ Copilot summary.

## 2. COMPLETE COMPONENT LIBRARY

### Anatomy of Key Components

#### Score Meter Component
```text
  [-------------Animated SVG Donut Base-------------]
  |                                                 |
  |                [SCORE VALUE]                    |
  |                   e.g. 742                      |
  |               [SCORE GRADE]                     |
  |                   e.g. B+                       |
  |                                                 |
  [-----------Progress Arc (Score-Based)------------]
  + Subtext: "Based on 45 data points"
```

#### SME Profile Card
```text
  +-------------------------------------------------+
  | [Sector Icon]  Business Name                    |
  |                Sector Tag | Yrs in Business     |
  +-------------------------------------------------+
  | Health Score: [||||||||||  ] 72/100             |
  | Ratio:        1.8x  (Green)                     |
  | Margin:       8.5%  (Green)                     |
  +-------------------------------------------------+
```

### Component Details

*   **Buttons:**
    *   *Primary:* Solid background (`var(--primary-500)`). Used for main actions (e.g., "Approve").
    *   *Secondary:* Outlined or subtle background. Used for alternatives (e.g., "Save Draft").
    *   *Ghost:* Text only, transparent background. Used for less prominent actions (e.g., "View All").
    *   *Danger:* Solid or outlined (`var(--accent-rose)`). Used for destructive actions (e.g., "Decline").

*   **Cards:**
    *   *Metric Cards:* Shadowed container, icon (top left), trend indicator (top right), large value, label underneath.
    *   *Score Cards:* Centered animated SVG donut chart, score inside, supporting metrics below.

*   **Tables:** Sticky header, sortable columns, paginated footer. Hover state highlights the row.
*   **Modals:** Darkened backdrop blur. Slide-in from bottom (mobile) or fade-in center (desktop).

### Badges & Tags
*   **Risk System:** `Success` (Emerald), `Warning` (Amber), `Danger` (Rose).
*   **Fraud Severity:** `CRITICAL` (Pulsing Rose), `HIGH` (Amber), `MEDIUM` (Cyan), `LOW` (Primary).

## 3. FIGMA-STYLE DESIGN SYSTEM (TEXT VERSION)

### Color Palette

| Token | Hex | Purpose |
|-------|-----|---------|
| `primary-500` | `#6366f1` | Main brand color, buttons, active states |
| `primary-hover` | `#4f46e5` | Button hover states |
| `bg-dark` | `#0f172a` | App background (Dark Mode) |
| `bg-light` | `#f8fafc` | App background (Light Mode) |
| `emerald-500` | `#10b981` | Success states, low risk metrics |
| `amber-500` | `#f59e0b` | Warnings, medium risk, SLA alerts |
| `rose-500` | `#f43f5e` | Errors, high risk, destructive actions |

### Typography Scale
*   **English Font:** Inter or Roboto.
*   **Arabic Font:** Tajawal, Cairo, or IBM Plex Arabic.

| Element | Size | Weight | Line Height (Eng) | Line Height (Ar) |
|---------|------|--------|-------------------|------------------|
| `h1` | 24px | 600 | 1.2 | 1.4 |
| `h2` | 20px | 500 | 1.3 | 1.5 |
| `body` | 14px | 400 | 1.5 | 1.6 |
| `small`| 12px | 400 | 1.5 | 1.6 |

### Spacing layout
Use an 4px baseline grid. Padding: `16px` for cards, `24px` for page sections. Radius: `8px` (`md`), `12px` (`lg`).

## 4. COPILOT INTERACTION MODEL

### Context-Awareness
*   **Customer Scope:** Autoloads customer profiles (e.g. "Ahmed's profile").
*   **Regulations Scope:** Automatically queries Pinecone for current UAE/KSA mandates based on selected country context.

### Inline Actions Available in UI
*   *Explain this score:* Copilot outputs a plain-text translation of SHAP importance features.
*   *Suggest decision:* Outlines pros/cons based on credit policy and history.
*   *Draft communication:* Creates approval/rejection text suitable for sending to the customer.

### Safety Guardrails
*   If confidence < 80% on policy queries: Prepend `[REQUIREMENT: HUMAN VERIFICATION]`.
*   PII elements (Names, IDs) are masked during processing externally.

## 5. SCENARIO SIMULATOR DESIGN

The **What-if Scenario Simulator** empowers users to dynamically test application parameters.

### User Interface Layout
```text
  +----------------------+---------------------------+
  |    INPUT PANEL       |     OUTPUT PANEL          |
  |                      |                           |
  | Tenor: [ 48 mo ]     |   Current Score:  [680]   |
  | ---------O----       |   Simulated Score:[710]   |
  |                      |                           |
  | Salary: [ 15,000 ]   |   Impact Highlights:      |
  |                      |   🟢 DSR drops to 45%     |
  | Down Pmt:[ 2,000 ]   |   🟢 LTV improved         |
  +----------------------+---------------------------+
```
*   **Interactivity:** Dragging the slider executes real-time recalculations via WebSockets or optimistic UI updates.
*   **Copilot Hook:** A button reads *"Explain Delta"*, generating AI narrative on why the score improved.

## 6. MOTION DESIGN SPECIFICATION

| Element | Animation Type | Duration | Easing Curve | Purpose |
|---------|----------------|----------|--------------|---------|
| **Score Meter** | Stroke-dashoffset fill | 1500ms | `ease-out` | Provide a sense of "calculating" |
| **Modals** | Opacity + TranslateY | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth entry |
| **Buttons** | Background-color transition | 150ms | `linear` | Responsive physical feedback |
| **Fraud Alerts** | Scale / Opacity Pulse | 1000ms (inf) | `ease-in-out` | Draw immediate attention |

*Accessibility:* Hook into CSS `@media (prefers-reduced-motion: reduce)` to disable transitions entirely.

## 7. GCC ARABIC UX TONE GUIDE

### Overview
Financial tools require a delicate balance. The Arabic interface must be purely formal (`الفصحى`), minimizing slang to maximize trust. English interfaces should be concise and action-oriented.

### Side-by-Side Translation Examples

| UI Element | English Tone | Arabic Translation (Tone) | Rationale |
|------------|--------------|---------------------------|-----------|
| **Primary Action** | Approve | موافقة | Noun-based, formal confirmation. |
| **Destructive Action** | Decline | رفض | Direct and unambiguous. |
| **Empty State** | No alerts found. | لا توجد تنبيهات حالياً. | Reassuring and definitive. |
| **Copilot Greeting** | How can I help? | كيف يمكنني مساعدتك؟ | Polite assistance prompt. |
| **Regulation Error** | DSR Exceeded | تجاوز نسبة عبء الدين | Formal financial terminology. |

### Typesetting Checks
*   Arabic script requires a line-height increase of roughly **10-15%** compared to Latin script to prevent descenders from colliding with ascenders.
*   Right-to-Left (RTL) spacing requires swapping margin-left and margin-right via CSS Logical Properties (`margin-inline-start`, `padding-inline-end`).
