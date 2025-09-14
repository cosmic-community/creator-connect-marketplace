'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface ContactCreatorFormProps {
  creatorId: string
}

export default function ContactCreatorForm({ creatorId }: ContactCreatorFormProps) {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    companyName: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          creatorId
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ subject: '', message: '', companyName: '', email: '' })
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-600 text-sm">
          The creator will receive your message via email and can respond directly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-outline mt-4 text-sm"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
          className="input w-full"
          placeholder="Your company name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="input w-full"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          className="input w-full"
          placeholder="Partnership opportunity"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={4}
          className="textarea w-full"
          placeholder="Tell them about your collaboration opportunity..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your message will be sent directly to the creator's email address.
      </p>
    </form>
  )
}