import React, { useState, useCallback } from 'react'

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

function saveUser(value) {
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem('rLens_user', JSON.stringify(value))
    } else {
      localStorage.removeItem('rLens_user')
    }
  }
}

export function useAuth() {
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rLens_user') === null
    }
    return true
  })

  const login = useCallback(() => {
    const demo = { email: 'admin@rLens.ai', name: 'Ossama Admin', role: 'Admin' }
    saveUser(demo)
    setUser(demo)
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    saveUser(null)
    setUser(null)
    setLoading(false)
  }, [])

  return { user, loading, login, logout }
}
