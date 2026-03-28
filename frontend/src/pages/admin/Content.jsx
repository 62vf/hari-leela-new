import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { contentService } from '../../services/contentService'
import Loader from '../../components/Loader'

export default function Content() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const contentFields = [
    { key: 'contact_address', label: 'Contact Address', type: 'textarea' },
    { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
    { key: 'contact_email', label: 'Contact Email', type: 'email' },
    { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text' },
    { key: 'contact_hours', label: 'Store Hours', type: 'textarea' },
    { key: 'about_text', label: 'About Us Text', type: 'textarea' },
    { key: 'footer_text', label: 'Footer Text', type: 'textarea' },
  ]

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const data = await contentService.getAll()
      setContent(data)
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const field of contentFields) {
        if (content[field.key]) {
          await contentService.createOrUpdate(field.key, content[field.key])
        }
      }
      toast.success('Content saved successfully')
    } catch (error) {
      toast.error('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }))
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-900">Site Content</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="card p-6 space-y-6">
        {contentFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={content[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={4}
                className="input resize-none"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            ) : (
              <input
                type={field.type}
                value={content[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="input"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
