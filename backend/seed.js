
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/admin');
const Category = require('./models/category');
const Product = require('./models/product');
const Banner = require('./models/banner');
const Content = require('./models/content');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await Admin.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Banner.deleteMany();
    await Content.deleteMany();

    const adminUser = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin',
    });

    await adminUser.save();

    const categories = await Category.insertMany([
      {
        name: 'Sarees',
        slug: 'sarees',
        description: 'Elegant silk, cotton, and designer sarees for every occasion.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 1,
      },
      {
        name: 'Lehengas',
        slug: 'lehengas',
        description: 'Festive and bridal lehengas with rich embroidery and premium fabrics.',
        image: 'https://images.unsplash.com/photo-1597983073512-7c0a9b9786d5?auto=format&fit=crop&w=1200&q=80',
        isFeatured: true,
        sortOrder: 2,
      },
      {
        name: 'Kurtis',
        slug: 'kurtis',
        description: 'Comfortable daily-wear and occasion kurtis in modern and ethnic styles.',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
        isFeatured: false,
        sortOrder: 3,
      },
    ]);

    const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category._id]));

    await Product.insertMany([
      {
        name: 'Banarasi Silk Saree',
        slug: 'banarasi-silk-saree',
        description: 'Traditional Banarasi silk saree with zari border and rich pallu.',
        price: 7499,
        oldPrice: 8999,
        images: [
          'https://images.unsplash.com/photo-1594969155368-f194841f98f0?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1618244972963-dbad68f7d2f5?auto=format&fit=crop&w=1200&q=80',
        ],
        colors: ['Maroon', 'Royal Blue'],
        sizes: ['Free Size'],
        isFeatured: true,
        isNewProduct: true,
        category: categoryBySlug.sarees,
        sortOrder: 1,
      },
      {
        name: 'Embroidered Bridal Lehenga',
        slug: 'embroidered-bridal-lehenga',
        description: 'Premium bridal lehenga set with handcrafted embroidery.',
        price: 18999,
        oldPrice: 22999,
        images: [
          'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80',
        ],
        colors: ['Red', 'Wine'],
        sizes: ['S', 'M', 'L'],
        isFeatured: true,
        isNewProduct: false,
        category: categoryBySlug.lehengas,
        sortOrder: 2,
      },
      {
        name: 'Printed Cotton Kurti',
        slug: 'printed-cotton-kurti',
        description: 'Lightweight cotton kurti for casual and office wear.',
        price: 1499,
        oldPrice: 1999,
        images: [
          'https://images.unsplash.com/photo-1583391733975-6c78276477e2?auto=format&fit=crop&w=1200&q=80',
        ],
        colors: ['Mustard', 'Teal'],
        sizes: ['M', 'L', 'XL'],
        isFeatured: false,
        isNewProduct: true,
        category: categoryBySlug.kurtis,
        sortOrder: 3,
      },
      {
        name: 'Party Wear Georgette Saree',
        slug: 'party-wear-georgette-saree',
        description: 'Flowy georgette saree with sequins work for evening events.',
        price: 3299,
        oldPrice: 4199,
        images: [
          'https://images.unsplash.com/photo-1618244973073-12ba9f7f9f42?auto=format&fit=crop&w=1200&q=80',
        ],
        colors: ['Black', 'Rose Gold'],
        sizes: ['Free Size'],
        isFeatured: true,
        isNewProduct: false,
        category: categoryBySlug.sarees,
        sortOrder: 4,
      },
      {
        name: 'Festive Anarkali Kurti',
        slug: 'festive-anarkali-kurti',
        description: 'Anarkali style kurti with elegant flare and festive detailing.',
        price: 2599,
        oldPrice: 3199,
        images: [
          'https://images.unsplash.com/photo-1618244973233-76495dca7e5c?auto=format&fit=crop&w=1200&q=80',
        ],
        colors: ['Emerald Green', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL'],
        isFeatured: false,
        isNewProduct: true,
        category: categoryBySlug.kurtis,
        sortOrder: 5,
      },
    ]);

    await Banner.insertMany([
      {
        title: 'New Festive Collection',
        subtitle: 'Discover handpicked ethnic styles for this season',
        image: 'https://images.unsplash.com/photo-1583391733981-8491650f126c?auto=format&fit=crop&w=1600&q=80',
        link: '/categories',
        buttonText: 'Shop Now',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'Bridal Edit',
        subtitle: 'Premium lehengas and couture styles',
        image: 'https://images.unsplash.com/photo-1596436889102-17d3f9c58a95?auto=format&fit=crop&w=1600&q=80',
        link: '/categories/lehengas',
        buttonText: 'Explore',
        isActive: true,
        sortOrder: 2,
      },
    ]);

    await Content.insertMany([
      {
        key: 'home_hero_title',
        value: 'Hari Leela Collections',
      },
      {
        key: 'home_hero_subtitle',
        value: 'Timeless ethnic fashion crafted for modern women.',
      },
      {
        key: 'contact_phone',
        value: '+91 98765 43210',
      },
      {
        key: 'contact_email',
        value: 'support@harileela.com',
      },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Admin.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Banner.deleteMany();
    await Content.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
