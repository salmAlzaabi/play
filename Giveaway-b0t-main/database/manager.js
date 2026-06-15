const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class DatabaseManager {
    constructor() {
        this.basePath = path.join(__dirname, 'models');
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }

    _getFilePath(model) {
        return path.join(this.basePath, `${model}.json`);
    }

    read(model) {
        const filePath = this._getFilePath(model);
        if (!fs.existsSync(filePath)) {
            return [];
        }
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            logger.error(`Failed to read database model ${model}: ${error.message}`);
            return [];
        }
    }

    write(model, data) {
        const filePath = this._getFilePath(model);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            logger.error(`Failed to write database model ${model}: ${error.message}`);
            return false;
        }
    }

    // Helper to get configuration/settings, allowing object return instead of array
    readSettings(model) {
        const filePath = this._getFilePath(model);
        if (!fs.existsSync(filePath)) {
            return {};
        }
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            logger.error(`Failed to read settings model ${model}: ${error.message}`);
            return {};
        }
    }
}

module.exports = new DatabaseManager();
