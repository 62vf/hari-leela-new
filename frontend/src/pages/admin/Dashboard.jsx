import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Tag, Image, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { categoryService } from '../../services/categoryService'
import { productService } from '../../services/productService'
import { bannerService } from '../../services/bannerService'

export default function Dashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    banners: 0,
    featuredProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [categories, products, banners] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
        bannerService.getAll(false),
      ])
      
      setStats({
        categories: categories.length,
        products: products.products?.length || products.length || 0,
        banners: banners.length,
        featuredProducts: products.products?.filter(p => p.is_featured).length || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Categories',
      value: stats.categories,
      icon: Tag,
      color: 'bg-blue-500',
      link: '/admin/categories',
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: ShoppingBag,
      color: 'bg-green-500',
      link: '/admin/products',
    },
    {
      title: 'Active Banners',
      value: stats.banners,
      icon: Image,
      color: 'bg-purple-500',
      link: '/admin/banners',
    },
    {
      title: 'Featured Products',
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: 'bg-pink-500',
      link: '/admin/products',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Dashboard</h1>
        <p className="text-secondary-600">Welcome to your store management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link} className="card p-6 hover:shadow-lg transition-shadow block">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-secondary-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-secondary-900">
                {loading ? '...' : stat.value}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/products" className="block p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
              <h3 className="font-semibold text-secondary-900 mb-1">Add New Product</h3>
              <p className="text-sm text-secondary-600">Create and publish a new product</p>
            </Link>
            <Link to="/admin/categories" className="block p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
              <h3 className="font-semibold text-secondary-900 mb-1">Manage Categories</h3>
              <p className="text-sm text-secondary-600">Organize your product categories</p>
            </Link>
            <Link to="/admin/banners" className="block p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
              <h3 className="font-semibold text-secondary-900 mb-1">Update Banners</h3>
              <p className="text-sm text-secondary-600">Manage homepage sliders and banners</p>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Website Info</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Store Name</p>
              <p className="font-semibold text-secondary-900">Hari Leela Collections</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 mb-1">Admin Panel Version</p>
              <p className="font-semibold text-secondary-900">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 mb-1">Last Updated</p>
              <p className="font-semibold text-secondary-900">{new Date().toLocaleDateString()}</p>
            </div>
            <Link to="/" target="_blank" className="btn btn-outline w-full mt-4">
              View Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
