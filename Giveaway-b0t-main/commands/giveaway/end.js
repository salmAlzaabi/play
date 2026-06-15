const checkPerms = require('../../utils/permissions-check');
const { endGiveaway } = require('../../utils/giveaway-actions');

module.exports = async (interaction) => {
    if (!await checkPerms(interaction)) {
        return interaction.reply({ content: '❌ You do not have permission.', ephemeral: true });
    }

    const messageId = interaction.options.getString('message_id');
    await interaction.deferReply({ ephemeral: true });

    const result = await endGiveaway(interaction.client, messageId);

    if (result.error) {
        return interaction.editReply({ content: `❌ ${result.error}` });
    }

    await interaction.editReply({ content: '✅ Giveaway ended successfully.' });
};
