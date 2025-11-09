const { logAuditEvent } = require('../security/audit');

const errorHandler = async (err, req, res, next) => {
    console.error('Error:', err);

    if (req.user) {
        await logAuditEvent(req.user.userId, 'ERROR', 'system', null, 'failed', { error: err.message });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
