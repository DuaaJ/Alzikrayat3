
const express = require('express');
const multer = require('multer');
const path = require('path');

const {
    getAll,
    getOne,
    create,
    remove
} = require('../controllers/photoController');

const router = express.Router();

// Save uploaded images inside server/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Routes
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', upload.single('picture'), create);
router.delete('/:id', remove);

module.exports = router;
