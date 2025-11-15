const db = require('../config/db');
const { logAuditEvent } = require('../security/audit');
const logger = require('../utils/logger');

// Check drug interactions
const checkInteractions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { medication_list } = req.body;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        // Get drug data
        const drugsResult = await db.query(
            `SELECT * FROM drugs WHERE drug_name = ANY($1)`,
            [medication_list]
        );

        const drugs = drugsResult.rows;
        const interactions = [];

        // Check for interactions between drugs
        for (let i = 0; i < drugs.length; i++) {
            for (let j = i + 1; j < drugs.length; j++) {
                const interactionResult = await db.query(
                    `SELECT * FROM drug_interactions 
           WHERE (drug1_id = $1 AND drug2_id = $2) OR (drug1_id = $2 AND drug2_id = $1)`,
                    [drugs[i].id, drugs[j].id]
                );

                if (interactionResult.rows.length > 0) {
                    interactions.push(interactionResult.rows[0]);
                }
            }
        }

        // Log check
        await db.query(
            `INSERT INTO drug_checks (patient_id, medication_list, interactions_found, severity_level)
       VALUES ($1, $2, $3, $4)`,
            [patientId, medication_list, interactions.length, interactions.length > 0 ? 'moderate' : 'none']
        );

        await logAuditEvent(userId, 'DRUG_CHECK', 'check', patientId, 'success');

        res.json({
            medications: medication_list,
            interactions_found: interactions.length,
            interactions,
            severity_level: interactions.length > 0 ? 'moderate' : 'none'
        });

    } catch (error) {
        logger.error('Failed to check interactions', { error: error.message });
        res.status(500).json({ error: 'Failed to check interactions' });
    }
};

// Get check history
const getCheckHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `SELECT * FROM drug_checks WHERE patient_id = $1 ORDER BY check_date DESC LIMIT 10`,
            [patientId]
        );

        res.json({ checks: result.rows });

    } catch (error) {
        logger.error('Failed to fetch check history', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch check history' });
    }
};

module.exports = {
    checkInteractions,
    getCheckHistory
};
