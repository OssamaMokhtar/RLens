import React, { useState } from 'react'
import { Modal } from '../components/Shared/Modal'
import appData from '../lib/data'

export function FraudAML({ titles, locale }) {
  const [filterType, setFilterType] = useState('all')
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [investigatorNotes, setInvestigatorNotes] = useState({})

  const filtered = appData.fraudAlerts.filter(a => {
    if (filterType === 'all') return true
    return a.status === filterType
  })

  const statusCounts = {
    NEW: appData.fraudAlerts.filter(a => a.status === 'NEW').length || 0,
    ASSIGNED: appData.fraudAlerts.filter(a => a.status === 'ASSIGNED').length || 0,
    INVESTIGATING: appData.fraudAlerts.filter(a => a.status === 'INVESTIGATING').length || 0,
    RESOLVED: appData.fraudAlerts.filter(a => a.status === 'RESOLVED').length || 0,
  }

  return (
    <div className="fraud-page">
      <h1>{titles?.fraud?.[locale] || 'Fraud & AML'}</h1>

      <div className="filter-bar">
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="NEW">NEW</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="INVESTIGATING">INVESTIGATING</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      <div className="alert-stats">
        <div className="alert-stat">
          <span className="alert-stat-value">{statusCounts.NEW}</span>
          <span className="alert-stat-label">NEW</span>
        </div>
        <div className="alert-stat">
          <span className="alert-stat-value">{statusCounts.ASSIGNED}</span>
          <span className="alert-stat-label">ASSIGNED</span>
        </div>
        <div className="alert-stat">
          <span className="alert-stat-value">{statusCounts.INVESTIGATING}</span>
          <span className="alert-stat-label">INVESTIGATING</span>
        </div>
        <div className="alert-stat">
          <span className="alert-stat-value">{statusCounts.RESOLVED}</span>
          <span className="alert-stat-label">RESOLVED</span>
        </div>
      </div>

      <div className="alert-table">
        <div className="alert-row alert-header">
          <div className="alert-cell alert-id">ID</div>
          <div className="alert-cell alert-applicant">Applicant</div>
          <div className="alert-cell alert-amount">Amount</div>
          <div className="alert-cell alert-risk">Risk</div>
          <div className="alert-cell alert-status">Status</div>
          <div className="alert-cell alert-assignee">Assignee</div>
          <div className="alert-cell alert-actions">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="alert-row alert-empty">No alerts</div>
        ) : (
          filtered.map(alert => (
            <div
              key={alert.id}
              className={`alert-row alert-${alert.severity.toLowerCase()}`}
            >
              <div className="alert-cell alert-id">{alert.id}</div>
              <div className="alert-cell alert-applicant">
                <div className="alert-applicant-name">{alert.applicantName}</div>
                <div className="alert-applicant-email">{alert.email}</div>
              </div>
              <div className="alert-cell alert-amount">
                {alert.amount.toLocaleString()} USD
              </div>
              <div className="alert-cell alert-risk">
                <div className="risk-indicator">
                  <span className={`risk-dot risk-${alert.riskLevel.toLowerCase()}`} />
                  <span>{alert.riskLevel}</span>
                </div>
              </div>
              <div className="alert-cell alert-status">
                <span className={`status-badge status-${alert.status.toLowerCase()}`}>
                  {alert.status}
                </span>
              </div>
              <div className="alert-cell alert-assignee">{alert.assignee}</div>
              <div className="alert-cell alert-actions">
                <button className="action-btn" onClick={() => setSelectedAlert(alert)}>
                  Investigate
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedAlert && (
        <Modal
          titleEn={`Alert ${selectedAlert.id}`}
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
        >
          <div className="investigation-panel">
            <h3>Investigation</h3>
            <div className="detail-row">
              <label>Applicant</label>
              <span>
                {selectedAlert.applicantName} ({selectedAlert.email})
              </span>
            </div>
            <div className="detail-row">
              <label>Amount at Risk</label>
              <span>{selectedAlert.amount.toLocaleString()} USD</span>
            </div>
            <div className="detail-row">
              <label>Similarity Flags</label>
              <div>
                {selectedAlert.similarityFlags.map(flag => (
                  <span key={flag} className="similarity-flag">
                    {flag}
                  </span>
                ))}
              </div>
            </div>
            <div className="detail-row">
              <label>Investigator Notes</label>
              <textarea
                className="investigator-notes"
                placeholder="Add notes..."
                value={investigatorNotes[selectedAlert.id] || ''}
                onChange={e =>
                  setInvestigatorNotes(prev => ({
                    ...prev,
                    [selectedAlert.id]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="detail-actions">
              <button className="action-btn primary" onClick={() => {}}>
                Assign to me
              </button>
              <button className="action-btn" onClick={() => {}}>
                Resolve
              </button>
              <button className="action-btn" onClick={() => {}}>
                Escalate
              </button>
              <button
                className="action-btn ghost"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
