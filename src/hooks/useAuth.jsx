import React from 'react'

let authState = { user: null, loading: true, ready: false }

function readStored() {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem('rLens_user')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      authState.user = parsed.email ? parsed : null
    } catch {
      authState.user = null
    }
  }
  authState.loading = false
  authState.ready = true
}

function setUser(value) {
  authState.user = value
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem('rLens_user', JSON.stringify(value))
    } else {
      localStorage.removeItem('rLens_user')
    }
  }
}

export function useAuth() {
  // Initialize from localStorage once
  if (!authState.ready) {
    readStored()
  }
  
  const [user, setUserState] = React.useState(authState.user)
  const [loading, setLoading] = React.useState(authState.loading)

  React.useEffect(() => {
    setUserState(authState.user)
    setLoading(authState.loading)
  }, [authState.ready])

  const login = () => {
    const demo = { email: 'admin@rLens.ai', name: 'Ossama Admin', role: 'Admin' }
    setUser(demo)
    authState.user = demo
    authState.loading = false
    authState.ready = true
    setUserState(demo)
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    authState.user = null
    authState.loading = false
    authState.ready = true
    setUserState(null)
    setLoading(false)
  }

  return { user, loading, login, logout }
}

export const AuthProvider = ({ children }) => children
export { useRTL } from './useRTL'
export { useTheme } from './useTheme'
