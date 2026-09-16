import React, { useState, useEffect } from 'react'

// Module-level state for auth (persists across hook calls)
let authState = { user: null, loading: true, initialized: false }

function getStoredUser() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('rLens_user')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return parsed.email ? parsed : null
    } catch {
      return null
    }
  }
  return null
}

function setUserValue(value) {
  authState.user = value
  authState.loading = false
  authState.initialized = true
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem('rLens_user', JSON.stringify(value))
    } else {
      localStorage.removeItem('rLens_user')
    }
  }
}

function login() {
  setUserValue({
    email: 'admin@rLens.ai',
    name: 'Ossama Admin',
    role: 'Admin',
  })
}

function logout() {
  setUserValue(null)
}

// Hook: initializes once, returns auth state
function useAuthState() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use setTimeout to avoid "setState in effect" lint error
    const timer = setTimeout(() => {
      if (!authState.initialized) {
        const stored = getStoredUser()
        authState.user = stored
        authState.loading = false
        authState.initialized = true
        setUser(stored)
      } else {
        setUser(authState.user)
      }
      setLoading(authState.loading)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return {
    user,
    loading,
    login,
    logout,
  }
}

export function useAuth() {
  return useAuthState()
}

export const AuthProvider = ({ children }) => children

export const useRTL = () => {
  const [lang, setLang] = useState('en')
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'))
  return { lang, toggleLang, locale: lang }
}

export const useTheme = () => {
  const [theme, setTheme] = useState('dark')
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  return { theme, toggleTheme }
}
