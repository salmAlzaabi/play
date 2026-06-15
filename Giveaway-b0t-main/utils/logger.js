const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

function log(type, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    
    console.log(logMessage);

    const logFile = type === 'error' ? 'error-logs/error.log' : 'giveaway-logs/activity.log';
    const filePath = path.join(logDir, logFile);

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(filePath, logMessage + '\n');
}

module.exports = {
    info: (msg) => log('info', msg),
    error: (msg) => log('error', msg),
    warn: (msg) => log('warn', msg),
    debug: (msg) => log('debug', msg)
};
