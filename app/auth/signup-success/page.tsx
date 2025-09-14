'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, CheckCircle, RefreshCw } from 'lucide-react'

export default function SignupSuccessPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResendEmail = async () => {
    const email = localStorage.getItem('signup_email')
    if (!email) {
      setResendMessage('Email address not found. Please sign up again.')
      return
    }

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage('Verification email sent successfully!')
      } else {
        setResendMessage(data.error || 'Failed to resend email')
      }
    } catch (error) {
      setResendMessage('Failed to resend email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Created Successfully!</h2>
          <p className="text-gray-600">
            We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center text-blue-600 mb-2">
            <Mail className="w-5 h-5 mr-2" />
            <span className="font-medium">Check Your Email</span>
          </div>
          <p className="text-blue-700 text-sm">
            Look for an email from Creator Connect with the subject "Verify your email address"
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="btn-outline flex items-center justify-center mx-auto"
            >
              {isResending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            
            {resendMessage && (
              <p className={`text-sm mt-2 ${resendMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {resendMessage}
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              Already verified your email?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}