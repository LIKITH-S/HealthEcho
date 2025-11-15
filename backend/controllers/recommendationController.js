const db = require('../config/db');
const { logAuditEvent } = require('../security/audit');
const logger = require('../utils/logger');

// Get patient recommendations
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        let patientId = req.query.patient_id;

        if (role === 'patient') {
            const result = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
            patientId = result.rows[0].id;
        }

        const recommendations = await db.query(
            `SELECT * FROM recommendations 
       WHERE patient_id = $1 
       ORDER BY created_at DESC`,
            [patientId]
        );

        res.json({ recommendations: recommendations.rows });

    } catch (error) {
        logger.error('Failed to fetch recommendations', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};

// Create recommendation
const createRecommendation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { patient_id, recommendation_text, recommendation_type, priority, action_required, follow_up_date } = req.body;

        const result = await db.query(
            `INSERT INTO recommendations (patient_id, recommendation_text, recommendation_type, priority, action_required, follow_up_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
            [patient_id, recommendation_text, recommendation_type, priority, action_required, follow_up_date]
        );

        await logAuditEvent(userId, 'RECOMMENDATION_CREATED', 'recommendation', result.rows[0].id, 'success');

        res.json({ message: 'Recommendation created', recommendation_id: result.rows[0].id });

    } catch (error) {
        logger.error('Failed to create recommendation', { error: error.message });
        res.status(500).json({ error: 'Failed to create recommendation' });
    }
};

// Mark recommendation as completed
const markAsCompleted = async (req, res) => {
    try {
        const { recommendation_id } = req.params;

        await db.query(
            `UPDATE recommendations SET is_completed = TRUE, completed_date = NOW() WHERE id = $1`,
            [recommendation_id]
        );

        res.json({ message: 'Recommendation marked as completed' });

    } catch (error) {
        logger.error('Failed to update recommendation', { error: error.message });
        res.status(500).json({ error: 'Failed to update recommendation' });
    }
};

module.exports = {
    getRecommendations,
    createRecommendation,
    markAsCompleted
};
