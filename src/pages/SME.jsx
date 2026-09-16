import React, { useState } from 'react'
import { Modal } from '../components/Shared/Modal'
import data from '../lib/data'

export function SMELending({ titles, locale }) {
  const [form, setForm] = useState({
    businessName: '',
    sector: 'Retail',
    amount: '',
    purpose: 'Working Capital',
  })
  const [showModal, setShowModal] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const sectors = ['Retail', 'Technology', 'Healthcare', 'Construction', 'Agriculture']
  const purposes = ['Working Capital', 'Equipment Financing', 'Expansion', 'Inventory']

  return (
    <div className="sme-page">
      <h1>{titles?.sme?.[locale] || 'SME Lending'}</h1>

      <div className="sme-actions">
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          {locale === 'ar' ? '+' : '+'} {locale === 'ar' ? 'طلب جديد' : 'New Application'}
        </button>
      </div>

      <div className="sme-list">
        {data.smeApplications?.map(app => (
          <div key={app.id} className="sme-card">
            <div className="sme-card-main">
              <div className="sme-card-info">
                <div className="sme-card-name">{app.name}</div>
                <div className="sme-card-sector">{app.sector}</div>
              </div>
              <div className="sme-card-amount">
                {app.amount?.toLocaleString()} AED
              </div>
            </div>
            <div className="sme-card-footer">
              <span className="status-badge status-pending">Pending Review</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          titleEn="New SME Application"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="sme-form">
            <div className="form-field">
              <label>Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={e => handleChange('businessName', e.target.value)}
                placeholder="Enter business name"
              />
            </div>
            <div className="form-field">
              <label>Sector</label>
              <select
                value={form.sector}
                onChange={e => handleChange('sector', e.target.value)}
              >
                {sectors.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Amount (AED)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => handleChange('amount', e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="form-field">
              <label>Purpose</label>
              <select
                value={form.purpose}
                onChange={e => handleChange('purpose', e.target.value)}
              >
                {purposes.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => setShowModal(false)}>
                Submit Application
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
