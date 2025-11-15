const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '7d';

const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRE }
    );
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error(`Refresh token verification failed: ${error.message}`);
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    JWT_SECRET,
    JWT_EXPIRE
};
