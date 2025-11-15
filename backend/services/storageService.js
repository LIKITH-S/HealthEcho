const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { UPLOAD_DIR } = require('../utils/fileHandler');

// Save file securely
const saveFile = (file, userId) => {
    try {
        const userDir = path.join(UPLOAD_DIR, userId);

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        return {
            success: true,
            path: file.path
        };

    } catch (error) {
        logger.error('File save failed', { error: error.message });
        return {
            success: false,
            error: error.message
        };
    }
};

// Delete file
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return { success: true };
        }
        return { success: false, error: 'File not found' };

    } catch (error) {
        logger.error('File deletion failed', { error: error.message });
        return { success: false, error: error.message };
    }
};

module.exports = {
    saveFile,
    deleteFile
};
