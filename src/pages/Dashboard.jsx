import React, { useState, useEffect } from 'react'
import { Card, Badge, Button } from '../components/Shared'
import { KPICard, ScoreDistribution, DonutChart } from '../components/Charts'
import { APPLICATIONS, COUNTRIES, KPIs, SECTOR_EXPOSURE, FRAUD_ALERTS } from '../lib/data'
import { usePulse } from '../hooks/usePulse'

const ACTIVITY_ITEMS = [
  { type: 'approve', label: { en: 'Application approved', ar: 'تم اعتماد الطلب' }, target: 'Fatima Al-Khalifa', time: '5 min ago' },
  { type: 'score', label: { en: 'Application scored', ar: 'تم تقييم الطلب' }, target: 'Mohammed Al-Rashid', time: '12 min ago' },
  { type: 'alert', label: { en: 'New fraud alert', ar: 'تنبيه احتيال جديد' }, target: 'FA-001', time: '15 min ago' },
  { type: 'refer', label: { en: 'Sent for review', ar: 'تم الإرسال للمراجعة' }, target: 'Ahmed Al-Mansouri', time: '22 min ago' },
  { type: 'decline', label: { en: 'Application declined', ar: 'تم رفض الطلب' }, target: 'Sara Al-Nuaimi', time: '1 hour ago' },
]

export function Dashboard({ lang }) {
  const { insights } = usePulse()
  const [activity, setActivity] = useState(ACTIVITY_ITEMS)

  const statusCounts = {
    'APPROVED': KPIs.approved,
    'REFERRED': Math.max(0, KPIs.pending - KPIs.declined),
    'SCORED': Math.floor(KPIs.pending * 0.3),
    'DECLINED': KPIs.declined,
  }

  return (
    <div className="dashboard-page">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="banner-glow" />
        <div className="banner-content">
          <h2 className="banner-title" data-en="Welcome back" data-ar="مرحباً بك">
            {lang === 'ar' ? 'مرحباً بك' : 'Welcome back'}
          </h2>
          <p className="banner-subtitle">
            {lang === 'ar' ? `إجمالي المحفظة: ${KPIs.totalPortfolio.toLocaleString()} AED` : `Total portfolio: ${KPIs.totalPortfolio.toLocaleString()} AED`}
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard
          title={lang === 'ar' ? 'الطلبات النشطة' : 'Active Applications'}
          value={KPIs.totalApplications}
          subtitle={lang === 'ar' ? 'إجمالي الطلبات' : 'Total applications'}
          icon="📋"
          color="var(--primary-500)"
          lang={lang}
        />
        <KPICard
          title={lang === 'ar' ? 'معتمدة' : 'Approved'}
          value={KPIs.approved}
          subtitle={lang === 'ar' ? 'عدد الموافقات' : 'Approval count'}
          icon="✅"
          color="var(--accent-emerald)"
          lang={lang}
        />
        <KPICard
          title={lang === 'ar' ? 'قيد المراجعة' : 'Pending Review'}
          value={KPIs.pending}
          subtitle={lang === 'ar' ? 'تحتاج قراراً' : 'Need decision'}
          icon="⏳"
          color="var(--accent-amber)"
          lang={lang}
        />
        <KPICard
          title={lang === 'ar' ? 'مرفوضة' : 'Declined'}
          value={KPIs.declined}
          subtitle={lang === 'ar' ? 'تم الرفض' : 'Rejected'}
          icon="❌"
          color="var(--accent-rose)"
          lang={lang}
        />
        <KPICard
          title={lang === 'ar' ? 'متوسط التقييم' : 'Avg Score'}
          value={KPIs.avgScore}
          subtitle={lang === 'ar' ? 'من 850' : 'out of 850'}
          icon="🎯"
          color="var(--accent-cyan)"
          lang={lang}
        />
        <KPICard
          title={lang === 'ar' ? 'التنبيهات' : 'Alerts'}
          value={KPIs.activeAlerts}
          subtitle={lang === 'ar' ? 'التنبيهات النشطة' : 'Active alerts'}
          icon="🔔"
          color="var(--accent-rose)"
          lang={lang}
          delay={200}
        />
      </div>

      {/* Main dashboard grid */}
      <div className="dashboard-grid">
        {/* Score Distribution */}
        <Card className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">📊</span>
              {lang === 'ar' ? 'توزيع التقييمات' : 'Score Distribution'}
            </h3>
          </div>
          <div className="card-body">
            <ScoreDistribution scores={APPLICATIONS.map(a => a.score)} lang={lang} />
          </div>
        </Card>

        {/* Sector Exposure */}
        <Card className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">🏢</span>
              {lang === 'ar' ? 'التعرض للقطاعات' : 'Sector Exposure'}
            </h3>
          </div>
          <div className="card-body">
            <div className="sector-list">
              {SECTOR_EXPOSURE.map((sector, i) => (
                <div key={i} className="sector-row">
                  <div className="sector-info">
                    <div className="sector-dot" style={{ background: sector.color }} />
                    <span className="sector-name">{sector.sector}</span>
                  </div>
                  <div className="sector-bar-wrapper">
                    <div className="sector-bar-bg">
                      <div
                        className="sector-bar"
                        style={{ width: `${sector.exposure}%`, background: sector.color, transition: 'width 600ms ease' }}
                      />
                    </div>
                    <span className="sector-value" style={{ color: sector.color }}>
                      {sector.exposure}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="dashboard-bottom">
        {/* Recent Activity */}
        <Card className="activity-card">
          <div className="card-header" style={{ justifyContent: 'space-between' }}>
            <h3 className="card-title">
              <span className="card-icon">📜</span>
              {lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h3>
            <Badge variant="primary" size="sm">Live</Badge>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {activity.map((item, i) => (
                <div key={i} className="activity-row">
                  <div className="activity-dot" style={{ background: item.type === 'approve' ? 'var(--accent-emerald)' : item.type === 'decline' ? 'var(--accent-rose)' : item.type === 'alert' ? 'var(--accent-amber)' : 'var(--primary-500)' }} />
                  <div className="activity-content">
                    <div className="activity-label">{item.label[lang]}</div>
                    <div className="activity-target">{item.target}</div>
                  </div>
                  <div className="activity-time">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="quick-actions-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-icon">⚡</span>
              {lang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              {[
                { icon: '📝', label: { en: 'New Application', ar: 'طلب جديد' }, page: 'applications' },
                { icon: '🎯', label: { en: 'Review Applications', ar: 'تقييم الطلبات' }, page: 'scoring' },
                { icon: '🔍', label: { en: 'Fraud Review', ar: 'فحص الاحتيال' }, page: 'fraud' },
                { icon: '📈', label: { en: 'Risk Analytics', ar: 'تحليل المخاطر' }, page: 'risk' },
              ].map((action, i) => (
                <button
                  key={i}
                  className="quick-action-btn"
                  onClick={() => {}}
                >
                  <span className="quick-action-icon">{action.icon}</span>
                  <span className="quick-action-label">{action.label[lang]}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
