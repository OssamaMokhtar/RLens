import React, { useState } from 'react'
import data from '../lib/data'

export function Profile({ titles, locale }) {
  const [form, setForm] = useState({
    name: data.profileData?.name || 'Ossama Admin',
    email: data.profileData?.email || 'admin@rLens.ai',
    role: data.profileData?.role || 'Admin',
    marketing: data.profileData?.marketing ?? true,
    notifications: data.profileData?.notifications ?? true,
  })
  const [activity] = useState(data.activityFeed || [])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="profile-page">
      <h1>{titles?.profile?.[locale] || 'Profile'}</h1>

      {/* Personal Info */}
      <div className="profile-section">
        <h2>{titles?.personalInfo?.[locale] || 'Personal Information'}</h2>
        <div className="profile-card">
          <div className="profile-avatar">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 1-16 0a8 8 0 0 1 16 0" />
            </svg>
          </div>
          <div className="profile-info">
            <div className="profile-name">{form.name}</div>
            <div className="profile-email">{form.email}</div>
            <div className="profile-role">
              <span className="role-badge">{form.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="profile-section">
        <h2>{titles?.accountSettings?.[locale] || 'Account Settings'}</h2>
        <div className="settings-form">
          <div className="form-field">
            <label>{titles?.name?.[locale] || 'Name'}</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>{titles?.emailAddress?.[locale] || 'Email'}</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>{titles?.roleLabel?.[locale] || 'Role'}</label>
            <select value={form.role} onChange={e => handleChange('role', e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="profile-section">
        <h2>{titles?.preferences?.[locale] || 'Preferences'}</h2>
        <div className="preferences-list">
          <label className="preference-item">
            <div className="preference-info">
              <span className="preference-label">
                {titles?.marketingEmails?.[locale] || 'Marketing Emails'}
              </span>
              <span className="preference-desc">
                Receive product updates and offers
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.marketing}
              onChange={e => handleChange('marketing', e.target.checked)}
            />
          </label>
          <label className="preference-item">
            <div className="preference-info">
              <span className="preference-label">
                {titles?.securityNotifications?.[locale] || 'Security Notifications'}
              </span>
              <span className="preference-desc">
                Get alerts for suspicious activity
              </span>
            </div>
            <input
              type="checkbox"
              checked={form.notifications}
              onChange={e => handleChange('notifications', e.target.checked)}
            />
          </label>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="profile-section">
        <h2>{titles?.activityFeed?.[locale] || 'Activity Feed'}</h2>
        {activity.length === 0 ? (
          <div className="empty-state">
            {titles?.noActivity?.[locale] || 'No activity yet'}
          </div>
        ) : (
          <div className="activity-feed">
            {activity.map((item, idx) => (
              <div key={idx} className="activity-item">
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

      {/* Danger Zone */}
      <div className="profile-section profile-danger">
        <h2>Danger Zone</h2>
        <div className="danger-actions">
          <button className="btn-danger">
            {titles?.deleteAccount?.[locale] || 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
