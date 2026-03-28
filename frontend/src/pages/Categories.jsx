import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import CategoryCard from '../components/CategoryCard'
import Loader from '../components/Loader'
import { categoryService } from '../services/categoryService'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <>
      <SEO 
        title="Categories"
        description="Browse our collection of women's fashion categories at Hari Leela Collections"
      />

      <div className="bg-secondary-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            All Categories
          </h1>
          <p className="text-lg text-secondary-600">
            Explore our complete range of fashion categories
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="container-custom">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-secondary-500">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
