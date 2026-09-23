# Security Checklist & Deployment Plan

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

## 1. Security Checklist

### 1.1 Authentication & Authorization

| Item | Requirement | Implementation |
|------|------------|----------------|
| Identity Provider | Centralized IdP with MFA | Keycloak / Auth0 |
| Protocol | OAuth2 + OIDC | Bearer tokens, JWT |
| MFA | Required for all internal users | TOTP/Push |
| RBAC | Role-based access control | 8 roles defined |
| Session Management | Configurable timeout | 15 min idle, 8hr max |
| API Authentication | Service-to-service auth | mTLS + API keys |
| Password Policy | GCC banking standards | 12+ chars, complexity |
| Brute Force Protection | Account lockout | 5 attempts, 30min lock |

**Defined Roles:**
1. `CREDIT_OFFICER` — Score, review, decide on applications
2. `RISK_MANAGER` — Portfolio oversight, model monitoring
3. `FRAUD_ANALYST` — Alert investigation, case management
4. `AML_OFFICER` — AML cases, SAR filing
5. `RM` (Relationship Manager) — Customer interaction, cross-sell
6. `DATA_SCIENTIST` — Model training, monitoring
7. `COMPLIANCE` — Audit trail, regulatory reports
8. `ADMIN` — System configuration, user management

### 1.2 Data Encryption

| Layer | Method | Standard |
|-------|--------|----------|
| In Transit | TLS 1.3 | All API communication |
| At Rest (DB) | AES-256 | PostgreSQL TDE |
| At Rest (Files) | AES-256 | S3/GCS server-side encryption |
| Field-Level | AES-256-GCM | PII fields (name, ID, phone) |
| Backup | AES-256 | Encrypted backups |
| Key Management | HSM-backed | AWS KMS / GCP Cloud KMS |

### 1.3 PII Protection

| Data Element | Storage Method | Access |
|---|---|---|
| National ID | SHA-256 hash + token | Hash for lookup, token for retrieval |
| Phone Number | SHA-256 hash | Hash only |
| Email | SHA-256 hash | Hash only  |
| Name | Field-level encryption | Decrypted on authorized access |
| Date of Birth | Field-level encryption | Decrypted on authorized access |
| Financial Data | Role-based access | RBAC enforced |

### 1.4 Network Security

- WAF (Web Application Firewall) on all public endpoints
- DDoS protection (AWS Shield / Cloudflare)
- VPC isolation with private subnets for data layer
- Network segmentation (5 security zones)
- IP allowlisting for admin access
- VPN required for production access

### 1.5 Application Security

- OWASP Top 10 mitigation
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection (CSP headers)
- CSRF tokens on all forms
- Rate limiting (per user, per endpoint)
- Request size limits
- API versioning for backward compatibility

### 1.6 Audit & Monitoring

| Audit Event | Logged Fields | Retention |
|---|---|---|
| Score generation | Score, features, model, timestamp | 7 years |
| Decision made | Decision, actor, rationale, overrides | 7 years |
| AI recommendation used | Input, output, model, confidence | 7 years |
| Data access | Who, what, when, from where | 3 years |
| Login/logout | User, IP, device, success/fail | 1 year |
| Config change | Before, after, who, why | 7 years |

### 1.7 Secrets Management

- All secrets in HashiCorp Vault / AWS Secrets Manager
- No secrets in code, config files, or environment variables
- Automatic rotation: DB passwords (90 days), API keys (180 days)
- Service accounts with minimal privileges
- Separate secrets per environment (dev/UAT/prod)

### 1.8 Compliance Controls

| Regulation | Requirement | Implementation |
|---|---|---|
| CBUAE Consumer Protection | Score transparency | Bilingual explanations |
| SAMA Data Protection | Data localization | KSA region deployment |
| GCC Data Privacy | Consent management | Explicit opt-in, revocation |
| AML/CFT | Transaction monitoring | Real-time fraud engine |
| Basel III | Capital adequacy | PD/LGD reporting |

---

## 2. Deployment & Scaling Plan

### 2.1 Environment Strategy

| Environment | Purpose | Infra | Data |
|---|---|---|---|
| **DEV** | Development & testing | Shared K8s cluster | Synthetic data |
| **UAT** | User acceptance testing | Dedicated K8s | Anonymized production data |
| **STAGING** | Pre-production validation | Mirror of prod | Anonymized production data |
| **PROD** | Production | Multi-AZ K8s | Real data |

### 2.2 Container Architecture

