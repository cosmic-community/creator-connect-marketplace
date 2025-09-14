import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getContentCreatorBySlug } from '@/lib/cosmic'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { creatorId, subject, message, companyName, email } = await request.json()

    if (!creatorId || !subject || !message || !companyName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get creator details to send email
    const creator = await getContentCreatorBySlug(creatorId)
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }

    const creatorEmail = creator.metadata.email
    const creatorName = creator.metadata.creator_name

    // Send email to creator using Resend
    await resend.emails.send({
      from: 'Creator Connect <noreply@creatorconnect.com>',
      to: creatorEmail,
      replyTo: email,
      subject: `New Partnership Opportunity: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Partnership Opportunity</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Message Details</h3>
            <p><strong>From:</strong> ${companyName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h4 style="color: #1e293b;">Message:</h4>
            <p style="line-height: 1.6; color: #475569;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0c4a6e;">
              <strong>How to respond:</strong> Simply reply to this email to start the conversation with ${companyName}.
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          
          <p style="color: #64748b; font-size: 14px;">
            This message was sent through Creator Connect. If you didn't expect this message, 
            please contact support.
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending contact email:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}