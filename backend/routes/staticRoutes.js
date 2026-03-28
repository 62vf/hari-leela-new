
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:folder/:file', (req, res) => {
    const { folder, file } = req.params;
    res.sendFile(path.join(__dirname, `../uploads/${folder}/${file}`));
});

module.exports = router;
