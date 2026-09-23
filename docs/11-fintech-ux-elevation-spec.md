# GCC AI Credit Platform: World-Class UX Elevation Specification

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

This document defines the technical and visual standards for the “World-Class” version of the platform. It serves as the master blueprint for designers, engineers, and motion specialists.

---

## 1. COPILOT DASHBOARD “PULSE” SYSTEM
*From Reactive Chat to Anticipatory Intelligence.*

### 1.1 Pulse Engine Logic
The engine monitors the frontend data-bus for state changes and applies an anomaly-detection heuristic:
*   **DSR Spike:** If `current_dsr > 0.45` AND `previous_dsr <= 0.45`.
*   **Sector Risk:** If `sector_avg_npl > 5%` OR `sector_volatility > 20%`.
*   **Fraud Pulse:** High-velocity sequence of applications from the same IP/Location.
*   **Missing Docs:** Application status "Submitted" but `mandates_count < requirements`.

### 1.2 Interaction Model
*   **State: Idle** → No pulse.
*   **State: Alert** → 
    *   **Visual:** Copilot FAB glows with an outer-aura (`box-shadow: 0 0 20px rgba(99, 102, 241, 0.4)`).
    *   **Animation:** 2s breathing cycle (Ease-in-out).
*   **“Insight Chip” Delivery:**
    *   Chips appear as floating overlays next to relevant data points.
    *   **Tap:** Reveals a 2-sentence executive summary.
    *   **Long-Press:** Transitions into a deep-reasoning thread in the Copilot panel.

---

## 2. ADVANCED EXPLAINABILITY (SHAP WATERFALLS)
*From Hidden Scores to Visible Logic.*

### 2.1 Waterfall Architecture
The chart visualizes `f(x) - E[f(x)]` (the difference between the model’s output and its expected value).

```text
[BASELINE: 600] >>> [TOTAL SCORE: 742]
-----------------------------------------
[+] Salary Stability      | +80  [██████  ] (Green)
[+] Payment History       | +45  [███     ] (Green)
[-] Sector Risk (Retail)  | -15  [█        ] (Red)
[-] High Utilization      | -20  [██       ] (Red)
-----------------------------------------
```

### 2.2 Interactive Rules
*   **RTL Orientation:** In Arabic mode, the Waterfall baseline starts from the **Right** and expands **Left**.
*   **“What-If” Integration:** Sliders in the Scenario Simulator live-update the waterfall bars with a `300ms` staggered delay.

---

## 3. ROLE-BASED ADAPTIVE DASHBOARD LAYOUTS
*Contextual Utility for Every Persona.*

### 3.1 Persona Layout Maps
| Role | Primary Widget | Sidebar Focus | Copilot Prompt |
|:---|:---|:---|:---|
| **Credit Officer** | App Queue (Horizontal) | Alerts, Underwriting | “Decision impact summary” |
| **Risk Manager** | Portfolio Heatmap | Analytics, Fraud | “Identify high-risk clusters” |
| **SME Specialist** | Sector Exposure | Industry, SME Radar | “Analyze cashflow stability” |

### 3.2 Motion Transition
When switching roles, the dashboard uses a **Grid Morph**:
*   Widgets fade out (`opacity: 0, scale: 0.95`).
*   Grid rows/columns animate to new proportions (CSS Grid `fr` transitions).
*   Widgets fade back in with a **Staggered Delay** (`50ms` per widget).

---

## 4. PREMIUM ARABIC-FIRST TYPOGRAPHY & VISUAL LOGIC
*Native Experience, Not Translation.*

### 4.1 Typographic Scale
*   **Body:** `Tajawal` (Regular, 16px) | `line-height: 1.6`.
*   **Data/Numbers:** `IBM Plex Arabic` (Medium, 14px) | Ensuring non-ambiguity in digits.
*   **Headings:** `Cairo` (Bold, 24-32px) | `letter-spacing: -0.01em`.

### 4.2 Visual Logic Rules
*   **Mirroring:** Only mirrors **directional** items (arrows, progress bars, calendars). **Quantifiable** symbols (icons for 'Money', 'Phone') remain non-mirrored to preserve brand recognition.
*   **Padding Harmony:** Increase padding-right on buttons in Arabic mode to account for the script’s visual density.

---

## 5. MICRO-INTERACTIVE “DELIGHT” LAYER
*Surface Physics & Tactile Precision.*

### 5.1 Motion Specifications
*   **Standard Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (Back Out - for "Overshoot" bounce).
*   **Liquid Progress:** `ScoreMeter` uses `transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)`.
*   **Spring Physics:** Modals open with `mass: 1, tension: 280, friction: 60`.

### 5.2 Accessibility Fallbacks
*   **Reduced Motion Mode:** All durations set to `0ms`. Transitions replaced with simple `opacity` cross-fades.
*   **Contrast:** Minimum `4.5:1` ratio for all text on cards.

---

## ✅ Summary of Implementation Impact
This specification ensures that every pixel and pulse on the GCC AI Credit Platform reflects the **premium authority** of an enterprise banking system while maintaining the **agility** of a top-tier fintech.
