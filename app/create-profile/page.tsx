'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, isContentCreator, isProductCreator } from '@/hooks/useAuth'
import { User, Building2, Camera, Plus, X, MapPin, Globe, DollarSign, Users, Tag } from 'lucide-react'

// Define the social media links type with proper index signature
interface SocialMediaLinks {
  youtube?: string
  instagram?: string
  tiktok?: string
  twitter?: string
  linkedin?: string
  website?: string
  [key: string]: string | undefined // Add index signature for dynamic access
}

// Define the form types explicitly
interface ContentCreatorFormState {
  creator_name: string
  bio: string
  content_categories: string[]
  platform_specialties: string[]
  follower_count_range: string
  rate_range: string
  services_offered: string[]
  social_media_links: SocialMediaLinks
  website_url: string
  location: string
  tags: string
}

interface ProductCreatorFormState {
  company_name: string
  contact_person: string
  company_description: string
  website_url: string
  industry_category: string
  looking_for: string[]
  budget_range: string
  project_type: string
  phone_number: string
  location: string
  tags: string
}

export default function CreateProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  
  // Content Creator Form State
  const [contentCreatorForm, setContentCreatorForm] = useState<ContentCreatorFormState>({
    creator_name: '',
    bio: '',
    content_categories: [] as string[],
    platform_specialties: [] as string[],
    follower_count_range: '',
    rate_range: '',
    services_offered: [] as string[],
    social_media_links: {} as SocialMediaLinks,
    website_url: '',
    location: '',
    tags: ''
  })

  // Product Creator Form State
  const [productCreatorForm, setProductCreatorForm] = useState<ProductCreatorFormState>({
    company_name: '',
    contact_person: '',
    company_description: '',
    website_url: '',
    industry_category: '',
    looking_for: [] as string[],
    budget_range: '',
    project_type: '',
    phone_number: '',
    location: '',
    tags: ''
  })

  // UI State
  const [activeTab, setActiveTab] = useState<'content-creator' | 'product-creator'>('content-creator')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [newSocialPlatform, setNewSocialPlatform] = useState('')
  const [newSocialUrl, setNewSocialUrl] = useState('')

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Set active tab based on user account type
  useEffect(() => {
    if (user && !isLoading) {
      setActiveTab(user.accountType === 'content-creator' ? 'content-creator' : 'product-creator')
    }
  }, [user, isLoading])

  // Redirect if not authenticated
  if (!isLoading && !user) {
    router.push('/auth/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = activeTab === 'content-creator' ? contentCreatorForm : productCreatorForm
      
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileType: activeTab,
          profileData: formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to profile page or dashboard
        router.push(activeTab === 'content-creator' ? '/content-creators' : '/product-creators')
      } else {
        setError(data.error || 'Failed to create profile')
      }
    } catch (error) {
      console.error('Profile creation error:', error)
      setError('Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle social media link addition
  const addSocialMediaLink = () => {
    if (newSocialPlatform && newSocialUrl) {
      setContentCreatorForm((prev: ContentCreatorFormState) => ({
        ...prev,
        social_media_links: {
          ...prev.social_media_links,
          [newSocialPlatform.toLowerCase()]: newSocialUrl
        }
      }))
      setNewSocialPlatform('')
      setNewSocialUrl('')
    }
  }

  // Handle social media link removal - Fixed the TypeScript error
  const removeSocialMediaLink = (platform: string) => {
    setContentCreatorForm((prev: ContentCreatorFormState) => {
      const newLinks = { ...prev.social_media_links }
      delete newLinks[platform]
      return {
        ...prev,
        social_media_links: newLinks
      }
    })
  }

  // Handle array field updates
  const handleArrayField = (
    field: string, 
    value: string, 
    formType: 'content-creator' | 'product-creator'
  ) => {
    if (formType === 'content-creator') {
      setContentCreatorForm((prev: ContentCreatorFormState) => {
        const currentArray = (prev as any)[field] || []
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item: string) => item !== value)
          : [...currentArray, value]
        
        return {
          ...prev,
          [field]: newArray
        }
      })
    } else {
      setProductCreatorForm((prev: ProductCreatorFormState) => {
        const currentArray = (prev as any)[field] || []
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item: string) => item !== value)
          : [...currentArray, value]
        
        return {
          ...prev,
          [field]: newArray
        }
      })
    }
  }

  // Filter categories by type
  const contentCategories = categories.filter(cat => 
    cat.metadata?.category_type?.key === 'content'
  )
  const industryCategories = categories.filter(cat => 
    cat.metadata?.category_type?.key === 'industry'
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Profile
          </h1>
          <p className="text-gray-600">
            Tell us about yourself to connect with the right opportunities
          </p>
        </div>

        {/* Tab Navigation - Only show if user can switch */}
        {user && (
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('content-creator')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'content-creator'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${user.accountType !== 'content-creator' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={user.accountType !== 'content-creator'}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Content Creator Profile
                </button>
                <button
                  onClick={() => setActiveTab('product-creator')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'product-creator'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${user.accountType !== 'product-creator' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={user.accountType !== 'product-creator'}
                >
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Product Creator Profile
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Content Creator Form */}
          {activeTab === 'content-creator' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Creator Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contentCreatorForm.creator_name}
                      onChange={(e) => setContentCreatorForm((prev: ContentCreatorFormState) => ({
                        ...prev,
                        creator_name: e.target.value
                      }))}
                      className="input w-full"
                      placeholder="Your display name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={contentCreatorForm.location}
                        onChange={(e) => setContentCreatorForm((prev: ContentCreatorFormState) => ({
                          ...prev,
                          location: e.target.value
                        }))}
                        className="input w-full pl-10"
                        placeholder="City, State"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio *
                  </label>
                  <textarea
                    required
                    value={contentCreatorForm.bio}
                    onChange={(e) => setContentCreatorForm((prev: ContentCreatorFormState) => ({
                      ...prev,
                      bio: e.target.value
                    }))}
                    className="input w-full h-24 resize-none"
                    placeholder="Tell us about your content style, audience, and what makes you unique..."
                  />
                </div>
              </div>

              {/* Categories & Specialties */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Focus</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {contentCategories.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleArrayField('content_categories', category.id, 'content-creator')}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            contentCreatorForm.content_categories.includes(category.id)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {category.metadata?.category_icon} {category.metadata?.category_name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Specialties
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['YouTube', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'Blog', 'Podcast', 'Twitch'].map(platform => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => handleArrayField('platform_specialties', platform, 'content-creator')}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            contentCreatorForm.platform_specialties.includes(platform)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audience & Rates */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience & Pricing</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Follower Count Range
                    </label>
                    <select
                      value={contentCreatorForm.follower_count_range}
                      onChange={(e) => setContentCreatorForm((prev: ContentCreatorFormState) => ({
                        ...prev,
                        follower_count_range: e.target.value
                      }))}
                      className="input w-full"
                    >
                      <option value="">Select range</option>
                      <option value="micro">1K - 10K (Micro)</option>
                      <option value="mid-tier">10K - 100K (Mid-tier)</option>
                      <option value="macro">100K - 1M (Macro)</option>
                      <option value="mega">1M+ (Mega)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Range
                    </label>
                    <select
                      value={contentCreatorForm.rate_range}
                      onChange={(e) => setContentCreatorForm((prev: ContentCreatorFormState) => ({
                        ...prev,
                        rate_range: e.target.value
                      }))}
                      className="input w-full"
                    >
                      <option value="">Select range</option>
                      <option value="budget">Under $500</option>
                      <option value="mid-range">$500 - $2,000</option>
                      <option value="premium">$2,000 - $10,000</option>
                      <option value="enterprise">$10,000+</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services Offered
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Sponsored Posts', 'Product Reviews', 'Brand Partnerships', 'Content Creation', 'Affiliate Marketing', 'Event Coverage', 'Consulting'].map(service => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleArrayField('services_offered', service, 'content-creator')}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          contentCreatorForm.services_offered.includes(service)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media & Website</h3>
                
                <div className="space-y-4">
                  {/* Current Links */}
                  {Object.entries(contentCreatorForm.social_media_links).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Links
                      </label>
                      <div className="space-y-2">
                        {Object.entries(contentCreatorForm.social_media_links).map(([platform, url]) => (
                          <div key={platform} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="capitalize font-medium">{platform}:</span>
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {url}
                              </a>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSocialMediaLink(platform)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Social Media Link
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={newSocialPlatform}
                        onChange={(e) => setNewSocialPlatform(e.target.value)}
                        className="input flex-shrink-0 w-32"
                      >
                        <option value="">Platform</option>
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="twitter">Twitter</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitch">Twitch</option>
                        <option value="website">Website</option>
                      </select>
                      <input
                        type="url"
                        value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                        className="input flex-1"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={addSocialMediaLink}
                        className="btn-primary px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={contentCreatorForm.website_url}
                        onChange={(e) => setContentCreatorForm((prev: ContentCreatorFormState) => ({
                          ...prev,
                          website_url: e.target.value
                        }))}
                        className="input w-full pl-10"
                        placeholder="https://yourwebsite.com"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags & Keywords</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={contentCreatorForm.tags}
                      onChange={(e) => setContentCreatorForm((prev: ContentCreatorFormState) => ({
                        ...prev,
                        tags: e.target.value
                      }))}
                      className="input w-full pl-10"
                      placeholder="tech reviews, productivity, SaaS, tutorials"
                    />
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add relevant tags to help brands discover your content
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Product Creator Form */}
          {activeTab === 'product-creator' && (
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productCreatorForm.company_name}
                      onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                        ...prev,
                        company_name: e.target.value
                      }))}
                      className="input w-full"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={productCreatorForm.contact_person}
                      onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                        ...prev,
                        contact_person: e.target.value
                      }))}
                      className="input w-full"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description *
                  </label>
                  <textarea
                    required
                    value={productCreatorForm.company_description}
                    onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                      ...prev,
                      company_description: e.target.value
                    }))}
                    className="input w-full h-24 resize-none"
                    placeholder="Describe your company, products, and what you're looking for in creator partnerships..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={productCreatorForm.website_url}
                        onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                          ...prev,
                          website_url: e.target.value
                        }))}
                        className="input w-full pl-10"
                        placeholder="https://yourcompany.com"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={productCreatorForm.phone_number}
                      onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                        ...prev,
                        phone_number: e.target.value
                      }))}
                      className="input w-full"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={productCreatorForm.location}
                      onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                        ...prev,
                        location: e.target.value
                      }))}
                      className="input w-full pl-10"
                      placeholder="City, State"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Industry & Partnership */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry & Partnership Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {industryCategories.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                            ...prev,
                            industry_category: category.id
                          }))}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            productCreatorForm.industry_category === category.id
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {category.metadata?.category_icon} {category.metadata?.category_name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Looking For
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['YouTube Creators', 'Instagram Influencers', 'TikTok Creators', 'Bloggers', 'LinkedIn Creators', 'Twitch Streamers', 'Podcast Hosts'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleArrayField('looking_for', type, 'product-creator')}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            productCreatorForm.looking_for.includes(type)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Range
                    </label>
                    <select
                      value={productCreatorForm.budget_range}
                      onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                        ...prev,
                        budget_range: e.target.value
                      }))}
                      className="input w-full"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-1k">Under $1,000</option>
                      <option value="1k-5k">$1,000 - $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-plus">$25,000+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <select
                      value={productCreatorForm.project_type}
                      onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                        ...prev,
                        project_type: e.target.value
                      }))}
                      className="input w-full"
                    >
                      <option value="">Select project type</option>
                      <option value="product-launch">Product Launch</option>
                      <option value="brand-awareness">Brand Awareness</option>
                      <option value="content-series">Content Series</option>
                      <option value="review-campaign">Review Campaign</option>
                      <option value="ongoing-partnership">Ongoing Partnership</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags & Keywords</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={productCreatorForm.tags}
                      onChange={(e) => setProductCreatorForm((prev: ProductCreatorFormState) => ({
                        ...prev,
                        tags: e.target.value
                      }))}
                      className="input w-full pl-10"
                      placeholder="productivity, SaaS, B2B, workflow"
                    />
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add relevant tags to help creators discover your brand
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8 py-3"
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}