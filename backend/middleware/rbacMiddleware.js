const { checkPermission } = require('../config/rbac');
const { logAuditEvent } = require('../security/audit');

const authorize = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                await logAuditEvent(null, 'AUTHZ_FAILED', 'resource', null, 'failed', { reason: 'User not authenticated' });
                return res.status(401).json({ error: 'Authentication required' });
            }

            const hasPermission = checkPermission(req.user.role, requiredPermission);

            if (!hasPermission) {
                await logAuditEvent(req.user.userId, 'AUTHZ_FAILED', 'resource', null, 'failed', { permission: requiredPermission });
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            await logAuditEvent(req.user.userId, 'AUTHZ_SUCCESS', 'resource', null, 'success', { permission: requiredPermission });
            next();
        } catch (error) {
            res.status(500).json({ error: 'Authorization check failed' });
        }
    };
};

module.exports = {
    authorize
};
