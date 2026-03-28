import { Helmet } from 'react-helmet-async'

export default function SEO({ 
  title = 'Women\'s Wear Store', 
  description = 'Discover the latest trends in women\'s fashion. Elegant, stylish, and timeless pieces for every occasion.',
  keywords = 'women fashion, clothing, dresses, accessories, style',
  image = '/og-image.jpg'
}) {
  const siteUrl = window.location.origin
  const fullTitle = title.includes('Hari Leela') ? title : `${title} | Hari Leela Collections`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
    </Helmet>
  )
}
