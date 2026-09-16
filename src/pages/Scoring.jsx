import React, { useState, useMemo } from 'react'
import { Card, Button, Badge, Input } from '../components/Shared'
import { ScoreMeter, SHAPWaterfall } from '../components/Charts'
import { APPLICATIONS, COUNTRIES, REGULATORY_DOCS, usePulse } from '../lib/data'

const SCENARIOS = [
  { id: 1, salary: 12000, loanAmount: 50000, tenor: 48, collateral: 30000, cashflow: 5000, sectorRisk: 0.08 },
  { id: 2, salary: 18000, loanAmount: 100000, tenor: 60, collateral: 80000, cashflow: 8000, sectorRisk: 0.12 },
  { id: 3, salary: 8000, loanAmount: 30000, tenor: 36, collateral: 0, cashflow: 2000, sectorRisk: 0.05 },
  { id: 4, salary: 25000, loanAmount: 200000, tenor: 120, collateral: 150000, cashflow: 12000, sectorRisk: 0.06 },
]

const computeScore = (s) => {
  let score = 450
  const monthlyPmt = s.loanAmount / s.tenor
  const dsr = monthlyPmt / Math.max(s.salary, 1)
  if (dsr <= 0.20) score += 200
  else if (dsr <= 0.35) score += 150
  else if (dsr <= 0.50) score += 80
  else score -= 50
  const ltv = s.loanAmount / Math.max(s.collateral, 1)
  if (ltv <= 0.5) score += 100
  else if (ltv <= 0.8) score += 60
  if (s.cashflow > 0) {
    const coverage = s.cashflow / Math.max(monthlyPmt, 1)
    if (coverage >= 3) score += 100
    else if (coverage >= 1.5) score += 60
  }
  score -= Math.round(s.sectorRisk * 400)
  return Math.max(300, Math.min(850, Math.round(score)))
}

const getRiskLevel = (score) => {
  if (score >= 700) return { level: 'low', color: 'var(--accent-emerald)', label: { en: 'Low Risk', ar: 'مخاطر منخفضة' } }
  if (score >= 600) return { level: 'medium', color: 'var(--accent-amber)', label: { en: 'Medium Risk', ar: 'مخاطر متوسطة' } }
  return { level: 'high', color: 'var(--accent-rose)', label: { en: 'High Risk', ar: 'مخاطر عالية' } }
}

