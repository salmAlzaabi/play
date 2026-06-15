const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require('../../database/manager');
const timeParser = require('../../utils/time-parser');
const embedBuilder = require('../../utils/embed-builder');

module.exports = async (interaction) => {
    // Defer reply as it might take a moment
    await interaction.deferReply({ ephemeral: true });

    const prize = interaction.fields.getTextInputValue('prize');
    const durationInput = interaction.fields.getTextInputValue('duration');
    const winnersCount = parseInt(interaction.fields.getTextInputValue('winners'));
    const reqsInput = interaction.fields.getTextInputValue('requirements');

    // Validation
    const durationMs = timeParser(durationInput);
    if (!durationMs) {
        return interaction.editReply({ content: '❌ Invalid duration format. Try `1h`, `1d`, `30m`.' });
    }
    if (isNaN(winnersCount) || winnersCount < 1) {
        return interaction.editReply({ content: '❌ Invalid number of winners.' });
    }

    // Parse Requirements
    const requirements = {};
    if (reqsInput) {
        const pairs = reqsInput.split(',').map(s => s.trim());
        pairs.forEach(pair => {
            const [key, val] = pair.split(':').map(s => s.trim().toLowerCase());
            if (key === 'role') requirements.role = val;
            if (key === 'age') requirements.age = parseInt(val);
            if (key === 'voice') requirements.voiceVal = val === 'true';
        });
    }

    const endsAt = Date.now() + durationMs;

    // Create Embed and Buttons
    const giveawayData = {
        prize,
        endsAt,
        winnersCount,
        hostedBy: interaction.user.id,
        participants: [],
        requirements,
        status: 'active'
    };

    const embed = embedBuilder.giveaway(giveawayData);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('join-giveaway')
                .setLabel('🎉 Join Giveaway')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('leave-giveaway') // Optional but good UX
                .setLabel('❌ Leave')
                .setStyle(ButtonStyle.Secondary)
        );

    // Send to channel
    const message = await interaction.channel.send({ embeds: [embed], components: [row] });

    // Save to DB
    giveawayData.messageId = message.id;
    giveawayData.channelId = message.channel.id;
    giveawayData.guildId = interaction.guild.id;

    const giveaways = db.read('giveaway');
    giveaways.push(giveawayData);
    db.write('giveaway', giveaways);

    await interaction.editReply({ content: `✅ Giveaway created! [Jump to Message](${message.url})` });
};
