const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const checkPerms = require('../../utils/permissions-check');

module.exports = async (interaction) => {
    if (!await checkPerms(interaction)) {
        return interaction.reply({ content: '❌ You do not have permission to manage giveaways.', ephemeral: true });
    }

    const modal = new ModalBuilder()
        .setCustomId('create-giveaway')
        .setTitle('Create Giveaway');

    const prizeInput = new TextInputBuilder()
        .setCustomId('prize')
        .setLabel("Prize Name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const durationInput = new TextInputBuilder()
        .setCustomId('duration')
        .setLabel("Duration (e.g. 10m, 1h, 2d)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const winnersInput = new TextInputBuilder()
        .setCustomId('winners')
        .setLabel("Number of Winners")
        .setValue("1")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const requirementsInput = new TextInputBuilder()
        .setCustomId('requirements')
        .setLabel("Reqs: RoleID, Age(days), voice (true/false)")
        .setPlaceholder("role:1234, age:10, voice:true")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    modal.addComponents(
        new ActionRowBuilder().addComponents(prizeInput),
        new ActionRowBuilder().addComponents(durationInput),
        new ActionRowBuilder().addComponents(winnersInput),
        new ActionRowBuilder().addComponents(requirementsInput)
    );

    await interaction.showModal(modal);
};
