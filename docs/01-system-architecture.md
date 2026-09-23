# AI Credit Scoring & Risk Platform — System Architecture

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          GCC AI Credit Scoring Platform                         │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                        PRESENTATION LAYER                                │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────────┐   │  │
│  │  │Credit Officer│ │   SME        │ │  Risk & AML  │ │  Copilot      │   │  │
│  │  │   Portal     │ │ Lending      │ │  Dashboards  │ │  Interfaces   │   │  │
│  │  │   (React)    │ │ Portal       │ │  (React)     │ │  (React)      │   │  │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └───────┬───────┘   │  │
│  └─────────┼────────────────┼────────────────┼──────────────────┼───────────┘  │
│            │                │                │                  │               │
│  ┌─────────▼────────────────▼────────────────▼──────────────────▼───────────┐  │
│  │                        API GATEWAY (Kong / AWS API Gateway)              │  │
│  │          Authentication │ Rate Limiting │ Audit Logging                  │  │
│  └─────────┬────────────────┬────────────────┬──────────────────┬───────────┘  │
│            │                │                │                  │               │
│  ┌─────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐ ┌───────▼───────────┐  │
│  │ SCORING        │ │ DATA         │ │ FRAUD & AML  │ │ LLM / RAG         │  │
│  │ SERVICE        │ │ INGESTION    │ │ SERVICE      │ │ SERVICE           │  │
│  │ (FastAPI)      │ │ SERVICE      │ │ (FastAPI)    │ │ (FastAPI)         │  │
│  │                │ │ (FastAPI)    │ │              │ │                   │  │
│  │ • Retail Score │ │              │ │ • Fraud Det. │ │ • Copilots        │  │
│  │ • SME Score    │ │ • ETL/ELT   │ │ • AML Screen │ │ • RAG Engine      │  │
│  │ • PD Model    │ │ • Quality    │ │ • Sanctions  │ │ • Agents          │  │
│  │ • LGD Model   │ │ • Transform  │ │ • Alerts     │ │ • Embeddings      │  │
│  └───────┬────────┘ └──────┬───────┘ └──────┬───────┘ └───────┬───────────┘  │
│          │                 │                 │                 │               │
│  ┌───────▼─────────────────▼─────────────────▼─────────────────▼───────────┐  │
│  │                       MESSAGE BUS (Apache Kafka / RabbitMQ)             │  │
│  │              Event Streaming │ Async Processing │ CQRS                  │  │
│  └───────┬─────────────────┬─────────────────┬─────────────────┬───────────┘  │
│          │                 │                 │                 │               │
│  ┌───────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐ ┌───────▼───────────┐  │
│  │ PostgreSQL   │ │ Data         │ │ Redis        │ │ Vector DB         │  │
│  │ (Core OLTP)  │ │ Warehouse    │ │ (Cache +     │ │ (Pinecone /       │  │
│  │              │ │ (BigQuery /  │ │  Sessions)   │ │  Chroma)          │  │
│  │ • Customers  │ │  Snowflake)  │ │              │ │                   │  │
│  │ • Scores     │ │              │ │ • Score Cache│ │ • Regulations     │  │
│  │ • Decisions  │ │ • Analytics  │ │ • Rate Limit │ │ • Policies        │  │
│  │ • Audit Logs │ │ • ML Features│ │ • Sessions   │ │ • Customer Docs   │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                     EXTERNAL INTEGRATIONS                               │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌─────────────┐  │  │
│  │  │Core     │ │Open      │ │KYC       │ │Sanctions  │ │Telecom /    │  │  │
│  │  │Banking  │ │Banking   │ │Providers │ │Screening  │ │Utility APIs │  │  │
│  │  │Systems  │ │APIs      │ │          │ │           │ │             │  │  │
│  │  └─────────┘ └──────────┘ └──────────┘ └───────────┘ └─────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                     INFRASTRUCTURE & DEVOPS                             │  │
│  │  Docker │ Kubernetes │ CI/CD │ Monitoring │ Logging │ Secrets Mgmt     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Service Decomposition

### 2.1 Scoring Service (Python + FastAPI)

| Sub-module | Responsibility | Endpoints |
|---|---|---|
| Retail Scorer | Personal loan, credit card, auto loan, BNPL scoring | `POST /api/v1/score/retail` |
| SME Scorer | Working capital, asset finance, trade finance scoring | `POST /api/v1/score/sme` |
| PD Engine | Probability of Default calculation | `POST /api/v1/score/pd` |
| LGD Engine | Loss Given Default estimation | `POST /api/v1/score/lgd` |
| Rule Engine | Policy rules overlay (DSR, min salary, blacklists) | `POST /api/v1/rules/evaluate` |
| Explainer | SHAP-based explanations per score | `GET /api/v1/score/{id}/explain` |
| Model Registry | Model versioning and A/B testing | `GET /api/v1/models` |

