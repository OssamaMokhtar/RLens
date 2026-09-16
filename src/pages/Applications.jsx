import React, { useState, useMemo } from 'react'
import { Card, Badge, Button, Input, Modal, ScoreMeter } from '../components/Shared'
import { APPLICATIONS, COUNTRIES, FRAUD_ALERTS, usePulse } from '../lib/data'
import { ScoreMeterCard } from '../components/Charts'

export function Applications({ lang }) {
  const [selected, setSelected] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const { evaluate } = usePulse()

  const filtered = useMemo(() => {
    return APPLICATIONS.filter(app => {
      if (filterType !== 'all' && app.type !== filterType) return false
      if (filterStatus !== 'all' && app.status !== filterStatus) return false
      if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.nameAr.includes(search)) return false
      return true
    })
  }, [filterType, filterStatus, search])

  const openDetails = (app) => {
    evaluate(app)
    setSelected(app)
    setModalOpen(true)
  }

  const statusBadgeVariant = (status) => {
    const map = { APPROVED: 'success', DECLINED: 'danger', REFERRED: 'warning', SCORED: 'info', SUBMITTED: 'primary' }
    return map[status] || 'primary'
  }

  return (
    <div className="applications-page">
      <div className="app-filters" style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', alignItems: 'center' }}>
        <Input placeholder={lang === 'ar' ? 'البحث عن اسم...' : 'Search name...'} value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <div className="filter-group" style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          {['all', 'RETAIL', 'SME'].map(type => (
            <button key={type} onClick={() => setFilterType(type)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, background: filterType === type ? 'var(--primary-500)' : 'transparent', color: filterType === type ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
              {type === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : type === 'RETAIL' ? (lang === 'ar' ? 'أفراد' : 'Retail') : (lang === 'ar' ? 'مؤسسات' : 'SME')}
            </button>
          ))}
        </div>
        <div className="filter-group" style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          {['all', 'APPROVED', 'REFERRED', 'SCORED', 'DECLINED'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, background: filterStatus === status ? 'var(--primary-500)' : 'transparent', color: filterStatus === status ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
              {status === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : status}
            </button>
          ))}
        </div>
        <Button variant="primary" size="md">{lang === 'ar' ? 'طلب جديد' : 'New Application'}</Button>
      </div>

      <div className="applications-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-md)' }}>
        {filtered.map((app, i) => (
          <Card key={app.id} hover className="app-card" onClick={() => openDetails(app)} style={{ padding: 'var(--spacing-md)', animationDelay: `${i * 50}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{app.id}</span>
              <Badge variant={statusBadgeVariant(app.status)} size="sm">{app.status}</Badge>
            </div>

            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.3 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {lang === 'ar' ? app.nameAr : app.name}
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {app.type === 'RETAIL' ? (
                <>
                  <span>💰 {app.salary?.toLocaleString()} {app.currency}/mo</span>
                  <span>📅 {app.tenure} mo</span>
                </>
              ) : (
                <>
                  <span>💼 {app.sector}</span>
                  <span>👥 {app.employees} employees</span>
                </>
              )}
            </div>

            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              {app.currency} {app.amount?.toLocaleString()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                  {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{app.updated}</span>
              </div>
              <ScoreMeter score={app.score} grade={app.grade} size="sm" />
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>
            {lang === 'ar' ? 'لا توجد طلبات' : 'No applications found'}
          </h3>
          <p style={{ fontSize: '14px' }}>Try adjusting your filters</p>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={lang === 'ar' ? 'تفاصيل الطلب' : 'Application Details'} size="lg">
        {selected && (
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{selected.id}</div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? selected.nameAr : selected.name}
                  </h2>
                </div>
                <Badge variant={statusBadgeVariant(selected.status)} size="md">{selected.status}</Badge>
              </div>

              {selected.type === 'RETAIL' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { label: lang === 'ar' ? 'المنتج' : 'Product', value: selected.product },
                      { label: lang === 'ar' ? 'المبلغ' : 'Amount', value: `${selected.currency} ${selected.amount.toLocaleString()}` },
                      { label: lang === 'ar' ? 'المدة' : 'Tenor', value: selected.tenor > 0 ? `${selected.tenor} mo` : 'N/A' },
                      { label: lang === 'ar' ? 'الدخل الشهري' : 'Income', value: `${selected.salary.toLocaleString()} ${selected.currency}` },
                      { label: lang === 'ar' ? 'صاحب العمل' : 'Employer', value: selected.employer },
                      { label: lang === 'ar' ? 'السنوات' : 'Tenure', value: `${selected.tenure} mo` },
                      { label: lang === 'ar' ? 'تاريخ الائتمان' : 'Credit History', value: `${selected.creditHistory} mo` },
                      { label: lang === 'ar' ? 'نسبة الـ DSR' : 'DSR', value: `${(selected.dsr * 100).toFixed(1)}%` },
                    ].map((item, i) => (
                      <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <Button variant="primary" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'موافقة' : 'Approve'}</Button>
                    <Button variant="secondary" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'إرسال للمراجعة' : 'Refer'}</Button>
                    <Button variant="danger" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'رفض' : 'Decline'}</Button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { label: lang === 'ar' ? 'القطاع' : 'Sector', value: selected.sector },
                      { label: lang === 'ar' ? 'المبلغ' : 'Amount', value: `${selected.currency} ${selected.amount.toLocaleString()}` },
                      { label: lang === 'ar' ? 'المدة' : 'Tenor', value: `${selected.tenor} mo` },
                      { label: lang === 'ar' ? 'الإيرادات السنوية' : 'Annual Revenue', value: `${selected.revenue.toLocaleString()} ${selected.currency}` },
                      { label: lang === 'ar' ? 'هامش الربح' : 'Profit Margin', value: `${(selected.margin * 100).toFixed(1)}%` },
                      { label: lang === 'ar' ? 'السنوات في العمل' : 'Years in Business', value: `${selected.years} years` },
                      { label: lang === 'ar' ? 'عدد الموظفين' : 'Employees', value: `${selected.employees}` },
                      { label: lang === 'ar' ? 'نسبة الـ DSR' : 'DSR', value: `${(selected.dsr * 100).toFixed(1)}%` },
                    ].map((item, i) => (
                      <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <Button variant="primary" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'موافقة' : 'Approve'}</Button>
                    <Button variant="secondary" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'إرسال للمراجعة' : 'Refer'}</Button>
                    <Button variant="danger" size="sm" style={{ flex: 1 }}>{lang === 'ar' ? 'رفض' : 'Decline'}</Button>
                  </div>
                </>
              )}
            </div>

            <div style={{ width: 180, paddingLeft: 'var(--spacing-md)', borderLeft: '1px solid var(--border)' }}>
              <ScoreMeterCard score={selected.score} grade={selected.grade} maxScore={850} applicant={selected} lang={lang} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
