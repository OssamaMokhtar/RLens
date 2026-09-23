# LLM / RAG Architecture

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LLM SERVICE LAYER                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │  Copilot    │  │   RAG       │  │   Agent             ││
│  │  Engine     │  │   Engine    │  │   Framework         ││
│  │             │  │             │  │                     ││
│  │ • Credit    │  │ • Regulate  │  │ • API Caller        ││
│  │   Officer   │  │ • Customer  │  │ • Doc Retriever     ││
│  │ • RM        │  │ • Policy    │  │ • Decision Proposer ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────────────┘│
│         │                │                │                │
│  ┌──────▼────────────────▼────────────────▼──────────────┐ │
│  │              ORCHESTRATION LAYER                      │ │
│  │  • Prompt Template Management                        │ │
│  │  • Context Assembly (features + docs + history)      │ │
│  │  • Response Filtering (PII, hallucination guard)     │ │
│  │  • Bilingual Routing (AR/EN)                         │ │
│  │  • Audit Logging (every LLM call)                    │ │
│  └──────┬────────────────┬────────────────┬──────────────┘ │
│         │                │                │                │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐       │
│  │  LLM APIs   │  │ Vector DB   │  │ Internal    │       │
│  │  (GPT-4/    │  │ (Pinecone/  │  │ APIs        │       │
│  │   Gemini/   │  │  Chroma)    │  │ (Scoring,   │       │
│  │   Claude)   │  │             │  │  KYC, etc.) │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 2. RAG Pipeline Design

### 2.1 Document Ingestion Flow

```
Document Upload → Format Detection → Text Extraction → 
Language Detection → Chunking → Embedding → Vector Store + Metadata Store
```

### 2.2 Chunking Strategy

| Document Type | Chunk Size | Overlap | Strategy |
|---|---|---|---|
| Regulations | 512 tokens | 50 tokens | Section-aware (headers preserved) |
| Policies | 512 tokens | 50 tokens | Section-aware |
| Financial Statements | 256 tokens | 25 tokens | Table-aware (preserve tables) |
| Customer Docs | 384 tokens | 40 tokens | Paragraph-based |
| KYC Documents | 256 tokens | 25 tokens | Field-based |

### 2.3 Embedding Strategy

- **Model**: `text-embedding-3-large` (1536 dims) or `gecko-multilingual` for Arabic
- **Bilingual handling**: Embed Arabic and English separately, with cross-lingual retrieval
- **Metadata enrichment**: Each chunk tagged with source, language, access level, date

### 2.4 Retrieval Pipeline

```python
# Pseudo-code for RAG retrieval
def rag_query(query, context):
    # 1. Query understanding
    parsed = understand_query(query, language=detect_language(query))
    
    # 2. Access control filter
    user_role = context.user.role
    access_filter = build_access_filter(user_role, context.customer_id)
    
    # 3. Hybrid retrieval (semantic + keyword)
    semantic_results = vector_db.search(
        query_embedding=embed(parsed.query),
        filter=access_filter,
        top_k=10
    )
    keyword_results = elastic_search.search(
        query=parsed.keywords,
        filter=access_filter,
        top_k=5
    )
    
    # 4. Reciprocal Rank Fusion
    merged = rrf_merge(semantic_results, keyword_results, k=60)
    
    # 5. Re-ranking
    reranked = cross_encoder_rerank(parsed.query, merged[:20])
    
    # 6. Context assembly
    context_window = assemble_context(reranked[:5], max_tokens=4000)
    
    # 7. Generate response
    response = llm.generate(
        system_prompt=get_system_prompt(context.copilot_type),
        context=context_window,
        query=query,
        language=parsed.language
    )
    
    # 8. Post-processing
    response = filter_pii(response)
    response = add_citations(response, reranked[:5])
    
    # 9. Audit log
    log_llm_interaction(query, response, context, reranked)
    
    return response
```

## 3. Copilot Designs

### 3.1 Credit Officer Copilot

