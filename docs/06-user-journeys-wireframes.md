# User Journeys & UI Wireframes

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

## 1. Retail Loan Application Journey

```
Step 1: Application Intake
├── Customer visits branch or applies online
├── RM/System captures: personal details, employment, income docs
├── System runs: KYC check, sanctions screening
└── Status: SUBMITTED

Step 2: Data Enrichment (Automated)
├── Credit bureau pull (AECB/SIMAH/etc.)
├── Salary verification (via employer/WPS)
├── Open Banking data fetch (if consented)
├── Transaction history analysis
└── Feature computation → Feature Store

Step 3: AI Scoring (Automated, < 3 seconds)
├── Feature extraction from Feature Store
├── ML model prediction (PD + Score)
├── Rule engine evaluation (DSR, min salary, age, etc.)
├── SHAP explanation generation
├── LLM narrative generation (EN + AR)
└── Status: SCORED

Step 4: Decision
├── AUTO-APPROVE: Score ≥ 700, all rules pass, DSR < 40%
├── AUTO-DECLINE: Score < 400 or critical rule failure
├── REFER: Everything else → Credit Officer queue
│   ├── Officer reviews score + explanation via Copilot
│   ├── Copilot suggests mitigations if needed
│   ├── Officer makes decision (approve/decline/modify)
│   └── Decision + rationale logged to audit trail
└── Status: APPROVED / DECLINED / REFERRED

Step 5: Post-Decision
├── If approved: terms finalization, document signing, disbursement
├── If declined: decline letter generated (bilingual)
├── Audit log: complete trail of data → score → decision → rationale
└── Customer notification (SMS/email, bilingual)
```

## 2. SME Loan Application Journey

```
Step 1: Application Intake
├── RM captures: business details, trade license, financial statements
├── Owner/guarantor personal details
├── Collateral details (if any)
├── Purpose and requested terms
└── Status: SUBMITTED

Step 2: Data Enrichment
├── Trade license verification
├── Owner credit bureau check
├── Business banking history analysis
├── Financial statement parsing (OCR + AI extraction)
├── Sector risk assessment
├── Collateral valuation (if applicable)
└── Feature computation → SME Feature Store

Step 3: AI Scoring
├── SME PD model scoring (52 features)
├── LGD estimation (with collateral)
├── Rule engine: min years, sector exclusions, max exposure
├── SHAP explanations + LLM narrative
├── Sector benchmarking
└── Status: SCORED

Step 4: Credit Committee / Officer Decision
├── SME cases typically require manual review
├── Credit Officer uses Copilot to:
│   ├── Review financial trends
│   ├── Understand sector risks
│   ├── Compare to portfolio benchmarks
│   ├── Evaluate collateral coverage
│   └── Generate credit memo draft
├── For larger exposures → Credit Committee
└── Decision logged with full audit trail

Step 5: Fulfillment
├── Approved: facility letter, security documentation, disbursement
├── Declined: formal decline with rationale
├── Monitoring: ongoing covenant monitoring, early warning triggers
└── Annual review: automated re-scoring and flag if deteriorating
```

## 3. Fraud Alert Investigation Journey

```
Step 1: Alert Generation (Automated)
├── Real-time transaction monitoring detects anomaly
├── Fraud model assigns score (0-1)
├── Alert created with: type, severity, details
├── Priority scoring: CRITICAL > HIGH > MEDIUM > LOW
└── Alert appears in Fraud Analyst dashboard

Step 2: Triage & Assignment
├── Fraud Manager reviews incoming alerts
├── Auto-assignment based on: analyst workload, expertise, country
├── Analyst receives alert notification
└── Status: ASSIGNED

Step 3: Investigation
├── Analyst opens alert in investigation workbench
├── Views: transaction details, customer profile, history
├── Copilot provides: pattern analysis, similar past cases
├── Analyst checks: device info, geolocation, velocity patterns
├── Analyst adds investigation notes (timestamped)
├── May request: customer contact, additional docs, account freeze
└── Status: INVESTIGATING

Step 4: Resolution
├── FALSE_POSITIVE: Mark as false positive, update model feedback
├── CONFIRMED_FRAUD: 
│   ├── Account actions (freeze, block card)
│   ├── Customer notification
│   ├── Law enforcement referral (if applicable)
│   └── If threshold met → SAR/STR filing
├── ESCALATED: To AML team for deeper investigation
└── Status: RESOLVED / ESCALATED

Step 5: SAR Filing (if required)
├── AML officer drafts SAR/STR
├── Copilot assists with regulatory-compliant drafting
├── Supervisor review and approval
├── Filed with relevant regulator (per country)
└── Case documented and archived
```

## 4. Risk Officer Portfolio Review Journey

