import React, { useState, useEffect } from 'react'
import { Card, Badge, Button, Input } from '../components/Shared'
import { MiniChart } from '../components/Charts'
import { REGULATORY_DOCS } from '../lib/data'

export function RegulationsRAG({ lang }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredDocs = REGULATORY_DOCS.filter(doc => {
    if (activeCategory !== 'all' && doc.type !== activeCategory) return false
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && !doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  useEffect(() => {
    if (selectedDoc) {
      document.getElementById('doc-modal')?.showModal()
    }
  }, [selectedDoc])

  const categoryStats = {
    regulation: REGULATORY_DOCS.filter(d => d.type === 'regulation').length,
    policy: REGULATORY_DOCS.filter(d => d.type === 'policy').length,
    guideline: REGULATORY_DOCS.filter(d => d.type === 'guideline').length,
  }

  const openDoc = (doc) => {
    setSelectedDoc(doc)
  }

  const closeDoc = () => {
    setSelectedDoc(null)
  }

  return (
    <div className="regulations-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ position: 'relative', maxWidth: 300 }}>
          <Input
            placeholder={lang === 'ar' ? 'البحث في الأنظمة...' : 'Search regulations...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              padding: '4px',
              display: searchQuery ? 'flex' : 'none',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            {[
              { key: 'all', label: lang === 'ar' ? 'الكل' : 'All', count: REGULATORY_DOCS.length },
              { key: 'regulation', label: lang === 'ar' ? 'أنظمة' : 'Regulations', count: categoryStats.regulation },
              { key: 'policy', label: lang === 'ar' ? 'سياسات' : 'Policies', count: categoryStats.policy },
              { key: 'guideline', label: lang === 'ar' ? 'أدلة' : 'Guidelines', count: categoryStats.guideline },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: activeCategory === cat.key ? 'var(--primary-500)' : 'transparent',
                  color: activeCategory === cat.key ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {cat.label}
                <span style={{ fontSize: '10px', opacity: 0.7 }}>({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Search results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {filteredDocs.map((doc, i) => (
              <Card
                key={doc.id}
                hover
                onClick={() => openDoc(doc)}
                style={{
                  padding: 'var(--spacing-md)',
                  borderLeft: `3px solid ${doc.type === 'regulation' ? 'var(--accent-emerald)' : doc.type === 'policy' ? 'var(--primary-500)' : 'var(--accent-cyan)'}`,
                  transition: 'all 150ms ease',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Badge variant={doc.type === 'regulation' ? 'success' : doc.type === 'policy' ? 'primary' : 'info'} size="sm">
                      {doc.type === 'regulation' ? (lang === 'ar' ? 'System' : 'Regulation') : doc.type === 'policy' ? (lang === 'ar' ? 'Policy' : 'Policy') : (lang === 'ar' ? 'Guideline' : 'Guideline')}
                    </Badge>
                    {doc.country !== 'GCC' && (
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {doc.country}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {doc.updated}
                  </span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)', lineHeight: 1.3 }}>
                  {doc.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--spacing-sm)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {doc.excerpt}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  <span>
                    {doc.type === 'regulation' ? (lang === 'ar' ? 'تنظيم' : 'Regulation') : doc.type === 'policy' ? (lang === 'ar' ? 'سياسة داخلية' : 'Internal Policy') : (lang === 'ar' ? 'دليل' : 'Guideline')}
                  </span>
                  <span>{label}</span>
                </div>
              </Card>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <Card style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-md)' }}>🔍</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
                {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Try a different search term or category
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Stats */}
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>📊</span>
              {lang === 'ar' ? 'إحصاءات' : 'Statistics'}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              {[
                { label: lang === 'ar' ? 'التنظيمات' : 'Regs', value: categoryStats.regulation, color: 'var(--accent-emerald)' },
                { label: lang === 'ar' ? 'السياسات' : 'Policies', value: categoryStats.policy, color: 'var(--primary-500)' },
                { label: lang === 'ar' ? 'الأدلة' : 'Guides', value: categoryStats.guideline, color: 'var(--accent-cyan)' },
              ].map((stat) => (
                <div key={stat.label} className="stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 2, textTransform: 'uppercase' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
              {REGULATORY_DOCS.length} total documents
            </div>
          </Card>

          {/* Recent activity */}
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>📜</span>
              {lang === 'ar' ? 'الأ Presidential' : 'Recently Viewed'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {REGULATORY_DOCS.slice(0, 3).map((doc, i) => (
                <div key={i} style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', borderLeft: `3px solid ${doc.type === 'regulation' ? 'var(--accent-emerald)' : doc.type === 'policy' ? 'var(--primary-500)' : 'var(--accent-cyan)'}` }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {doc.type} · {doc.updated}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick links */}
          <Card style={{ padding: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', margin: 0 }}>
              <span style={{ fontSize: '16px' }}>🔗</span>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {[
                { label: lang === 'ar' ? 'تجهيزات CBUAE الكاملة' : 'CBUAE Full Guidelines', href: '#' },
                { label: lang === 'ar' ? 'إطار SAMA للتقرض' : 'SAMA Lending Framework', href: '#' },
                { label: lang === 'ar' ? 'معايير AML التعاونية' : 'Joint AML Standards', href: '#' },
                { label: lang === 'ar' ? 'دليل الامتثال' : 'Compliance Handbook', href: '#' },
              ].map((link, i) => (
                <a key={i} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-xs) var(--spacing-sm)', color: 'var(--text-secondary)', fontSize: '12px', textDecoration: 'none', transition: 'color 150ms ease' }}>
                  <span style={{ fontSize: '10px' }}>→</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="doc-modal-overlay" onClick={closeDoc} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div
            id="doc-modal"
            className="doc-modal"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              width: '700px',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Badge variant={selectedDoc.type === 'regulation' ? 'success' : selectedDoc.type === 'policy' ? 'primary' : 'info'} size="md">
                    {selectedDoc.type}
                  </Badge>
                  {selectedDoc.country !== 'GCC' && (
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {selectedDoc.country}
                    </span>
                  )}
                </div>
                <button
                  onClick={closeDoc}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                {selectedDoc.title}
              </h2>
              <div style={{ marginTop: 'var(--spacing-sm)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Updated: {selectedDoc.updated} · {selectedDoc.type === 'regulation' ? (lang === 'ar' ? 'تنظيم' : 'Regulation') : selectedDoc.type === 'policy' ? (lang === 'ar' ? 'سياسة داخلية' : 'Internal Policy') : (lang === 'ar' ? 'دليل' : 'Guideline')}
              </div>
            </div>
            <div style={{ padding: 'var(--spacing-lg)' }}>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-sm)' }}>
                  {lang === 'ar' ? 'المقدمة' : 'Excerpt'}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {selectedDoc.excerpt}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)' }}>{lang === 'ar' ? 'النوع' : 'Type'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedDoc.type}
                  </div>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)' }}>{lang === 'ar' ? 'الدولة' : 'Country'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedDoc.country}
                  </div>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)' }}>{lang === 'ar' ? 'آخر تحديث' : 'Last Updated'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedDoc.updated}
                  </div>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--spacing-xs)' }}>{lang === 'ar' ? 'المعرف' : 'ID'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {selectedDoc.id}
                  </div>
                </div>
              </div>

              <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--spacing-md)' }}>
                  {lang === 'ar' ? 'المحتويات الكاملة' : 'Full Content'}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {lang === 'ar' ? 'هذا المستند موجز فقط. للحصول على المحتوى الكامل، يرجى الرجوع إلى مستودع السياسات الداخلي أو التوجه إلى portal المؤسسة.' : 'This document is an excerpt. For full content, please refer to the internal policy repository or contact the compliance portal.'}
                </p>
              </div>
            </div>
            <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)' }}>
              <Button variant="primary" size="sm">
                {lang === 'ar' ? 'تنزيل PDF' : 'Download PDF'}
              </Button>
              <Button variant="secondary" size="sm" onClick={closeDoc}>
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
