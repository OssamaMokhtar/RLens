# Security

**Status:** Prototype / reference architecture — not production hardened.

## Data Classification

| Data Type | Classification | Encryption |
|-----------|---------------|------------|
| Credit application data (PD/LGD inputs) | Sensitive financial PII | TLS in transit; at rest: not yet implemented in prototype |
| AML/sanctions screening data | Sensitive financial PII + sanctions data | TLS in transit; at rest: not yet implemented |
| LLM copilot documents (regulations, credit policy) | Internal / confidential | TLS in transit; at rest: not yet implemented |
| Audit trail | Internal / regulatory | TLS in transit; at rest: not yet implemented |
| Bilingual content (tone pack) | Internal | Not sensitive |

## API Key Protection

- The Gemini API key is held server-side only.
- A build-time check asserts the key cannot appear in the client bundle.
- The key is never exposed to the browser.

## Access Control

- Access control is designed around roles: credit officer, SME applicant, risk analyst, admin.
- The prototype implements basic ownership checks.
- Full RBAC with SSO is on the roadmap (see improvement plan).

## Audit Trail

- Every automated credit decision is designed to be reconstructable.
- The prototype implements a basic audit log.
- Full audit trail with tamper-evident logging is on the roadmap.

## Known Security Gaps

| Gap | Severity | Roadmap |
|-----|----------|---------|
| No encryption at rest for sensitive data | High | Pre-production |
| No RBAC beyond basic ownership | High | Pre-production |
| No SSO (SAML/OIDC) | High | Pre-production |
| No penetration test | High | Pre-production |
| No dependency vulnerability scanning | Medium | CI (this PR) |
| No threat model document | Medium | Pre-production |

## Reporting a Vulnerability

Contact the maintainer directly. Do not open a public issue for security vulnerabilities.

---

*Open items are ranked in [docs/GAPS.md](docs/GAPS.md).*
