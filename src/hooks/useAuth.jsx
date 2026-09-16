import React, { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('rlens_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email) setUser(parsed)
      } catch (e) {}
    }
    setIsLoading(false)
  }, [])

  const login = (email, password) => {
    const users = {
      'admin@rLens.ai': { id: 'usr_001', name: 'Ahmed Al-Mansouri', role: 'ADMIN', email: 'admin@rLens.ai', country: 'AE', permissions: ['read', 'write', 'delete', 'admin'] },
      'officer@rLens.ai': { id: 'usr_002', name: 'Fatima Al-Khalifa', role: 'CREDIT_OFFICER', email: 'officer@rLens.ai', country: 'AE', permissions: ['read', 'write', 'score'] },
      'risk@rLens.ai': { id: 'usr_003', name: 'Khalid Al-Otaibi', role: 'RISK_MANAGER', email: 'risk@rLens.ai', country: 'SA', permissions: ['read', 'analytics', 'report'] },
      'fraud@rLens.ai': { id: 'usr_004', name: 'Maria Garcia', role: 'FRAUD_ANALYST', email: 'fraud@rLens.ai', country: 'AE', permissions: ['read', 'fraud', 'investigate'] },
    }
    const found = users[email]
    if (found && password === 'demo123') {
      setUser(found)
      localStorage.setItem('rlens_auth', JSON.stringify(found))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rlens_auth')
  }

  return { user, login, logout, isAuthenticated: !!user, isLoading }
}

export function AuthProvider({ children }) {
  const context = useAuth()
  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

const AuthContext = React.createContext(null)
