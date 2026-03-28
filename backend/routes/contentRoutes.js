
const express = require('express');
const router = express.Router();
const Content = require('../models/content');
const auth = require('../middleware/auth');

// @route   GET api/content
// @desc    Get all content
// @access  Public
router.get('/', async (req, res) => {
    try {
        const contentItems = await Content.find();
        const contentMap = contentItems.reduce((map, item) => {
            map[item.key] = item.value;
            return map;
        }, {});
        res.json(contentMap);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/content/:key
// @desc    Get content by key
// @access  Public
router.get('/:key', async (req, res) => {
    try {
        const content = await Content.findOne({ key: req.params.key });
        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/content
// @desc    Create or update content
// @access  Private
router.post('/', auth, async (req, res) => {
    const { key, value } = req.body;

    if (!key) {
        return res.status(400).json({ error: 'Key is required' });
    }

    try {
        let content = await Content.findOne({ key });

        if (content) {
            content.value = value || '';
        } else {
            content = new Content({
                key,
                value: value || ''
            });
        }

        await content.save();
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/content/:key
// @desc    Delete content by key
// @access  Private
router.delete('/:key', auth, async (req, res) => {
    try {
        const content = await Content.findOne({ key: req.params.key });

        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        await content.deleteOne();

        res.json({ msg: 'Content removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
