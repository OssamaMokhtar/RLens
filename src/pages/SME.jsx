import React, { useState, useMemo } from 'react'
import { Card, Badge, Button, Input } from '../components/Shared'
import { DonutChart, MiniChart } from '../components/Charts'
import { APPLICATIONS, COUNTRIES, usePulse } from '../lib/data'

const SECTORS = [
  { id: 'tech', label: { en: 'Technology', ar: 'تقنية المعلومات' }, risk: 0.05, color: 'var(--accent-emerald)' },
  { id: 'trade', label: { en: 'Trade & Retail', ar: 'التجارة والتجزئة' }, risk: 0.10, color: 'var(--accent-cyan)' },
  { id: 'realestate', label: { en: 'Real Estate', ar: 'العقارات' }, risk: 0.15, color: 'var(--accent-amber)' },
  { id: 'construction', label: { en: 'Construction', ar: 'البناء والإنشاء' }, risk: 0.20, color: 'var(--accent-rose)' },
  { id: 'oilgas', label: { en: 'Oil & Gas', ar: 'النفط والغاز' }, risk: 0.25, color: 'var(--accent-rose)' },
  { id: 'other', label: { en: 'Other', ar: 'أخرى' }, risk: 0.12, color: 'var(--text-tertiary)' },
]

const calculateSMEScore = (data) => {
  let score = 500
  score += data.revenue > 1000000 ? 80 : data.revenue > 500000 ? 50 : 20
  score += data.yearsInBusiness >= 5 ? 60 : data.yearsInBusiness >= 2 ? 30 : 0
  score += data.profitMargin > 0.15 ? 80 : data.profitMargin > 0.08 ? 50 : data.profitMargin > 0 ? 20 : -20
  score -= data.sectorRisk * 300
  score += data.cashflowMonthly > data.monthlyPmt * 2 ? 60 : data.cashflowMonthly > data.monthlyPmt ? 30 : -30
  score += data.employeeCount >= 20 ? 30 : data.employeeCount >= 5 ? 15 : 0
  return Math.max(300, Math.min(850, score))
}

