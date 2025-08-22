import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Phone, Lock, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate phone number (8 digits)
    if (!/^\d{8}$/.test(phoneNumber)) {
      setError(t('auth.errors.phone_invalid'))
      setLoading(false)
      return
    }

    // Validate PIN (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      setError(t('auth.errors.pin_invalid'))
      setLoading(false)
      return
    }

    try {
      const success = await login(phoneNumber, pin)
      
      if (success) {
        // Get user data from localStorage to determine role
        const userData = JSON.parse(localStorage.getItem('ong_user') || '{}')
        if (userData.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(t('auth.errors.invalid_credentials'))
      }
    } catch (err) {
      setError(t('auth.errors.login_failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="https://i.postimg.cc/mkjyN04T/5.png" 
            alt="ONG A.A.S" 
            className="h-20 w-20 rounded-full mx-auto mb-4 border-4 border-blue-600"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.sign_in.title')}</h2>
          <p className="text-gray-600">{t('auth.sign_in.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3 space-x-reverse">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.sign_in.phone_label')}
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('auth.sign_in.phone_placeholder')}
                  maxLength={8}
                />
              </div>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.sign_in.pin_label')}
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="pin"
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('auth.sign_in.pin_placeholder')}
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? t('auth.sign_in.loading') : t('auth.sign_in.submit')}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              {t('auth.sign_in.no_account')}{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('auth.sign_in.register_link')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}