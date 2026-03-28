# Hari Leela Collections - Frontend

Modern React-based frontend for the Hari Leela Collections e-commerce website.

## Features

- ✅ Modern, responsive UI with TailwindCSS
- ✅ Smooth animations with Framer Motion
- ✅ SEO-friendly with React Helmet
- ✅ Complete admin panel with CRUD operations
- ✅ Image galleries and lightbox
- ✅ Product filtering and sorting
- ✅ WhatsApp integration
- ✅ Professional women's fashion aesthetic

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Helmet Async** - SEO
- **Lucide React** - Icons

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── admin/          # Admin-specific components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── Loader.jsx
│   │   └── SEO.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Categories.jsx
│   │   ├── CategoryDetail.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── admin/          # Admin pages
│   │       ├── AdminLogin.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Categories.jsx
│   │       ├── Products.jsx
│   │       ├── Banners.jsx
│   │       └── Content.jsx
│   ├── services/           # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── categoryService.js
│   │   ├── productService.js
│   │   ├── bannerService.js
│   │   └── contentService.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Public Pages

### Home Page
- Hero banner slider
- Featured categories
- Featured products
- Promotional sections

### Categories Page
- Grid of all categories
- Category images and descriptions
- Product count per category

### Category Detail Page
- Products grid
- Filters (price, color, size)
- Sorting options
- Responsive sidebar

### Product Detail Page
- Image gallery with lightbox
- Product information
- Colors and sizes display
- Price and sale information

### About Page
- Store information
- Mission and values
- Professional content layout

### Contact Page
- Contact form
- Store information
- WhatsApp integration
- Store hours and location

## Admin Panel

### Access
- URL: `/admin/login`
- Default credentials:
  - Username: `admin`
  - Password: `admin123`

### Features

**Dashboard**
- Overview statistics
- Quick actions
- Website information

**Categories Management**
- Create, edit, delete categories
- Upload category images
- Set featured categories
- Manage sort order

**Products Management**
- Create, edit, delete products
- Upload multiple images
- Manage colors and sizes
- Set featured/new products
- Assign to categories
- Price management

**Banners Management**
- Create, edit, delete banners
- Upload banner images
- Set titles, subtitles, links
- Manage active status
- Sort order management

**Content Management**
- Update contact information
- Manage store hours
- Edit about text
- Update footer content

## Building for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL` to your backend URL
4. Deploy

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in Netlify dashboard
4. Configure redirects for React Router

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist` folder to your hosting
3. Configure server to serve `index.html` for all routes

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api  # Backend API URL
```

For production, update to your production backend URL.

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: { ... },
      secondary: { ... }
    }
  }
}
```

### Fonts
Update Google Fonts in `index.html` and `tailwind.config.js`

### SEO
Update meta tags in each page using the `SEO` component

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
