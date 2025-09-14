import Link from 'next/link'
import { ContentCreator } from '@/types'
import { MapPin, ExternalLink, Star, Users } from 'lucide-react'

interface ContentCreatorCardProps {
  creator: ContentCreator
}

export default function ContentCreatorCard({ creator }: ContentCreatorCardProps) {
  const { metadata } = creator

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6">
      {/* Profile Header */}
      <div className="flex items-start space-x-4 mb-4">
        {metadata.profile_photo && (
          <img
            src={`${metadata.profile_photo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
            alt={metadata.creator_name}
            width="60"
            height="60"
            className="rounded-full object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {metadata.creator_name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Users className="w-4 h-4 mr-1" />
            {metadata.follower_count_range?.value || 'Not specified'}
          </div>
          {metadata.location && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {metadata.location}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {metadata.bio}
      </p>

      {/* Categories */}
      {metadata.content_categories && metadata.content_categories.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {metadata.content_categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category.metadata?.category_icon} {category.metadata?.category_name}
              </span>
            ))}
            {metadata.content_categories.length > 2 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{metadata.content_categories.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Platform Specialties */}
      {metadata.platform_specialties && metadata.platform_specialties.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {metadata.platform_specialties.slice(0, 3).map((platform, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {platform}
              </span>
            ))}
            {metadata.platform_specialties.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                +{metadata.platform_specialties.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rate Range */}
      {metadata.rate_range && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-green-600 font-medium">
            <Star className="w-4 h-4 mr-1" />
            {metadata.rate_range.value}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          href={`/content-creators/${creator.slug}`}
          className="btn-primary text-sm"
        >
          View Profile
        </Link>
        
        {metadata.website_url && (
          <a
            href={metadata.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Website
          </a>
        )}
      </div>
    </div>
  )
}