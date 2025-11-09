const db = require('../config/db');
const { logAuditEvent } = require('../security/audit');
const logger = require('../utils/logger');

// Create mental health assessment
const createAssessment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { assessment_type, scores, total_score } = req.body;

        // Get patient ID
        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        // Determine severity level
        let severity_level = 'minimal';
        if (total_score >= 20 && total_score < 30) severity_level = 'mild';
        else if (total_score >= 30 && total_score < 40) severity_level = 'moderate';
        else if (total_score >= 40 && total_score < 50) severity_level = 'moderately_severe';
        else if (total_score >= 50) severity_level = 'severe';

        const is_crisis = total_score >= 40;

        const result = await db.query(
            `INSERT INTO mental_health_assessments (patient_id, assessment_type, scores, total_score, severity_level, is_crisis)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [patientId, assessment_type, JSON.stringify(scores), total_score, severity_level, is_crisis]
        );

        await logAuditEvent(userId, 'MENTAL_HEALTH_ASSESSMENT', 'assessment', result.rows[0].id, 'success');

        res.json({ message: 'Assessment created', assessment: result.rows[0] });

    } catch (error) {
        logger.error('Failed to create assessment', { error: error.message });
        res.status(500).json({ error: 'Failed to create assessment' });
    }
};

// Get assessments
const getAssessments = async (req, res) => {
    try {
        const userId = req.user.userId;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `SELECT * FROM mental_health_assessments WHERE patient_id = $1 ORDER BY assessment_date DESC`,
            [patientId]
        );

        res.json({ assessments: result.rows });

    } catch (error) {
        logger.error('Failed to fetch assessments', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
};

// Get assessment details
const getAssessmentDetails = async (req, res) => {
    try {
        const { assessment_id } = req.params;

        const result = await db.query(
            'SELECT * FROM mental_health_assessments WHERE id = $1',
            [assessment_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        logger.error('Failed to fetch assessment', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch assessment' });
    }
};

// Get support resources
const getSupportResources = async (req, res) => {
    try {
        const resources = {
            crisis_lines: [
                { country: 'India', name: 'AASRA', number: '9820466726' },
                { country: 'India', name: 'iCall', number: '9152987821' }
            ],
            meditation_apps: ['Calm', 'Headspace', 'Insight Timer'],
            support_communities: ['7 Cups', 'BumbleBee', 'ReachOut']
        };

        res.json(resources);

    } catch (error) {
        logger.error('Failed to fetch resources', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
};

module.exports = {
    createAssessment,
    getAssessments,
    getAssessmentDetails,
    getSupportResources
};
