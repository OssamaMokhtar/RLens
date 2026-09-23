# 00 · Status

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

## One line

A designed credit platform with a working bilingual UI on sample data. No model, no real data, no lender, no users.

## Built versus designed

| Capability | Built (runs today) | Designed only (in docs) |
|---|---|---|
| Bilingual AR/EN UI with structural RTL | ✅ 9 screens, `src/` | |
| Dashboard, applications, scoring, SME, risk, fraud/AML, copilot, regulations, profile | ✅ Sample data from `src/lib/data.js` | |
| Relational schema (15 tables incl. `decision_audit_logs`, `model_registry`) | ✅ `database/schema.sql` (not deployed) | |
| Retail and SME PD/LGD models | | [04](04-ml-pipeline.md) |
| Policy rule engine (GCC DSR caps, sanctions, blacklist) | | [04 §6](04-ml-pipeline.md), [07 §3](07-scoring-logic.md) |
| Fraud and AML screening | | [01](01-system-architecture.md) |
| LLM copilot with RAG over policy and regulation | UI only; fixed sample replies, labelled on screen | [05](05-llm-rag-architecture.md) |
| Audit trail | Schema only | [08](08-security-deployment.md) |
| Fairness testing | | [14](14-evaluation-and-fairness.md) |

## What would unblock a real build, in order

1. A lender partner and data-sharing agreement. Without labelled repayment outcomes there is nothing to train or validate.
2. The fairness plan in [14](14-evaluation-and-fairness.md) signed off **before** model work. Telecom and utility signals can proxy for nationality.
3. A regulatory opinion that settles the positioning in [12](12-regulatory-positioning.md) and [ADR-002](13-decision-log.md#adr-002-position-as-decision-support-no-auto-approve-or-auto-decline-on-model-score-alone).

## CI

`.github/workflows/ci.yml`: install → docs gate → lint → build. `pages.yml` deploys the prototype to GitHub Pages on `main`.
