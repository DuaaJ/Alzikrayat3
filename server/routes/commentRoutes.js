
const express = require('express');

const {
    getByPhoto,
    add
} = require('../controllers/commentController');

const router = express.Router();

// Get comments for a photo
router.get('/photos/:id/comments', getByPhoto);

// Add a comment to a photo
router.post('/photos/:id/comments', add);

module.exports = router;
