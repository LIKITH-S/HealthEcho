const db = require('../config/db');
const { logAuditEvent } = require('../security/audit');
const logger = require('../utils/logger');

// Add contact
const addContact = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { contact_name, contact_phone, relationship, priority } = req.body;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `INSERT INTO emergency_contacts (patient_id, contact_name, contact_phone, relationship, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [patientId, contact_name, contact_phone, relationship, priority]
        );

        await logAuditEvent(userId, 'CONTACT_ADDED', 'contact', result.rows[0].id, 'success');

        res.json({ message: 'Contact added', contact: result.rows[0] });

    } catch (error) {
        logger.error('Failed to add contact', { error: error.message });
        res.status(500).json({ error: 'Failed to add contact' });
    }
};

// Get contacts
const getContacts = async (req, res) => {
    try {
        const userId = req.user.userId;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        const result = await db.query(
            `SELECT * FROM emergency_contacts WHERE patient_id = $1 AND is_active = TRUE ORDER BY priority`,
            [patientId]
        );

        res.json({ contacts: result.rows });

    } catch (error) {
        logger.error('Failed to fetch contacts', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

// Update contact
const updateContact = async (req, res) => {
    try {
        const { contact_id } = req.params;
        const { contact_name, contact_phone, relationship, priority } = req.body;

        await db.query(
            `UPDATE emergency_contacts SET contact_name = COALESCE($1, contact_name),
       contact_phone = COALESCE($2, contact_phone), relationship = COALESCE($3, relationship),
       priority = COALESCE($4, priority), updated_at = NOW()
       WHERE id = $5`,
            [contact_name, contact_phone, relationship, priority, contact_id]
        );

        res.json({ message: 'Contact updated' });

    } catch (error) {
        logger.error('Failed to update contact', { error: error.message });
        res.status(500).json({ error: 'Failed to update contact' });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    try {
        const { contact_id } = req.params;

        await db.query('UPDATE emergency_contacts SET is_active = FALSE WHERE id = $1', [contact_id]);

        res.json({ message: 'Contact deleted' });

    } catch (error) {
        logger.error('Failed to delete contact', { error: error.message });
        res.status(500).json({ error: 'Failed to delete contact' });
    }
};

module.exports = {
    addContact,
    getContacts,
    updateContact,
    deleteContact
};
