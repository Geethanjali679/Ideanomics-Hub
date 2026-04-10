// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, updateProfile } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/profile', protect, updateProfile);

module.exports = router;
