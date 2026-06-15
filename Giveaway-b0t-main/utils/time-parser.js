const ms = require('ms');

module.exports = (timeString) => {
    if (!timeString) return null;
    const milliseconds = ms(timeString);
    if (!milliseconds || isNaN(milliseconds)) return null;
    return milliseconds;
};
