import SEO from '../components/SEO'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <>
      <SEO 
        title="About Us"
        description="Learn more about Hari Leela Collections - Your destination for elegant and stylish women's fashion"
      />

      <div className="bg-secondary-50 py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
            About Us
          </h1>
          <p className="text-lg text-secondary-600">
            Discover our story and passion for women's fashion
          </p>
        </div>
      </div>

      <div className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  Our Story
                </h2>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Welcome to Hari Leela Collections, where fashion meets elegance. We are dedicated to bringing you the finest collection of women's clothing, carefully curated to match your unique style and personality.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Our mission is to empower women through fashion by offering timeless pieces that blend style, comfort, and quality. We believe that every woman deserves to feel confident and beautiful in what she wears.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  Quality & Craftsmanship
                </h2>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Each piece in our collection is selected with meticulous attention to detail. We partner with skilled artisans and trusted manufacturers to ensure that every item meets our high standards of quality and craftsmanship.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                  Our Values
                </h2>
                <ul className="space-y-4 text-lg text-secondary-600">
                  <li className="flex gap-3">
                    <span className="text-primary-600 font-bold">•</span>
                    <span><strong>Quality First:</strong> We never compromise on the quality of our products</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 font-bold">•</span>
                    <span><strong>Customer Satisfaction:</strong> Your happiness is our priority</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 font-bold">•</span>
                    <span><strong>Timeless Style:</strong> Fashion that transcends trends</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-600 font-bold">•</span>
                    <span><strong>Sustainability:</strong> Conscious choices for a better tomorrow</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary-50 p-8 rounded-xl">
                <h2 className="text-2xl font-display font-bold text-secondary-900 mb-4">
                  Visit Our Store
                </h2>
                <p className="text-lg text-secondary-600 leading-relaxed mb-6">
                  We invite you to explore our collection and experience the elegance of Hari Leela Collections. Whether you're looking for everyday essentials or special occasion pieces, we have something perfect for you.
                </p>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Thank you for choosing Hari Leela Collections. We look forward to being part of your fashion journey.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
