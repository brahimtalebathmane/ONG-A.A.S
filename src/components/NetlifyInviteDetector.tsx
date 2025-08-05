import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function NetlifyInviteDetector() {
  const navigate = useNavigate()

  useEffect(() => {
    // التحقق من وجود invite_token في الرابط
    const hash = window.location.hash
    
    if (hash && hash.includes('invite_token=')) {
      // استخراج الرمز المميز
      const params = new URLSearchParams(hash.substring(1))
      const inviteToken = params.get('invite_token')
      
      if (inviteToken) {
        // إزالة الهاش من الرابط الحالي
        window.history.replaceState(null, '', window.location.pathname)
        
        // التوجيه إلى صفحة إعداد كلمة السر مع الرمز المميز
        navigate(`/netlify-password-setup#invite_token=${inviteToken}`, { replace: true })
      }
    }
  }, [navigate])

  // هذا المكون لا يعرض أي شيء
  return null
}