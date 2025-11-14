const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Authentication rate limiter (stricter)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50, // limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again after 15 minutes.',
    skipSuccessfulRequests: true
});

// File upload rate limiter
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each user to 10 uploads per hour
    message: 'Too many file uploads, please try again later.'
});

// SOS/Emergency limiter (very strict)
const sosLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // allow 3 SOS per minute
    message: 'Too many emergency alerts. Please wait before triggering another.'
});

module.exports = {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    sosLimiter
};
