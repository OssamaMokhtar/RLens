import React, { useState, useEffect } from 'react'
import { Card, Badge, Button } from '../components/Shared'
import { useAuth } from '../hooks/useAuth'

export function Profile({ lang }) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState(3)
  const [marketing, setMarketing] = useState(false)

  const roles = {
    ADMIN: { label: lang === 'ar' ? 'مدير النظام' : 'System Administrator', permissions: ['read', 'write', 'delete', 'admin'] },
    CREDIT_OFFICER: { label: lang === 'ar' ? 'مسؤول الائتمان' : 'Credit Officer', permissions: ['read', 'write', 'score'] },
    RISK_MANAGER: { label: lang === 'ar' ? 'مدير المخاطر' : 'Risk Manager', permissions: ['read', 'analytics', 'report'] },
    FRAUD_ANALYST: { label: lang === 'ar' ? 'محلل الاحتيال' : 'Fraud Analyst', permissions: ['read', 'fraud', 'investigate'] },
    COMPLIANCE: { label: lang === 'ar' ? 'امتثال' : 'Compliance', permissions: ['read', 'audit', 'report'] },
  }

  const userRole = roles[user?.role] || roles.CREDIT_OFFICER

  return (
    <div className="profile-page">
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--spacing-lg)' }}>
        {/* Profile sidebar */}
        <Card style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
          <div className="profile-avatar" style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)', fontSize: '28px', fontWeight: 700, color: 'white' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {user?.name}
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-sm)' }}>
            {user?.role}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            {user?.email}
          </div>
          <div className="profile-country" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            {user?.country || 'AE'}
          </div>
          <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
              {lang === 'ar' ? 'آخر نشاط' : 'Last Active'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'قبل 5 دقائق' : '5 minutes ago'}
            </div>
          </div>
        </Card>

        {/* Content tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Tabs */}
          <div className="profile-tabs" style={{ display: 'flex', gap: 'var(--spacing-xs)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--spacing-lg)' }}>
            {[
              { key: 'profile', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile' },
              { key: 'settings', label: lang === 'ar' ? 'الإعدادات' : 'Settings' },
              { key: 'notifications', label: lang === 'ar' ? 'الإشعارات' : 'Notifications' },
              { key: 'activity', label: lang === 'ar' ? 'النشاط' : 'Activity' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: activeTab === tab.key ? 'var(--bg-hover)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid var(--primary-500)' : '2px solid transparent',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 150ms ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                {lang === 'ar' ? 'تفاصيل الحساب' : 'Account Details'}
              </h3>
              <div className="profile-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                {[
                  { label: lang === 'ar' ? 'الاسم الكامل' : 'Full Name', value: user?.name, editable: false },
                  { label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', value: user?.email, editable: true },
                  { label: lang === 'ar' ? 'الدور' : 'Role', value: userRole.label, editable: false },
                  { label: lang === 'ar' ? 'الدولة' : 'Country', value: user?.country || 'AE', editable: true },
                  { label: lang === 'ar' ? 'الصلاحيات' : 'Permissions', value: userRole.permissions.join(', '), editable: false },
                  { label: lang === 'ar' ? 'تاريخ الانضمام' : 'Joined', value: 'Jan 15, 2026', editable: false },
                ].map((item, i) => (
                  <div key={i} className="profile-field" style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: item.editable ? 'var(--spacing-sm)' : 0 }}>
                      {item.value}
                    </div>
                    {item.editable && (
                      <Button variant="ghost" size="sm">
                        {lang === 'ar' ? 'تعديل' : 'Edit'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
                  {lang === 'ar' ? 'الصلاحيات المفصلة' : 'Detailed Permissions'}
                </div>
                <div className="permissions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)' }}>
                  {userRole.permissions.map((perm) => (
                    <div key={perm} className="permission-badge" style={{ padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-secondary)', border: `1px solid ${perm === 'admin' ? 'var(--primary-500)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
                        {perm === 'read' ? (lang === 'ar' ? 'قراءة' : 'Read') : perm === 'write' ? (lang === 'ar' ? 'كتابة' : 'Write') : perm === 'delete' ? (lang === 'ar' ? 'حذف' : 'Delete') : perm === 'admin' ? (lang === 'ar' ? 'إدارة' : 'Admin') : perm === 'score' ? (lang === 'ar' ? 'تقييم' : 'Score') : perm === 'analytics' ? (lang === 'ar' ? 'تحليلات' : 'Analytics') : perm === 'report' ? (lang === 'ar' ? 'تقارير' : 'Reports') : perm === 'fraud' ? (lang === 'ar' ? 'احتيال' : 'Fraud') : perm === 'investigate' ? (lang === 'ar' ? 'تحقيق' : 'Investigate') : perm === 'audit' ? (lang === 'ar' ? 'تدقيق' : 'Audit') : perm}
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: perm === 'admin' ? 'var(--primary-500)' : 'var(--accent-emerald)', margin: '0 auto' }} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Settings tab */}
          {activeTab === 'settings' && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                {lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {[
                  { label: lang === 'ar' ? 'اللغة المفضلة' : 'Preferred Language', options: [{ value: 'en', label: 'English' }, { value: 'ar', label: 'العربية' }], current: 'en' },
                  { label: lang === 'ar' ? 'المظهر' : 'Theme', options: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }], current: 'dark' },
                  { label: lang === 'ar' ? 'المنطقة الزمنية' : 'Timezone', options: [{ value: 'GMT+3', label: 'GMT+3 (UAE)' }, { value: 'GMT+2', label: 'GMT+2 (Europe)' }], current: 'GMT+3' },
                ].map((setting, i) => (
                  <div key={i} className="settings-row" style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
                      {setting.label}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                      {setting.options.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {}}
                          className={`settings-option ${setting.current === opt.value ? 'active' : ''}`}
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-md)',
                            borderRadius: 'var(--radius-full)',
                            border: setting.current === opt.value ? '1px solid var(--primary-500)' : '1px solid var(--border)',
                            background: setting.current === opt.value ? 'rgba(99,102,241,0.1)' : 'transparent',
                            color: setting.current === opt.value ? 'var(--primary-500)' : 'var(--text-secondary)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary">
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          )}

          {/* Notifications tab */}
          {activeTab === 'notifications' && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                {lang === 'ar' ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {[
                  { label: lang === 'ar' ? 'تنبيهات الاحتيال' : 'Fraud Alerts', desc: lang === 'ar' ? 'عند اكتشاف تنبيهات احتيال جديدة' : 'When new fraud alerts are detected', enabled: true, critical: true },
                  { label: lang === 'ar' ? 'قرارات التقييم' : 'Score Decisions', desc: lang === 'ar' ? 'عند وجود قرارات ائتمانية جديدة' : 'When new credit decisions are made', enabled: true, critical: false },
                  { label: lang === 'ar' ? 'تقارير المخاطر' : 'Risk Reports', desc: lang === 'ar' ? 'عند تجديد تقارير المخاطر' : 'When risk reports are updated', enabled: false, critical: false },
                  { label: lang === 'ar' ? 'رسائل التسويق' : 'Marketing Messages', desc: lang === 'ar' ? 'عن الإصدارات الجديدة والخصائص' : 'About new releases and features', enabled: marketing, critical: false },
                ].map((notif, i) => (
                  <div key={i} className="notification-row" style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${notif.enabled ? notif.critical ? 'var(--accent-rose)' : 'var(--accent-emerald)' : 'var(--border)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                          {notif.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {notif.desc}
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications(notif.enabled ? notifications - 1 : notifications + 1)}
                        className={`toggle ${notif.enabled ? 'on' : 'off'}`}
                        style={{
                          width: 36,
                          height: 20,
                          borderRadius: 10,
                          background: notif.enabled ? 'var(--primary-500)' : 'var(--bg-card)',
                          border: `1px solid ${notif.enabled ? 'var(--primary-500)' : 'var(--border)'}`,
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <div style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: notif.enabled ? 2 : 2,
                          left: notif.enabled ? 18 : 2,
                          transition: 'all 150ms ease',
                        }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Activity tab */}
          {activeTab === 'activity' && (
            <Card style={{ padding: 'var(--spacing-lg)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
                {lang === 'ar' ? 'نشاط الحساب' : 'Account Activity'}
              </h3>
              <div className="activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {[
                  { action: lang === 'ar' ? 'تسجيل دخول' : 'Signed in', target: '', time: '5 minutes ago', type: 'login' },
                  { action: lang === 'ar' ? 'تعديل الإعدادات' : 'Updated settings', target: 'Profile', time: '1 hour ago', type: 'settings' },
                  { action: lang === 'ar' ? 'تقييم طلب' : 'Scored application', target: 'AE-2026-1234', time: '2 hours ago', type: 'score' },
                  { action: lang === 'ar' ? 'تغيير كلمة المرور' : 'Changed password', target: '', time: '1 day ago', type: 'security' },
                  { action: lang === 'ar' ? 'تسجيل دخول' : 'Signed in', target: '', time: '2 days ago', type: 'login' },
                ].map((item, i) => (
                  <div key={i} className="activity-item" style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${item.type === 'login' ? 'var(--accent-cyan)' : item.type === 'settings' ? 'var(--primary-500)' : item.type === 'score' ? 'var(--accent-emerald)' : item.type === 'security' ? 'var(--accent-rose)' : 'var(--border)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.action}
                          {item.target && <span style={{ color: 'var(--text-secondary)' }}> — {item.target}</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
