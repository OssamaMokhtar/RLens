# RLens — AI Credit Scoring & Risk Platform for GCC Lending

> **Reference architecture with a clickable UI prototype.** No trained models, no live bureau or open-banking data, no users. Every number in the UI is sample data. Earlier names: RiskFree, RiskLens.

> Retail and SME credit decisioning with explainable scoring, AML/fraud screening, and an LLM copilot over regulatory policy — designed for Arabic/English markets.

**Architecture docs:** [full set](docs/README.md) · [status](docs/00-status.md) · [system architecture](docs/01-system-architecture.md) · [scoring logic](docs/07-scoring-logic.md) · [decision log](docs/13-decision-log.md) · [evaluation and fairness](docs/14-evaluation-and-fairness.md) · [gaps](docs/GAPS.md)

---

## The problem

Conventional credit scoring in the GCC leaves large segments effectively invisible: expatriate workers with short local credit histories, SMEs whose cash flow lives outside formal reporting, and first-time borrowers with no bureau file at all. Lenders respond by either rejecting them or pricing in blanket risk — losing viable customers and mispricing the ones they keep.

RLens is a product architecture for scoring those borrowers using alternative signals (open banking, telecom, utility) while staying explainable enough to defend to a regulator and a rejected applicant.

## What it does

- **Retail and SME credit scoring** — PD and LGD models with explainable factor attribution
- **Fraud detection & AML/sanctions screening** — pre-decision, not post-hoc
- **LLM copilot with RAG** over regulations, credit policy, and customer documents
- **Bilingual AR/EN interface** with a documented tone system for both languages
- **Full audit trail** — every automated decision reconstructable

## Architecture

The platform separates scoring, ingestion, fraud/AML, and LLM services behind an API gateway, with an event bus for async processing and a split OLTP / warehouse / vector data layer.

See **[docs/01-system-architecture.md](docs/01-system-architecture.md)** for the full diagram and component breakdown.

## Documentation

The substance of this project is the product and architecture thinking. Start here:

| Document | What's in it |
|---|---|
| [01 · System architecture](docs/01-system-architecture.md) | Services, message bus, data layer, external integrations |
| [02 · Data model](docs/02-data-model.md) | Core entities and relationships |
| [03 · API endpoints](docs/03-api-endpoints.md) | Service contracts |
| [04 · ML pipeline](docs/04-ml-pipeline.md) | Feature engineering → training → serving |
| [05 · LLM / RAG architecture](docs/05-llm-rag-architecture.md) | Copilot design, embeddings, retrieval strategy |
| [06 · User journeys & wireframes](docs/06-user-journeys-wireframes.md) | Credit officer, SME applicant, risk analyst flows |
| [07 · Scoring logic](docs/07-scoring-logic.md) | How a credit decision is actually reached |
| [08 · Security & deployment](docs/08-security-deployment.md) | Security posture, infrastructure, compliance |
| [09 · UI/UX design system](docs/09-ui-ux-design-system.md) | Components and interaction patterns |
| [10 · Bilingual tone pack](docs/10-bilingual-tone-pack.md) | AR/EN voice, copy rules, RTL considerations |
| [11 · Fintech UX elevation spec](docs/11-fintech-ux-elevation-spec.md) | Interaction quality bar |
| [12 · Regulatory positioning](docs/12-regulatory-positioning.md) | Decisioning system or decision support? |
| [13 · Decision log](docs/13-decision-log.md) | ADRs: LLM explains never decides; decision support; rules before model; fairness gate |
| [14 · Evaluation and fairness](docs/14-evaluation-and-fairness.md) | Pass bars set before any model exists |
| [GAPS](docs/GAPS.md) | What is open, ranked |

## Repository layout

| Path | Status |
|---|---|
| `src/`, `index.html` | **The app**: Vite + React 19, AR/EN with RTL, 9 screens (dashboard, applications, scoring, SME, risk, fraud/AML, copilot, regulations, profile) on sample data |
| `database/schema.sql` | Core relational schema |
| `docs/` | Product and architecture documentation (the substance of this project) |
| `frontend-app/`, `react-ui/`, `ui-kit/` | Earlier design explorations, kept for reference, not built |

## Run

```bash
npm install
npm run dev        # http://localhost:3000 — sign in with the prefilled demo account
npm run build
```

Demo: `https://ossamamokhtar.github.io/RLens/` once GitHub Pages is enabled (Settings → Pages → Source: GitHub Actions); `.github/workflows/pages.yml` deploys on every push to `main`.

## Status

**Prototype / reference architecture.** The UI runs on sample data; the scoring models, AML screening and copilot are specified in `docs/`, not built.

What a real build needs first, in order:
1. A lender partner and a data-sharing agreement. Without real labelled outcomes there is nothing to train or validate on.
2. A fairness plan before any model. Telecom and utility signals can act as proxies for nationality, which is a disparate-impact risk for expatriate borrowers.
3. A mapping of CBUAE and SAMA model-risk and consumer-protection rules to the explainability design.

**Fixed in the 23 Sep 2026 audit:** `main` did not build (a wrong import path in the entry file and in `Layout.jsx`, default imports of named page exports, a missing context provider). A first-time visitor was stuck on the loading screen, because `loading` started as `true` whenever no user was stored. Navigation was hard-wired to the dashboard, and the stylesheets were never imported.

## License

MIT — see [LICENSE](LICENSE).
