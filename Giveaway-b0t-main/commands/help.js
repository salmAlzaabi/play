const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show detailed help for all commands')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('Get help for a specific command')
                .setRequired(false)
                .addChoices(
                    { name: 'Setup', value: 'setup' },
                    { name: 'Giveaway Create', value: 'giveaway-create' },
                    { name: 'Giveaway List', value: 'giveaway-list' },
                    { name: 'Giveaway Info', value: 'giveaway-info' },
                    { name: 'Giveaway End', value: 'giveaway-end' },
                    { name: 'Giveaway Reroll', value: 'giveaway-reroll' }
                )
        ),

    async execute(interaction) {
        try {
            const commandOption = interaction.options.getString('command');

            if (commandOption === 'setup') {
                return interaction.reply({
                    embeds: [setupEmbed()],
                    ephemeral: true
                });
            } else if (commandOption === 'giveaway-create') {
                return interaction.reply({
                    embeds: [createGiveawayCreateEmbed()],
                    ephemeral: true
                });
            } else if (commandOption === 'giveaway-list') {
                return interaction.reply({
                    embeds: [giveawayListEmbed()],
                    ephemeral: true
                });
            } else if (commandOption === 'giveaway-info') {
                return interaction.reply({
                    embeds: [giveawayInfoEmbed()],
                    ephemeral: true
                });
            } else if (commandOption === 'giveaway-end') {
                return interaction.reply({
                    embeds: [giveawayEndEmbed()],
                    ephemeral: true
                });
            } else if (commandOption === 'giveaway-reroll') {
                return interaction.reply({
                    embeds: [giveawayRerollEmbed()],
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    embeds: [mainHelpEmbed()],
                    ephemeral: true
                });
            }
        } catch (error) {
            logger.error(`Help command error: ${error.message}`);
            return interaction.reply({
                content: '❌ An error occurred while retrieving help',
                ephemeral: true
            });
        }
    }
};

function mainHelpEmbed() {
    return new EmbedBuilder()
        .setTitle('🎉 Discord Giveaway Bot - Complete Help Guide')
        .setDescription('Use `/help [command]` to get detailed help for any command')
        .addFields(
            {
                name: '⚙️ **SETUP (START HERE!)**',
                value: 'Configure your server before creating giveaways',
                inline: false
            },
            {
                name: '/setup',
                value: '**Required:** Server Admin\n**Purpose:** Configure admin roles, super admins, and log channel\n**Get detailed help:** Use `/help setup`',
                inline: false
            },
            {
                name: '🎁 **GIVEAWAY COMMANDS**',
                value: 'Manage and create giveaways in your server',
                inline: false
            },
            {
                name: '/giveaway create',
                value: '**Required:** Admin\n**Purpose:** Start a new giveaway with custom settings',
                inline: false
            },
            {
                name: '/giveaway list',
                value: '**Required:** Any user\n**Purpose:** View all active giveaways',
                inline: false
            },
            {
                name: '/giveaway info',
                value: '**Required:** Any user\n**Purpose:** Get detailed info about a specific giveaway',
                inline: false
            },
            {
                name: '/giveaway end',
                value: '**Required:** Admin\n**Purpose:** End a giveaway early and pick winners',
                inline: false
            },
            {
                name: '/giveaway reroll',
                value: '**Required:** Admin\n**Purpose:** Reroll a giveaway to pick new winners',
                inline: false
            }
        )
        .setColor('#9b59b6')
        .setFooter({ text: 'Type /help [command] for detailed information' })
        .setTimestamp();
}

