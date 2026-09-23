# Risk Scoring Logic — Retail & SME

> Status: SPEC (target design, not built) · Updated 2026-09-23 · Owner: Ossama Mokhtar

## 1. Retail Credit Scoring

### 1.1 Scoring Flow

```
Customer Data → Feature Extraction → ML Score → Rule Overlay → 
LLM Explanation → Final Grade + Recommendation
```

### 1.2 Score Composition

| Component | Weight | Range | Description |
|---|---|---|---|
| ML Score (XGBoost + LR) | 70% | 300-850 | Primary model output |
| Bureau Score | 15% | 300-850 | External credit bureau |
| Rule Adjustments | 15% | -100 to +50 | Policy-based adjustments |

### 1.3 Risk Grade Mapping

| Grade | Score Range | PD Range | Decision Default |
|---|---|---|---|
| AAA | 800-850 | < 0.5% | Auto-approve |
| AA | 750-799 | 0.5-1.0% | Auto-approve |
| A | 700-749 | 1.0-2.0% | Auto-approve (with limits) |
| BBB | 650-699 | 2.0-4.0% | Refer (simplified review) |
| BB | 600-649 | 4.0-7.0% | Refer (full review) |
| B | 550-599 | 7.0-12.0% | Refer (senior review) |
| CCC | 500-549 | 12.0-20.0% | Auto-decline |
| CC | 450-499 | 20.0-35.0% | Auto-decline |
| C | 400-449 | 35.0-50.0% | Auto-decline |
| D | 300-399 | > 50% | Auto-decline |

### 1.4 Affordability Calculation

```python
def calculate_dsr(customer, country_config):
    """Debt Service Ratio calculation per GCC regulations."""
    
    # Existing obligations
    existing_emis = sum(loan.emi for loan in customer.active_loans)
    existing_card_min = sum(card.limit * 0.05 for card in customer.active_cards)
    
    # Proposed obligation
    proposed_emi = calculate_emi(
        principal=application.requested_amount,
        rate=product.indicative_rate,
        tenure=application.requested_tenure
    )
    
    # Total obligations
    total_obligations = existing_emis + existing_card_min + proposed_emi
    
    # Eligible income
    gross_income = customer.monthly_salary
    if customer.has_verified_allowances:
        gross_income += customer.verified_allowances * 0.5  # 50% of allowances
    
    # DSR
    dsr = total_obligations / gross_income
    
    # Country-specific limit check
    max_dsr = country_config.max_dsr_retail
    
    return {
        "dsr": dsr,
        "max_allowed": max_dsr,
        "passes": dsr <= max_dsr,
        "max_eligible_emi": (gross_income * max_dsr) - existing_emis - existing_card_min,
        "max_eligible_amount": calculate_max_principal(
            emi=(gross_income * max_dsr) - existing_emis - existing_card_min,
            rate=product.indicative_rate,
            tenure=application.requested_tenure
        )
    }
```

### 1.5 Score Explanation Layer

```python
def generate_explanation(score_result, customer, application):
    """Generate multi-layer explanation."""
    
    # Layer 1: Feature importance (SHAP)
    shap_values = explainer.shap_values(feature_vector)
    top_positive = sorted(
        [(f, v) for f, v in zip(feature_names, shap_values) if v > 0],
        key=lambda x: x[1], reverse=True
    )[:5]
    top_negative = sorted(
        [(f, v) for f, v in zip(feature_names, shap_values) if v < 0],
        key=lambda x: x[1]
    )[:5]
    
    # Layer 2: Rule engine results
    rule_results = rule_engine.evaluate(customer, application, country_config)
    
    # Layer 3: LLM narrative
    narrative = llm.generate(
        prompt=EXPLANATION_PROMPT.format(
            score=score_result.score,
            grade=score_result.grade,
            top_positive=top_positive,
            top_negative=top_negative,
            rule_results=rule_results,
            customer_context=customer.summary
        ),
        languages=["en", "ar"]
    )
    
    return ScoreExplanation(
        feature_importances=shap_values,
        top_positive_factors=top_positive,
        top_negative_factors=top_negative,
        rules_result=rule_results,
        narrative_en=narrative.en,
        narrative_ar=narrative.ar
    )
```

