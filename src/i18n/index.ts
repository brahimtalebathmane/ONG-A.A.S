import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { ar } from './locales/ar'
import { fr } from './locales/fr'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      fr: { translation: fr }
    },
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'ar',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false
    },

    // تحذيرات في وضع التطوير
    debug: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
      }
    }
  })

export default i18n

// دالة مساعدة لتغيير الاتجاه
export const updateDirection = (language: string) => {
  const isRTL = language === 'ar'
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = language
}

// دالة مساعدة لتنسيق التواريخ
export const formatDate = (date: string | Date, language: string = 'ar') => {
  const locale = language === 'ar' ? 'ar-MA' : 'fr-FR'
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// دالة مساعدة لتنسيق الأرقام
export const formatNumber = (number: number, language: string = 'ar') => {
  const locale = language === 'ar' ? 'ar-MA' : 'fr-FR'
  return new Intl.NumberFormat(locale).format(number)
}

// دالة مساعدة للجمع
export const getPlural = (count: number, key: string, t: any) => {
  return t(key, { count })
}