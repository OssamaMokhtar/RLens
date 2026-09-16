import React, { useState, useLayoutEffect } from 'react'
import { Layout } from './components/Layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Applications } from './pages/Applications'
import { Scoring } from './pages/Scoring'
import { SMELending } from './pages/SME'
import { RiskAnalytics } from './pages/RiskAnalytics'
import { FraudAML } from './pages/FraudAML'
import { CopilotPage } from './pages/Copilot'
import { RegulationsRAG } from './pages/RegulationsRAG'
import { Profile } from './pages/Profile'
import { AuthProvider } from './hooks/useAuth'
import { useAuth } from './hooks/useAuth'
import { useRTL } from './hooks/useRTL'
import { useTheme } from './hooks/useTheme'

const PAGE_TITLES = {
  dashboard: { en: 'Dashboard', ar: 'لوحة المعلومات' },
  applications: { en: 'Applications', ar: 'الطلبات' },
  scoring: { en: 'Credit Scoring', ar: 'تقييم الائتمان' },
  sme: { en: 'SME Lending', ar: 'تمويل المؤسسات' },
  risk: { en: 'Risk Analytics', ar: 'تحليل المخاطر' },
  fraud: { en: 'Fraud & AML', ar: 'الاحتيال وغسل الأموال' },
  copilot: { en: 'AI Copilot', ar: 'المساعد الذكي' },
  regulations: { en: 'Regulations', ar: 'الأنظمة والتعليمات' },
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth()
  const { lang, toggleLang } = useRTL('en')
  const { theme, toggleTheme } = useTheme('dark')
  const [currentPage, setCurrentPage] = useState('dashboard')

  useLayoutEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  if (!isAuthenticated) {
    return null
  }

  const renderPage = () => {
    const pages = {
      dashboard: () => <Dashboard lang={lang} />,
      applications: () => <Applications lang={lang} />,
      scoring: () => <Scoring lang={lang} />,
      sme: () => <SMELending lang={lang} />,
      risk: () => <RiskAnalytics lang={lang} />,
      fraud: () => <FraudAML lang={lang} />,
      copilot: () => <CopilotPage lang={lang} />,
      regulations: () => <RegulationsRAG lang={lang} />,
      profile: () => <Profile lang={lang} logout={logout} />,
    }
    const PageComponent = pages[currentPage]
    return PageComponent ? <PageComponent /> : <Dashboard lang={lang} />
  }

  return (
    <Layout
      lang={lang}
      theme={theme}
      toggleTheme={toggleTheme}
      toggleLang={toggleLang}
      user={user}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={logout}
    >
      {renderPage()}
    </Layout>
  )
}
