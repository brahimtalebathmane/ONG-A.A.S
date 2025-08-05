import { useEffect } from 'react'

declare global {
  interface Window {
    netlifyIdentity: any
  }
}

export function NetlifyIdentityWidget() {
  useEffect(() => {
    // Load Netlify Identity widget
    const script = document.createElement('script')
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.init()
        
        // Handle login redirect
        window.netlifyIdentity.on('login', () => {
          window.location.href = '/admin/'
        })

        // Handle signup completion
        window.netlifyIdentity.on('signup', () => {
          window.netlifyIdentity.close()
        })
      }
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}