import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const result = await login({ email, password })

    return NextResponse.json({
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    console.error('Login API error:', error)
    
    if (error.message === 'User not found') {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      )
    }

    if (error.message === 'Invalid password') {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}