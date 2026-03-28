
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Banner = require('../models/banner');
const auth = require('../middleware/auth');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/banners');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route   GET api/banners
// @desc    Get all banners
// @access  Public
router.get('/', async (req, res) => {
    const { active_only } = req.query;
    const query = active_only === 'true' ? { isActive: true } : {};
    try {
        const banners = await Banner.find(query).sort({ sortOrder: 1 });
        res.json(banners);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/banners/:id
// @desc    Get banner by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ msg: 'Banner not found' });
        }
        res.json(banner);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Banner not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/banners
// @desc    Create a banner
// @access  Private
router.post('/', [auth, upload.single('image')], async (req, res) => {
    const { title, subtitle, link, buttonText, isActive, sortOrder } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'Banner image is required' });
    }

    try {
        const newBanner = new Banner({
            title,
            subtitle,
            link,
            buttonText,
            isActive: isActive === 'true',
            sortOrder,
            image: 'banners/' + req.file.filename
        });

        const banner = await newBanner.save();
        res.json(banner);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/banners/:id
// @desc    Update a banner
// @access  Private
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
    const { title, subtitle, link, buttonText, isActive, sortOrder } = req.body;
    const { id } = req.params;

    try {
        let banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ msg: 'Banner not found' });
        }

        if (title) banner.title = title;
        if (subtitle) banner.subtitle = subtitle;
        if (link) banner.link = link;
        if (buttonText) banner.buttonText = buttonText;
        if (isActive) banner.isActive = isActive === 'true';
        if (sortOrder) banner.sortOrder = sortOrder;

        if (req.file) {
            if (banner.image) {
                const oldPath = path.join(__dirname, '../uploads', banner.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            banner.image = 'banners/' + req.file.filename;
        }

        banner = await banner.save();
        res.json(banner);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/banners/:id
// @desc    Delete a banner
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ msg: 'Banner not found' });
        }

        if (banner.image) {
            const imagePath = path.join(__dirname, '../uploads', banner.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await banner.deleteOne();

        res.json({ msg: 'Banner removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Banner not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
