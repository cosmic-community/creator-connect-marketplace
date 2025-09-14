import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user with this verification token
    const response = await cosmic.objects
      .find({ 
        type: 'user-accounts',
        'metadata.email_verification_token': token
      })
      .props(['id', 'title', 'slug', 'metadata']);

    if (!response.objects || response.objects.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    const user = response.objects[0]

    // Update user to mark email as verified
    await cosmic.objects.updateOne(user.id, {
      metadata: {
        email_verified: true,
        email_verification_token: null
      }
    })

    return NextResponse.json({
      message: 'Email verified successfully'
    })
  } catch (error: any) {
    console.error('Email verification API error:', error)
    return NextResponse.json(
      { error: 'Failed to verify email. Please try again.' },
      { status: 500 }
    )
  }
}