### 2.2 Data Ingestion Service (Python + FastAPI)

| Sub-module | Responsibility |
|---|---|
| ETL Orchestrator | Apache Airflow DAGs for batch data ingestion |
| Stream Processor | Real-time transaction ingestion via Kafka |
| Data Quality | Great Expectations validation suite |
| PII Handler | Tokenization, hashing, anonymization |
| Feature Store | Feast-based feature serving (online + offline) |

### 2.3 Fraud & AML Service (Python + FastAPI)

| Sub-module | Responsibility |
|---|---|
| Transaction Monitor | Real-time fraud scoring via velocity/pattern checks |
| Sanctions Screener | UN/OFAC/GCC-specific watchlist matching |
| Alert Engine | Alert creation, scoring, and prioritization |
| Case Manager | Investigation workflow: assign → investigate → resolve |
| SAR/STR Generator | Suspicious Activity/Transaction Report drafting |

### 2.4 LLM / RAG Service (Python + FastAPI)

| Sub-module | Responsibility |
|---|---|
| Copilot Engine | Credit Officer + RM copilot orchestration |
| RAG Pipeline | Document retrieval + context assembly |
| Agent Framework | Multi-tool agent (call APIs, retrieve docs, propose decisions) |
| Embedding Service | Document chunking + embedding generation |
| Vector Store Manager | CRUD ops on Pinecone/Chroma collections |

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Backend** | Python 3.11+ / FastAPI | Async, high performance, ML-native |
| **Frontend** | React 18 + TypeScript | Component-based, bilingual support |
| **API Gateway** | Kong / AWS API Gateway | Auth, rate limiting, routing |
| **Message Bus** | Apache Kafka | Event streaming, CQRS, audit trail |
| **Task Queue** | Celery + Redis | Async background jobs |
| **OLTP DB** | PostgreSQL 16 | ACID, JSON support, partitioning |
| **Data Warehouse** | BigQuery / Snowflake | Analytics, ML training data |
| **Cache** | Redis 7 | Score caching, sessions, rate limiting |
| **Vector DB** | Pinecone / Chroma | RAG embeddings, similarity search |
| **Feature Store** | Feast | Online + offline feature serving |
| **ML Framework** | XGBoost, LightGBM, scikit-learn | Explainable, proven in credit scoring |
| **Explainability** | SHAP, EBM | Local + global explanations |
| **LLM** | GPT-4 / Claude / Gemini (via API) | Copilots, RAG, agents |
| **Embeddings** | text-embedding-3-large / Gecko | Document + query embeddings |
| **Orchestration** | Apache Airflow | ETL/ELT scheduling |
| **Container** | Docker + Kubernetes (EKS/GKE) | Deployment, scaling |
| **CI/CD** | GitHub Actions / GitLab CI | Pipeline automation |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting |
| **Logging** | ELK Stack (Elastic, Logstash, Kibana) | Centralized logging |
| **Secrets** | HashiCorp Vault / AWS Secrets Manager | Secure credential storage |
| **Auth** | Keycloak / Auth0 | OAuth2, OIDC, RBAC |

---

## 4. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                │
│                                                                 │
│  SOURCES              INGESTION           PROCESSING           │
│  ────────             ─────────           ──────────           │
│                                                                 │
│  Core Banking ──┐                                              │
│  Payroll ───────┤                    ┌──────────────┐          │
│  Transactions ──┤    ┌──────────┐    │ Feature      │          │
│  Open Banking ──┼───▶│ETL/ELT   │───▶│ Engineering  │          │
│  Telecom ───────┤    │Pipeline  │    │ (Feast)      │          │
│  Utilities ─────┤    └──────────┘    └──────┬───────┘          │
│  KYC/AML ───────┤                           │                  │
│  Trade Data ────┘                           ▼                  │
│                                    ┌──────────────┐            │
│                                    │ ML Scoring   │            │
│                   ┌──────────┐     │ Engine       │            │
│  Real-time ──────▶│ Kafka    │────▶│              │            │
│  Events           │ Streams  │     │ • Retail PD  │            │
│                   └──────────┘     │ • SME PD     │            │
│                                    │ • LGD        │            │
│                                    │ • Rules      │            │
│                                    └──────┬───────┘            │
│                                           │                    │
│                   DECISIONING             ▼                    │
│                   ───────────    ┌──────────────┐              │
│                                 │ Decision     │              │
│                                 │ Engine       │              │
│                                 │              │              │
│                                 │ Score + Rules│              │
│                                 │ + Explanation│              │
│                                 │ + Audit Log  │              │
│                                 └──────┬───────┘              │
│                                        │                      │
│              ┌────────────┬────────────┬────────────┐         │
│              ▼            ▼            ▼            ▼         │
│         PostgreSQL   Dashboard    LLM Copilot   Audit        │
│         (Store)      (Display)   (Explain)      (Log)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Multi-Tenancy & Country Isolation

