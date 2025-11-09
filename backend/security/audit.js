const db = require('../config/db');

const logAuditEvent = async (userId, action, resourceType, resourceId, status, details) => {
    try {
        await db.query(
            `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, status, details, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [userId, action, resourceType, resourceId, status, JSON.stringify(details)]
        );
    } catch (error) {
        console.error('Audit logging failed:', error);
    }
};

const getAuditLogs = async (filters = {}) => {
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.userId) {
        query += ` AND user_id = $${paramCount}`;
        params.push(filters.userId);
        paramCount++;
    }

    if (filters.action) {
        query += ` AND action = $${paramCount}`;
        params.push(filters.action);
        paramCount++;
    }

    if (filters.startDate) {
        query += ` AND timestamp >= $${paramCount}`;
        params.push(filters.startDate);
        paramCount++;
    }

    query += ' ORDER BY timestamp DESC LIMIT 100';

    return await db.query(query, params);
};

module.exports = {
    logAuditEvent,
    getAuditLogs
};
