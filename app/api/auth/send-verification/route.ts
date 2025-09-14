import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/email'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const response = await cosmic.objects
      .find({ 
        type: 'user-accounts',
        'metadata.email': email
      })
      .props(['id', 'title', 'slug', 'metadata']);

    if (!response.objects || response.objects.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = response.objects[0]

    // Check if already verified
    if (user.metadata.email_verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token using Web Crypto API
    const verificationToken = globalThis.crypto.randomUUID()

    // Update user with new verification token
    await cosmic.objects.updateOne(user.id, {
      metadata: {
        email_verification_token: verificationToken
      }
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({
      message: 'Verification email sent successfully'
    })
  } catch (error: any) {
    console.error('Send verification API error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email. Please try again.' },
      { status: 500 }
    )
  }
}