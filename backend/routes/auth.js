const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/errorHandler');
const protect = require('../middleware/auth');
const { login, verifyOTP, refreshToken, dashboard } = require('../controllers/authController');

// Step 1: verify password → sends OTP
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], validate, login);

// Step 2: verify OTP → returns tokens
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], validate, verifyOTP);

router.post('/refresh', refreshToken);
router.get('/dashboard', protect, dashboard);

module.exports = router;