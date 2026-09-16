import React, { useState, useMemo } from 'react'
import { Modal } from '../components/Shared/Modal'
import appData from '../lib/data'

export function Dashboard({ titles, locale }) {
  const activity = appData.activityFeed?.slice(0, 12) || []
  const insights = appData.insights?.slice(0, 5) || []

  return (
    <div className="dashboard-page">
      <h1>{titles?.dashboard?.[locale] || 'Dashboard'}</h1>

      <div className="kpi-grid">
        {appData.kpiData?.map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-trend">{kpi.trend}</div>
          </div>
        ))}
      </div>

      <h2>Sector Exposure</h2>
      <div className="sector-exposure">
        {appData.sectorExposure?.map(s => (
          <div key={s.sector} className="sector-bar">
            <div className="sector-info">
              <span className="sector-name">{s.sector}</span>
              <span className="sector-value">{s.exposure}%</span>
            </div>
            <div className="sector-track">
              <div
                className="sector-fill"
                style={{
                  width: `${s.exposure}%`,
                  background:
                    s.rating === 'high' ? 'var(--danger)' :
                    s.rating === 'medium' ? 'var(--warning)' :
                    'var(--success)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <h2>Recent Activity</h2>
      {activity.length === 0 ? (
        <p className="empty-state">No recent activity</p>
      ) : (
        <div className="activity-list">
          {activity.map((item, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{item.icon}</div>
              <div className="activity-content">
                <div
                  className="activity-text"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
                <div className="activity-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
