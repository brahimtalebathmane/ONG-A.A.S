import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function NetlifyInviteDetector() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if URL contains Netlify Identity invitation fragment
    const hash = window.location.hash
    
    if (hash && hash.includes('access_token=') && hash.includes('type=invite')) {
      // Extract parameters from hash fragment
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const type = params.get('type')
      const tokenType = params.get('token_type')
      const expiresIn = params.get('expires_in')
      
      if (accessToken && type === 'invite') {
        // Build query string for password setup page
        const queryParams = new URLSearchParams({
          access_token: accessToken,
          type: type,
          ...(tokenType && { token_type: tokenType }),
          ...(expiresIn && { expires_in: expiresIn })
        })
        
        // Clear the hash from current URL
        window.history.replaceState(null, '', window.location.pathname)
        
        // Redirect to password setup page with parameters
        navigate(`/netlify-password-setup?${queryParams.toString()}`, { replace: true })
      }
    }
  }, [navigate])

  // This component doesn't render anything
  return null
}