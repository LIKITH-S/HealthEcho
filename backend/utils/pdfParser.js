const pdfParse = require('pdf-parse');
const fs = require('fs');
const logger = require('./logger');

const parsePDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        return {
            totalPages: data.numpages,
            text: data.text,
            metadata: data.metadata,
            version: data.version
        };
    } catch (error) {
        logger.error('PDF parsing failed', {
            filePath,
            error: error.message
        });
        throw new Error('Failed to parse PDF file');
    }
};

const extractTextFromPDF = async (filePath) => {
    try {
        const pdfData = await parsePDF(filePath);
        return pdfData.text;
    } catch (error) {
        throw error;
    }
};

const validatePDFContent = (text) => {
    // Check if PDF contains medical-related keywords
    const medicalKeywords = [
        'diagnosis', 'medication', 'prescription', 'symptom',
        'test', 'result', 'treatment', 'patient', 'doctor',
        'hospital', 'clinic', 'examination', 'vitals'
    ];

    const lowerText = text.toLowerCase();
    const foundKeywords = medicalKeywords.filter(keyword => lowerText.includes(keyword));

    return {
        isValid: foundKeywords.length > 0,
        foundKeywords,
        confidence: (foundKeywords.length / medicalKeywords.length) * 100
    };
};

module.exports = {
    parsePDF,
    extractTextFromPDF,
    validatePDFContent
};
