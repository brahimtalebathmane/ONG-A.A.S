import React, { useEffect, useState } from 'react'
import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    netlifyIdentity: any
  }
}

/**
 * Helper: extract token from location.hash or location.search
 * Supports formats:
 *  - #invite_token=ABC&email=...
 *  - #recovery_token=ABC
 *  - ?token=ABC&type=invite
 */
function extractTokenAndEmail() {
  // Check hash fragment first (preferred for Netlify Identity)
  const hash = window.location.hash // e.g. "#invite_token=ABC&email=foo@bar.com"
  if (hash && hash.length > 1) {
    // remove leading '#'
    const fragment = hash.substring(1)
    const params = new URLSearchParams(fragment)
    const inviteToken = params.get('invite_token') || params.get('recovery_token')
    const email = params.get('email') || undefined
    if (inviteToken) return { token: inviteToken, email, type: params.get('type') || (params.get('invite_token') ? 'invite' : 'recovery') }
  }

  // Fallback: check query string (in case link uses ?token=...&type=invite)
  const searchParams = new URLSearchParams(window.location.search)
  const token = searchParams.get('token') || searchParams.get('invite_token')
  const type = searchParams.get('type') || (searchParams.get('invite_token') ? 'invite' : undefined)
  const email = searchParams.get('email') || undefined
  if (token) return { token, email, type: type || 'invite' }

  return { token: null, email: null, type: null }
}

export function NetlifyPasswordSetup() {
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailFromLink, setEmailFromLink] = useState<string | null>(null)
  const [flowType, setFlowType] = useState<string | null>(null)
  const [tokenFromLink, setTokenFromLink] = useState<string | null>(null)

  useEffect(() => {
    // Inject Netlify Identity widget script if not already present
    let removed = false
    const existing = (window as any).netlifyIdentity
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        if (removed) return
        initWidget()
      }

      // cleanup: remove script on unmount (only if we injected it)
      return () => {
        removed = true
        try {
          document.head.removeChild(script)
        } catch (err) {
          // ignore
        }
      }
    } else {
      // widget already present
      initWidget()
    }

    function initWidget() {
      try {
        // Initialize widget with the project's identity endpoint.
        // If you're hosting on Netlify, the default endpoint is fine.
        // But keep this call to ensure widget is ready.
        if (window.netlifyIdentity && typeof window.netlifyIdentity.init === 'function') {
          window.netlifyIdentity.init()
        }
      } catch (err) {
        console.error('Netlify Identity init error:', err)
      }

      // parse token & email from URL (hash preferred)
      const { token, email, type } = extractTokenAndEmail()
      if (token) {
        setTokenFromLink(token)
        setEmailFromLink(email || null)
        setFlowType(type || 'invite')
      }

      setIsLoading(false)
    }
  }, [])

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters'
    if (!/(?=.*[a-z])/.test(pwd)) return 'Password must include a lowercase letter'
    if (!/(?=.*[A-Z])/.test(pwd)) return 'Password must include an uppercase letter'
    if (!/(?=.*\d)/.test(pwd)) return 'Password must include a number'
    return null
  }

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    try {
      // If token available, use acceptInvite or recover flow
      const token = tokenFromLink
      const type = flowType

      if (!token) {
        setError('No invitation or recovery token found in the URL.')
        setIsSubmitting(false)
        return
      }

      if (!window.netlifyIdentity) {
        setError('Identity widget not loaded.')
        setIsSubmitting(false)
        return
      }

      if (type === 'recovery') {
        // For recovery, netlify-identity-widget does not expose direct recover usage in the same way.
        // Approach: call currentUser.update if current user exists after confirm flow.
        // But many apps use netlifyIdentity.acceptInvite for invite flow only.
        // We'll try acceptInvite for invite, and for recovery, trigger password reset flow is usually server side.
        await window.netlifyIdentity.acceptInvite(token, password)
      } else {
        // Invite flow (most common)
        await window.netlifyIdentity.acceptInvite(token, password)
      }

      setSuccess(true)

      // After short delay, redirect to admin (or to /admin/login) — you can change
      setTimeout(() => {
        window.location.href = '/admin'
      }, 1500)
    } catch (err: any) {
      console.error('Error during invite accept:', err)
      // err.message might be a string, otherwise stringify
      setError(err?.message || 'An error occurred while setting up the password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenLogin = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open('login')
      window.netlifyIdentity.on('login', () => {
        window.location.href = '/admin'
      })
    } else {
      setError('Identity widget not loaded')
    }
  }

  // Determine if we are in invitation or recovery flow
  const isInvitationFlow = !!tokenFromLink && (flowType === 'invite' || flowType === 'recovery')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Password setup successful</h2>
          <p className="text-gray-600 mb-6">Redirecting to admin...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

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
            {isInvitationFlow ? 'Set your password' : 'Admin access'}
          </h2>
          <p className="text-gray-600">
            {isInvitationFlow ? 'Create a secure password for your account' : 'Sign in to the content management system'}
          </p>
        </div>

        {isInvitationFlow ? (
          <form onSubmit={handlePasswordSetup} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 ml-3" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={emailFromLink || ''}
                  disabled
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New password
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
                  placeholder="Enter a strong password"
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
                <p>• At least 8 characters</p>
                <p>• Mixed upper and lower case</p>
                <p>• At least one number</p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
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
                  placeholder="Re-enter your password"
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
              {isSubmitting ? 'Setting up...' : 'Set password'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                To access content management, please sign in.
              </p>
              <button
                onClick={handleOpenLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Open Login
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Back to homepage
          </a>
        </div>
      </div>
    </div>
  )
}