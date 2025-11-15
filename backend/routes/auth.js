const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/register', validateSignup, handleValidationErrors, authLimiter, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authLimiter, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
