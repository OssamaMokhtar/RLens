# 13 · Decision log

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

Each record states the decision, what was rejected and why, and the evidence that would reverse it.

## ADR-001: The LLM explains; it never scores or decides

- **Decision.** Scores come from calibrated PD/LGD models and deterministic policy rules. The copilot ([05](05-llm-rag-architecture.md)) only explains a decision already made, citing the factor attribution and the policy clause. It has no write path to a score, a grade or a decision.
- **Rejected.** An LLM that reads the application file and proposes a grade. Why: not calibrated, not reproducible, not explainable under adverse-action rules, and its errors are hard to detect.
- **Reversal trigger.** None expected for scoring. For narrative risk memos, reconsider only if a held-out set shows officer edit rate under 20% with zero factual errors on 100 memos.

## ADR-002: Position as decision support; no auto-approve or auto-decline on model score alone

- **Context.** [07 §1.3](07-scoring-logic.md) maps grades AAA–A to auto-approve and CCC–D to auto-decline. [12](12-regulatory-positioning.md) recommends positioning as decision support. Those two cannot both be true: regulators judge substance, not labels.
- **Decision.** Until a regulatory opinion says otherwise, every score-driven outcome is a **recommendation** to a credit officer. Only hard policy rules (sanctions hit, blacklist, statutory DSR cap) may decline automatically, and each carries a reason code.
- **Rejected.** Straight-through processing for top grades. Why: it makes RLens a regulated automated decisioning system on day one, with a 12–24 month approval path.
- **Reversal trigger.** Written regulatory opinion permitting automated approval for a defined segment, plus 6 months of shadow-mode results where officer and model agree on ≥ 95% of that segment.

## ADR-003: Hard policy rules run before the model, not as a score adjustment

- **Decision.** Sanctions, blacklist, bureau default and statutory DSR caps are gates evaluated first ([07 §3](07-scoring-logic.md)). The model only scores applications that pass.
- **Rejected.** Folding policy into the score as weighted adjustments ([07 §1.2](07-scoring-logic.md) "Rule adjustments 15%"). Why: a strong score could offset a statutory breach, and the reason for a decline becomes a blend instead of a rule citation.
- **Reversal trigger.** None for statutory rules. Soft rules (for example marginal DSR) may stay as adjustments if each adjustment is logged as its own reason code.

## ADR-004: Alternative data only with a fairness gate in front of it

- **Decision.** Telecom, utility and open-banking features enter a model only after the proxy test in [14](14-evaluation-and-fairness.md) shows they do not predict nationality or gender above the stated threshold.
- **Rejected.** Using every available signal and checking fairness after launch. Why: in the GCC the thin-file population RLens exists to serve is mostly expatriate, so a nationality proxy harms exactly the target users.
- **Reversal trigger.** Not reversible by performance gains alone. A feature that fails the proxy test can return only with a documented mitigation that passes the same test.

## ADR-005: Bilingual by construction

- **Decision.** Arabic and English are both first-class from the first screen, with structural RTL mirroring and a shared tone pack ([10](10-bilingual-tone-pack.md)). Adverse-action reasons exist in both languages from the same reason code.
- **Rejected.** English build with an Arabic translation layer later. Why: adverse-action notices must be understood by the borrower; retrofitting RTL breaks layouts and reason-code parity.
- **Reversal trigger.** None for GCC markets.
