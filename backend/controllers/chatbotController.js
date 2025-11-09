const db = require('../config/db');
const axios = require('axios');
const logger = require('../utils/logger');

// Send message to chatbot
const sendMessage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { message, session_id } = req.body;

        // Get patient ID
        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        // Send to Rasa chatbot service
        const botResponse = await axios.post(`${process.env.CHATBOT_SERVICE_URL}/webhooks/rest/webhook`, {
            sender: userId,
            message
        });

        const botReply = botResponse.data[0]?.text || 'I did not understand that.';

        // Log conversation
        await db.query(
            `INSERT INTO chat_logs (patient_id, user_message, bot_response, session_id)
       VALUES ($1, $2, $3, $4)`,
            [patientId, message, botReply, session_id]
        );

        res.json({
            message: botReply,
            session_id
        });

    } catch (error) {
        logger.error('Chatbot interaction failed', { error: error.message });
        res.status(500).json({ error: 'Failed to process message' });
    }
};

// Get chat history
const getChatHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { session_id, limit = 50 } = req.query;

        const patientResult = await db.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
        const patientId = patientResult.rows[0].id;

        let query = 'SELECT * FROM chat_logs WHERE patient_id = $1';
        const params = [patientId];

        if (session_id) {
            query += ' AND session_id = $2';
            params.push(session_id);
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
        params.push(limit);

        const result = await db.query(query, params);

        res.json({ chat_history: result.rows });

    } catch (error) {
        logger.error('Failed to fetch chat history', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

module.exports = {
    sendMessage,
    getChatHistory
};
