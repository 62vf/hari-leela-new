
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Category = require('../models/category');
const auth = require('../middleware/auth');
const { slugify } = require('../utils/helpers');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/categories');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/categories/featured
// @desc    Get featured categories
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const categories = await Category.find({ isFeatured: true }).sort({ sortOrder: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/categories
// @desc    Create a category
// @access  Private
router.post('/', [auth, upload.single('image')], async (req, res) => {
  const { name, description, isFeatured, sortOrder } = req.body;

  try {
    const slug = slugify(name);
    let category = await Category.findOne({ slug });

    if (category) {
      return res.status(400).json({ errors: [{ msg: 'Category already exists' }] });
    }

    const newCategory = new Category({
      name,
      slug,
      description,
      isFeatured: isFeatured === 'true',
      sortOrder,
    });

    if (req.file) {
      newCategory.image = 'categories/' + req.file.filename;
    }

    category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
    const { name, description, isFeatured, sortOrder } = req.body;
    const { id } = req.params;

    try {
        let category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        if (name && name !== category.name) {
            const newSlug = slugify(name);
            const existing = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
            if (existing) {
                return res.status(400).json({ error: 'Category with this name already exists' });
            }
            category.name = name;
            category.slug = newSlug;
        }

        if (description) category.description = description;
        if (isFeatured) category.isFeatured = isFeatured === 'true';
        if (sortOrder) category.sortOrder = sortOrder;

        if (req.file) {
            if (category.image) {
                const oldPath = path.join(__dirname, '../uploads', category.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            category.image = 'categories/' + req.file.filename;
        }

        category = await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // TODO: Delete products and product images associated with the category

        if (category.image) {
            const imagePath = path.join(__dirname, '../uploads', category.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await category.deleteOne();

        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
