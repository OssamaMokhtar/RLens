import React, { useState, useLayoutEffect } from 'react'

export function useRTL(initialLang = 'en') {
  const [lang, setLang] = useState(initialLang)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const toggleLang = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar')
  }

  return { lang, toggleLang }
}
