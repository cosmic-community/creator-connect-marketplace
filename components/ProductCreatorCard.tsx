import Link from 'next/link'
import { ProductCreator } from '@/types'
import { MapPin, ExternalLink, DollarSign, Briefcase } from 'lucide-react'

interface ProductCreatorCardProps {
  creator: ProductCreator
}

export default function ProductCreatorCard({ creator }: ProductCreatorCardProps) {
  const { metadata } = creator

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6">
      {/* Profile Header */}
      <div className="flex items-start space-x-4 mb-4">
        {metadata.company_logo && (
          <img
            src={`${metadata.company_logo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
            alt={metadata.company_name}
            width="60"
            height="60"
            className="rounded-lg object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {metadata.company_name}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            Contact: {metadata.contact_person}
          </p>
          {metadata.location && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {metadata.location}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {metadata.company_description}
      </p>

      {/* Industry Category */}
      {metadata.industry_category && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {metadata.industry_category.metadata?.category_icon} {metadata.industry_category.metadata?.category_name}
          </span>
        </div>
      )}

      {/* Looking For */}
      {metadata.looking_for && metadata.looking_for.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {metadata.looking_for.slice(0, 3).map((platform, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {platform}
              </span>
            ))}
            {metadata.looking_for.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                +{metadata.looking_for.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Budget Range */}
      {metadata.budget_range && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-green-600 font-medium">
            <DollarSign className="w-4 h-4 mr-1" />
            {metadata.budget_range.value}
          </div>
        </div>
      )}

      {/* Project Type */}
      {metadata.project_type && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-purple-600 font-medium">
            <Briefcase className="w-4 h-4 mr-1" />
            {metadata.project_type.value}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          href={`/product-creators/${creator.slug}`}
          className="btn-primary text-sm"
        >
          View Details
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