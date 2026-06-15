const { PermissionsBitField } = require('discord.js');
const adminManager = require('./admin-manager');
const logger = require('./logger');

/**
 * Advanced permission checking with admin roles and super admins
 * @param {Interaction} interaction 
 * @returns {Promise<boolean>}
 */
module.exports = async (interaction) => {
    try {
        const isAdmin = adminManager.isAdmin(interaction.member, interaction.guild.id);
        
        if (!isAdmin) {
            logger.warn(`Permission denied for ${interaction.user.id} in guild ${interaction.guild.id}`);
            return false;
        }

        return true;
    } catch (error) {
        logger.error(`Permission check error: ${error.message}`);
        return false;
    }
};

/**
 * Get admin level - useful for logging and audit trails
 * 0 = no access, 4 = owner
 */
module.exports.getAdminLevel = (member, guildId) => {
    return adminManager.getAdminLevel(member, guildId);
};

/**
 * Require minimum admin level
 */
module.exports.requireLevel = (minLevel) => {
    return async (interaction) => {
        const level = adminManager.getAdminLevel(interaction.member, interaction.guild.id);
        return level >= minLevel;
    };
};
