import React, { useState, useLayoutEffect } from 'react'
import { usePulse } from '../hooks/usePulse'

const NavItem = ({ icon, label, labelAr, active, onClick, badge }) => (
  <button
    className={`nav-item ${active ? 'active' : ''}`}
    onClick={onClick}
    title={label}
  >
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
    {badge && <span className="nav-badge">{badge}</span>}
  </button>
)

const Sidebar = ({ lang, currentPage, onNavigate, alertsCount }) => {
  const pages = [
    { key: 'dashboard', icon: '📊', label: lang === 'ar' ? 'لوحة المعلومات' : 'Dashboard' },
    { key: 'applications', icon: '📋', label: lang === 'ar' ? 'الطلبات' : 'Applications', badge: alertsCount > 2 ? alertsCount : null },
    { key: 'scoring', icon: '🎯', label: lang === 'ar' ? 'تقييم الائتمان' : 'Credit Scoring' },
    { key: 'sme', icon: '🏢', label: lang === 'ar' ? 'تمويل المؤسسات' : 'SME Lending' },
    { key: 'risk', icon: '📈', label: lang === 'ar' ? 'تحليل المخاطر' : 'Risk Analytics' },
    { key: 'fraud', icon: '🔒', label: lang === 'ar' ? 'الاحتيال وغسل الأموال' : 'Fraud & AML', badge: null },
    { key: 'copilot', icon: '🤖', label: lang === 'ar' ? 'المساعد الذكي' : 'AI Copilot' },
    { key: 'regulations', icon: '📜', label: lang === 'ar' ? 'الأنظمة' : 'Regulations' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
            <path d="M12 28V12l16 8-16 8z" fill="white"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1"/>
                <stop offset="1" stopColor="#4f46e5"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="sidebar-brand">RLens</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {pages.map(page => (
          <NavItem
            key={page.key}
            icon={page.icon}
            label={page.label}
            active={currentPage === page.key}
            onClick={() => onNavigate(page.key)}
            badge={page.key === 'applications' ? alertsCount : null}
          />
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot" />
          <span className={lang === 'ar' ? 'فعال' : 'Active'}</span>
        </div>
      </div>
    </aside>
  )
}

const TopBar = ({ lang, theme, toggleTheme, toggleLang, user, onLogout }) => (
  <header className="topbar">
    <div className="topbar-left">
      <div className="topbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input type="text" placeholder={lang === 'ar' ? 'البحث...' : 'Search applications...'} className="search-input" />
      </div>
    </div>

    <div className="topbar-right">
      <button className="topbar-btn" onClick={toggleLang} title={lang === 'ar' ? 'English' : 'العربية'}>
        <span className="lang-indicator">{lang === 'ar' ? 'عربي' : 'EN'}</span>
      </button>
      <button className="topbar-btn" onClick={toggleTheme} title={lang === 'ar' ? 'تبديل المظهر' : 'Toggle theme'}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      <div className="topbar-user">
        <div className="user-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 1-16 0a8 8 0 0 1 16 0"/>
          </svg>
        </div>
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button className="user-logout" onClick={onLogout} title={lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
)

export function Layout({ lang, theme, user, currentPage, onNavigate, onToggleLang, onToggleTheme, onLogout, children }) {
  const { insights } = usePulse()
  const alertsCount = insights.filter(i => i.severity === 'high').length

  const navPages = {
    dashboard: { en: 'Dashboard', ar: 'لوحة المعلومات' },
    applications: { en: 'Applications', ar: 'الطلبات' },
    scoring: { en: 'Credit Scoring', ar: 'تقييم الائتمان' },
    sme: { en: 'SME Lending', ar: 'تمويل المؤسسات' },
    risk: { en: 'Risk Analytics', ar: 'تحليل المخاطر' },
    fraud: { en: 'Fraud & AML', ar: 'الاحتيال وغسل الأموال' },
    copilot: { en: 'AI Copilot', ar: 'المساعد الذكي' },
    regulations: { en: 'Regulations', ar: 'الأنظمة' },
    profile: { en: 'Profile', ar: 'الملف الشخصي' },
  }

  return (
    <div className="app-layout">
      <Sidebar lang={lang} currentPage={currentPage} onNavigate={onNavigate} alertsCount={alertsCount} />
      <div className="main-area">
        <TopBar lang={lang} theme={theme} toggleTheme={onToggleTheme} toggleLang={onToggleLang} user={user} onLogout={onLogout} />
        <main className="content">
          <div className="page-header">
            <div className="page-breadcrumb">
              <span className="breadcrumb-current" data-en={navPages[currentPage]?.en} data-ar={navPages[currentPage]?.ar}>
                {navPages[currentPage]?.[lang] || 'Dashboard'}
              </span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
