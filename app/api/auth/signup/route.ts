import { NextRequest, NextResponse } from 'next/server'
import { signup } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, accountType } = await request.json()

    if (!name || !email || !password || !accountType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const result = await signup({
      name,
      email,
      password,
      accountType
    })

    return NextResponse.json({
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.message === 'User already exists with this email') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}