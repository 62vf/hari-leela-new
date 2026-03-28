import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '../services/api'

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden group"
    >
      <Link to={`/category/${category.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary-100">
          <img
            src={getImageUrl(category.image)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-display font-semibold mb-2">{category.name}</h3>
            {category.product_count !== undefined && (
              <p className="text-sm text-white/90">{category.product_count} Products</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
