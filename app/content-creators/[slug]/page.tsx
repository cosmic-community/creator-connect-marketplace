// app/content-creators/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getContentCreatorBySlug } from '@/lib/cosmic'
import { ContentCreator } from '@/types'
import { MapPin, ExternalLink, Globe, MessageCircle, Star, Users } from 'lucide-react'
import ContactCreatorForm from '@/components/ContactCreatorForm'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ContentCreatorProfilePage({ params }: PageProps) {
  const { slug } = await params
  const creator = await getContentCreatorBySlug(slug) as ContentCreator | null

  if (!creator) {
    notFound()
  }

  const { metadata } = creator

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              {/* Header */}
              <div className="flex items-start space-x-6 mb-6">
                {metadata.profile_photo && (
                  <img
                    src={`${metadata.profile_photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                    alt={metadata.creator_name}
                    width="100"
                    height="100"
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {metadata.creator_name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    {metadata.follower_count_range && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {metadata.follower_count_range.value}
                      </div>
                    )}
                    {metadata.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {metadata.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        metadata.available_for_work ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {metadata.available_for_work ? 'Available for work' : 'Not available'}
                    </div>
                  </div>

                  {/* Rate Range */}
                  {metadata.rate_range && (
                    <div className="flex items-center text-green-600 font-semibold mb-4">
                      <Star className="w-5 h-5 mr-2" />
                      {metadata.rate_range.value}
                    </div>
                  )}

                  {/* External Links */}
                  <div className="flex flex-wrap gap-3">
                    {metadata.website_url && (
                      <a
                        href={metadata.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </a>
                    )}
                    {metadata.social_media_links && Object.entries(metadata.social_media_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 capitalize"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{metadata.bio}</p>
              </div>

              {/* Platform Specialties */}
              {metadata.platform_specialties && metadata.platform_specialties.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Platform Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {metadata.platform_specialties.map((platform, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Offered */}
              {metadata.services_offered && metadata.services_offered.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Services Offered</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {metadata.services_offered.map((service, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Categories */}
              {metadata.content_categories && metadata.content_categories.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Content Categories</h2>
                  <div className="grid gap-3">
                    {metadata.content_categories.map((category, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl mr-3">{category.metadata?.category_icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {category.metadata?.category_name}
                          </h3>
                          {category.metadata?.description && (
                            <p className="text-sm text-gray-600">
                              {category.metadata.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio */}
            {metadata.portfolio_images && metadata.portfolio_images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio</h2>
                <div className="grid grid-cols-2 gap-4">
                  {metadata.portfolio_images.map((image, index) => (
                    <img
                      key={index}
                      src={`${image.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                      alt={`Portfolio ${index + 1}`}
                      width="400"
                      height="300"
                      className="rounded-lg object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact {metadata.creator_name}
                </div>
                <ContactCreatorForm creatorId={creator.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}