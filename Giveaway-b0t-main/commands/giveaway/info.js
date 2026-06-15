const db = require('../../database/manager');

module.exports = async (interaction) => {
    const messageId = interaction.options.getString('message_id');
    const giveaways = db.read('giveaway');
    const giveaway = giveaways.find(g => g.messageId === messageId);

    if (!giveaway) {
        return interaction.reply({ content: 'giveaway not found.', ephemeral: true });
    }

    const description = `
**Prize:** ${giveaway.prize}
**Status:** ${giveaway.status}
**Ends:** <t:${Math.floor(giveaway.endsAt / 1000)}:F>
**Hosted By:** <@${giveaway.hostedBy}>
**Participants:** ${giveaway.participants.length}
**Winners Count:** ${giveaway.winnersCount}
    `;

    await interaction.reply({
        embeds: [{
            title: '🎉 Giveaway Info',
            description: description,
            color: 0x9b59b6
        }],
        ephemeral: true
    });
};
