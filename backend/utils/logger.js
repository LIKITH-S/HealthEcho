const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');
const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const getLogFile = (level) => {
    const date = new Date().toISOString().split('T')[0];
    return path.join(LOG_DIR, `${level.toLowerCase()}-${date}.log`);
};

const formatLog = (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
        timestamp,
        level,
        message,
        ...data
    });
};

const log = (level, message, data = {}) => {
    const logEntry = formatLog(level, message, data);
    const logFile = getLogFile(level);

    // Console output (for development)
    console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](logEntry);

    // File output (for production)
    fs.appendFileSync(logFile, logEntry + '\n', (err) => {
        if (err) console.error('Failed to write log:', err);
    });
};

const logger = {
    error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
    warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
    info: (message, data) => log(LOG_LEVELS.INFO, message, data),
    debug: (message, data) => process.env.NODE_ENV === 'development' && log(LOG_LEVELS.DEBUG, message, data)
};

module.exports = logger;
