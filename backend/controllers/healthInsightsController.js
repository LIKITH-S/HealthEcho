const db = require('../config/db');
const { logAuditEvent } = require('../security/audit');
const logger = require('../utils/logger');

// Add health metric
const addMetric = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            blood_pressure_systolic, blood_pressure_diastolic,
            blood_sugar_fasting, weight_kg, heart_rate, temperature_celsius
        } = req.body;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        // Calculate BMI if height available
        const heightResult = await db.query('SELECT height_cm FROM health_metrics WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1', [patientId]);
        const heightCm = heightResult.rows?.[0]?.height_cm;
        const bmi = heightCm && weight_kg ? (weight_kg / ((heightCm / 100) ** 2)).toFixed(2) : null;

        const result = await db.query(
            `INSERT INTO health_metrics (patient_id, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar_fasting, weight_kg, bmi, heart_rate, temperature_celsius, metric_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)
       RETURNING *`,
            [patientId, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar_fasting, weight_kg, bmi, heart_rate, temperature_celsius]
        );

        res.json({ message: 'Metric added', metric: result.rows[0] });

    } catch (error) {
        logger.error('Failed to add metric', { error: error.message });
        res.status(500).json({ error: 'Failed to add metric' });
    }
};

// Get metrics
const getMetrics = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { days = 30 } = req.query;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `SELECT * FROM health_metrics WHERE patient_id = $1 AND metric_date >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY metric_date DESC`,
            [patientId]
        );

        res.json({ metrics: result.rows });

    } catch (error) {
        logger.error('Failed to fetch metrics', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};

// Get insights
const getInsights = async (req, res) => {
    try {
        const userId = req.user.userId;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `SELECT * FROM health_insights WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 10`,
            [patientId]
        );

        res.json({ insights: result.rows });

    } catch (error) {
        logger.error('Failed to fetch insights', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch insights' });
    }
};

// Get trends
const getTrends = async (req, res) => {
    try {
        const userId = req.user.userId;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const metricsResult = await db.query(
            `SELECT metric_date, AVG(blood_pressure_systolic) as avg_bp, AVG(heart_rate) as avg_hr, AVG(blood_sugar_fasting) as avg_glucose
       FROM health_metrics WHERE patient_id = $1 AND metric_date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY metric_date ORDER BY metric_date`,
            [patientId]
        );

        res.json({ trends: metricsResult.rows });

    } catch (error) {
        logger.error('Failed to fetch trends', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
};

module.exports = {
    addMetric,
    getMetrics,
    getInsights,
    getTrends
};
