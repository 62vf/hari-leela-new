import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '../components/SEO'
import Loader from '../components/Loader'
import { productService } from '../services/productService'
import { getImageUrl } from '../services/api'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      const data = await productService.getBySlug(slug)
      setProduct(data)
      // Set default selections
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0])
      }
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0])
      }
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  if (loading) return <Loader fullScreen />

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-secondary-900">Product not found</h1>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 ? product.images : [null]

  return (
    <>
      <SEO 
        title={product.name}
        description={product.description || product.name}
      />

      <div className="py-12">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-secondary-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/categories" className="hover:text-primary-600">Categories</Link>
            {product.category_slug && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/category/${product.category_slug}`} className="hover:text-primary-600">
                  {product.category_name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-secondary-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square bg-secondary-100 rounded-xl overflow-hidden mb-4 cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={getImageUrl(images[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.is_new && (
                  <span className="absolute top-4 left-4 bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-full">
                    New Arrival
                  </span>
                )}
                {product.old_price && (
                  <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full">
                    Sale
                  </span>
                )}
              </motion.div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-secondary-100 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                {product.name}
              </h1>

              {product.category_name && (
                <Link
                  to={`/category/${product.category_slug}`}
                  className="inline-block text-sm text-primary-600 hover:text-primary-700 mb-4"
                >
                  {product.category_name}
                </Link>
              )}

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.old_price && (
                  <>
                    <span className="text-2xl text-secondary-400 line-through">
                      ${product.old_price.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      Save {Math.round((1 - product.price / product.old_price) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {product.description && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-3">Description</h2>
                  <p className="text-secondary-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-secondary-900 mb-3">
                    Select Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-secondary-900 mb-3">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-secondary-300 hover:border-primary-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="border-t border-secondary-200 pt-6">
                <h3 className="text-sm font-semibold text-secondary-900 mb-3">
                  Product Information
                </h3>
                <ul className="space-y-2 text-sm text-secondary-600">
                  <li>• High-quality materials</li>
                  <li>• Professional craftsmanship</li>
                  <li>• Detailed attention to design</li>
                  <li>• Contact us for more details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <img
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
