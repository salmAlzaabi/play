const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const adminManager = require('../../utils/admin-manager');
const db = require('../../database/manager');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configure server settings and admin permissions')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub
                .setName('admin-role')
                .setDescription('Set a role as admin for managing giveaways')
                .addRoleOption(option =>
                    option.setName('role').setDescription('The role to make admin').setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('superadmin')
                .setDescription('Add or remove a super admin user')
                .addUserOption(option =>
                    option.setName('user').setDescription('The user to modify').setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('action')
                        .setDescription('Add or remove')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Add', value: 'add' },
                            { name: 'Remove', value: 'remove' }
                        )
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('log-channel')
                .setDescription('Set channel for giveaway logs')
                .addChannelOption(option =>
                    option.setName('channel').setDescription('The channel for logs').setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('view')
                .setDescription('View current server configuration')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            if (subcommand === 'admin-role') {
                const role = interaction.options.getRole('role');
                
                if (role.managed) {
                    return interaction.reply({
                        content: '❌ Cannot use managed roles (bot roles, integration roles)',
                        ephemeral: true
                    });
                }

                adminManager.addAdminRole(interaction.guild.id, role.id);
                logger.info(`Admin role added: ${role.name} (${role.id})`);

                const embed = new EmbedBuilder()
                    .setTitle('✅ Admin Role Set')
                    .setDescription(`${role} can now manage giveaways`)
                    .setColor('#2ecc71')
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            if (subcommand === 'superadmin') {
                const user = interaction.options.getUser('user');
                const action = interaction.options.getString('action');

                if (action === 'add') {
                    adminManager.addSuperAdmin(interaction.guild.id, user.id);
                    logger.info(`Super admin added: ${user.tag} (${user.id})`);
                } else {
                    adminManager.removeSuperAdmin(interaction.guild.id, user.id);
                    logger.info(`Super admin removed: ${user.tag} (${user.id})`);
                }

                const embed = new EmbedBuilder()
                    .setTitle(`✅ Super Admin ${action === 'add' ? 'Added' : 'Removed'}`)
                    .setDescription(`${user} is ${action === 'add' ? 'now' : 'no longer'} a super admin`)
                    .setColor(action === 'add' ? '#2ecc71' : '#e74c3c')
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            if (subcommand === 'log-channel') {
                const channel = interaction.options.getChannel('channel');
                
                const settings = db.readSettings('settings');
                if (!settings[interaction.guild.id]) settings[interaction.guild.id] = {};
                settings[interaction.guild.id].logChannel = channel.id;
                db.write('settings', settings);

                logger.info(`Log channel set to ${channel.name} (${channel.id})`);

                const embed = new EmbedBuilder()
                    .setTitle('✅ Log Channel Set')
                    .setDescription(`Giveaway logs will be sent to ${channel}`)
                    .setColor('#2ecc71')
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }

            if (subcommand === 'view') {
                const admins = adminManager.getGuildAdmins(interaction.guild.id);
                const settings = db.readSettings('settings')[interaction.guild.id] || {};
                
                let superAdminText = 'None configured';
                let roleText = 'No admin roles set';
                let logChannelText = 'Not set';

                if (admins.superAdmins.length > 0) {
                    superAdminText = admins.superAdmins.map(id => `<@${id}>`).join(', ');
                }

                if (admins.adminRoles.length > 0) {
                    roleText = admins.adminRoles.map(id => `<@&${id}>`).join(', ');
                }

                if (settings.logChannel) {
                    logChannelText = `<#${settings.logChannel}>`;
                }

                const embed = new EmbedBuilder()
                    .setTitle('⚙️ Server Configuration')
                    .addFields(
                        { name: '🛡️ Admin Roles', value: roleText, inline: false },
                        { name: '👑 Super Admins', value: superAdminText, inline: false },
                        { name: '📝 Log Channel', value: logChannelText, inline: false }
                    )
                    .setColor('#3498db')
                    .setTimestamp()
                    .setFooter({ text: 'Use /help setup for more information' });

                return interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            logger.error(`Setup command error: ${error.message}`);
            return interaction.reply({
                content: '❌ An error occurred while executing this command',
                ephemeral: true
            });
        }
    }
};
