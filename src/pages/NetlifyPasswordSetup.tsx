import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from 'lucide-react'

declare global {
  interface Window {
    netlifyIdentity: any
  }
}

export function NetlifyPasswordSetup() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const accessToken = searchParams.get('access_token')
  const type = searchParams.get('type')
  const tokenType = searchParams.get('token_type')
  const expiresIn = searchParams.get('expires_in')

  useEffect(() => {
    // Load Netlify Identity Widget
    const script = document.createElement('script')
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
    script.async = true
    
    script.onload = () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.init()
        
        // Check if this is an invitation flow with access token
        if (accessToken && type === 'invite') {
          console.log('Processing Netlify Identity invitation...')
          
          // Set up event listeners
          window.netlifyIdentity.on('login', (user: any) => {
            console.log('User logged in:', user)
            setSuccess(true)
            setTimeout(() => {
              navigate('/admin')
            }, 2000)
          })

          window.netlifyIdentity.on('signup', (user: any) => {
            console.log('User signed up:', user)
            setSuccess(true)
            setTimeout(() => {
              navigate('/admin')
            }, 2000)
          })

          window.netlifyIdentity.on('init', (user: any) => {
            if (!user) {
              // Auto-open the widget for invitation
              setTimeout(() => {
                window.netlifyIdentity.open()
              }, 1000)
            }
          })

          window.netlifyIdentity.on('error', (err: any) => {
            console.error('Netlify Identity error:', err)
            setError('حدث خطأ أثناء إعداد كلمة المرور. يرجى المحاولة مرة أخرى.')
          })

          // Try to accept the invitation using the access token
          try {
            // Set the token in localStorage for Netlify Identity to use
            if (accessToken) {
              localStorage.setItem('gotrue.user', JSON.stringify({
                token: {
                  access_token: accessToken,
                  token_type: tokenType || 'bearer',
                  expires_in: expiresIn ? parseInt(expiresIn) : 3600,
                  expires_at: Date.now() + (expiresIn ? parseInt(expiresIn) * 1000 : 3600000)
                }
              }))
            }
          } catch (err) {
            console.error('Error processing invitation token:', err)
          }
        } else {
          setError('رابط دعوة غير صالح أو منتهي الصلاحية')
        }
      }
      setLoading(false)
    }

    script.onerror = () => {
      setError('فشل في تحميل نظام المصادقة')
      setLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [accessToken, type, tokenType, expiresIn, navigate])

  const handleOpenWidget = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تم بنجاح!</h2>
            <p className="text-gray-600 mb-4">
              تم إعداد كلمة المرور بنجاح. سيتم توجيهك إلى لوحة الإدارة...
            </p>
            <div className="animate-pulse text-blue-600">
              جاري التوجيه...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <img 
            src="https://i.postimg.cc/mkjyN04T/5.png" 
            alt="ONG A.A.S" 
            className="h-16 w-16 rounded-full mx-auto mb-6 border-4 border-blue-600"
          />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك</h1>
          <p className="text-blue-600 font-medium mb-6">جمعية التأمين للتوعية</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <Lock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">إعداد كلمة المرور</h3>
            <p className="text-gray-600 text-sm mb-4">
              تم دعوتك للانضمام كمدير محتوى. يرجى إعداد كلمة مرور للمتابعة.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">خطوات الإعداد:</h4>
              <ul className="text-sm text-gray-600 space-y-1 text-right">
                <li>• انقر على "إعداد كلمة المرور"</li>
                <li>• أدخل كلمة مرور قوية</li>
                <li>• أكد كلمة المرور</li>
                <li>• سيتم توجيهك للوحة الإدارة</li>
              </ul>
            </div>

            <button
              onClick={handleOpenWidget}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              إعداد كلمة المرور
            </button>

            <p className="text-xs text-gray-500 leading-relaxed">
              بعد إعداد كلمة المرور، ستتمكن من الوصول إلى لوحة إدارة المحتوى لتحديث محتوى الموقع.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}