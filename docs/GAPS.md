# GAPS

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

Ranked by what blocks a credible build first.

| # | Gap | Why it matters | Next step |
|---|---|---|---|
| 1 | No lender partner or labelled repayment data | Nothing to train, validate or calibrate | Data-sharing agreement with one GCC lender or BNPL provider |
| 2 | No fairness evidence | Alternative data can proxy for nationality; the target users are mostly expatriate | Run the proxy test in [14 §2](14-evaluation-and-fairness.md) on the first dataset before modelling |
| 3 | Scoring spec auto-approves and auto-declines on score, contradicting the decision-support positioning | Regulatory classification risk | Apply [ADR-002](13-decision-log.md#adr-002-position-as-decision-support-no-auto-approve-or-auto-decline-on-model-score-alone) to [07](07-scoring-logic.md) grade table |
| 4 | No regulatory opinion (CBUAE, SAMA) | Decides what the product is allowed to be | Engage a fintech regulatory lawyer |
| 5 | Policy folded into the score as a 15% adjustment | A strong score can offset a rule breach | Apply [ADR-003](13-decision-log.md#adr-003-hard-policy-rules-run-before-the-model-not-as-a-score-adjustment) |
| 6 | Copilot confidence thresholds are uncalibrated | Self-reported LLM confidence is not a probability | Calibrate on graded set or drop the auto-respond band |
| 7 | Copilot is canned text in the UI | Demo could be mistaken for a working model | **Done 23 Sep 2026:** labelled on screen in AR and EN; wire to a real model only after [14 §3](14-evaluation-and-fairness.md) |
| 8 | `frontend-app/`, `react-ui/`, `ui-kit/` are unbuilt earlier explorations | Noise for reviewers | Move to `archive/` |
| 9 | No tests for the UI | Regressions only caught by build | Add smoke tests for RTL toggle and routing |
