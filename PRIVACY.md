# Privacy Policy

**Status:** Draft — for prototype use only. Not a substitute for legal advice.

## Data We Collect

| Data | Purpose | Retention |
|------|---------|-----------|
| Credit application data (PD/LGD inputs) | Credit decisioning | Per lender policy; minimum: duration of application + regulatory hold period |
| AML/sanctions screening data | Fraud and sanctions screening | Per regulatory requirement |
| LLM copilot documents | Retrieval-augmented generation for copilot responses | Per lender policy |
| Audit trail data | Regulatory defense, decision reconstruction | Per regulatory requirement (years) |
| Bilingual content preferences | User interface personalization | Session only |

## Data Storage

- All data is stored in the lender's infrastructure (prototype: local development only).
- No data is shared with third parties except as required for credit decisioning (e.g., credit bureau, AML screening provider).
- The Gemini API is used server-side only; no user data is sent to Gemini except what's required for the copilot response.

## Your Rights

Under UAE PDPL and applicable data protection laws, you have the right to:

- Access your data
- Correct inaccurate data
- Request deletion of your data (subject to regulatory retention requirements)
- Withdraw consent (where processing is consent-based)

## Contact

For privacy inquiries, contact the maintainer.

---

*Open items are ranked in [docs/GAPS.md](docs/GAPS.md).*
