import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { productService } from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import { getImageUrl } from '../../services/api'
import Loader from '../../components/Loader'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', old_price: '', category_id: '',
    colors: [], sizes: [], is_featured: false, is_new: false, sort_order: 0
  })
  const [imageFiles, setImageFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [colorInput, setColorInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll({ per_page: 100 }),
        categoryService.getAll()
      ])
      setProducts(productsData.products || productsData)
      setCategories(categoriesData)
    } catch (error) {
      toast.error('Failed to load data')
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
      data.append('price', formData.price)
      data.append('oldPrice', formData.old_price)
      data.append('category', formData.category_id)
      data.append('colors', formData.colors.join(','))
      data.append('sizes', formData.sizes.join(','))
      data.append('isFeatured', formData.is_featured)
      data.append('isNewProduct', formData.is_new)
      data.append('sortOrder', formData.sort_order)

      imageFiles.forEach((file) => data.append('images', file))

      if (editingProduct) {
        await productService.update(editingProduct._id, data)
        toast.success('Product updated')
      } else {
        await productService.create(data)
        toast.success('Product created')
      }
      loadData()
      closeModal()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productService.delete(id)
      toast.success('Product deleted')
      loadData()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name, description: product.description || '', 
        price: product.price, old_price: product.oldPrice || '',
        category_id: product.category?._id || product.category || '', colors: product.colors || [],
        sizes: product.sizes || [], is_featured: product.isFeatured,
        is_new: product.isNewProduct, sort_order: product.sortOrder || 0
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '', description: '', price: '', old_price: '', category_id: '',
        colors: [], sizes: [], is_featured: false, is_new: false, sort_order: 0
      })
    }
    setImageFiles([])
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setImageFiles([])
  }

  const addColor = () => {
    if (colorInput.trim()) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput.trim()] })
      setColorInput('')
    }
  }

  const removeColor = (index) => {
    setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== index) })
  }

  const addSize = () => {
    if (sizeInput.trim()) {
      setFormData({ ...formData, sizes: [...formData.sizes, sizeInput.trim()] })
      setSizeInput('')
    }
  }

  const removeSize = (index) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) })
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Products</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Product</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-secondary-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={getImageUrl(product.images?.[0])} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <span className="font-medium text-secondary-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-secondary-600">{product.category?.name || '—'}</td>
                <td className="px-4 py-3 text-sm font-semibold text-secondary-900">${product.price}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {product.isFeatured && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Featured</span>}
                    {product.isNewProduct && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">New</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openModal(product)} className="p-2 hover:bg-secondary-100 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 text-red-600 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-8">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-secondary-100 rounded-lg"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} required className="input">
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="input resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Old Price</label>
                  <input type="number" step="0.01" value={formData.old_price} onChange={(e) => setFormData({ ...formData, old_price: e.target.value })} className="input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Colors</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())} className="input" placeholder="Add color" />
                  <button type="button" onClick={addColor} className="btn btn-secondary">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary-100 rounded-full text-sm flex items-center gap-2">
                      {color} <button type="button" onClick={() => removeColor(i)} className="text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sizes</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())} className="input" placeholder="Add size" />
                  <button type="button" onClick={addSize} className="btn btn-secondary">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary-100 rounded-full text-sm flex items-center gap-2">
                      {size} <button type="button" onClick={() => removeSize(i)} className="text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm font-medium">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.is_new} onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm font-medium">New Arrival</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
