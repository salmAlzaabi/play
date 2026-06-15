/**
 * Picks random winners from an array of User IDs
 * @param {Array} participants 
 * @param {number} count 
 * @returns {Array} Array of Winner IDs
 */
module.exports = (participants, count) => {
    if (!participants || participants.length === 0) return [];

    // Shuffle array (Fisher-Yates)
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Slice the first 'count' elements
    return shuffled.slice(0, count);
};
