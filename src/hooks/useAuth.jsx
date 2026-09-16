import React, { useState, useEffect } from 'react'

let storedUser = null
let loadingComplete = false

function readStored() {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem('rLens_user')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      storedUser = parsed.email ? parsed : null
    } catch {
      storedUser = null
    }
  }
  loadingComplete = true
}

function setUserValue(value) {
  storedUser = value
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

function useAuthState() {
  const [user, setUser] = React.useState(storedUser)
  const [loading, setLoading] = React.useState(!loadingComplete)

  useEffect(() => {
    readStored()
    setUser(storedUser)
    setLoading(false)
  }, [])

  return { user, loading, login, logout }
}

export function useAuth() {
  return useAuthState()
}

export const AuthProvider = ({ children }) => children

export const useRTL = () => {
  const [lang, setLang] = React.useState('en')
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'))
  return { lang, toggleLang, locale: lang }
}

export const useTheme = () => {
  const [theme, setTheme] = React.useState('dark')
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  return { theme, toggleTheme }
}
