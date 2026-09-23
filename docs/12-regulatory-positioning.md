# Regulatory Positioning

**Status:** Draft — for planning purposes only. Not legal advice.

## Product Classification Question

Is RLens a **regulated credit decisioning system** (requiring CBUAE/SAMA approval) or a **decision-support tool** (lower regulatory bar)?

This is the fundamental regulatory question that determines everything: what we can say, what we can build, what we can deploy, and what approvals we need.

## Possible Positions

### Option A: Regulated Credit Decisioning System

If RLens makes automated credit decisions that lenders rely on, it may be classified as a regulated credit decisioning system. This would require:

- CBUAE (UAE central bank) approval for lending technology
- SAMA (Saudi central bank) approval for Saudi market
- Explainability requirements (already designed for)
- Audit trail requirements (already designed for)
- Model validation and governance requirements
- Potential license requirements

**Timeline estimate:** 12–24 months, AED 500K–2M+ in regulatory, legal, and compliance costs.

### Option B: Decision-Support Tool

If RLens positions as a tool that *supports* human credit decisions (not replaces them), the regulatory bar may be lower:

- The credit officer makes the final decision
- RLens provides scoring, factor attribution, and recommendations
- The tool is positioned as "decision intelligence" not "automated decisioning"
- Regulatory requirements may be lighter, but not zero

**Risk:** This positioning must be genuine — regulators look at substance, not labels. If the tool is de facto making automated decisions, calling it "decision support" won't help.

## Recommended Approach

1. **Engage a UAE fintech regulatory lawyer** — before any deployment, before any lender conversation that involves real credit decisions.
2. **Document the intended scope of use** — what the tool does, what it doesn't do, who makes the final decision, what the human oversight is.
3. **Map CBUAE/SAMA requirements** — what approvals, if any, are required for the intended use case.
4. **Design for explainability and audit from the start** — this is already in the architecture. Make it verifiable, not just designed.

## Current Status

- Architecture designed for explainability and audit (factor attribution, full audit trail)
- No regulatory engagement yet
- No legal opinion obtained
- No deployment to real credit decisions

---

*See [Improvement Plan — RiskFree](../../Obsidian/Portfolio-Due-Diligence/03-Improvement-Plan-RiskFree.md) for the full regulatory roadmap.*
