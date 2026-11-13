import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './translations'

const LANGUAGE_STORAGE_KEY = 'easygym.language'

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      return saved === 'tr' || saved === 'en' ? saved : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // Dil tercihi kaydedilemese bile uygulama çalışmaya devam eder.
    }
  }, [language])

  const t = (key) => translations[language]?.[key] ?? key

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useTranslation must be used inside I18nProvider')
  }

  return context
}