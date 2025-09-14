'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Category } from '@/types'

interface SearchFiltersProps {
  categories: Category[]
  type: 'content-creators' | 'product-creators'
}

export default function SearchFilters({ categories, type }: SearchFiltersProps) {
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [selectedFollowers, setSelectedFollowers] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const budgetRanges = type === 'content-creators' 
    ? [
        { key: 'budget', value: '$100 - $500' },
        { key: 'mid-range', value: '$500 - $2,000' },
        { key: 'premium', value: '$2,000 - $10,000' },
        { key: 'enterprise', value: '$10,000+' }
      ]
    : [
        { key: 'under-1k', value: 'Under $1,000' },
        { key: '1k-5k', value: '$1,000 - $5,000' },
        { key: '5k-10k', value: '$5,000 - $10,000' },
        { key: '10k-25k', value: '$10,000 - $25,000' },
        { key: '25k-plus', value: '$25,000+' }
      ]

  const followerRanges = [
    { key: 'micro', value: '1K - 10K (Micro)' },
    { key: 'mid-tier', value: '10K - 100K (Mid-tier)' },
    { key: 'macro', value: '100K - 1M (Macro)' },
    { key: 'mega', value: '1M+ (Mega)' }
  ]

  const clearFilters = () => {
    setKeyword('')
    setSelectedCategory('')
    setSelectedBudget('')
    setSelectedFollowers('')
  }

  const hasActiveFilters = keyword || selectedCategory || selectedBudget || selectedFollowers

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type === 'content-creators' ? 'creators' : 'companies'}...`}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline flex items-center ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[keyword, selectedCategory, selectedBudget, selectedFollowers].filter(Boolean).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-outline text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input w-full"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.metadata.category_icon} {category.metadata.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'content-creators' ? 'Rate Range' : 'Budget Range'}
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="input w-full"
              >
                <option value="">Any Budget</option>
                {budgetRanges.map((range) => (
                  <option key={range.key} value={range.key}>
                    {range.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Follower Range (Content Creators only) */}
            {type === 'content-creators' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follower Count
                </label>
                <select
                  value={selectedFollowers}
                  onChange={(e) => setSelectedFollowers(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Any Size</option>
                  {followerRanges.map((range) => (
                    <option key={range.key} value={range.key}>
                      {range.value}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Placeholder for additional filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select className="input w-full">
                <option value="">All</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {keyword && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  Search: "{keyword}"
                  <button
                    onClick={() => setKeyword('')}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  Category: {categories.find(c => c.id === selectedCategory)?.metadata.category_name}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBudget && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  Budget: {budgetRanges.find(b => b.key === selectedBudget)?.value}
                  <button
                    onClick={() => setSelectedBudget('')}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedFollowers && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  Followers: {followerRanges.find(f => f.key === selectedFollowers)?.value}
                  <button
                    onClick={() => setSelectedFollowers('')}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}