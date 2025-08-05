import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle, Lock } from 'lucide-react'

declare global {
  interface Window {
    netlifyIdentity: any
  }
}

export function NetlifyPasswordSetup() {
  const [status, setStatus] = useState<'loading' | 'processing' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('جارٍ إعداد كلمة السر...')
  const navigate = useNavigate()

  useEffect(() => {
    // تحميل مكتبة Netlify Identity
    const script = document.createElement('script')
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
    script.async = true
    
    script.onload = () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.init()
        handleInviteToken()
      }
    }

    script.onerror = () => {
      setStatus('error')
      setMessage('فشل في تحميل نظام المصادقة')
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleInviteToken = () => {
    try {
      // استخراج invite_token من الرابط
      const hash = window.location.hash
      let inviteToken = ''

      if (hash && hash.includes('invite_token=')) {
        const params = new URLSearchParams(hash.substring(1))
        inviteToken = params.get('invite_token') || ''
      }

      // التحقق من وجود الرمز المميز
      if (!inviteToken) {
        setStatus('error')
        setMessage('رابط الدعوة غير صالح أو منتهي الصلاحية')
        return
      }

      setStatus('processing')
      setMessage('جارٍ تفعيل الدعوة...')

      // إعداد مستمعي الأحداث
      window.netlifyIdentity.on('login', (user: any) => {
        console.log('تم تسجيل الدخول بنجاح:', user)
        setStatus('success')
        setMessage('تم إعداد كلمة السر بنجاح! جارٍ التوجيه...')
        
        // إعادة التوجيه إلى لوحة الإدارة بعد ثانيتين
        setTimeout(() => {
          navigate('/admin')
        }, 2000)
      })

      window.netlifyIdentity.on('signup', (user: any) => {
        console.log('تم إنشاء الحساب بنجاح:', user)
        setStatus('success')
        setMessage('تم إعداد كلمة السر بنجاح! جارٍ التوجيه...')
        
        // إعادة التوجيه إلى لوحة الإدارة بعد ثانيتين
        setTimeout(() => {
          navigate('/admin')
        }, 2000)
      })

      window.netlifyIdentity.on('error', (err: any) => {
        console.error('خطأ في Netlify Identity:', err)
        setStatus('error')
        setMessage('حدث خطأ أثناء إعداد كلمة المرور. يرجى المحاولة مرة أخرى.')
      })

      // تفعيل الدعوة
      setTimeout(() => {
        try {
          if (window.netlifyIdentity.acceptInvite) {
            window.netlifyIdentity.acceptInvite(inviteToken)
          } else {
            // فتح نافذة إعداد كلمة السر
            window.netlifyIdentity.open()
          }
        } catch (error) {
          console.error('خطأ في تفعيل الدعوة:', error)
          setStatus('error')
          setMessage('حدث خطأ أثناء تفعيل الدعوة')
        }
      }, 1000)

    } catch (error) {
      console.error('خطأ في معالجة رابط الدعوة:', error)
      setStatus('error')
      setMessage('حدث خطأ أثناء معالجة رابط الدعوة')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
      case 'processing':
        return <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      case 'error':
        return <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      default:
        return <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* شعار المنظمة */}
          <img 
            src="https://i.postimg.cc/mkjyN04T/5.png" 
            alt="ONG A.A.S" 
            className="h-16 w-16 rounded-full mx-auto mb-6 border-4 border-blue-600"
          />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك</h1>
          <p className="text-blue-600 font-medium mb-8">جمعية التأمين للتوعية</p>
          
          {/* أيقونة الحالة */}
          {getStatusIcon()}
          
          {/* رسالة الحالة */}
          <h2 className={`text-xl font-semibold mb-4 ${getStatusColor()}`}>
            {message}
          </h2>
          
          {/* معلومات إضافية حسب الحالة */}
          {status === 'loading' && (
            <p className="text-gray-600 text-sm">
              يرجى الانتظار بينما نقوم بإعداد حسابك...
            </p>
          )}
          
          {status === 'processing' && (
            <p className="text-gray-600 text-sm">
              سيتم فتح نافذة إعداد كلمة السر قريباً...
            </p>
          )}
          
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                تم إعداد حسابك بنجاح! سيتم توجيهك إلى لوحة الإدارة...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm mb-3">
                {message}
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                العودة للرئيسية
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}