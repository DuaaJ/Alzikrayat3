
const express = require('express');

const router = express.Router();

const {
    registeration,
    login
} = require('../controllers/authController');

router.post('/register', registeration);
router.post('/login', login);

module.exports = router;
