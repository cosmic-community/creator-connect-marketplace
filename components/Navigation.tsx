'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Users, Building2, Search, User, LogIn } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

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

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
            <Link 
              href="/auth/signup"
              className="btn-primary"
            >
              Get Started
            </Link>
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
                <Link 
                  href="/auth/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link 
                  href="/auth/signup"
                  className="btn-primary mt-2 w-full text-center"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}