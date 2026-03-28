import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { categoryService } from '../../services/categoryService'
import { getImageUrl } from '../../services/api'
import Loader from '../../components/Loader'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_featured: false,
    sort_order: 0,
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('is_featured', formData.is_featured)
      data.append('sort_order', formData.sort_order)
      if (imageFile) {
        data.append('image', imageFile)
      }

      if (editingCategory) {
        await categoryService.update(editingCategory.id, data)
        toast.success('Category updated successfully')
      } else {
        await categoryService.create(data)
        toast.success('Category created successfully')
      }

      loadCategories()
      closeModal()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await categoryService.delete(id)
      toast.success('Category deleted successfully')
      loadCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || '',
        is_featured: category.is_featured,
        sort_order: category.sort_order,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        is_featured: false,
        sort_order: 0,
      })
    }
    setImageFile(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '', is_featured: false, sort_order: 0 })
    setImageFile(null)
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Categories</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="card p-4">
            <div className="aspect-video bg-secondary-100 rounded-lg overflow-hidden mb-4">
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg text-secondary-900 mb-2">{category.name}</h3>
            <p className="text-sm text-secondary-600 mb-4 line-clamp-2">{category.description}</p>
            <div className="flex gap-2 items-center mb-4">
              {category.is_featured && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Featured</span>
              )}
              <span className="text-xs text-secondary-500">{category.product_count} products</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModal(category)} className="btn btn-secondary flex-1">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button onClick={() => handleDelete(category.id)} className="btn bg-red-50 text-red-600 hover:bg-red-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-secondary-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-secondary-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="input"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm font-medium text-secondary-700">Featured Category</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  className="input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
