const db = require('../../database/manager');
const embedBuilder = require('../../utils/embed-builder');

module.exports = async (interaction) => {
    // Ephemeral loading state
    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.message.id;
    const giveaways = db.read('giveaway');
    const giveawayIndex = giveaways.findIndex(g => g.messageId === messageId);

    if (giveawayIndex === -1) {
        return interaction.editReply({ content: '❌ This giveaway no longer exists in the database.' });
    }

    const giveaway = giveaways[giveawayIndex];

    if (giveaway.status !== 'active') {
        return interaction.editReply({ content: '❌ This giveaway has ended.' });
    }

    if (giveaway.participants.includes(interaction.user.id)) {
        return interaction.editReply({ content: '⚠️ You have already joined this giveaway!' });
    }

    // Check Requirements
    if (giveaway.requirements) {
        // Role
        if (giveaway.requirements.role) {
            if (!interaction.member.roles.cache.has(giveaway.requirements.role)) {
                return interaction.editReply({ content: `❌ You need the <@&${giveaway.requirements.role}> role to join.` });
            }
        }
        // Age
        if (giveaway.requirements.age) {
            const created = interaction.user.createdTimestamp;
            const ageDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
            if (ageDays < giveaway.requirements.age) {
                return interaction.editReply({ content: `❌ Your account must be at least ${giveaway.requirements.age} days old.` });
            }
        }
        // Voice
        if (giveaway.requirements.voiceVal) {
            if (!interaction.member.voice.channel) {
                return interaction.editReply({ content: `❌ You must be in a voice channel to join.` });
            }
        }
    }

    // Add User
    giveaway.participants.push(interaction.user.id);
    db.write('giveaway', giveaways);

    // Update Embed
    const newEmbed = embedBuilder.giveaway(giveaway);
    await interaction.message.edit({ embeds: [newEmbed] });

    await interaction.editReply({ content: '🎉 You have successfully joined the giveaway!' });
};
