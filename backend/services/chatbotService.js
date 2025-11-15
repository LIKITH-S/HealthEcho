const axios = require('axios');
const logger = require('../utils/logger');

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://localhost:5002';

// Send message to Rasa
const sendToRasa = async (sender, message) => {
    try {
        const response = await axios.post(`${CHATBOT_SERVICE_URL}/webhooks/rest/webhook`, {
            sender,
            message
        });

        return response.data;

    } catch (error) {
        logger.error('Chatbot service error', { error: error.message });
        return [{ text: 'Sorry, I am having trouble responding right now.' }];
    }
};

module.exports = {
    sendToRasa
};
