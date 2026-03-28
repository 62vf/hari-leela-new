import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import Loader from '../components/Loader'
import { bannerService } from '../services/bannerService'
import { categoryService } from '../services/categoryService'
import { productService } from '../services/productService'
import { getImageUrl } from '../services/api'

export default function Home() {
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [bannersData, categoriesData, productsData] = await Promise.all([
        bannerService.getAll(true),
        categoryService.getFeatured(),
        productService.getFeatured(8),
      ])
      setBanners(bannersData)
      setCategories(categoriesData)
      setFeaturedProducts(productsData)
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextBanner, 5000)
      return () => clearInterval(timer)
    }
  }, [banners.length])

  if (loading) return <Loader fullScreen />

  return (
    <>
      <SEO title="Home - Hari Leela Collections" description="Discover the latest trends in women's fashion at Hari Leela Collections" />
      
      {/* Hero Slider */}
      {banners.length > 0 && (
        <section className="relative h-[600px] overflow-hidden">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentBanner ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              className={`absolute inset-0 ${index === currentBanner ? 'z-10' : 'z-0'}`}
            >
              <img
                src={getImageUrl(banner.image)}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container-custom">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="max-w-2xl text-white"
                  >
                    {banner.title && (
                      <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                        {banner.title}
                      </h1>
                    )}
                    {banner.subtitle && (
                      <p className="text-xl md:text-2xl mb-8 text-white/90">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.button_text && banner.link && (
                      <Link
                        to={banner.link}
                        className="btn btn-primary text-lg"
                      >
                        {banner.button_text}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}

          {banners.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentBanner ? 'w-8 bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-secondary-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-secondary-600">
                Explore our curated collections
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/categories" className="btn btn-outline">
                View All Categories
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-secondary-600">
                Handpicked favorites just for you
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-20 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
              New Collection
            </h2>
            <p className="text-lg text-secondary-600 mb-8">
              Discover our latest arrivals and refresh your wardrobe with trendy pieces
            </p>
            <Link to="/categories" className="btn btn-primary text-lg">
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
