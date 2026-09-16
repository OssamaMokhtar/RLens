import React, { useState } from 'react'
import { Modal } from '../components/Shared/Modal'
import appData from '../lib/data'

export function Applications({ titles, locale }) {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? (appData.applications || [])
    : (appData.applications || []).filter(a =>
        (a.status || '').toLowerCase() === filter.toLowerCase()
      )

  const statuses = [
    { key: 'all', label: titles?.all?.[locale] || 'All' },
    { key: 'NEW', label: titles?.new?.[locale] || 'New' },
    { key: 'ASSIGNED', label: titles?.assigned?.[locale] || 'Assigned' },
    { key: 'INVESTIGATING', label: titles?.investigating?.[locale] || 'Investigating' },
    { key: 'RESOLVED', label: titles?.resolved?.[locale] || 'Resolved' },
  ]

  return (
    <div className="applications-page">
      <h1>{titles?.applications?.[locale] || 'Applications'}</h1>

      <div className="filter-bar">
        {statuses.map(s => (
          <button
            key={s.key}
            className={`filter-btn ${filter === s.key ? 'active' : ''}`}
            onClick={() => setFilter(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="applications-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {locale === 'ar' ? 'لا توجد طلبات' : 'No applications'}
          </div>
        ) : (
          filtered.map(app => (
            <div
              key={app.id}
              className={`application-card ${selected?.id === app.id ? 'selected' : ''}`}
              onClick={() => setSelected(app)}
            >
              <div className="app-card-main">
                <div className="app-card-info">
                  <div className="app-card-name">{app.applicantName}</div>
                  <div className="app-card-email">{app.email}</div>
                </div>
                <div className="app-card-amounts">
                  <div className="app-card-amount">
                    {app.amount?.toLocaleString()} AED
                  </div>
                  <div className="app-card-tenor">{app.tenor} months</div>
                </div>
              </div>
              <div className="app-card-footer">
                <div className="app-card-score">
                  <span className="score-badge">{app.score || '--'}</span>
                  <span className="score-label">Score</span>
                </div>
                <div className="app-card-status">
                  <span className={`status-badge status-${app.status?.toLowerCase() || 'new'}`}>
                    {app.status || 'NEW'}
                  </span>
                </div>
                <div className="app-card-sector">
                  <span className="sector-badge">{app.sector || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <Modal
          titleEn={`Application ${selected.id}`}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
        >
          <div className="application-detail">
            <div className="detail-row">
              <label>Applicant</label>
              <span>{selected.applicantName}</span>
            </div>
            <div className="detail-row">
              <label>Email</label>
              <span>{selected.email}</span>
            </div>
            <div className="detail-row">
              <label>Amount</label>
              <span>{selected.amount?.toLocaleString()} AED</span>
            </div>
            <div className="detail-row">
              <label>Tenor</label>
              <span>{selected.tenor} months</span>
            </div>
            <div className="detail-row">
              <label>Sector</label>
              <span>{selected.sector || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <label>Score</label>
              <span>{selected.score || '--'} / 1000</span>
            </div>
            <div className="detail-row">
              <label>Status</label>
              <span className={`status-badge status-${selected.status?.toLowerCase() || 'new'}`}>
                {selected.status || 'NEW'}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
