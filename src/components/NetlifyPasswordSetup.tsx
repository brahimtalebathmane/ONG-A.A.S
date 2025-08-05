import React, { useEffect, useState } from 'react'
import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    netlifyIdentity: any
  }
}

export function NetlifyPasswordSetup() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load Netlify Identity widget
    const script = document.createElement('script')
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.init({
          APIUrl: `${window.location.origin}/.netlify/identity`
        })

        // Check if user is in recovery/invitation flow
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const type = urlParams.get('type')

        if (token && (type === 'recovery' || type === 'invite')) {
          // User is setting up password from invitation
          setUser({ email: urlParams.get('email') || 'Admin User', isInvited: true })
        } else {
          // Check if user is already logged in
          const currentUser = window.netlifyIdentity.currentUser()
          if (currentUser) {
            setUser(currentUser)
          }
        }
        setIsLoading(false)
      }
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    if (!/(?=.*[a-z])/.test(pwd)) return 'كلمة المرور يجب أن تحتوي على حرف صغير'
    if (!/(?=.*[A-Z])/.test(pwd)) return 'كلمة المرور يجب أن تحتوي على حرف كبير'
    if (!/(?=.*\d)/.test(pwd)) return 'كلمة المرور يجب أن تحتوي على رقم'
    return null
  }

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validate password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      setIsSubmitting(false)
      return
    }

    try {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const type = urlParams.get('type')

      if (token && window.netlifyIdentity) {
        if (type === 'recovery') {
          // Handle password recovery
          await window.netlifyIdentity.recover(token, true)
          const currentUser = window.netlifyIdentity.currentUser()
          if (currentUser) {
            await currentUser.update({ password })
          }
        } else if (type === 'invite') {
          // Handle invitation acceptance
          await window.netlifyIdentity.acceptInvite(token, password)
        }

        setSuccess(true)
        
        // Redirect to admin after successful setup
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إعداد كلمة المرور')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogin = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open('login')
      window.netlifyIdentity.on('login', () => {
        window.location.href = '/admin'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تم إعداد كلمة المرور بنجاح!</h2>
          <p className="text-gray-600 mb-6">سيتم تحويلك إلى لوحة الإدارة...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const urlParams = new URLSearchParams(window.location.search)
  const isInvitationFlow = urlParams.get('token') && (urlParams.get('type') === 'invite' || urlParams.get('type') === 'recovery')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img 
            src="https://i.postimg.cc/mkjyN04T/5.png" 
            alt="ONG A.A.S" 
            className="h-16 w-16 rounded-full mx-auto mb-4 border-4 border-blue-600"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isInvitationFlow ? 'إعداد كلمة المرور' : 'تسجيل دخول الإدارة'}
          </h2>
          <p className="text-gray-600">
            {isInvitationFlow ? 'قم بإنشاء كلمة مرور آمنة لحسابك' : 'تسجيل الدخول إلى نظام إدارة المحتوى'}
          </p>
        </div>

        {isInvitationFlow ? (
          <form onSubmit={handlePasswordSetup} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3 space-x-reverse">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={urlParams.get('email') || ''}
                  disabled
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل كلمة مرور قوية"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>• 8 أحرف على الأقل</p>
                <p>• حرف كبير وحرف صغير</p>
                <p>• رقم واحد على الأقل</p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أعد إدخال كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'جاري الإعداد...' : 'إعداد كلمة المرور'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                للوصول إلى نظام إدارة المحتوى، يرجى تسجيل الدخول
              </p>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  )
}