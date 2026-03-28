import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { bannerService } from '../../services/bannerService'
import { getImageUrl } from '../../services/api'
import Loader from '../../components/Loader'

export default function Banners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '', subtitle: '', link: '', button_text: '', is_active: true, sort_order: 0
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      const data = await bannerService.getAll(false)
      setBanners(data)
    } catch (error) {
      toast.error('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile && !editingBanner) {
      toast.error('Please select an image')
      return
    }
    setSubmitting(true)

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => data.append(key, formData[key]))
      if (imageFile) data.append('image', imageFile)

      if (editingBanner) {
        await bannerService.update(editingBanner.id, data)
        toast.success('Banner updated')
      } else {
        await bannerService.create(data)
        toast.success('Banner created')
      }
      loadBanners()
      closeModal()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return
    try {
      await bannerService.delete(id)
      toast.success('Banner deleted')
      loadBanners()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const openModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title || '', subtitle: banner.subtitle || '',
        link: banner.link || '', button_text: banner.button_text || '',
        is_active: banner.is_active, sort_order: banner.sort_order
      })
    } else {
      setEditingBanner(null)
      setFormData({ title: '', subtitle: '', link: '', button_text: '', is_active: true, sort_order: 0 })
    }
    setImageFile(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBanner(null)
    setImageFile(null)
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Banners</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          <Plus className="w-5 h-5" /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="card p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-64 flex-shrink-0">
                <img src={getImageUrl(banner.image)} alt={banner.title} className="w-full h-40 object-cover rounded-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{banner.title || 'Untitled'}</h3>
                <p className="text-sm text-secondary-600 mb-2">{banner.subtitle}</p>
                {banner.link && <p className="text-xs text-secondary-500 mb-2">Link: {banner.link}</p>}
                <div className="flex gap-2 items-center mb-4">
                  {banner.is_active ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                  ) : (
                    <span className="text-xs bg-secondary-200 text-secondary-700 px-2 py-1 rounded">Inactive</span>
                  )}
                  <span className="text-xs text-secondary-500">Order: {banner.sort_order}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(banner)} className="btn btn-secondary">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="btn bg-red-50 text-red-600 hover:bg-red-100">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-secondary-100 rounded-lg"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input type="text" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="input" placeholder="/category/dresses" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <input type="text" value={formData.button_text} onChange={(e) => setFormData({ ...formData, button_text: e.target.value })} className="input" placeholder="Shop Now" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} className="input" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? 'Saving...' : editingBanner ? 'Update' : 'Create'}
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
