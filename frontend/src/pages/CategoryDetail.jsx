import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { categoryService } from '../services/categoryService'
import { Filter } from 'lucide-react'

export default function CategoryDetail() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    color: '',
    size: '',
    sort: 'default',
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadCategory()
  }, [slug])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const loadCategory = async () => {
    try {
      const data = await categoryService.getBySlug(slug)
      setCategory(data)
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error loading category:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice))
    }

    // Color filter
    if (filters.color) {
      filtered = filtered.filter(p => 
        p.colors && p.colors.some(c => c.toLowerCase().includes(filters.color.toLowerCase()))
      )
    }

    // Size filter
    if (filters.size) {
      filtered = filtered.filter(p => 
        p.sizes && p.sizes.some(s => s.toLowerCase().includes(filters.size.toLowerCase()))
      )
    }

    // Sort
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      color: '',
      size: '',
      sort: 'default',
    })
  }

  if (loading) return <Loader fullScreen />

  if (!category) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-secondary-900">Category not found</h1>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title={category.name}
        description={category.description || `Shop ${category.name} collection`}
      />

      <div className="bg-secondary-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-secondary-600 max-w-3xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-secondary-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn btn-secondary text-sm"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                <motion.div
                  className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
                >
                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="input text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="input text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="input text-sm"
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      placeholder="Search color..."
                      value={filters.color}
                      onChange={(e) => handleFilterChange('color', e.target.value)}
                      className="input text-sm"
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      placeholder="Search size..."
                      value={filters.size}
                      onChange={(e) => handleFilterChange('size', e.target.value)}
                      className="input text-sm"
                    />
                  </div>

                  <button
                    onClick={resetFilters}
                    className="w-full btn btn-secondary text-sm"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-secondary-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-secondary-500">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
