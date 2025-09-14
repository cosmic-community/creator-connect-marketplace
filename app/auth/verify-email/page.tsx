'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/auth/login?verified=true')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to verify email. Please try again.')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Mail className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Email Verification</h2>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Email Verified Successfully!</h3>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting you to sign in...</p>
            <Link href="/auth/login" className="btn-primary inline-block">
              Continue to Sign In
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Verification Failed</h3>
            <p className="text-red-600">{message}</p>
            <div className="space-y-2">
              <Link href="/auth/signup" className="btn-primary block">
                Create New Account
              </Link>
              <Link href="/auth/login" className="btn-outline block">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {status === 'no-token' && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Invalid Verification Link</h3>
            <p className="text-gray-600">
              This verification link is invalid or has expired. Please sign up again to receive a new verification email.
            </p>
            <div className="space-y-2">
              <Link href="/auth/signup" className="btn-primary block">
                Create Account
              </Link>
              <Link href="/auth/login" className="btn-outline block">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}