function setupEmbed() {
    return new EmbedBuilder()
        .setTitle('⚙️ Setup - Detailed Guide')
        .setDescription('Configure your server for giveaway management')
        .addFields(
            {
                name: '📋 Command Usage',
                value: '```\n/setup [subcommand] [options]\n```\n**Available Subcommands:** admin-role, superadmin, log-channel, view',
                inline: false
            },
            {
                name: '⚙️ Subcommand 1: admin-role',
                value: '**Usage:**\n```\n/setup admin-role [role]\n```\n\n**Purpose:** Make a role have admin privileges\n\n' +
                       '**What It Does:**\n' +
                       '• Any user with this role becomes an admin\n' +
                       '• Can create, end, and manage giveaways\n' +
                       '• Cannot be a managed role (bot/integration roles)\n\n' +
                       '**Example:**\n```\n/setup admin-role @Moderators\n```\n' +
                       'Now all Moderators can manage giveaways',
                inline: false
            },
            {
                name: '⚙️ Subcommand 2: superadmin',
                value: '**Usage:**\n```\n/setup superadmin [user] [add/remove]\n```\n\n**Purpose:** Promote individual users to super admin\n\n' +
                       '**What It Does:**\n' +
                       '• Give specific person admin access\n' +
                       '• Useful for trusted members\n' +
                       '• Can add or remove at any time\n\n' +
                       '**Examples:**\n```\n/setup superadmin @John add\n(Makes John a super admin)\n\n' +
                       '/setup superadmin @John remove\n(Removes John status)\n```',
                inline: false
            },
            {
                name: '⚙️ Subcommand 3: log-channel',
                value: '**Usage:**\n```\n/setup log-channel [channel]\n```\n\n**Purpose:** Set where giveaway logs are sent\n\n' +
                       '**What It Does:**\n' +
                       '• All giveaway events logged to this channel\n' +
                       '• Useful for record keeping\n' +
                       '• Any channel works\n\n' +
                       '**Example:**\n```\n/setup log-channel #giveaway-logs\n```',
                inline: false
            },
            {
                name: '⚙️ Subcommand 4: view',
                value: '**Usage:**\n```\n/setup view\n```\n\n**Purpose:** See all current server settings\n\n' +
                       '**What You will See:**\n' +
                       '• List of all admin roles\n' +
                       '• List of all super admins\n' +
                       '• Current log channel\n\n' +
                       '**Example Output:**\n```\nAdmin Roles: @Moderators, @Staff\nSuper Admins: @John, @Sarah\nLog Channel: #giveaway-logs\n```',
                inline: false
            },
            {
                name: '📊 Admin Hierarchy',
                value: '**Level 4: Server Owner** → Always has full access\n\n' +
                       '**Level 3: Discord Admin** → Has Administrator permission\n\n' +
                       '**Level 2: Super Admin** → Promoted with `/setup superadmin add`\n\n' +
                       '**Level 1: Admin Role** → Members with designated admin role\n\n' +
                       '**Level 0: Regular User** → Cannot manage giveaways',
                inline: false
            },
            {
                name: '💡 Quick Setup Example',
                value: '**Step 1:** Create admin role in server settings\n' +
                       '**Step 2:** `/setup admin-role @Moderators`\n' +
                       '**Step 3:** `/setup log-channel #giveaway-logs`\n' +
                       '**Step 4:** `/setup view` to verify\n\n' +
                       'Now moderators can create giveaways!',
                inline: false
            }
        )
        .setColor('#2ecc71')
        .setTimestamp();
}

function createGiveawayCreateEmbed() {
    return new EmbedBuilder()
        .setTitle('🎁 Giveaway Create - Detailed Guide')
        .setDescription('Create a new giveaway with custom settings and requirements')
        .addFields(
            {
                name: '📋 Command Usage',
                value: '```\n/giveaway create\n```',
                inline: false
            },
            {
                name: '✅ Requirements',
                value: '• Must be Admin (or have Admin Role)\n• Server must not have ongoing giveaway in same channel',
                inline: false
            },
            {
                name: '📝 Form Fields (Step-by-Step)',
                value: '**1. Prize Name** (Required)\n   • What users are winning\n   • Example: "Nitro Classic", "Gaming Headset", "$50 Gift Card"\n\n' +
                       '**2. Duration** (Required)\n   • How long the giveaway lasts\n   • Format: `10m`, `1h`, `2d`, `3w`\n   • Examples: "10m" = 10 minutes, "1d" = 1 day\n\n' +
                       '**3. Number of Winners** (Required)\n   • How many people will win\n   • Default: 1\n   • Example: "3" for 3 winners\n\n' +
                       '**4. Requirements** (Optional)\n   • Conditions users must meet to join\n   • Leave empty for no requirements',
                inline: false
            },
            {
                name: '🔐 Requirement Format',
                value: '**Role Requirement:**\n   `role:ROLE_ID`\n   Example: `role:1234567890`\n\n' +
                       '**Account Age Requirement:**\n   `age:DAYS`\n   Example: `age:7` (must have account for 7+ days)\n\n' +
                       '**Voice Channel Requirement:**\n   `voice:true`\n   Users must be in a voice channel\n\n' +
                       '**Multiple Requirements:**\n   Separate with comma: `role:123, age:7, voice:true`',
                inline: false
            },
            {
                name: '📚 Real-World Examples',
                value: '**Example 1: Simple Prize**\n' +
                       'Prize: `Discord Nitro`\n' +
                       'Duration: `1h`\n' +
                       'Winners: `1`\n' +
                       'Requirements: (none)\n\n' +
                       '**Example 2: Role-Restricted Giveaway**\n' +
                       'Prize: `VIP Role Access`\n' +
                       'Duration: `3d`\n' +
                       'Winners: `5`\n' +
                       'Requirements: `role:987654321`',
                inline: false
            }
        )
        .setColor('#2ecc71')
        .setTimestamp();
}

