const { verifyAccessToken } = require('../config/auth');
const { logAuditEvent } = require('../security/audit');

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            await logAuditEvent(null, 'AUTH_FAILED', 'auth', null, 'failed', { reason: 'No token provided' });
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        await logAuditEvent(null, 'AUTH_FAILED', 'auth', null, 'failed', { reason: error.message });
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = verifyAccessToken(token);
            req.user = decoded;
        }
    } catch (error) {
        // Silently fail for optional auth
    }
    next();
};

module.exports = {
    authenticate,
    optionalAuth
};
