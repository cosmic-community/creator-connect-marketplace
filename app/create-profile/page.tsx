'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Camera, Upload, X, Plus, Loader2 } from 'lucide-react'
import AuthenticatedNavigation from '@/components/AuthenticatedNavigation'

interface Category {
  id: string
  title: string
  slug: string
  metadata: {
    category_name: string
    description: string
    category_icon: string
    category_type: {
      key: string
      value: string
    }
  }
}

interface ContentCreatorFormData {
  creator_name: string
  bio: string
  profile_photo: File | null
  content_categories: string[]
  platform_specialties: string[]
  follower_count_range: string
  rate_range: string
  services_offered: string[]
  portfolio_images: File[]
  social_media_links: {
    youtube?: string
    instagram?: string
    tiktok?: string
    twitter?: string
    linkedin?: string
    website?: string
  }
  website_url: string
  location: string
  tags: string
}

interface ProductCreatorFormData {
  company_name: string
  contact_person: string
  company_description: string
  website_url: string
  industry_category: string
  looking_for: string[]
  budget_range: string
  project_type: string
  company_logo: File | null
  phone_number: string
  location: string
  tags: string
}

export default function CreateProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Content Creator Form State
  const [contentCreatorData, setContentCreatorData] = useState<ContentCreatorFormData>({
    creator_name: '',
    bio: '',
    profile_photo: null,
    content_categories: [],
    platform_specialties: [],
    follower_count_range: '',
    rate_range: '',
    services_offered: [],
    portfolio_images: [],
    social_media_links: {},
    website_url: '',
    location: '',
    tags: ''
  })

  // Product Creator Form State
  const [productCreatorData, setProductCreatorData] = useState<ProductCreatorFormData>({
    company_name: '',
    contact_person: '',
    company_description: '',
    website_url: '',
    industry_category: '',
    looking_for: [],
    budget_range: '',
    project_type: '',
    company_logo: null,
    phone_number: '',
    location: '',
    tags: ''
  })

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleFileUpload = (file: File, field: string) => {
    if (user.accountType === 'content-creator') {
      if (field === 'profile_photo') {
        setContentCreatorData(prev => ({ ...prev, profile_photo: file }))
      } else if (field === 'portfolio_images') {
        setContentCreatorData(prev => ({
          ...prev,
          portfolio_images: [...prev.portfolio_images, file]
        }))
      }
    } else {
      setProductCreatorData(prev => ({ ...prev, company_logo: file }))
    }
  }

  const removePortfolioImage = (index: number) => {
    setContentCreatorData(prev => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter((_, i) => i !== index)
    }))
  }

  const addToArray = (field: string, value: string) => {
    if (user.accountType === 'content-creator') {
      setContentCreatorData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof ContentCreatorFormData] as string[]), value]
      }))
    } else {
      setProductCreatorData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof ProductCreatorFormData] as string[]), value]
      }))
    }
  }

  const removeFromArray = (field: string, index: number) => {
    if (user.accountType === 'content-creator') {
      setContentCreatorData(prev => ({
        ...prev,
        [field]: (prev[field as keyof ContentCreatorFormData] as string[]).filter((_, i) => i !== index)
      }))
    } else {
      setProductCreatorData(prev => ({
        ...prev,
        [field]: (prev[field as keyof ProductCreatorFormData] as string[]).filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('accountType', user.accountType)
      formData.append('userId', user.id)

      if (user.accountType === 'content-creator') {
        Object.entries(contentCreatorData).forEach(([key, value]) => {
          if (key === 'profile_photo' && value) {
            formData.append('profile_photo', value as File)
          } else if (key === 'portfolio_images' && Array.isArray(value)) {
            (value as File[]).forEach((file, index) => {
              formData.append(`portfolio_image_${index}`, file)
            })
          } else if (key === 'social_media_links') {
            formData.append(key, JSON.stringify(value))
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, String(value))
          }
        })
      } else {
        Object.entries(productCreatorData).forEach(([key, value]) => {
          if (key === 'company_logo' && value) {
            formData.append('company_logo', value as File)
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, String(value))
          }
        })
      }

      const response = await fetch('/api/profile/create', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create profile')
      }

      const result = await response.json()
      
      // Redirect to the new profile
      if (user.accountType === 'content-creator') {
        router.push(`/content-creators/${result.slug}`)
      } else {
        router.push(`/product-creators`)
      }

    } catch (error) {
      console.error('Profile creation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to create profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const platformOptions = [
    'YouTube', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'Blog', 'Podcast'
  ]

  const serviceOptions = [
    'Product Reviews', 'Sponsored Posts', 'Content Creation', 'Brand Partnerships',
    'Video Production', 'Photography', 'Consulting', 'Event Appearances'
  ]

  const lookingForOptions = [
    'YouTube Creators', 'Instagram Influencers', 'TikTok Creators', 'Bloggers',
    'LinkedIn Creators', 'Podcast Hosts', 'Event Speakers'
  ]

  const followerRanges = [
    { key: 'micro', value: '1K - 10K (Micro)' },
    { key: 'mid-tier', value: '10K - 100K (Mid-tier)' },
    { key: 'macro', value: '100K - 1M (Macro)' },
    { key: 'mega', value: '1M+ (Mega)' }
  ]

  const rateRanges = [
    { key: 'budget', value: 'Under $500' },
    { key: 'mid-range', value: '$500 - $2,000' },
    { key: 'premium', value: '$2,000 - $10,000' },
    { key: 'enterprise', value: '$10,000+' }
  ]

  const budgetRanges = [
    { key: 'under-1k', value: 'Under $1,000' },
    { key: '1k-5k', value: '$1,000 - $5,000' },
    { key: '5k-10k', value: '$5,000 - $10,000' },
    { key: '10k-25k', value: '$10,000 - $25,000' },
    { key: '25k-plus', value: '$25,000+' }
  ]

  const projectTypes = [
    { key: 'product-launch', value: 'Product Launch' },
    { key: 'brand-awareness', value: 'Brand Awareness' },
    { key: 'content-series', value: 'Content Series' },
    { key: 'review-campaign', value: 'Review Campaign' },
    { key: 'ongoing-partnership', value: 'Ongoing Partnership' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Profile
              </h1>
              <p className="text-gray-600">
                {user.accountType === 'content-creator' 
                  ? 'Set up your content creator profile to connect with brands and companies.'
                  : 'Set up your company profile to find and connect with content creators.'
                }
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {user.accountType === 'content-creator' ? (
                <>
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Creator Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contentCreatorData.creator_name}
                        onChange={(e) => setContentCreatorData(prev => ({ ...prev, creator_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your creator name or brand name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contentCreatorData.bio}
                        onChange={(e) => setContentCreatorData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about yourself, your content, and what makes you unique..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {contentCreatorData.profile_photo ? (
                            <img
                              src={URL.createObjectURL(contentCreatorData.profile_photo)}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'profile_photo')
                          }}
                          className="hidden"
                          id="profile-photo"
                        />
                        <label
                          htmlFor="profile-photo"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Photo</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Content Categories */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Content Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={contentCreatorData.content_categories.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setContentCreatorData(prev => ({
                                  ...prev,
                                  content_categories: [...prev.content_categories, category.id]
                                }))
                              } else {
                                setContentCreatorData(prev => ({
                                  ...prev,
                                  content_categories: prev.content_categories.filter(id => id !== category.id)
                                }))
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span className="text-xl">{category.metadata.category_icon}</span>
                          <span className="text-sm font-medium">{category.metadata.category_name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Platform Specialties */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Platform Specialties</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {platformOptions.map((platform) => (
                        <label
                          key={platform}
                          className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={contentCreatorData.platform_specialties.includes(platform)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addToArray('platform_specialties', platform)
                              } else {
                                const index = contentCreatorData.platform_specialties.indexOf(platform)
                                if (index > -1) removeFromArray('platform_specialties', index)
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Audience & Rates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Follower Count Range
                      </label>
                      <select
                        value={contentCreatorData.follower_count_range}
                        onChange={(e) => setContentCreatorData(prev => ({ ...prev, follower_count_range: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select follower range</option>
                        {followerRanges.map((range) => (
                          <option key={range.key} value={range.key}>{range.value}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate Range
                      </label>
                      <select
                        value={contentCreatorData.rate_range}
                        onChange={(e) => setContentCreatorData(prev => ({ ...prev, rate_range: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select rate range</option>
                        {rateRanges.map((range) => (
                          <option key={range.key} value={range.key}>{range.value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Services Offered */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Services Offered</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceOptions.map((service) => (
                        <label
                          key={service}
                          className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={contentCreatorData.services_offered.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addToArray('services_offered', service)
                              } else {
                                const index = contentCreatorData.services_offered.indexOf(service)
                                if (index > -1) removeFromArray('services_offered', index)
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Images */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Portfolio Images</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {contentCreatorData.portfolio_images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePortfolioImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {contentCreatorData.portfolio_images.length < 6 && (
                        <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || [])
                              files.forEach(file => handleFileUpload(file, 'portfolio_images'))
                            }}
                            className="hidden"
                          />
                          <Plus className="w-6 h-6 text-gray-400" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['youtube', 'instagram', 'tiktok', 'twitter', 'linkedin'].map((platform) => (
                        <div key={platform}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {platform}
                          </label>
                          <input
                            type="url"
                            value={contentCreatorData.social_media_links[platform] || ''}
                            onChange={(e) => setContentCreatorData(prev => ({
                              ...prev,
                              social_media_links: {
                                ...prev.social_media_links,
                                [platform]: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`https://${platform}.com/your-profile`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={contentCreatorData.website_url}
                        onChange={(e) => setContentCreatorData(prev => ({ ...prev, website_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://your-website.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={contentCreatorData.location}
                        onChange={(e) => setContentCreatorData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={contentCreatorData.tags}
                      onChange={(e) => setContentCreatorData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="comma, separated, tags, describing, your, content"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Product Creator Form */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={productCreatorData.company_name}
                          onChange={(e) => setProductCreatorData(prev => ({ ...prev, company_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          required
                          value={productCreatorData.contact_person}
                          onChange={(e) => setProductCreatorData(prev => ({ ...prev, contact_person: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Primary contact name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={productCreatorData.company_description}
                        onChange={(e) => setProductCreatorData(prev => ({ ...prev, company_description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your company, products, and what you're looking for in creator partnerships..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {productCreatorData.company_logo ? (
                            <img
                              src={URL.createObjectURL(productCreatorData.company_logo)}
                              alt="Logo preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'company_logo')
                          }}
                          className="hidden"
                          id="company-logo"
                        />
                        <label
                          htmlFor="company-logo"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Logo</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Industry Category */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Industry Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.filter(cat => cat.metadata.category_type.key === 'industry').map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="industry_category"
                            value={category.id}
                            checked={productCreatorData.industry_category === category.id}
                            onChange={(e) => setProductCreatorData(prev => ({ ...prev, industry_category: e.target.value }))}
                            className="text-blue-600"
                          />
                          <span className="text-xl">{category.metadata.category_icon}</span>
                          <span className="text-sm font-medium">{category.metadata.category_name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Looking For */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Looking For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lookingForOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={productCreatorData.looking_for.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addToArray('looking_for', option)
                              } else {
                                const index = productCreatorData.looking_for.indexOf(option)
                                if (index > -1) removeFromArray('looking_for', index)
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Budget & Project Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        value={productCreatorData.budget_range}
                        onChange={(e) => setProductCreatorData(prev => ({ ...prev, budget_range: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range.key} value={range.key}>{range.value}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type
                      </label>
                      <select
                        value={productCreatorData.project_type}
                        onChange={(e) => setProductCreatorData(prev => ({ ...prev, project_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type.key} value={type.key}>{type.value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={productCreatorData.website_url}
                        onChange={(e) => setProductCreatorData(prev => ({ ...prev, website_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://your-company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={productCreatorData.phone_number}
                        onChange={(e) => setProductCreatorData(prev => ({ ...prev, phone_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={productCreatorData.location}
                      onChange={(e) => setProductCreatorData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State/Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={productCreatorData.tags}
                      onChange={(e) => setProductCreatorData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="comma, separated, tags, describing, your, industry"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? 'Creating Profile...' : 'Create Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}