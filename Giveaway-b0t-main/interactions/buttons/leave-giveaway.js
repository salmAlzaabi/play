const db = require('../../database/manager');
const embedBuilder = require('../../utils/embed-builder');

module.exports = async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.message.id;
    const giveaways = db.read('giveaway');
    const giveawayIndex = giveaways.findIndex(g => g.messageId === messageId);

    if (giveawayIndex === -1) {
        return interaction.editReply({ content: '❌ This giveaway no longer exists.' });
    }

    const giveaway = giveaways[giveawayIndex];

    if (giveaway.status !== 'active') {
        return interaction.editReply({ content: '❌ This giveaway has ended.' });
    }

    if (!giveaway.participants.includes(interaction.user.id)) {
        return interaction.editReply({ content: '⚠️ You are not in this giveaway.' });
    }

    // Remove User
    giveaway.participants = giveaway.participants.filter(id => id !== interaction.user.id);
    db.write('giveaway', giveaways);

    // Update Embed
    const newEmbed = embedBuilder.giveaway(giveaway);
    await interaction.message.edit({ embeds: [newEmbed] });

    await interaction.editReply({ content: '✅ You have left the giveaway.' });
};
