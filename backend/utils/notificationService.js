const axios = require('axios');
const logger = require('./logger');
const nodemailer = require('nodemailer');

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send SMS via Twilio
const sendSMS = async (phoneNumber, message) => {
    try {
        const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
            {
                From: process.env.TWILIO_PHONE,
                To: phoneNumber,
                Body: message
            },
            {
                auth: {
                    username: process.env.TWILIO_ACCOUNT_SID,
                    password: process.env.TWILIO_AUTH_TOKEN
                }
            }
        );

        logger.info('SMS sent successfully', { phoneNumber });
        return {
            success: true,
            messageId: response.data.sid
        };
    } catch (error) {
        logger.error('Failed to send SMS', { phoneNumber, error: error.message });
        return {
            success: false,
            error: error.message
        };
    }
};

// Send Email
const sendEmail = async (email, subject, htmlContent) => {
    try {
        await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject,
            html: htmlContent
        });

        logger.info('Email sent successfully', { email });
        return { success: true };
    } catch (error) {
        logger.error('Failed to send email', { email, error: error.message });
        return {
            success: false,
            error: error.message
        };
    }
};

// Send Push Notification
const sendPushNotification = async (deviceToken, title, body) => {
    try {
        // Integration with Firebase Cloud Messaging
        const response = await axios.post(
            'https://fcm.googleapis.com/fcm/send',
            {
                to: deviceToken,
                notification: {
                    title,
                    body
                }
            },
            {
                headers: {
                    'Authorization': `key=${process.env.FCM_SERVER_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        logger.info('Push notification sent', { deviceToken });
        return { success: true, messageId: response.data.message_id };
    } catch (error) {
        logger.error('Failed to send push notification', { deviceToken, error: error.message });
        return {
            success: false,
            error: error.message
        };
    }
};

// Send reminder notification
const sendReminderNotification = async (patient, medication, method) => {
    const message = `Reminder: Time to take ${medication.medication_name} (${medication.dosage})`;

    if (method === 'sms') {
        return sendSMS(patient.phone_number, message);
    } else if (method === 'email') {
        return sendEmail(patient.email, 'Medication Reminder', `<p>${message}</p>`);
    } else if (method === 'push') {
        return sendPushNotification(patient.device_token, 'Medication Reminder', message);
    }
};

module.exports = {
    sendSMS,
    sendEmail,
    sendPushNotification,
    sendReminderNotification
};
