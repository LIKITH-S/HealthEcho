const axios = require('axios');
const logger = require('../utils/logger');

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:5001';

// Send text for entity extraction
const extractEntities = async (reportId, text) => {
    try {
        const response = await axios.post(`${NLP_SERVICE_URL}/api/extract`, {
            report_id: reportId,
            text
        });

        return {
            success: true,
            data: response.data
        };

    } catch (error) {
        logger.error('NLP extraction failed', { reportId, error: error.message });
        return {
            success: false,
            error: error.message
        };
    }
};

// Get extraction status
const getExtractionStatus = async (reportId) => {
    try {
        const response = await axios.get(`${NLP_SERVICE_URL}/api/status/${reportId}`);
        return response.data;

    } catch (error) {
        logger.error('Failed to get extraction status', { reportId, error: error.message });
        return null;
    }
};

module.exports = {
    extractEntities,
    getExtractionStatus
};