The platform supports six GCC countries with configurable regulatory parameters:

| Country | Regulator | Max DSR | Min Salary | Data Residency | Special Rules |
|---|---|---|---|---|---|
| UAE | CBUAE | 50% | AED 5,000 | UAE-based | EWS integration, AECB |
| KSA | SAMA | 55% | SAR 4,000 | KSA-based | SIMAH credit bureau |
| Qatar | QCB | 50% | QAR 4,000 | Qatar-based | QCB reporting |
| Bahrain | CBB | 50% | BHD 400 | Bahrain-based | BENEFIT integration |
| Kuwait | CBK | 40% | KWD 400 | Kuwait-based | Ci-Net bureau |
| Oman | CBO | 50% | OMR 350 | Oman-based | CBO guidelines |

### Country Configuration Service

```python
class CountryConfig:
    country_code: str          # e.g., "AE", "SA", "QA"
    currency: str              # e.g., "AED", "SAR", "QAR"
    max_dsr_retail: float      # Maximum debt-service ratio (retail)
    max_dsr_sme: float         # Maximum debt-service ratio (SME)
    min_salary: float          # Minimum salary threshold
    credit_bureau: str         # Bureau provider name
    regulator: str             # Regulatory body
    data_residency_zone: str   # Cloud region for data storage
    language_default: str      # "ar" or "en"
    reporting_format: str      # Regulatory report format
```

---

## 6. Security Zones

```
┌─────────────────────────────────────────────────────┐
│  ZONE 1: PUBLIC (DMZ)                               │
│  • CDN (CloudFront/Cloudflare)                      │
│  • WAF (Web Application Firewall)                   │
│  • Load Balancer                                    │
├─────────────────────────────────────────────────────┤
│  ZONE 2: APPLICATION                                │
│  • API Gateway                                      │
│  • Frontend servers                                 │
│  • Application services                             │
├─────────────────────────────────────────────────────┤
│  ZONE 3: SERVICES (Private Subnet)                  │
│  • Scoring Engine                                   │
│  • Fraud/AML Engine                                 │
│  • LLM/RAG Services                                 │
│  • Feature Store                                    │
├─────────────────────────────────────────────────────┤
│  ZONE 4: DATA (Restricted Subnet)                   │
│  • PostgreSQL                                       │
│  • Redis                                            │
│  • Vector DB                                        │
│  • Data Warehouse                                   │
│  • Kafka Cluster                                    │
├─────────────────────────────────────────────────────┤
│  ZONE 5: MANAGEMENT                                 │
│  • Vault (Secrets)                                  │
│  • Monitoring (Prometheus/Grafana)                  │
│  • Logging (ELK)                                    │
│  • CI/CD runners                                    │
└─────────────────────────────────────────────────────┘
```

---

## 7. Scalability Design

| Component | Scaling Strategy | Auto-scale Trigger |
|---|---|---|
| API Gateway | Horizontal (pods) | CPU > 70%, Latency > 200ms |
| Scoring Service | Horizontal + GPU (batch) | Queue depth > 100 |
| Fraud Service | Horizontal | Alert queue > 50 |
| LLM Service | Horizontal + GPU | Request queue > 20 |
| PostgreSQL | Vertical + Read replicas | Connection pool > 80% |
| Redis | Cluster mode | Memory > 75% |
| Kafka | Partition scaling | Lag > 10,000 messages |

---

## 8. Disaster Recovery & HA

| Tier | RPO | RTO | Strategy |
|---|---|---|---|
| PostgreSQL | 0 (sync repl) | < 1 min | Multi-AZ, streaming replication |
| Redis | < 1 min | < 1 min | Redis Sentinel / Cluster |
| Kafka | 0 | < 5 min | Multi-broker, ISR ≥ 2 |
| Application | N/A | < 2 min | K8s self-healing, multi-AZ |
| ML Models | N/A | < 5 min | Model Registry + S3 backup |
| Vector DB | < 5 min | < 10 min | Pinecone managed HA |