```yaml
# Docker Compose (simplified)
services:
  api-gateway:
    image: kong:3.5
    ports: ["8000:8000", "8443:8443"]
    
  scoring-service:
    image: gcc-credit/scoring:latest
    replicas: 3
    resources:
      limits: { cpus: '2', memory: '4G' }
    
  fraud-service:
    image: gcc-credit/fraud:latest
    replicas: 2
    resources:
      limits: { cpus: '2', memory: '4G' }
    
  llm-service:
    image: gcc-credit/llm:latest
    replicas: 2
    resources:
      limits: { cpus: '4', memory: '8G' }
    
  data-ingestion:
    image: gcc-credit/ingestion:latest
    replicas: 2
    
  frontend:
    image: gcc-credit/frontend:latest
    replicas: 2
    
  postgres:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
    
  redis:
    image: redis:7-alpine
    
  kafka:
    image: confluentinc/cp-kafka:7.5
```

### 2.3 CI/CD Pipeline

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Commit  │──▶│  Build   │──▶│  Test    │──▶│  Scan    │
│  (Git)   │   │  (Docker)│   │  (Unit + │   │  (SAST + │
│          │   │          │   │   Integ) │   │   Image) │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
                                                   │
                    ┌──────────────────────────────┘
                    ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │  Deploy  │──▶│  Smoke   │──▶│  Deploy  │
              │  to DEV  │   │  Tests   │   │  to UAT  │
              └──────────┘   └──────────┘   └──────────┘
                                                   │
                    ┌──────────────────────────────┘
                    ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │ UAT Sign │──▶│  Deploy  │──▶│  Canary  │
              │   Off    │   │  to PROD │   │  Monitor │
              └──────────┘   └──────────┘   └──────────┘
```

### 2.4 Horizontal Scaling Strategy

| Service | Min Pods | Max Pods | Scale Metric | Target |
|---|---|---|---|---|
| Scoring Service | 3 | 20 | CPU utilization | 70% |
| Fraud Service | 2 | 10 | Queue depth | < 50 |
| LLM Service | 2 | 8 | Request latency | < 3s |
| Data Ingestion | 2 | 10 | Kafka lag | < 5000 |
| Frontend | 2 | 6 | Request rate | < 1000 RPS |
| API Gateway | 2 | 10 | Active connections | < 5000 |

### 2.5 Model Versioning Strategy

```
Model Deployment Flow:
1. Train new model version (monthly cadence)
2. Evaluate against champion on holdout set
3. A/B test: 90% champion / 10% challenger (2 weeks)
4. If challenger metrics ≥ champion:
   a. Promote challenger to champion
   b. Archive old champion
   c. Update model registry
5. If challenger < champion:
   a. Keep champion
   b. Log findings for next iteration
```

### 2.6 Data Residency Deployment

| Country | Cloud Region | DB Instance | Vault Instance |
|---|---|---|---|
| UAE | AWS me-south-1 (Bahrain) or Azure UAE North | Primary + replica | Regional vault |
| KSA | AWS me-south-1 or local DC | Primary + replica | Regional vault |
| Qatar | GCP me-central2 or local DC | Primary + replica | Regional vault |
| Bahrain | AWS me-south-1 | Primary + replica | Regional vault |
| Kuwait | Local DC or nearest region | Primary + replica | Regional vault |
| Oman | Local DC or nearest region | Primary + replica | Regional vault |

### 2.7 Performance Targets

| Operation | Target Latency | Target Throughput |
|---|---|---|
| Real-time credit score | < 2 seconds | 100 scores/sec |
| Fraud screening | < 500 ms | 500 txns/sec |
| LLM copilot response | < 5 seconds | 50 queries/sec |
| RAG query | < 3 seconds | 100 queries/sec |
| Dashboard load | < 2 seconds | N/A |
| Batch scoring (10K) | < 10 minutes | N/A |
| Report generation | < 30 seconds | N/A |

### 2.8 Cost Estimation (Monthly — Production)

| Component | Specification | Est. Monthly Cost |
|---|---|---|
| K8s Cluster (3 nodes) | 8 vCPU, 32GB each | $2,000 |
| PostgreSQL (HA) | db.r6g.xlarge, multi-AZ | $1,500 |
| Redis Cluster | cache.r6g.large, 3 nodes | $600 |
| Kafka (managed) | 3 brokers | $1,200 |
| LLM API costs | ~500K tokens/day | $3,000 |
| Vector DB (Pinecone) | s1.x1, 1M vectors | $70 |
| Object Storage | 500GB | $50 |
| CDN + WAF | CloudFront + Shield | $500 |
| Monitoring | Datadog / Grafana Cloud | $800 |
| **TOTAL** | | **~$9,720/month** |

*Costs vary significantly by region and provider. Local DC hosting may be required for data residency compliance.*