**System Prompt (English)**:
```
You are an AI assistant for credit officers at a GCC retail bank. 
You help analyze credit applications, explain risk scores, and suggest 
risk-mitigating actions. Always be factual, reference specific data points, 
and clearly separate AI recommendations from regulatory requirements.
Never make a final lending decision — that is the officer's responsibility.
```

**Capabilities**:
- Summarize customer profile (income, spending, obligations, credit history)
- Explain score drivers with plain-language SHAP interpretations
- Compare customer to segment benchmarks
- Suggest risk mitigations (collateral, guarantor, reduced limit)
- Answer regulatory questions via RAG
- Draft decline/approval rationale

### 3.2 Relationship Manager Copilot

**Capabilities**:
- Identify cross-sell opportunities based on risk and behavior
- Generate personalized product recommendations
- Draft compliant customer communications (bilingual)
- Summarize customer relationship history
- Predict customer lifetime value

### 3.3 Example Interactions

**Credit Officer asks**: "Why was Application #AE-2026-1234 scored at 580?"
```
Based on the scoring analysis for Application #AE-2026-1234:

Score: 580 (Risk Grade: BB-)
Key Negative Factors:
1. High credit utilization (78%) — contributing -45 points
2. Two 30+ DPD events in last 12 months — contributing -38 points
3. Short employment tenure (8 months) — contributing -22 points

Key Positive Factors:
1. Salary stability (verified government employer) — contributing +30 points
2. Low cash withdrawal ratio — contributing +15 points

DSR at requested amount: 52% (exceeds UAE CBUAE limit of 50%)

Recommendation: REFER
Suggested mitigations:
- Reduce loan amount by 15% to bring DSR to 48%
- Request 6 months of salary certificates
- Consider shorter tenure (36m vs 48m requested)
```

## 4. Agent Framework

### 4.1 Agent Architecture

```
User Request → Intent Classification → Tool Selection → 
Execution Plan → Tool Calls (parallel/sequential) → 
Result Assembly → Confidence Assessment → Response/Escalation
```

### 4.2 Available Tools

| Tool | Description | API Called |
|---|---|---|
| `get_customer_profile` | Retrieve full customer data | Customer Service |
| `get_credit_score` | Get latest score + explanation | Scoring Service |
| `get_transaction_history` | Query transactions | Customer Service |
| `check_kyc_status` | KYC verification status | KYC Service |
| `screen_sanctions` | Check sanctions/watchlists | AML Service |
| `query_regulations` | Search regulatory docs | RAG Service |
| `calculate_affordability` | Compute DSR and capacity | Scoring Service |
| `get_portfolio_stats` | Portfolio-level analytics | Analytics Service |

### 4.3 Confidence & Escalation

| Confidence Level | Action |
|---|---|
| > 90% | Auto-respond with recommendation |
| 70-90% | Respond with caveats, suggest verification |
| 50-70% | Provide analysis, recommend human review |
| < 50% | Escalate to human with context summary |

## 5. Access Control for RAG

| Role | Regulations | Policies | Customer Docs | Financial Data |
|---|---|---|---|---|
| Credit Officer | ✅ Read | ✅ Read | ✅ Own portfolio | ✅ Own portfolio |
| Risk Manager | ✅ Read | ✅ Read/Write | ✅ All | ✅ All |
| RM | ✅ Read | ✅ Read | ✅ Own clients | ✅ Limited |
| Compliance | ✅ Read/Write | ✅ Read/Write | ✅ All | ✅ Read |
| AML Officer | ✅ Read | ✅ Read | ✅ Flagged only | ✅ Read |
| Admin | ✅ Full | ✅ Full | ❌ | ❌ |

## 6. Safety & Guardrails

- **PII filtering**: All LLM outputs scanned for leaked PII before delivery
- **Hallucination detection**: Cross-reference key claims against source data
- **Disclaimer injection**: All AI outputs include "AI-generated recommendation" label
- **Bias monitoring**: Regular audits of recommendations by demographic segment
- **Prompt injection protection**: Input sanitization + instruction hierarchy
- **Rate limiting**: Max 100 LLM calls per user per hour
- **Audit trail**: Every LLM interaction logged with input, output, context, latency
