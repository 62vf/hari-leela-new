import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '../services/api'

export default function ProductCard({ product, index = 0 }) {
  const image = product.images && product.images.length > 0 ? product.images[0] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden group"
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100">
          <img
            src={getImageUrl(image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.is_new && (
            <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              New
            </span>
          )}
          {product.old_price && (
            <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              Sale
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-secondary-500 mb-1">{product.category_name}</p>
          <h3 className="font-medium text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {product.old_price && (
              <span className="text-sm text-secondary-400 line-through">
                ${product.old_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
