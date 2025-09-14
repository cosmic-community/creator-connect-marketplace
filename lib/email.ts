import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`

  try {
    await resend.emails.send({
      from: 'Creator Connect <noreply@creatorconnect.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Creator Connect</h1>
            <h2 style="color: #374151; margin: 0;">Verify your email address</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up for Creator Connect! To complete your registration and start connecting with creators and brands, please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      `
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

  try {
    await resend.emails.send({
      from: 'Creator Connect <noreply@creatorconnect.com>',
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Creator Connect</h1>
            <h2 style="color: #374151; margin: 0;">Reset your password</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to create a new password for your Creator Connect account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
        </div>
      `
    })
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}