export function Scoring({ lang }) {
  const [selectedApp, setSelectedApp] = useState(null)
  const [scenario, setScenario] = useState(SCENARIOS[0])
  const [sliderValues, setSliderValues] = useState({ salary: 12000, loanAmount: 50000, tenor: 48, collateral: 30000, cashflow: 5000, sectorRisk: 8 })
  const [searchTerm, setSearchTerm] = useState('')
  const { insights, evaluate } = usePulse()

  const filteredApps = useMemo(() => {
    return APPLICATIONS.filter(a =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nameAr.includes(searchTerm)
    )
  }, [searchTerm])

  const handleSlider = (key, value) => {
    setSliderValues(prev => ({ ...prev, [key]: value }))
  }

  const runScenario = () => {
    const s = {
      salary: sliderValues.salary,
      loanAmount: sliderValues.loanAmount,
      tenor: sliderValues.tenor,
      collateral: sliderValues.collateral,
      cashflow: sliderValues.cashflow,
      sectorRisk: sliderValues.sectorRisk / 100,
    }
    const score = computeScore(s)
    const risk = getRiskLevel(score)
    evaluate(s)
    setScenario({ ...s, score, risk, dsr: (s.loanAmount / s.tenor) / Math.max(s.salary, 1) })
  }

  const selectedScenarioScore = useMemo(() => {
    return computeScore(scenario)
  }, [scenario])

  const selectedScenarioRisk = getRiskLevel(selectedScenarioScore)

  const sampleFactors = useMemo(() => {
    const factors = [
      { label: lang === 'ar' ? 'استقرار الدخل' : 'Salary Stability', value: 80, description: 'Stable employment for 24+ months' },
      { label: lang === 'ar' ? 'تاريخ السداد' : 'Payment History', value: 45, description: '100% on-time payments in 24 months' },
      { label: lang === 'ar' ? 'نسبة الاستخدام' : 'Utilization', value: -20, description: 'High credit utilization at 72%' },
      { label: lang === 'ar' ? 'مخاطر القطاع' : 'Sector Risk', value: -15, description: 'Retail sector volatility' },
      { label: lang === 'ar' ? 'طول الائتمان' : 'Credit Length', value: 30, description: '48 months credit history' },
    ]
    return factors
  }, [lang])

  return (
    <div className="scoring-page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Search + quick select */}
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <Input placeholder={lang === 'ar' ? 'البحث عن طلب...' : 'Search application...'} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1 }} />
              <Button variant="primary" onClick={() => { const app = filteredApps[0]; if (app) { setSelectedApp(app); evaluate(app) } }}>
                {lang === 'ar' ? 'تحليل' : 'Analyze'}
              </Button>
            </div>

            {selectedApp ? (
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{selectedApp.id}</div>
                  <Badge variant={selectedApp.status === 'APPROVED' ? 'success' : selectedApp.status === 'DECLINED' ? 'danger' : selectedApp.status === 'REFERRED' ? 'warning' : 'info'}>
                    {selectedApp.status}
                  </Badge>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  {lang === 'ar' ? selectedApp.nameAr : selectedApp.name}
                </h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span>{selectedApp.type === 'RETAIL' ? (lang === 'ar' ? 'فرد' : 'Retail') : (lang === 'ar' ? 'مؤسسة' : 'SME')}</span>
                  <span>{selectedApp.product}</span>
                  <span>{COUNTRIES[selectedApp.country]?.name}</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-sm)' }}>🔍</div>
                <p style={{ fontSize: '14px' }}>
                  {lang === 'ar' ? 'ابحث عن طلب أو اختر من القائمة' : 'Search for an application or pick from the list'}
                </p>
              </div>
            )}
          </Card>

          {/* Waterfall + SHAP */}
          {selectedApp ? (
            <Card style={{ padding: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📊</span>
                  {lang === 'ar' ? 'تحليل SHAP' : 'SHAP Analysis'}
                </h3>
                <div style={{ fontSize: '20px', fontWeight: 800, color: selectedApp.score >= 700 ? 'var(--accent-emerald)' : selectedApp.score >= 600 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                  {selectedApp.score} / 850
                </div>
              </div>
              <SHAPWaterfall factors={sampleFactors} lang={lang} score={selectedApp.score} />
            </Card>
          ) : (
            <Card style={{ padding: 'var(--spacing-lg)', textAlign: 'center', minHeight: 200 }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-sm)' }}>📈</div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                {lang === 'ar' ? 'اختر طلباً لعرض التحليل' : 'Select an application to view analysis'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'ستظهر تفاصيل التقييم والعوامل المؤثرة' : 'SHAP waterfall will show factor attribution'}
              </p>
            </Card>
          )}
        </div>

        {/* Scenario Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🎚️</span>
                {lang === 'ar' ? 'محاكاة السيناريو' : 'Scenario Simulator'}
              </h3>
              <Button variant="ghost" size="sm" onClick={runScenario}>
                {lang === 'ar' ? 'إعادة الحساب' : 'Recalculate'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              {[
                { key: 'salary', label: lang === 'ar' ? 'الدخل الشهري' : 'Monthly Salary', min: 3000, max: 30000, step: 500, format: (v) => `${v.toLocaleString()} AED` },
                { key: 'loanAmount', label: lang === 'ar' ? 'مبلغ القرض' : 'Loan Amount', min: 5000, max: 500000, step: 5000, format: (v) => `${v.toLocaleString()} AED` },
                { key: 'tenor', label: lang === 'ar' ? 'المدة (أشهر)' : 'Tenor (months)', min: 6, max: 240, step: 6, format: (v) => `${v} mo` },
                { key: 'collateral', label: lang === 'ar' ? 'الضمان' : 'Collateral', min: 0, max: 300000, step: 5000, format: (v) => v > 0 ? `${v.toLocaleString()} AED` : 'None' },
                { key: 'cashflow', label: lang === 'ar' ? 'التدفق النقدي' : 'Cashflow/mo', min: 0, max: 20000, step: 500, format: (v) => `${v.toLocaleString()} AED` },
                { key: 'sectorRisk', label: lang === 'ar' ? 'مخاطر القطاع (%)' : 'Sector Risk %', min: 0, max: 25, step: 1, format: (v) => `${v}%` },
              ].map((field) => (
                <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>{field.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{field.format(sliderValues[field.key])}</span>
                  </div>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={sliderValues[field.key]}
                    onChange={e => handleSlider(field.key, Number(e.target.value))}
                    style={{ width: '100%', height: '6px', appearance: 'none', background: 'var(--bg-secondary)', borderRadius: '3px', outline: 'none', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <div style={{ flex: 1, padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'نسبة الـ DSR' : 'DSR Ratio'}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: scenario.dsr > 0.5 ? 'var(--accent-rose)' : scenario.dsr > 0.4 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                  {(scenario.dsr * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {lang === 'ar' ? 'الحد: 50% (CBUAE)' : 'Limit: 50% (CBUAE)'}
                </div>
              </div>
              <div style={{ flex: 1, padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'نسبة الـ LTV' : 'LTV Ratio'}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: (scenario.collateral > 0 ? (scenario.loanAmount / scenario.collateral) : 99) > 0.8 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                  {scenario.collateral > 0 ? ((scenario.loanAmount / scenario.collateral) * 100).toFixed(0) : '∞'}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {lang === 'ar' ? 'القرض / الضمان' : 'Loan / Collateral'}
                </div>
              </div>
            </div>
          </Card>

          {/* Score result */}
          <Card style={{ padding: 'var(--spacing-md)', background: `linear-gradient(135deg, var(--bg-card) 0%, ${selectedScenarioRisk.color}10 100%)`, border: `1px solid ${selectedScenarioRisk.color}30` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                {lang === 'ar' ? 'نتيجة التقييم' : 'Score Result'}
              </div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: selectedScenarioRisk.color, lineHeight: 1, marginBottom: '4px' }}>
                {selectedScenarioScore}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: selectedScenarioRisk.color, marginBottom: '8px' }}>
                {selectedScenarioRisk.label[lang]}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {lang === 'ar' ? 'تشغيل محاكاة مع بياناتك لتقييم تأثير المتغيرات على الدرجة الائتمانية' : 'Run simulations with your data to see how variables affect the credit score'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
