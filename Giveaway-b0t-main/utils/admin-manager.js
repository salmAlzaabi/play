const db = require('../database/manager');
const logger = require('./logger');

class AdminManager {
    /**
     * Get guild admin settings
     */
    getGuildAdmins(guildId) {
        const settings = db.readSettings('settings');
        return settings[guildId]?.admins || {
            superAdmins: [],
            admins: [],
            moderators: [],
            adminRoles: []
        };
    }

    /**
     * Set guild admin configuration
     */
    setGuildAdmins(guildId, adminConfig) {
        const settings = db.readSettings('settings');
        if (!settings[guildId]) settings[guildId] = {};
        settings[guildId].admins = adminConfig;
        db.write('settings', settings);
        logger.info(`Updated admin configuration for guild ${guildId}`);
    }

    /**
     * Add super admin (highest level)
     */
    addSuperAdmin(guildId, userId) {
        const admins = this.getGuildAdmins(guildId);
        if (!admins.superAdmins.includes(userId)) {
            admins.superAdmins.push(userId);
            this.setGuildAdmins(guildId, admins);
            logger.info(`Added super admin ${userId} to guild ${guildId}`);
        }
    }

    /**
     * Remove super admin
     */
    removeSuperAdmin(guildId, userId) {
        const admins = this.getGuildAdmins(guildId);
        admins.superAdmins = admins.superAdmins.filter(id => id !== userId);
        this.setGuildAdmins(guildId, admins);
        logger.info(`Removed super admin ${userId} from guild ${guildId}`);
    }

    /**
     * Add admin role (multiple roles can be admins)
     */
    addAdminRole(guildId, roleId) {
        const admins = this.getGuildAdmins(guildId);
        if (!admins.adminRoles.includes(roleId)) {
            admins.adminRoles.push(roleId);
            this.setGuildAdmins(guildId, admins);
            logger.info(`Added admin role ${roleId} to guild ${guildId}`);
        }
    }

    /**
     * Remove admin role
     */
    removeAdminRole(guildId, roleId) {
        const admins = this.getGuildAdmins(guildId);
        admins.adminRoles = admins.adminRoles.filter(id => id !== roleId);
        this.setGuildAdmins(guildId, admins);
        logger.info(`Removed admin role ${roleId} from guild ${guildId}`);
    }

    /**
     * Check if user has admin access (for command execution)
     */
    isAdmin(member, guildId) {
        // Server owner always has full access
        if (member.guild.ownerId === member.id) return true;

        // Check Discord Administrator permission
        if (member.permissions.has('Administrator')) return true;

        const admins = this.getGuildAdmins(guildId);

        // Check super admin
        if (admins.superAdmins.includes(member.id)) return true;

        // Check admin roles
        if (admins.adminRoles.some(roleId => member.roles.cache.has(roleId))) return true;

        return false;
    }

    /**
     * Get admin level of user (0 = not admin, 3 = super admin)
     */
    getAdminLevel(member, guildId) {
        if (member.guild.ownerId === member.id) return 4; // Owner
        if (member.permissions.has('Administrator')) return 3; // Discord Admin
        
        const admins = this.getGuildAdmins(guildId);
        if (admins.superAdmins.includes(member.id)) return 2; // Super Admin
        if (admins.adminRoles.some(roleId => member.roles.cache.has(roleId))) return 1; // Admin Role
        
        return 0; // Not admin
    }
}

module.exports = new AdminManager();
