import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, Home, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { formatDate } from '../i18n'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const menuItems = user ? [
    { href: '/', label: t('nav.home'), icon: Home },
    { 
      href: user.role === 'admin' ? '/admin' : '/dashboard', 
      label: user.role === 'admin' ? t('nav.admin') : t('nav.dashboard'), 
      icon: user.role === 'admin' ? Settings : User 
    }
  ] : [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/login', label: t('nav.login'), icon: User },
    { href: '/register', label: t('nav.register'), icon: User }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{ fontFamily: i18n.language === 'ar' ? '"Droid Arabic Kufi", "Tajawal", sans-serif' : 'system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 space-x-reverse">
              <img 
                src="https://i.postimg.cc/mkjyN04T/5.png" 
                alt="ONG A.A.S" 
                className="h-10 w-10 rounded-full"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-blue-900">{t('homepage.hero.title')}</h1>
                <p className="text-xs text-blue-600">{t('homepage.hero.subtitle')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
              <LanguageSwitcher />
              
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2"><LanguageSwitcher /></div>
              
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="text-center md:text-right">
              <img 
                src="https://i.postimg.cc/mkjyN04T/5.png" 
                alt="ONG A.A.S" 
                className="h-16 w-16 rounded-full mx-auto md:mx-0 mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{t('footer.organization_name')}</h3>
              <p className="text-blue-200 mb-4">"{t('footer.slogan')}"</p>
              <div className="text-sm text-blue-200 space-y-1">
                <p>{t('footer.license')}: FA010000360307202511232</p>
                <p>{t('footer.license_date')}: {formatDate('2025-07-04', i18n.language)}</p>
                <p>{t('footer.location')}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4">{t('footer.quick_links')}</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-200 hover:text-white transition-colors">{t('nav.home')}</Link></li>
                <li><Link to="/register" className="text-blue-200 hover:text-white transition-colors">{t('nav.register')}</Link></li>
                <li><Link to="/login" className="text-blue-200 hover:text-white transition-colors">{t('nav.login')}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4">{t('footer.contact_us')}</h4>
              <div className="space-y-2 text-blue-200">
                <p>{t('footer.whatsapp')}: +222 34 14 14 97</p>
                <p>{t('footer.phone')}: +222 34 14 14 97</p>
                <p>{t('footer.email')}: info@ong-aas.mr</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-200">
              © 2025 {t('footer.organization_name')} - {t('footer.rights_reserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}