import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, Home, Settings, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { NetlifyIdentityWidget } from './NetlifyIdentityWidget'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleAdminLogin = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open()
    } else {
      window.location.href = '/admin/'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const menuItems = user ? [
    { href: '/', label: 'الرئيسية', icon: Home },
    { 
      href: user.role === 'admin' ? '/admin' : '/dashboard', 
      label: user.role === 'admin' ? 'لوحة الإدارة' : 'لوحة التحكم', 
      icon: user.role === 'admin' ? Settings : User 
    }
  ] : [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/login', label: 'تسجيل الدخول', icon: User },
    { href: '/register', label: 'التسجيل', icon: User }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{ fontFamily: '"Droid Arabic Kufi", "Tajawal", sans-serif' }} dir="rtl">
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
                <h1 className="text-xl font-bold text-blue-900">ONG A.A.S</h1>
                <p className="text-xs text-blue-600">جمعية مدنية لحماية حقوق المؤمنين</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
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
              
              {/* Content Admin Button */}
              <button
                onClick={handleAdminLogin}
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>إدارة المحتوى</span>
              </button>
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
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
              
              {/* Mobile Content Admin Button */}
              <button
                onClick={() => {
                  handleAdminLogin()
                  setIsMenuOpen(false)
                }}
                className="w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <Shield className="h-5 w-5" />
                <span>إدارة المحتوى</span>
              </button>
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>تسجيل الخروج</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <NetlifyIdentityWidget />
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
              <h3 className="text-xl font-bold mb-2">جمعية التأمين للتوعية</h3>
              <p className="text-blue-200 mb-4">"التأمين وعي… والتعويض حق."</p>
              <div className="text-sm text-blue-200 space-y-1">
                <p>الترخيص: FA010000360307202511232</p>
                <p>تاريخ الترخيص: 2025-07-04</p>
                <p>نواكشوط – موريتانيا</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-200 hover:text-white transition-colors">الرئيسية</Link></li>
                <li><Link to="/register" className="text-blue-200 hover:text-white transition-colors">التسجيل</Link></li>
                <li><Link to="/login" className="text-blue-200 hover:text-white transition-colors">تسجيل الدخول</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4">اتصل بنا</h4>
              <div className="space-y-2 text-blue-200">
                <p>واتساب: +222 34 14 14 97</p>
                <p>الهاتف: +222 34 14 14 97</p>
                <p>البريد الإلكتروني: info@ong-aas.mr</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-200">
              © 2025 جمعية التأمين للتوعية - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}