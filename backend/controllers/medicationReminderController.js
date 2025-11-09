const db = require('../config/db');
const { logAuditEvent } = require('../security/audit');
const axios = require('axios');
const logger = require('../utils/logger');

// Create reminder
const createReminder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { medication_name, dosage, frequency, time_of_day, start_date, reminder_method } = req.body;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `INSERT INTO medication_reminders (patient_id, medication_name, dosage, frequency, time_of_day, start_date, reminder_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [patientId, medication_name, dosage, frequency, time_of_day, start_date, reminder_method]
        );

        // Schedule reminder with notification service
        await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/schedule-reminder`, {
            reminder_id: result.rows[0].id,
            patient_id: patientId,
            time: time_of_day,
            frequency,
            message: `Time to take ${medication_name} (${dosage})`
        });

        await logAuditEvent(userId, 'REMINDER_CREATED', 'reminder', result.rows[0].id, 'success');

        res.json({ message: 'Reminder created', reminder: result.rows[0] });

    } catch (error) {
        logger.error('Failed to create reminder', { error: error.message });
        res.status(500).json({ error: 'Failed to create reminder' });
    }
};

// Get reminders
const getReminders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `SELECT * FROM medication_reminders WHERE patient_id = $1 AND is_active = TRUE ORDER BY time_of_day`,
            [patientId]
        );

        res.json({ reminders: result.rows });

    } catch (error) {
        logger.error('Failed to fetch reminders', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
};

// Update reminder
const updateReminder = async (req, res) => {
    try {
        const { reminder_id } = req.params;
        const { medication_name, dosage, frequency, time_of_day } = req.body;

        await db.query(
            `UPDATE medication_reminders SET medication_name = COALESCE($1, medication_name),
       dosage = COALESCE($2, dosage), frequency = COALESCE($3, frequency),
       time_of_day = COALESCE($4, time_of_day), updated_at = NOW()
       WHERE id = $5`,
            [medication_name, dosage, frequency, time_of_day, reminder_id]
        );

        res.json({ message: 'Reminder updated' });

    } catch (error) {
        logger.error('Failed to update reminder', { error: error.message });
        res.status(500).json({ error: 'Failed to update reminder' });
    }
};

// Delete reminder
const deleteReminder = async (req, res) => {
    try {
        const { reminder_id } = req.params;

        await db.query('UPDATE medication_reminders SET is_active = FALSE WHERE id = $1', [reminder_id]);

        res.json({ message: 'Reminder deleted' });

    } catch (error) {
        logger.error('Failed to delete reminder', { error: error.message });
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
};

module.exports = {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder
};
