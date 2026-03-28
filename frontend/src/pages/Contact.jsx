import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'
import { contentService } from '../services/contentService'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [contactInfo, setContactInfo] = useState({
    address: '123 Fashion Street, Style City, SC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@womenswear.com',
    whatsapp: '+1 (555) 123-4567',
    hours: 'Mon - Sat: 10:00 AM - 8:00 PM\nSunday: 12:00 PM - 6:00 PM',
  })

  useEffect(() => {
    loadContactInfo()
  }, [])

  const loadContactInfo = async () => {
    try {
      const data = await contentService.getAll()
      if (data.contact_address) contactInfo.address = data.contact_address
      if (data.contact_phone) contactInfo.phone = data.contact_phone
      if (data.contact_email) contactInfo.email = data.contact_email
      if (data.contact_whatsapp) contactInfo.whatsapp = data.contact_whatsapp
      if (data.contact_hours) contactInfo.hours = data.contact_hours
      setContactInfo({ ...contactInfo })
    } catch (error) {
      console.error('Error loading contact info:', error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Since there's no backend for contact form, show a message
    toast.success('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const openWhatsApp = () => {
    const phone = contactInfo.whatsapp.replace(/[^0-9]/g, '')
    const message = formData.message || 'Hello, I would like to inquire about your products.'
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      <SEO 
        title="Contact Us"
        description="Get in touch with Hari Leela Collections. We're here to help you with any questions."
      />

      <div className="bg-secondary-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-secondary-600">
            We'd love to hear from you. Get in touch with us!
          </p>
        </div>
      </div>

      <div className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="card p-6">
                <MapPin className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-semibold text-secondary-900 mb-2">Address</h3>
                <p className="text-secondary-600">{contactInfo.address}</p>
              </div>

              <div className="card p-6">
                <Phone className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-semibold text-secondary-900 mb-2">Phone</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-secondary-600 hover:text-primary-600">
                  {contactInfo.phone}
                </a>
              </div>

              <div className="card p-6">
                <Mail className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-semibold text-secondary-900 mb-2">Email</h3>
                <a href={`mailto:${contactInfo.email}`} className="text-secondary-600 hover:text-primary-600">
                  {contactInfo.email}
                </a>
              </div>

              <div className="card p-6">
                <Clock className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-semibold text-secondary-900 mb-2">Store Hours</h3>
                <p className="text-secondary-600 whitespace-pre-line">{contactInfo.hours}</p>
              </div>

              <button
                onClick={openWhatsApp}
                className="w-full btn btn-primary"
              >
                <Send className="w-5 h-5" />
                WhatsApp Us
              </button>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="card p-8">
                <h2 className="text-2xl font-display font-bold text-secondary-900 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