export function SMELending({ lang }) {
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '', businessNameAr: '', sector: 'trade', yearsInBusiness: 3, employeeCount: 10,
    annualRevenue: 500000, annualExpenses: 400000, monthlyCashflow: 5000,
    collateralAmount: 0, collateralType: 'none', requestedAmount: 100000, tenorMonths: 24,
  })
  const { insights, evaluate } = usePulse()

  const handleSubmit = () => {
    const data = {
      ...formData,
      sectorRisk: SECTORS.find(s => s.id === formData.sector)?.risk || 0.1,
      monthlyPmt: formData.requestedAmount / formData.tenorMonths,
    }
    const score = calculateSMEScore(data)
    const risk = score >= 700 ? 'low' : score >= 600 ? 'medium' : 'high'
    evaluate({ ...data, mode: 'sme', sectorRisk: data.sectorRisk, score, risk })
    setSelected({ ...data, score, risk, grade: score >= 700 ? 'A' : score >= 600 ? 'BBB' : 'C' })
    setShowForm(false)
  }

  const currentScenario = useMemo(() => {
    return {
      monthlyPmt: formData.requestedAmount / formData.tenorMonths,
      dsr: (formData.requestedAmount / formData.tenorMonths) / Math.max(formData.monthlyCashflow, 1),
    }
  }, [formData])

  return (
    <div className="sme-page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--spacing-lg)' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {!selected ? (
            <>
              <Card style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📊</span>
                    {lang === 'ar' ? 'أحدث الطلبات' : 'Recent Applications'}
                  </h3>
                  <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                    {lang === 'ar' ? 'طلب جديد' : 'New Application'}
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {APPLICATIONS.filter(a => a.type === 'SME').slice(0, 5).map((app, i) => (
                    <div key={app.id} onClick={() => { setSelected(app); evaluate(app) }} className="sme-row" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid transparent', transition: 'all 150ms ease' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {app.type === 'SME' ? '🏢' : '👤'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px', dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
                          {lang === 'ar' ? app.nameAr : app.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          {app.sector} · {app.employees} emp · {app.years} yrs
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {app.currency} {app.amount?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          {(app.dsr * 100).toFixed(0)}% DSR
                        </div>
                      </div>
                      <ScoreMeter score={app.score} grade={app.grade} size="sm" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Sector exposure */}
              <Card style={{ padding: 'var(--spacing-md)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <span style={{ fontSize: '16px' }}>📈</span>
                  {lang === 'ar' ? 'التعرض للقطاعات' : 'Sector Exposure'}
                </h3>
                <DonutChart
                  data={[
                    { label: 'Trade', value: 32 },
                    { label: 'Construction', value: 22 },
                    { label: 'Technology', value: 18 },
                    { label: 'Real Estate', value: 15 },
                    { label: 'Oil & Gas', value: 8 },
                    { label: 'Other', value: 5 },
                  ]}
                  colors={['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#a78bfa']}
                  size={140}
                  centerLabel={lang === 'ar' ? 'إجمالي' : 'Total'}
                  centerValue="6"
                  lang={lang}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-md)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>{lang === 'ar' ? '14 طلب SME نشط' : '14 active SME applications'}</span>
                  <span>{lang === 'ar' ? 'إجمالي: 2.4M AED' : 'Total: 2.4M AED'}</span>
                </div>
              </Card>
            </>
          ) : (
            <Card style={{ padding: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>{selected.id}</div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
                    {lang === 'ar' ? selected.nameAr : selected.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {selected.sector} · {selected.employees} employees · {selected.years} yrs
                  </div>
                </div>
                <Badge variant="primary">SME</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                {[
                  { label: lang === 'ar' ? 'الإيرادات' : 'Revenue', value: `${selected.revenue?.toLocaleString()} ${selected.currency}` },
                  { label: lang === 'ar' ? 'هامش الربح' : 'Margin', value: `${(selected.margin * 100).toFixed(1)}%` },
                  { label: lang === 'ar' ? 'التيار النقدي' : 'Cashflow', value: `${selected.monthlyCashflow?.toLocaleString()} ${selected.currency}/mo` },
                ].map((item, i) => (
                  <div key={i} style={{ padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Button variant="primary" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'موافقة' : 'Approve'}</Button>
                <Button variant="secondary" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'إرسال للمراجعة' : 'Refer'}</Button>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>{lang === 'ar' ? 'رجوع' : 'Back'}</Button>
              </div>
            </Card>
          )}
        </div>

        {/* New application form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {showForm ? (
            <Card style={{ padding: 'var(--spacing-md)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <span style={{ fontSize: '16px' }}>📝</span>
                {lang === 'ar' ? 'طلب SME جديد' : 'New SME Application'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Input label={lang === 'ar' ? 'اسم الشركة (عربي)' : 'Business Name (AR)'} value={formData.businessNameAr} onChange={e => setFormData({ ...formData, businessNameAr: e.target.value })} style={{ flex: 1 }} />
                  <Input label={lang === 'ar' ? 'اسم الشركة (إنجليزي)' : 'Business Name (EN)'} value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} style={{ flex: 1 }} />
                </div>
                <Input label={lang === 'ar' ? 'القطاع' : 'Sector'} value={formData.sector} onChange={e => setFormData({ ...formData, sector: e.target.value })} style={{ marginBottom: 'var(--spacing-sm)' }} />
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Input label={lang === 'ar' ? 'سنوات في العمل' : 'Years in Business'} type="number" value={formData.yearsInBusiness} onChange={e => setFormData({ ...formData, yearsInBusiness: Number(e.target.value) })} style={{ flex: 1 }} />
                  <Input label={lang === 'ar' ? 'عدد الموظفين' : 'Employees'} type="number" value={formData.employeeCount} onChange={e => setFormData({ ...formData, employeeCount: Number(e.target.value) })} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Input label={lang === 'ar' ? 'الإيرادات السنوية' : 'Annual Revenue'} type="number" value={formData.annualRevenue} onChange={e => setFormData({ ...formData, annualRevenue: Number(e.target.value) })} style={{ flex: 1 }} />
                  <Input label={lang === 'ar' ? 'النفقات السنوية' : 'Annual Expenses'} type="number" value={formData.annualExpenses} onChange={e => setFormData({ ...formData, annualExpenses: Number(e.target.value) })} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Input label={lang === 'ar' ? 'تيار نقدي شهري' : 'Monthly Cashflow'} type="number" value={formData.monthlyCashflow} onChange={e => setFormData({ ...formData, monthlyCashflow: Number(e.target.value) })} style={{ flex: 1 }} />
                  <Input label={lang === 'ar' ? 'الضمان' : 'Collateral'} type="number" value={formData.collateralAmount} onChange={e => setFormData({ ...formData, collateralAmount: Number(e.target.value) })} style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Input label={lang === 'ar' ? 'مبلغ الطلب' : 'Requested Amount'} type="number" value={formData.requestedAmount} onChange={e => setFormData({ ...formData, requestedAmount: Number(e.target.value) })} style={{ flex: 1 }} />
                  <Input label={lang === 'ar' ? 'المدة (أشهر)' : 'Tenor (months)'} type="number" value={formData.tenorMonths} onChange={e => setFormData({ ...formData, tenorMonths: Number(e.target.value) })} style={{ flex: 1 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Button variant="secondary" size="sm" onClick={() => setShowForm(false)} style={{ flex: 1 }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
                <Button variant="primary" size="sm" onClick={handleSubmit} style={{ flex: 1 }}>
                  {lang === 'ar' ? 'تقديم الطلب' : 'Submit Application'}
                </Button>
              </div>

              {currentScenario.dsr > 0.5 && (
                <div style={{ marginTop: 'var(--spacing-sm)', padding: 'var(--spacing-sm)', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--accent-rose)' }}>
                  ⚠️ {lang === 'ar' ? `تجاوز حد الـ DSR (${currentScenario.dsr * 100}%) الحد المسموح به (50%)` : `DSR (${currentScenario.dsr * 100}%) exceeds limit (50%)`}
                </div>
              )}
            </Card>
          ) : (
            <Card style={{ padding: 'var(--spacing-lg)', textAlign: 'center', minHeight: 200 }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-sm)' }}>🏢</div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                {lang === 'ar' ? 'تمويل المؤسسات' : 'SME Lending'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                {lang === 'ar' ? 'قم بإنشاء طلب جديد أو اختر من القائمة' : 'Create a new application or select from the list'}
              </p>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                {lang === 'ar' ? 'إنشاء طلب جديد' : 'Create New Application'}
              </Button>
            </Card>
          )}

          {/* Risk gauge */}
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>🎯</span>
              {lang === 'ar' ? 'حالتك الحالية' : 'Your Current Scenario'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: 'var(--accent-emerald)' }}>
                620
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {lang === 'ar' ? 'التقييم المتوقع' : 'Expected Score'}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {lang === 'ar' ? 'جيد' : 'Good'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {lang === 'ar' ? 'بناءً على البيانات الحالية' : 'Based on current data'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
