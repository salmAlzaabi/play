const db = require('../../database/manager');

module.exports = async (interaction) => {
    const giveaways = db.read('giveaway').filter(g => g.status === 'active');

    if (giveaways.length === 0) {
        return interaction.reply({ content: 'No active giveaways.', ephemeral: true });
    }

    // Create a list string (max 4096 chars usually, but we'll list top 10 for safety)
    const listString = giveaways.slice(0, 10).map((g, i) => {
        return `**${i + 1}. ${g.prize}**\nEnd: <t:${Math.floor(g.endsAt / 1000)}:R> | [Link](https://discord.com/channels/${g.guildId}/${g.channelId}/${g.messageId})`;
    }).join('\n\n');

    await interaction.reply({
        embeds: [{
            title: '🎉 Active Giveaways',
            description: listString,
            color: 0x9b59b6
        }],
        ephemeral: true
    });
};
