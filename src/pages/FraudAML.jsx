import React, { useState, useEffect } from 'react'
import { Card, Badge, Button, Modal } from '../components/Shared'
import { ScoreMeter, SHAPWaterfall } from '../components/Charts'
import { APPLICATIONS, FRAUD_ALERTS, COUNTRIES, usePulse } from '../lib/data'

const FEATURE_FACTORS = {
  positive: [
    { label: 'Salary Stability', value: 45, description: '24+ months with same employer' },
    { label: 'Payment History', value: 38, description: '100% on-time payments' },
    { label: 'Low Utilization', value: 22, description: 'Credit utilization at 38%' },
    { label: 'Salary Verification', value: 15, description: 'Salary verified via WPS' },
  ],
  negative: [
    { label: 'High DSR', value: -25, description: 'DSR at 52% exceeds CBUAE 50% limit' },
    { label: 'Short Tenure', value: -12, description: 'Only 8 months at current employer' },
    { label: 'Existing Obligations', value: -8, description: '2 active loans with monthly EMIs' },
  ],
}

export function FraudAML({ lang }) {
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [investigator, setInvestigator] = useState('')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const { insights, evaluate } = usePulse()

  const severityBadge = (s) => {
    const map = { CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'primary' }
    return map[s] || 'primary'
  }

  const statusBadge = (s) => {
    const map = { NEW: 'primary', ASSIGNED: 'info', INVESTIGATING: 'warning', RESOLVED: 'success' }
    return map[s] || 'primary'
  }

  const filteredAlerts = FILTER_ALERTSseverity(severityFilter, statusFilter)

  // Helpers
  const FILTER_ALERTSseverity = (sev, status) => {
    return FRAUD_ALERTS.filter(a => {
      if (sev !== 'all' && a.severity !== sev) return false
      if (status !== 'all' && a.status !== status) return false
      return true
    })
  }

  const handleAssign = () => {
    if (!selectedAlert || !investigator.trim()) return
    setSelectedAlert(prev => ({ ...prev, assignedTo: investigator.trim(), status: 'ASSIGNED' }))
    setShowAssignModal(false)
    setInvestigator('')
    insights.push({ id: Date.now(), type: 'ASSIGNED', severity: 'medium', message: `Assigned ${selectedAlert.id} to ${investigator}` })
    evaluate({ alert: selectedAlert, action: 'assigned' })
  }

  const handleInvestigate = () => {
    if (!selectedAlert) return
    setSelectedAlert(prev => ({ ...prev, status: 'INVESTIGATING' }))
    evaluate({ alert: selectedAlert, action: 'investigating' })
  }

  const handleResolve = () => {
    if (!selectedAlert) return
    setSelectedAlert(prev => ({ ...prev, status: 'RESOLVED' }))
    evaluate({ alert: selectedAlert, action: 'resolved' })
  }

  return (
    <div className="fraud-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <Card style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)' }}>
          <Badge variant="danger" size="md">{FRAUD_ALERTS.filter(a => a.severity === 'CRITICAL').length}</Badge>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{lang === 'ar' ? 'حرجة' : 'Critical'}</span>
          <Badge variant="warning" size="md" style={{ marginLeft: 8 }}>{FRAUD_ALERTS.filter(a => a.severity === 'HIGH').length}</Badge>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{lang === 'ar' ? 'عالية' : 'High'}</span>
        </Card>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          {['severity', 'status'].map(filterType => (
            <div key={filterType} style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              {filterType === 'severity' ? ['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
                <button key={s} onClick={() => filterType === 'severity' && setSeverityFilter(s)} style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 600, background: severityFilter === s ? 'var(--primary-500)' : 'transparent', color: severityFilter === s ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                  {s === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : s}
                </button>
              ))}
              {filterType === 'status' ? ['all', 'NEW', 'ASSIGNED', 'INVESTIGATING', 'RESOLVED'].map(s => (
                <button key={s} onClick={() => filterType === 'status' && setStatusFilter(s)} style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 600, background: statusFilter === s ? 'var(--primary-500)' : 'transparent', color: statusFilter === s ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                  {s === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : s}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Alert list */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lang === 'ar' ? 'قائمة التنبيهات' : 'Alert Queue'} ({filteredAlerts.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {filteredAlerts.map((alert, i) => (
                <div
                  key={alert.id}
                  onClick={() => { setSelectedAlert(alert); evaluate({ alert }) }}
                  className="alert-card"
                  style={{
                    padding: 'var(--spacing-md)',
                    borderBottom: i < filteredAlerts.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    borderLeft: selectedAlert?.id === alert.id ? `3px solid var(--primary-500)` : '3px solid transparent',
                    background: selectedAlert?.id === alert.id ? 'var(--bg-hover)' : 'var(--bg-card)',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xs)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.severity === 'CRITICAL' ? 'var(--accent-rose)' : alert.severity === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-cyan)' }} />
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: alert.severity === 'CRITICAL' ? 'var(--accent-rose)' : alert.severity === 'HIGH' ? 'var(--accent-amber)' : 'var(--accent-cyan)' }}>
                        {alert.severity}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{alert.id}</span>
                    </div>
                    <Badge variant={statusBadge(alert.status)} size="sm">{alert.status}</Badge>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)', dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
                    {alert.customerName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                    {alert.type}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-sm)' }}>
                    {alert.details}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{alert.time}</span>
                    {alert.amount && (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {alert.amount.toLocaleString()} {alert.amount > 100000 ? 'AED' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {filteredAlerts.length === 0 && (
              <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-sm)' }}>✅</div>
                <p style={{ fontSize: '14px' }}>{lang === 'ar' ? 'لا توجد تنبيهات' : 'No alerts'}</p>
              </div>
            )}
          </Card>

          {/* Timeline */}
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>⏱️</span>
              {lang === 'ar' ? 'الأحداث الأخيرة' : 'Recent Events'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {[
                { time: '2 min ago', event: lang === 'ar' ? 'تنبيه احتيال جديد' : 'New fraud alert', type: 'alert', severity: 'CRITICAL' },
                { time: '15 min ago', event: lang === 'ar' ? 'تم تعيين التنبيه' : 'Alert assigned', type: 'assign', severity: 'HIGH' },
                { time: '1 hour ago', event: lang === 'ar' ? 'بدء التحقيق' : 'Investigation started', type: 'investigate', severity: 'MEDIUM' },
                { time: '2 hours ago', event: lang === 'ar' ? 'تقرير SAR مقدم' : 'SAR filed', type: 'resolve', severity: 'LOW' },
              ].map((item, i) => (
                <div key={i} className="timeline-item" style={{ display: 'flex', gap: 'var(--spacing-sm)', position: 'relative', paddingLeft: '20px' }}>
                  <div style={{ position: 'absolute', left: 4, top: 2, width: 8, height: 8, borderRadius: '50%', background: item.type === 'alert' ? 'var(--accent-rose)' : item.type === 'assign' ? 'var(--accent-cyan)' : item.type === 'investigate' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{item.event}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 2 }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detail panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {selectedAlert ? (
            <>
              <Card style={{ padding: 'var(--spacing-md)', background: selectedAlert.severity === 'CRITICAL' ? 'rgba(244,63,94,0.05)' : undefined, border: selectedAlert.severity === 'CRITICAL' ? '1px solid rgba(244,63,94,0.2)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🔍</span>
                    {lang === 'ar' ? 'تفاصيل التنبيه' : 'Alert Details'}
                  </h3>
                  <Badge variant={severityBadge(selectedAlert.severity)} size="md">{selectedAlert.severity}</Badge>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                  <Badge variant={statusBadge(selectedAlert.status)}>{selectedAlert.status}</Badge>
                  <Badge variant="primary">{selectedAlert.type}</Badge>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                  {[
                    { label: lang === 'ar' ? 'المعرف' : 'ID', value: selectedAlert.id },
                    { label: lang === 'ar' ? 'العميل' : 'Customer', value: selectedAlert.customerName },
                    { label: lang === 'ar' ? 'النوع' : 'Type', value: selectedAlert.type },
                    { label: lang === 'ar' ? 'المبلغ' : 'Amount', value: selectedAlert.amount ? `${selectedAlert.amount.toLocaleString()} AED` : 'N/A' },
                    { label: lang === 'ar' ? 'الوقت' : 'Time', value: selectedAlert.time },
                    { label: lang === 'ar' ? 'الحالة' : 'Status', value: selectedAlert.status },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)' }}>
                    {lang === 'ar' ? 'التفاصيل' : 'Details'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {selectedAlert.details}
                  </div>
                </div>

                {selectedAlert.assignedTo && (
                  <div style={{ padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>{lang === 'ar' ? 'مخصص لـ' : 'Assigned to'}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedAlert.assignedTo}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Button variant="primary" size="sm" onClick={handleInvestigate} disabled={selectedAlert.status === 'RESOLVED'} style={{ flex: 1 }}>
                    {lang === 'ar' ? 'تحقيق' : 'Investigate'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowAssignModal(true)} disabled={selectedAlert.status === 'RESOLVED'} style={{ flex: 1 }}>
                    {lang === 'ar' ? 'تعيين' : 'Assign'}
                  </Button>
                  <Button variant="success" size="sm" onClick={handleResolve} disabled={selectedAlert.status === 'RESOLVED'} style={{ flex: 1 }}>
                    {lang === 'ar' ? 'حل' : 'Resolve'}
                  </Button>
                </div>
              </Card>

              <Card style={{ padding: 'var(--spacing-md)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)', margin: 0 }}>
                  {lang === 'ar' ? 'خطوات التحقيق' : 'Investigation Steps'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {[
                    { icon: '🔎', step: lang === 'ar' ? 'مراجعة بيانات العميل' : 'Review customer data', done: selectedAlert.status !== 'NEW' },
                    { icon: '📊', step: lang === 'ar' ? 'تحليل المعاملات' : 'Analyze transactions', done: selectedAlert.status === 'INVESTIGATING' || selectedAlert.status === 'RESOLVED' },
                    { icon: '📋', step: lang === 'ar' ? 'التحقق من الهوية' : 'Verify identity', done: selectedAlert.status === 'INVESTIGATING' || selectedAlert.status === 'RESOLVED' },
                    { icon: '✅', step: lang === 'ar' ? 'تقديم التقرير' : 'Submit report', done: selectedAlert.status === 'RESOLVED' },
                  ].map((item, i) => (
                    <div key={i} className="investigation-step" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm)', background: item.done ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${item.done ? 'var(--accent-emerald)' : 'var(--border)'}` }}>
                      <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      <div style={{ flex: 1, fontSize: '12px', color: item.done ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                        {item.step}
                      </div>
                      {item.done && <div style={{ fontSize: '12px' }}>✓</div>}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card style={{ padding: 'var(--spacing-xl)', textAlign: 'center', minHeight: 200 }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-md)' }}>🔍</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
                {lang === 'ar' ? 'اختر تنبيهاً للتحقيق' : 'Select an alert to investigate'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                {lang === 'ar' ? 'عنوان كل تنبيه باللحظة التي تم فيها اكتشافه' : 'Each alert shows the moment it was detected'}
              </p>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-rose)' }}>{FRAUD_ALERTS.filter(a => a.severity === 'CRITICAL').length}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{lang === 'ar' ? 'حرجة' : 'Critical'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-amber)' }}>{FRAUD_ALERTS.filter(a => a.severity === 'HIGH').length}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{lang === 'ar' ? 'عالية' : 'High'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{FRAUD_ALERTS.filter(a => a.severity === 'MEDIUM').length}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{lang === 'ar' ? 'متوسطة' : 'Medium'}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  {lang === 'ar' ? 'إجمالي التنبيهات: ' : 'Total alerts: '}{FRAUD_ALERTS.length}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title={lang === 'ar' ? 'تعيين التحقيق' : 'Assign Investigation'} size="sm">
        <div style={{ padding: 'var(--spacing-sm)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            {lang === 'ar' ? 'اختر محللاً لتعيين هذا التنبيه:' : 'Select an analyst to assign this alert:'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {[
              { name: 'Maria Garcia', specialty: 'AML Specialist' },
              { name: 'James Wilson', specialty: 'Fraud Analyst' },
              { name: 'Sarah Chen', specialty: 'Sanctions' },
              { name: 'Ahmed Hassan', specialty: 'Document Review' },
            ].map((person) => (
              <button key={person.name} onClick={() => { setInvestigator(person.name); handleAssign() }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 150ms ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{person.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{person.specialty}</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--primary-500)' }}>→</div>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
