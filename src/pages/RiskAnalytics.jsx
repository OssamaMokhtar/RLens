import React from 'react'
import { Card, Badge } from '../components/Shared'
import { MiniChart, ScoreDistribution } from '../components/Charts'
import { APPLICATIONS, SECTOR_EXPOSURE, usePulse } from '../lib/data'

export function RiskAnalytics({ lang }) {
  const { insights } = usePulse()

  const sectorData = SECTOR_EXPOSURE.map(s => ({
    ...s,
    label: lang === 'ar' ? s.sector : s.sector,
  }))

  return (
    <div className="risk-page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
        {[
          { label: lang === 'ar' ? 'نسبة الـ NPL' : 'NPL Ratio', value: '2.4%', icon: '⚠️', color: 'var(--accent-amber)', trend: '+0.3%', highlight: true },
          { label: lang === 'ar' ? 'قروض عالية المخاطر' : 'High Risk Loans', value: '8', icon: '🎯', color: 'var(--accent-rose)', trend: '-2', highlight: true },
          { label: lang === 'ar' ? 'متوسط التقييم' : 'Avg Portfolio Score', value: '642', icon: '📊', color: 'var(--accent-cyan)', trend: '+12', highlight: false },
          { label: lang === 'ar' ? 'عائد المخاطر' : 'Risk-Adjusted Return', value: '8.4%', icon: '💰', color: 'var(--accent-emerald)', trend: '+0.5%', highlight: false },
        ].map((stat, i) => (
          <Card key={i} style={{ padding: 'var(--spacing-md)', background: stat.highlight ? `${stat.color}08` : undefined, border: stat.highlight ? `1px solid ${stat.color}30` : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: '28px', marginRight: 'var(--spacing-sm)' }}>{stat.icon}</span>
              {stat.trend && (
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: stat.trend.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', color: stat.trend.startsWith('+') ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {stat.trend}
                </span>
              )}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        {/* Portfolio Heatmap */}
        <Card style={{ padding: 'var(--spacing-md)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span style={{ fontSize: '16px' }}>🗺️</span>
            {lang === 'ar' ? 'خريطة المحفظة الحرارية' : 'Portfolio Heatmap'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: 'var(--spacing-md)' }}>
            {Array.from({ length: 20 }, (_, i) => {
              const risk = Math.random()
              const color = risk < 0.6 ? 'var(--accent-emerald)' : risk < 0.8 ? 'var(--accent-amber)' : 'var(--accent-rose)'
              const intensity = risk < 0.6 ? 0.3 : risk < 0.8 ? 0.6 : 1
              return (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-sm)', background: color, opacity: 0.2 + intensity * 0.8, transition: 'all 200ms ease' }} title={`Cell ${i + 1}`} />
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-emerald)', opacity: 0.5 }} />{'✅ Low'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-amber)', opacity: 0.5 }} />{'⚠️ Medium'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-rose)', opacity: 0.5 }} />{'🔴 High'}</div>
          </div>
        </Card>

        {/* Score Distribution */}
        <Card style={{ padding: 'var(--spacing-md)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            {lang === 'ar' ? 'توزيع التقييمات' : 'Score Distribution'}
          </h3>
          <ScoreDistribution scores={APPLICATIONS.map(a => a.score)} lang={lang} />
        </Card>
      </div>

      {/* Delinquency trends + Sector breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
        {/* Delinquency trends */}
        <Card style={{ padding: 'var(--spacing-md)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span style={{ fontSize: '16px' }}>📉</span>
            {lang === 'ar' ? 'اتجاهات التخلف عن السداد' : 'Delinquency Trends'}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)', fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
          <MiniChart data={[3.2, 3.1, 3.0, 2.9, 2.6, 2.4]} color="var(--accent-emerald)" height={60} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-sm)', fontSize: '10px', color: 'var(--text-secondary)' }}>
            <span>↓ Improving</span>
            <span>{lang === 'ar' ? 'أقل من الربع السابق' : 'Down from last quarter'}</span>
          </div>
        </Card>

        {/* Sector risk breakdown */}
        <Card style={{ padding: 'var(--spacing-md)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span style={{ fontSize: '16px' }}>🏢</span>
            {lang === 'ar' ? 'تعرض القطاعات للمخاطر' : 'Sector Risk Exposure'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sectorData.map((sector, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sector.color }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sector.label}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: sector.color }}>{sector.exposure}%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    {sector.risk === 'high' ? '🔴' : sector.risk === 'medium' ? '⚠️' : '✅'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts summary */}
      <Card style={{ padding: 'var(--spacing-md)', background: 'linear-gradient(135deg, rgba(244,63,94,0.05) 0%, transparent 100%)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            🚨
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'تنبيهات نشطة تحتاج انتباهاً' : 'Active alerts requiring attention'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>
              {lang === 'ar' ? '2 تنبيهات حرجة تحتاج مراجعة فورية' : '2 critical alerts need immediate review'}
            </div>
          </div>
          <Badge variant="danger">2 Critical</Badge>
        </div>
      </Card>
    </div>
  )
}
