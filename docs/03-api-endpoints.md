# API Endpoints Specification

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

## Base URL Structure
```
https://api.{country}.creditscore.bank/api/v1/
```

## Authentication
All endpoints require OAuth2 Bearer token. RBAC enforced via Keycloak.

---

## 1. Scoring Service

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| POST | `/score/retail` | Score retail application | CREDIT_OFFICER |
| POST | `/score/sme` | Score SME application | CREDIT_OFFICER |
| POST | `/score/pd` | Calculate PD | SCORING_ENGINE |
| POST | `/score/lgd` | Calculate LGD | SCORING_ENGINE |
| GET | `/score/{score_id}` | Get score details | CREDIT_OFFICER |
| GET | `/score/{score_id}/explain` | Get SHAP explanation | CREDIT_OFFICER |
| POST | `/score/batch` | Batch scoring (async) | RISK_MANAGER |
| POST | `/rules/evaluate` | Run rule engine | SCORING_ENGINE |
| GET | `/rules/country/{code}` | Get country rules | CREDIT_OFFICER |

### POST `/score/retail` — Request
```json
{
  "customer_id": "uuid",
  "application_id": "uuid",
  "product_type": "PERSONAL_LOAN",
  "country_code": "AE",
  "scoring_mode": "REALTIME",
  "include_explanation": true
}
```

### POST `/score/retail` — Response
```json
{
  "score_id": "uuid",
  "score_value": 742,
  "risk_grade": "B+",
  "pd_value": 0.023,
  "dsr_ratio": 0.38,
  "rules_passed": true,
  "recommendation": "APPROVE",
  "explanation": {
    "top_positive": [
      {"feature": "salary_stability", "impact": 0.15, "description_en": "Stable salary for 24+ months"},
      {"feature": "payment_history", "impact": 0.12, "description_en": "100% on-time payments"}
    ],
    "top_negative": [
      {"feature": "utilization_ratio", "impact": -0.08, "description_en": "High credit utilization at 72%"}
    ],
    "narrative_en": "This customer has a strong credit profile...",
    "narrative_ar": "يتمتع هذا العميل بملف ائتماني قوي..."
  }
}
```

---

## 2. Application Service

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| POST | `/applications` | Submit new application | CREDIT_OFFICER |
| GET | `/applications/{id}` | Get application details | CREDIT_OFFICER |
| PUT | `/applications/{id}/status` | Update status | CREDIT_OFFICER |
| POST | `/applications/{id}/decision` | Record decision | CREDIT_OFFICER, RISK_MANAGER |
| GET | `/applications?status={s}` | List by status | CREDIT_OFFICER |
| GET | `/applications/customer/{id}` | Customer applications | CREDIT_OFFICER |

---

## 3. Customer Service

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| GET | `/customers/{id}` | Get customer profile | CREDIT_OFFICER |
| GET | `/customers/{id}/summary` | AI-generated summary | CREDIT_OFFICER |
| GET | `/customers/{id}/features` | Get ML features | RISK_ANALYST |
| GET | `/customers/{id}/transactions` | Transaction history | CREDIT_OFFICER |
| GET | `/customers/{id}/risk-timeline` | Risk profile changes | RISK_MANAGER |
| GET | `/customers/search` | Search customers | CREDIT_OFFICER |

---

## 4. Fraud & AML Service

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| POST | `/fraud/screen` | Real-time fraud check | FRAUD_SYSTEM |
| GET | `/fraud/alerts` | List alerts | FRAUD_ANALYST |
| GET | `/fraud/alerts/{id}` | Alert details | FRAUD_ANALYST |
| PUT | `/fraud/alerts/{id}/assign` | Assign alert | FRAUD_MANAGER |
| PUT | `/fraud/alerts/{id}/resolve` | Resolve alert | FRAUD_ANALYST |
| POST | `/aml/cases` | Create AML case | AML_OFFICER |
| GET | `/aml/cases` | List cases | AML_OFFICER |
| GET | `/aml/cases/{id}` | Case details | AML_OFFICER |
| PUT | `/aml/cases/{id}/decision` | Case decision | AML_MANAGER |
| POST | `/sanctions/screen` | Screen against lists | COMPLIANCE |

---

## 5. LLM / RAG Service

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| POST | `/copilot/chat` | Chat with copilot | CREDIT_OFFICER, RM |
| POST | `/copilot/explain-score` | Explain a score | CREDIT_OFFICER |
| POST | `/copilot/suggest-actions` | Get risk mitigations | CREDIT_OFFICER |
| POST | `/copilot/draft-communication` | Draft customer comms | RM |
| POST | `/rag/query-regulations` | Query GCC regulations | ANY_INTERNAL |
| POST | `/rag/query-customer` | Query customer profile | CREDIT_OFFICER |
| POST | `/rag/index-document` | Index new document | ADMIN |
| POST | `/agent/execute` | Execute agent action | AGENT_SYSTEM |

### POST `/copilot/chat` — Request
```json
{
  "session_id": "uuid",
  "context": {
    "customer_id": "uuid",
    "application_id": "uuid",
    "portal": "CREDIT_OFFICER"
  },
  "message": "Why was this customer scored at 580?",
  "language": "en"
}
```

---

## 6. Data Ingestion Service

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| POST | `/ingest/transactions` | Batch transaction upload | ETL_SERVICE |
| POST | `/ingest/salary` | Salary/employment data | ETL_SERVICE |
| POST | `/ingest/bureau` | Credit bureau data | ETL_SERVICE |
| POST | `/ingest/sme-financials` | SME financial data | ETL_SERVICE |
| GET | `/ingest/jobs` | List ingestion jobs | DATA_ENGINEER |
| GET | `/ingest/jobs/{id}/status` | Job status | DATA_ENGINEER |
| GET | `/ingest/quality-report` | Data quality metrics | DATA_ENGINEER |

---

## 7. Analytics & Reporting

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| GET | `/analytics/portfolio` | Portfolio overview | RISK_MANAGER |
| GET | `/analytics/portfolio/pd-distribution` | PD distribution | RISK_MANAGER |
| GET | `/analytics/portfolio/npl-trend` | NPL trends | RISK_MANAGER |
| GET | `/analytics/portfolio/sector-exposure` | Sector breakdown | RISK_MANAGER |
| GET | `/analytics/early-warning` | Early warning list | RISK_MANAGER |
| GET | `/analytics/model-performance` | Model monitoring | DATA_SCIENTIST |
| GET | `/analytics/audit-trail` | Audit log query | COMPLIANCE |
| GET | `/reports/regulatory/{country}` | Regulatory report | COMPLIANCE |

---

## 8. Admin & Configuration

| Method | Endpoint | Description | Auth Role |
|--------|----------|-------------|-----------|
| GET | `/config/countries` | List country configs | ADMIN |
| PUT | `/config/countries/{code}` | Update country config | ADMIN |
| GET | `/config/rules` | List all rules | ADMIN |
| PUT | `/config/rules/{id}` | Update rule | ADMIN |
| GET | `/models` | List ML models | DATA_SCIENTIST |
| POST | `/models/deploy` | Deploy model to prod | MODEL_ADMIN |
| PUT | `/models/{id}/retire` | Retire model | MODEL_ADMIN |
