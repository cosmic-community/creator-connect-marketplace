import { getProductCreators, getCategories } from '@/lib/cosmic'
import { ProductCreator, Category } from '@/types'
import ProductCreatorCard from '@/components/ProductCreatorCard'
import SearchFilters from '@/components/SearchFilters'

export default async function ProductCreatorsPage() {
  const [creators, categories] = await Promise.all([
    getProductCreators(),
    getCategories()
  ])

  // Filter for verified creators
  const verifiedCreators = creators.filter((creator: ProductCreator) => 
    creator.metadata.account_status.key === 'verified'
  ) as ProductCreator[]

  // Filter for industry categories only
  const industryCategories = categories.filter((category: Category) => 
    category.metadata.category_type.key === 'industry'
  ) as Category[]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Creators & Brands
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover innovative companies and products looking for authentic content creator partnerships.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-full border">
              <span className="text-sm text-gray-600">
                {verifiedCreators.length} verified companies
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchFilters 
          categories={industryCategories}
          type="product-creators"
        />

        {/* Creators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedCreators.map((creator) => (
            <ProductCreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        {/* Empty State */}
        {verifiedCreators.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No companies found
            </h3>
            <p className="text-gray-600">
              Check back soon as we're constantly adding new verified companies to our platform.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}