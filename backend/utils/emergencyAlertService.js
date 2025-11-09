const { sendSMS, sendEmail } = require('./notificationService');
const logger = require('./logger');
const db = require('../config/db');

// Trigger emergency alert to all emergency contacts
const triggerEmergencyAlert = async (patientId, sosLogId, hospitalLocation) => {
    try {
        // Get patient emergency contacts
        const result = await db.query(
            `SELECT ec.*, p.user_id 
       FROM emergency_contacts ec
       JOIN patients p ON ec.patient_id = p.id
       WHERE ec.patient_id = $1 AND ec.is_active = TRUE
       ORDER BY ec.priority ASC`,
            [patientId]
        );

        const contacts = result.rows;
        let notificationsSent = 0;

        const alertMessage = `EMERGENCY ALERT: Patient needs immediate assistance. Location: ${hospitalLocation}`;

        for (const contact of contacts) {
            try {
                // Send SMS
                await sendSMS(contact.contact_phone, alertMessage);

                // Send Email if available
                if (contact.contact_email) {
                    await sendEmail(
                        contact.contact_email,
                        'EMERGENCY ALERT',
                        `<p><strong>Emergency Alert!</strong></p><p>${alertMessage}</p>`
                    );
                }

                notificationsSent++;

                // Log notification
                await db.query(
                    `INSERT INTO sos_notification_logs 
           (sos_log_id, emergency_contact_id, notification_method, notification_status, delivery_timestamp)
           VALUES ($1, $2, $3, $4, NOW())`,
                    [sosLogId, contact.id, 'sms', 'sent']
                );

            } catch (error) {
                logger.error('Failed to notify contact', {
                    contactId: contact.id,
                    error: error.message
                });
            }
        }

        // Update SOS log with notification count
        await db.query(
            `UPDATE emergency_sos_logs 
       SET contacts_notified = $1 
       WHERE id = $2`,
            [notificationsSent, sosLogId]
        );

        logger.info('Emergency alerts triggered', { patientId, notificationsSent });
        return { success: true, notificationsSent };

    } catch (error) {
        logger.error('Emergency alert trigger failed', { patientId, error: error.message });
        return { success: false, error: error.message };
    }
};

// Send follow-up message to emergency contacts
const sendFollowUpMessage = async (sosLogId, message) => {
    try {
        const sosResult = await db.query(
            `SELECT patient_id FROM emergency_sos_logs WHERE id = $1`,
            [sosLogId]
        );

        if (sosResult.rows.length === 0) {
            throw new Error('SOS log not found');
        }

        const patientId = sosResult.rows[0].patient_id;

        const contactsResult = await db.query(
            `SELECT * FROM emergency_contacts 
       WHERE patient_id = $1 AND is_active = TRUE`,
            [patientId]
        );

        for (const contact of contactsResult.rows) {
            await sendSMS(contact.contact_phone, message);
        }

        logger.info('Follow-up message sent', { sosLogId });
        return { success: true };

    } catch (error) {
        logger.error('Failed to send follow-up message', { sosLogId, error: error.message });
        return { success: false, error: error.message };
    }
};

module.exports = {
    triggerEmergencyAlert,
    sendFollowUpMessage
};
