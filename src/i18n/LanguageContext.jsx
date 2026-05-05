/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const LANGUAGE_STORAGE_KEY = 'aaydi_language'
const supportedLanguages = ['ar', 'fr']

const LanguageContext = createContext(null)

const getNestedValue = (source, path) => {
  if (!source || !path) {
    return undefined
  }

  return path.split('.').reduce((currentValue, key) => {
    if (currentValue === undefined || currentValue === null) {
      return undefined
    }

    return currentValue[key]
  }, source)
}

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'ar'
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return supportedLanguages.includes(savedLanguage) ? savedLanguage : 'ar'
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    }

    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const t = useCallback(
    (path, fallback = '') => {
      const activeLanguageValue = getNestedValue(translations[language], path)
      if (activeLanguageValue !== undefined) {
        return activeLanguageValue
      }

      const defaultLanguageValue = getNestedValue(translations.ar, path)
      if (defaultLanguageValue !== undefined) {
        return defaultLanguageValue
      }

      return fallback
    },
    [language],
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isRTL: language === 'ar',
      t,
    }),
    [language, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

const useLanguage = () => {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}

export { LanguageProvider, useLanguage, supportedLanguages }