```
Step 1: Dashboard Overview
├── Open Risk Dashboard → Portfolio Summary
├── View: total exposure, weighted PD, NPL ratio, provisions
├── Country breakdown (6 GCC countries)
├── Product breakdown (PL, CC, Auto, BNPL, WC, AF, TF)
└── Trend charts (3m, 6m, 12m)

Step 2: Early Warning Analysis
├── Navigate to Early Warning Indicators tab
├── View customers with deteriorating signals:
│   ├── Score decline > 50 points in 30 days
│   ├── Missed payments (new DPD)
│   ├── Utilization spike > 90%
│   ├── Income reduction (salary change)
│   └── Sector stress signals (for SMEs)
├── Filter by: country, segment, product, severity
└── Export list for RM action

Step 3: Drill-Down Investigation
├── Click on segment → see granular breakdown
├── Click on customer → full profile with AI summary
├── Use Copilot: "What changed for this customer in 6 months?"
├── Copilot provides timeline of risk-relevant events
└── Officer can trigger: re-scoring, limit review, watchlist

Step 4: Reporting
├── Generate regulatory reports per country
├── Portfolio quality report for board/management
├── Model performance report (Gini, KS, drift metrics)
└── Export to PDF/Excel with bilingual support
```

---

## 5. UI Wireframes (Text Descriptions)

### 5.1 Credit Officer Portal

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏦 GCC Credit Platform    [EN|عربي]    🔔 Notifications   👤  │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                        │
│  📋   │  CREDIT OFFICER DASHBOARD                              │
│ Queue  │                                                        │
│  12    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│        │  │ Pending  │ │ Scored   │ │ Approved │ │ Declined │ │
│  📊   │  │    12    │ │    8     │ │   45     │ │   15     │ │
│ Stats  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│        │                                                        │
│  🤖   │  PENDING APPLICATIONS                                  │
│Copilot │  ┌─────────────────────────────────────────────────┐  │
│        │  │ #AE-2026-1234 │ Ahmed Al-M. │ PL │ 50K AED    │  │
│  📄   │  │ Score: 580    │ Grade: BB- │ DSR: 52% │ REFER  │  │
│ Docs   │  │ ⚠ DSR exceeds limit │ [Review] [Copilot Ask]  │  │
│        │  ├─────────────────────────────────────────────────┤  │
│  ⚙️   │  │ #AE-2026-1235 │ Fatima K.  │ CC │ 25K AED    │  │
│Settings│  │ Score: 742    │ Grade: B+  │ DSR: 38% │ AUTO-A │  │
│        │  │ ✅ All rules pass │ [View Details]              │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  APPLICATION DETAIL VIEW (expanded)                   │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ Customer: Ahmed Al-Mansouri                      │  │
│        │  │ Product: Personal Loan │ Amount: 50,000 AED     │  │
│        │  │ Tenure: 48 months      │ Purpose: Home furnish  │  │
│        │  │                                                   │  │
│        │  │ [Score Tab] [Profile Tab] [Documents] [History]   │  │
│        │  │                                                   │  │
│        │  │ CREDIT SCORE: 580                                │  │
│        │  │ ████████████████░░░░░░░░ Risk Grade: BB-         │  │
│        │  │                                                   │  │
│        │  │ TOP FACTORS:                                      │  │
│        │  │ 🔴 Credit utilization: 78% (high)    -45 pts    │  │
│        │  │ 🔴 2× late payments in 12m           -38 pts    │  │
│        │  │ 🔴 Short job tenure (8m)             -22 pts    │  │
│        │  │ 🟢 Gov employer (stable)             +30 pts    │  │
│        │  │ 🟢 Low cash withdrawals              +15 pts    │  │
│        │  │                                                   │  │
│        │  │ ⚠️ DSR: 52% (exceeds 50% CBUAE limit)           │  │
│        │  │                                                   │  │
│        │  │ [Approve] [Decline] [Modify & Approve] [Ask AI]  │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  AI COPILOT PANEL (slide-out)                         │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 🤖 Credit Officer Copilot                       │  │
│        │  │                                                   │  │
│        │  │ You: Why is the score low for this customer?     │  │
│        │  │                                                   │  │
│        │  │ AI: Based on the analysis of Ahmed's profile...  │  │
│        │  │ The score of 580 is primarily driven by:         │  │
│        │  │ 1. High credit utilization at 78%...             │  │
│        │  │                                                   │  │
│        │  │ Suggested mitigations:                            │  │
│        │  │ • Reduce amount to 42,500 AED (DSR → 48%)       │  │
│        │  │ • Request salary certificate (6 months)          │  │
│        │  │                                                   │  │
│        │  │ ⚠️ AI recommendation — human decision required   │  │
│        │  │                                                   │  │
│        │  │ [Type your question...]              [Send]       │  │
│        │  └─────────────────────────────────────────────────┘  │
└────────┴────────────────────────────────────────────────────────┘
```

### 5.2 Risk & AML Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏦 GCC Credit Platform    [EN|عربي]                     👤    │
├────────┬────────────────────────────────────────────────────────┤
│        │  RISK DASHBOARD                                        │
│ 📊    │                                                        │
│Overview│  ┌──────────────────────────────────────────────────┐ │
│        │  │ PORTFOLIO SUMMARY          as of 31 Mar 2026     │ │
│ ⚠️    │  │                                                    │ │
│ Early  │  │ Total Exposure    │ Weighted PD │ NPL Ratio      │ │
│Warning │  │ 2.4B AED         │ 3.2%        │ 2.1%           │ │
│        │  │                                                    │ │
│ 🔍    │  │ [UAE: 45%] [KSA: 28%] [QA: 12%] [BH: 8%] ...   │ │
│ Drill  │  └──────────────────────────────────────────────────┘ │
│ Down   │                                                        │
│        │  ┌────────────────────┐ ┌───────────────────────────┐ │
│ 📈    │  │ PD DISTRIBUTION    │ │ NPL TREND (12 months)     │ │
│ Models │  │                    │ │                           │ │
│        │  │  ▓▓▓▓▓▓▓▓▓░░░░   │ │  ────────────────         │ │
│ 🚨    │  │  AAA  AA  A  BBB  │ │  2.0% → 2.1% (+0.1%)     │ │
│ Fraud  │  │  B   CCC  CC  D  │ │                           │ │
│        │  └────────────────────┘ └───────────────────────────┘ │
│ 📋    │                                                        │
│Reports │  EARLY WARNING SIGNALS (23 customers flagged)         │
│        │  ┌──────────────────────────────────────────────────┐ │
│        │  │ Customer      │ Signal           │ Severity      │ │
│        │  │ Ahmed M.      │ Score drop -65   │ 🔴 HIGH      │ │
│        │  │ Gulf Trade Co │ Missed payment   │ 🟠 MEDIUM    │ │
│        │  │ Fatima K.     │ Util spike 92%   │ 🟡 LOW       │ │
│        │  │ [View All 23] [Export] [Assign to RM]            │ │
│        │  └──────────────────────────────────────────────────┘ │
│        │                                                        │
│        │  FRAUD & AML ALERTS                                   │
│        │  ┌──────────────────────────────────────────────────┐ │
│        │  │ Open: 15 │ Critical: 3 │ Avg Resolution: 2.4d   │ │
│        │  │                                                    │ │
│        │  │ 🔴 #FA-001 Rapid velocity (12 txns/5 min)       │ │
│        │  │ 🔴 #FA-002 Sanctions near-match                 │ │
│        │  │ 🔴 #FA-003 Large unusual transfer               │ │
│        │  │ [View Alert Queue] [Create Case]                  │ │
│        │  └──────────────────────────────────────────────────┘ │
└────────┴────────────────────────────────────────────────────────┘
```

