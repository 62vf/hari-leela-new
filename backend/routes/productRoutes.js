
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const { slugify } = require('../utils/helpers');

const parseList = (value) => {
    if (value === undefined || value === null) return [];
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);

    const text = String(value).trim();
    if (!text) return [];

    if (text.startsWith('[') && text.endsWith(']')) {
        try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
                return parsed.map((item) => String(item).trim()).filter(Boolean);
            }
        } catch (_err) {
            // fall through to comma-split
        }
    }

    return text.split(',').map((item) => item.trim()).filter(Boolean);
};

const parseBoolean = (value, fallback) => {
    if (value === undefined || value === null) return fallback;
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/products');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route   GET api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 20;

    const query = {};

    if (req.query.category_id) {
        query.category = req.query.category_id;
    }
    if (req.query.is_featured) {
        query.isFeatured = req.query.is_featured === 'true';
    }
    if (req.query.is_new) {
        query.isNewProduct = req.query.is_new === 'true';
    }
    if (req.query.min_price || req.query.max_price) {
        query.price = {};
        if (req.query.min_price) {
            query.price.$gte = parseFloat(req.query.min_price);
        }
        if (req.query.max_price) {
            query.price.$lte = parseFloat(req.query.max_price);
        }
    }
     if (req.query.color) {
        query.colors = req.query.color;
    }
    if (req.query.size) {
        query.sizes = req.query.size;
    }


    let sort = {};
    if (req.query.sort === 'price_asc') {
        sort.price = 1;
    } else if (req.query.sort === 'price_desc') {
        sort.price = -1;
    } else if (req.query.sort === 'newest') {
        sort.createdAt = -1;
    } else {
        sort.sortOrder = 1;
        sort.createdAt = -1;
    }

    try {
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            total,
            pages: Math.ceil(total / perPage),
            currentPage: page,
            perPage
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true })
            .populate('category', 'name slug')
            .sort({ sortOrder: 1, createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/new
// @desc    Get new products
// @access  Public
router.get('/new', async (req, res) => {
    try {
        const products = await Product.find({ isNewProduct: true })
            .populate('category', 'name slug')
            .sort({ sortOrder: 1, createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/slug/:slug
// @desc    Get product by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', [auth, upload.array('images', 10)], async (req, res) => {
    const {
        name,
        description,
        price,
        oldPrice,
        old_price,
        colors,
        sizes,
        isFeatured,
        is_featured,
        isNewProduct,
        is_new,
        category,
        category_id,
        sortOrder,
        sort_order
    } = req.body;

    try {
        const slug = slugify(name);
        let product = await Product.findOne({ slug });
        const categoryId = category || category_id;

        if (product) {
            return res.status(400).json({ errors: [{ msg: 'Product already exists' }] });
        }

        if (!categoryId) {
            return res.status(400).json({ error: 'Category is required' });
        }

        const newProduct = new Product({
            name,
            slug,
            description,
            price,
            oldPrice: oldPrice ?? old_price,
            colors: parseList(colors),
            sizes: parseList(sizes),
            isFeatured: parseBoolean(isFeatured ?? is_featured, false),
            isNewProduct: parseBoolean(isNewProduct ?? is_new, false),
            category: categoryId,
            sortOrder: sortOrder ?? sort_order ?? 0
        });

        if (req.files && req.files.length > 0) {
            newProduct.images = req.files.map(file => 'products/' + file.filename);
        }

        product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', [auth, upload.array('images', 10)], async (req, res) => {
    const {
        name,
        description,
        price,
        oldPrice,
        old_price,
        colors,
        sizes,
        isFeatured,
        is_featured,
        isNewProduct,
        is_new,
        category,
        category_id,
        sortOrder,
        sort_order,
        existingImages
    } = req.body;
    const { id } = req.params;

    try {
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        if (name && name !== product.name) {
            const newSlug = slugify(name);
            const existing = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
            if (existing) {
                return res.status(400).json({ error: 'Product with this name already exists' });
            }
            product.name = name;
            product.slug = newSlug;
        }

        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (oldPrice !== undefined || old_price !== undefined) product.oldPrice = oldPrice ?? old_price;
        if (colors !== undefined) product.colors = parseList(colors);
        if (sizes !== undefined) product.sizes = parseList(sizes);
        if (isFeatured !== undefined || is_featured !== undefined) {
            product.isFeatured = parseBoolean(isFeatured ?? is_featured, product.isFeatured);
        }
        if (isNewProduct !== undefined || is_new !== undefined) {
            product.isNewProduct = parseBoolean(isNewProduct ?? is_new, product.isNewProduct);
        }
        if (category !== undefined || category_id !== undefined) product.category = category || category_id;
        if (sortOrder !== undefined || sort_order !== undefined) product.sortOrder = sortOrder ?? sort_order;

        let updatedImages = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : [];

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => 'products/' + file.filename);
            updatedImages = [...updatedImages, ...newImages];
        }

        // Delete images that were removed
        const imagesToDelete = product.images.filter(img => !updatedImages.includes(img));
        for (const img of imagesToDelete) {
            const imagePath = path.join(__dirname, '../uploads', img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        product.images = updatedImages;

        product = await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Delete images
        if (product.images && product.images.length > 0) {
            for (const img of product.images) {
                const imagePath = path.join(__dirname, '../uploads', img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        await product.deleteOne();

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
