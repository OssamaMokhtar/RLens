# 14 · Evaluation and fairness plan

> Status: AUTHORED (plan; nothing measured yet) · Updated 2026-09-23 · Owner: Ossama Mokhtar

Nothing here has been run. There is no model and no labelled data. This is the bar a model must clear, written before the model exists so the bar cannot move to fit the result.

## 1. Discrimination and calibration (per model, per segment)

| Metric | Pass bar | Segments reported separately |
|---|---|---|
| AUC-ROC on out-of-time holdout | ≥ 0.75 | Retail, SME; national vs expatriate; bureau-thin vs bureau-rich |
| Gini | ≥ 0.50 | Same |
| Calibration: predicted vs observed default by grade | Within ±20% per grade | Same |
| Lift over bureau-only baseline on thin-file segment | Must be positive with 95% CI above zero | Thin-file only |

The last row is the reason the product exists. If alternative data does not beat bureau-only on thin-file borrowers, RLens has no thesis.

## 2. Fairness

| Test | Method | Pass bar |
|---|---|---|
| Proxy test per alternative-data feature | Predict nationality group and gender from the feature alone | AUC ≤ 0.60 |
| Approval-rate parity | Adverse impact ratio by nationality group and gender | ≥ 0.80 (four-fifths rule), investigate anything lower |
| Error-rate parity | False-decline rate by group at the operating threshold | Gap ≤ 5 percentage points |
| Reject inference bias | Compare accepted-only vs reject-inferred models | Documented; no silent choice |

Protected attributes are used **only** for testing, never as model inputs, and are stored separately with restricted access.

## 3. Copilot (explanations)

| Metric | Method | Pass bar |
|---|---|---|
| Faithfulness | Every factor named in the explanation exists in the attribution with the same sign | 100% on 200 cases |
| Citation accuracy | Cited policy clause supports the statement | ≥ 95% on 200 cases, human-graded |
| Bilingual parity | AR and EN explanations of the same case name the same factors | 100% |
| No decision language | Explanation never states or changes an outcome | 0 violations |

The confidence bands in [05 §4.3](05-llm-rag-architecture.md) are not used until calibrated: a model's self-reported confidence is not a probability.

## 4. Operating evidence before any real decision

Shadow mode for at least 3 months alongside a lender's existing process, reporting officer–model agreement, overrides and their reasons, and every metric above on live traffic.