### 5.3 SME Lending Portal

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏦 SME LENDING PORTAL    [EN|عربي]                      👤    │
├────────┬────────────────────────────────────────────────────────┤
│        │  SME APPLICATION: Gulf Trading & Logistics LLC        │
│ 📋    │                                                        │
│ New    │  ┌─────────────────────────────────────────────────┐  │
│ App    │  │ Business Profile                                 │  │
│        │  │ Sector: Trading & Logistics │ Years: 7           │  │
│ 📂    │  │ Revenue: 12M AED │ Employees: 45                │  │
│ Active │  │ Banking since: 2019                              │  │
│ Apps   │  └─────────────────────────────────────────────────┘  │
│   8    │                                                        │
│        │  ┌─────────── SME CREDIT SCORECARD ─────────────┐    │
│ 💰    │  │ Score: 685 │ Grade: BBB │ PD: 4.2%            │    │
│ Portf. │  │                                                │    │
│        │  │ Financial Health     ████████░░  72/100        │    │
│ 📊    │  │ Cashflow Stability   ███████░░░  65/100        │    │
│ Report │  │ Sector Risk          ██████████  85/100        │    │
│        │  │ Payment Behavior     ████████░░  78/100        │    │
│        │  │ Management Quality   ███████░░░  68/100        │    │
│        │  │                                                │    │
│        │  │ Collateral Coverage: 120%                      │    │
│        │  │ DSCR: 1.35x │ Current Ratio: 1.8x             │    │
│        │  └────────────────────────────────────────────────┘    │
│        │                                                        │
│        │  [Financial Trends] [Trade History] [Collateral]      │
│        │  [Owner Profile] [AI Analysis] [Decision]             │
└────────┴────────────────────────────────────────────────────────┘
```
