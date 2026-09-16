import React, { useState } from 'react'

export const useRTL = () => {
  const [lang, setLang] = useState('en')
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'))
  return { lang, toggleLang, locale: lang }
}
