import React, { useState, useLayoutEffect } from 'react'

export function useTheme(initialTheme = 'dark') {
  const [theme, setTheme] = useState(initialTheme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