---

## 2. SME Credit Scoring

### 2.1 Score Composition

| Component | Weight | Description |
|---|---|---|
| Financial Analysis | 30% | Revenue, profitability, liquidity, leverage |
| Cashflow Assessment | 25% | Stability, coverage, trends |
| Sector Risk | 15% | Industry default rates, concentration |
| Payment Behavior | 15% | Banking history, cheque returns, DPD |
| Management & Owner | 10% | Experience, personal credit, governance |
| Collateral | 5% | Coverage ratio, quality |

### 2.2 Financial Scoring Matrix
]
| Metric | Excellent (25) | Good (20) | Fair (15) | Weak (10) | Poor (5) |
|---|---|---|---|---|---|
| Current Ratio | > 2.0 | 1.5-2.0 | 1.2-1.5 | 1.0-1.2 | < 1.0 |
| DSCR | > 2.0 | 1.5-2.0 | 1.2-1.5 | 1.0-1.2 | < 1.0 |
| Debt/Equity | < 0.5 | 0.5-1.0 | 1.0-2.0 | 2.0-3.0 | > 3.0 |
| Net Margin | > 15% | 10-15% | 5-10% | 2-5% | < 2% |
| Revenue Growth | > 20% | 10-20% | 0-10% | -10-0% | < -10% |
| Cash Conv Cycle | < 30d | 30-60d | 60-90d | 90-120d | > 120d |

### 2.3 Sector Risk Scoring

| Sector | Risk Score | Default Rate | Adjustment |
|---|---|---|---|
| Government Contracts | 90 | 0.8% | +20 pts |
| Healthcare | 85 | 1.2% | +15 pts |
| Education | 80 | 1.5% | +10 pts |
| Trading & Distribution | 65 | 3.5% | 0 pts |
| Construction | 50 | 5.2% | -15 pts |
| Real Estate Dev | 45 | 6.0% | -20 pts |
| Hospitality | 55 | 4.5% | -10 pts |
| Oil & Gas Services | 60 | 4.0% | -5 pts |
| Retail/F&B | 60 | 3.8% | -5 pts |

### 2.4 Collateral Haircuts

| Collateral Type | Haircut | Net Value |
|---|---|---|
| Cash Deposit | 0-5% | 95-100% |
| Government Securities | 5-10% | 90-95% |
| Listed Shares (blue chip) | 30-40% | 60-70% |
| Real Estate (commercial) | 30-40% | 60-70% |
| Real Estate (residential) | 20-30% | 70-80% |
| Vehicles/Equipment | 40-50% | 50-60% |
| Inventory | 50-60% | 40-50% |
| Receivables | 30-40% | 60-70% |
| Personal Guarantee | N/A | Qualitative |

---

## 3. Combined Decision Matrix

```
Final Decision = f(ML Score, Rule Engine, Affordability, Bureau, Collateral)

Decision Tree:
├── HARD DECLINE (any of):
│   ├── Active sanctions match
│   ├── Blacklisted customer
│   ├── Bureau: active default or bankruptcy
│   ├── Score < 400 (retail) or < 350 (SME)
│   └── Sector on exclusion list (SME)
│
├── AUTO APPROVE (all of):
│   ├── Score ≥ 700
│   ├── All rules pass
│   ├── DSR within limit
│   ├── Bureau: clean record
│   ├── KYC: verified
│   └── Amount < auto-approval threshold
│
├── REFER TO OFFICER (any of):
│   ├── Score 400-700
│   ├── Rules: soft rule failure
│   ├── DSR: marginal (within 5% of limit)
│   ├── Bureau: minor delinquencies
│   └── Amount > auto-approval threshold
│
└── REFER TO COMMITTEE (any of):
    ├── SME amount > committee threshold
    ├── Officer override of auto-decline
    ├── Connected party/group exposure
    └── Policy exception requested
```
