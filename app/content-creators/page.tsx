import { getContentCreators, getCategories } from '@/lib/cosmic'
import { ContentCreator, Category } from '@/types'
import ContentCreatorCard from '@/components/ContentCreatorCard'
import SearchFilters from '@/components/SearchFilters'

export default async function ContentCreatorsPage() {
  const [creators, categories] = await Promise.all([
    getContentCreators(),
    getCategories()
  ])

  // Filter for verified and available creators
  const availableCreators = creators.filter((creator: ContentCreator) => 
    creator.metadata.account_status.key === 'verified' && 
    creator.metadata.available_for_work
  ) as ContentCreator[]

  // Filter for content categories only
  const contentCategories = categories.filter((category: Category) => 
    category.metadata.category_type.key === 'content'
  ) as Category[]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Content Creators & Influencers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover talented creators across platforms and niches. Find the perfect match for your brand partnerships.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-full border">
              <span className="text-sm text-gray-600">
                {availableCreators.length} verified creators available
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchFilters 
          categories={contentCategories}
          type="content-creators"
        />

        {/* Creators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCreators.map((creator) => (
            <ContentCreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        {/* Empty State */}
        {availableCreators.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No creators found
            </h3>
            <p className="text-gray-600">
              Check back soon as we're constantly adding new verified creators to our platform.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}