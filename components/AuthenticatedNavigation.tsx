'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Users, Building2, Search, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthenticatedNavigation() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Creator Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/content-creators" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Content Creators</span>
            </Link>
            <Link 
              href="/product-creators" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Product Creators</span>
            </Link>
            <Link 
              href="/search" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    {user.accountType === 'content-creator' ? 'Content Creator' : 'Product Creator'}
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/content-creators" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                <Users className="w-4 h-4" />
                <span>Content Creators</span>
              </Link>
              <Link 
                href="/product-creators" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                <Building2 className="w-4 h-4" />
                <span>Product Creators</span>
              </Link>
              <Link 
                href="/search" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500 mb-2">
                  Signed in as {user.email}
                </div>
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  <Settings className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}