function giveawayListEmbed() {
    return new EmbedBuilder()
        .setTitle('📋 Giveaway List - Detailed Guide')
        .setDescription('View all active giveaways in your server')
        .addFields(
            {
                name: '📋 Command Usage',
                value: '```\n/giveaway list\n```',
                inline: false
            },
            {
                name: '✅ Who Can Use This',
                value: '• Anyone can use this command\n• Shows only active giveaways',
                inline: false
            },
            {
                name: '📊 What You will See',
                value: '• Prize name\n• Time until it ends\n• Direct link to the giveaway message\n• Up to 10 most recent giveaways',
                inline: false
            }
        )
        .setColor('#3498db')
        .setTimestamp();
}

function giveawayInfoEmbed() {
    return new EmbedBuilder()
        .setTitle('🔍 Giveaway Info - Detailed Guide')
        .setDescription('Get detailed information about a specific giveaway')
        .addFields(
            {
                name: '📋 Command Usage',
                value: '```\n/giveaway info [message_id]\n```\n**Note:** Message ID is from the giveaway message',
                inline: false
            },
            {
                name: '❓ How to Get Message ID',
                value: '1. Enable Developer Mode in Discord Settings\n' +
                       '2. Right-click on the giveaway message\n' +
                       '3. Click "Copy Message ID"\n' +
                       '4. Paste it in the command',
                inline: false
            },
            {
                name: '📊 Information Displayed',
                value: '**Prize:** What is being given away\n' +
                       '**Status:** Active or Ended\n' +
                       '**End Time:** When the giveaway closes\n' +
                       '**Hosted By:** Who started the giveaway\n' +
                       '**Participants:** How many people joined\n' +
                       '**Winners Count:** How many will win',
                inline: false
            }
        )
        .setColor('#9b59b6')
        .setTimestamp();
}

function giveawayEndEmbed() {
    return new EmbedBuilder()
        .setTitle('🏁 Giveaway End - Detailed Guide')
        .setDescription('End a giveaway early and select winners')
        .addFields(
            {
                name: '📋 Command Usage',
                value: '```\n/giveaway end [message_id]\n```',
                inline: false
            },
            {
                name: '✅ Requirements',
                value: '• Must be Admin (or have Admin Role)\n' +
                       '• Giveaway must still be active\n' +
                       '• Message ID must be correct',
                inline: false
            },
            {
                name: '⚙️ What Happens',
                value: '1. Bot stops accepting new participants\n' +
                       '2. Winners are randomly selected\n' +
                       '3. Winners are checked against requirements\n' +
                       '4. Winners announcement is posted\n' +
                       '5. Giveaway is marked as ended',
                inline: false
            },
            {
                name: '⚠️ Important Notes',
                value: '🔴 This action is PERMANENT\n' +
                       '🔴 Cannot be undone (must reroll if needed)\n' +
                       '🔴 All waiting participants are locked out',
                inline: false
            }
        )
        .setColor('#e74c3c')
        .setTimestamp();
}

function giveawayRerollEmbed() {
    return new EmbedBuilder()
        .setTitle('🔄 Giveaway Reroll - Detailed Guide')
        .setDescription('Pick new winners for an ended giveaway')
        .addFields(
            {
                name: '📋 Command Usage',
                value: '```\n/giveaway reroll [message_id]\n```',
                inline: false
            },
            {
                name: '✅ Requirements',
                value: '• Must be Admin (or have Admin Role)\n' +
                       '• Giveaway must be ENDED\n' +
                       '• Message ID must be correct',
                inline: false
            },
            {
                name: '⚙️ What Happens',
                value: '1. New winner is randomly selected\n' +
                       '2. Winner is checked against original requirements\n' +
                       '3. Previous winner is replaced\n' +
                       '4. New winner is announced\n' +
                       '5. Can be used multiple times',
                inline: false
            },
            {
                name: '💡 Why Use This',
                value: '• Winner unresponsive\n' +
                       '• Winner found to be ineligible\n' +
                       '• Need to pick multiple winners\n' +
                       '• Admin decision to change winner\n' +
                       '• Technical issues',
                inline: false
            }
        )
        .setColor('#f39c12')
        .setTimestamp();
}
