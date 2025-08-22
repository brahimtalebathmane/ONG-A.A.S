import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { updateDirection } from '../i18n'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    updateDirection(language)
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        aria-label={t('nav.language.ar')}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {i18n.language === 'ar' ? t('nav.language.ar') : t('nav.language.fr')}
        </span>
      </button>
      
      <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <button
            onClick={() => changeLanguage('ar')}
            className={`w-full text-right px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
              i18n.language === 'ar' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            {t('nav.language.ar')}
          </button>
          <button
            onClick={() => changeLanguage('fr')}
            className={`w-full text-right px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
              i18n.language === 'fr' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            {t('nav.language.fr')}
          </button>
        </div>
      </div>
    </div>
  )
}