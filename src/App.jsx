import React from 'react'
import { useAuth, AuthProvider } from './hooks/useAuth'
import { useRTL } from './hooks/useRTL'
import { useTheme } from './hooks/useTheme'
import { Layout } from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import Scoring from './pages/Scoring'
import SMELending from './pages/SME'
import RiskAnalytics from './pages/RiskAnalytics'
import FraudAML from './pages/FraudAML'
import CopilotPage from './pages/CopilotPage'
import RegulationsRAG from './pages/RegulationsRAG'
import Profile from './pages/Profile'

const PAGE_TITLES = {
  dashboard: { en: 'Dashboard', ar: 'لوحة المعلومات' },
  applications: { en: 'Applications', ar: 'الطلبات' },
  scoring: { en: 'Credit Scoring', ar: 'تقييم الائتمان' },
  sme: { en: 'SME Lending', ar: 'تمويل المؤسسات' },
  risk: { en: 'Risk Analytics', ar: 'تحليل المخاطر' },
  fraud: { en: 'Fraud & AML', ar: 'الاحتيال وغسل الأموال' },
  copilot: { en: 'AI Copilot', ar: 'المساعد الذكي' },
  regulations: { en: 'Regulations', ar: 'الأنظمة والتعليمات' },
  profile: { en: 'Profile', ar: 'الملف الشخصي' },
}

function LoadingScreen({ locale, theme }) {
  return (
    <div className="auth-screen" data-theme={theme}>
      <div className="auth-card">
        <div className="auth-spinner" />
        <p className="auth-loading-text">
          {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </div>
    </div>
  )
}

function AuthScreen({ locale, theme, login }) {
  return (
    <div className="auth-screen" data-theme={theme}>
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="currentColor" className="auth-logo-bg" />
            <path d="M14 16h20M14 24h20M14 32h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h1 className="auth-title">
            {locale === 'ar' ? 'منصة تقييم الائتمان' : 'Credit Scoring Platform'}
          </h1>
        </div>
        <form className="auth-form" onSubmit={e => { e.preventDefault(); login() }}>
          <div className="auth-field">
            <label className="auth-label">
              {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              className="auth-input"
              placeholder={locale === 'ar' ? 'admin@rLens.ai' : 'admin@rLens.ai'}
              value="admin@rLens.ai"
              readOnly
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">
              {locale === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              className="auth-input"
              placeholder={locale === 'ar' ? 'demo123' : 'demo123'}
              value="demo123"
              readOnly
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-submit">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <p className="auth-hint">
            {locale === 'ar'
              ? 'الرجاء المحاولة: admin@rLens.ai / demo123'
              : 'Try: admin@rLens.ai / demo123'}
          </p>
        </form>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, loading, login, logout } = useAuth()
  const { lang, toggleLang } = useRTL()
  const { theme, toggleTheme } = useTheme()
  const locale = lang

  if (loading) {
    return <LoadingScreen locale={locale} theme={theme} />
  }

  if (!user) {
    return <AuthScreen locale={locale} theme={theme} login={login} />
  }

  return (
    <div className="app-app" data-theme={theme}>
      <Layout
        lang={lang}
        theme={theme}
        user={user}
        currentPage="dashboard"
        onNavigate={() => {}}
        onToggleLang={toggleLang}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      >
        <Dashboard titles={PAGE_TITLES} locale={locale} />
      </Layout>
    </div>
  )
}

export default function App() {
  return <AppRoutes />
}
