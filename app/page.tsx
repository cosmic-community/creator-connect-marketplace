import Link from 'next/link'
import { Users, Building2, Search, MessageCircle, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Advanced Discovery",
      description: "Find the perfect match with powerful filtering by category, budget, audience size, and more."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Direct Communication",
      description: "Connect directly with creators and brands through our secure messaging system with email notifications."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Verified Profiles",
      description: "All creators and brands go through our verification process to ensure authentic partnerships."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Creators with <span className="text-blue-600">Brands</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The premier marketplace for authentic collaborations between content creators 
            and product developers. Find your perfect partnership today.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="/content-creators"
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                I'm a Content Creator
              </h3>
              <p className="text-gray-600 mb-4">
                Showcase your work and connect with brands looking for authentic partnerships
              </p>
              <div className="flex items-center justify-center text-purple-600 group-hover:translate-x-2 transition-transform">
                Browse Opportunities
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>

            <Link 
              href="/product-creators"
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                I'm a Product Creator
              </h3>
              <p className="text-gray-600 mb-4">
                Find talented creators to showcase your products and reach new audiences
              </p>
              <div className="flex items-center justify-center text-blue-600 group-hover:translate-x-2 transition-transform">
                Find Creators
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Creator Connect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and collaborate with the perfect partners for your projects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and brands already using Creator Connect 
            to build meaningful partnerships
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary">
              Create Account
            </Link>
            <Link href="/auth/login" className="btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}