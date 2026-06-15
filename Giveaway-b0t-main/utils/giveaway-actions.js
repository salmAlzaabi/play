const db = require('../database/manager');
const pickWinners = require('./random-winner');
const { EmbedBuilder } = require('discord.js');
const logger = require('./logger');

async function endGiveaway(client, messageId, checkOnly = false) {
    const giveaways = db.read('giveaway');
    const index = giveaways.findIndex(g => g.messageId === messageId);

    if (index === -1) return { error: 'Giveaway not found' };

    const giveaway = giveaways[index];
    if (giveaway.status === 'ended') return { error: 'Giveaway already ended' };

    // Update Status
    giveaway.status = 'ended';
    // We pick winners now
    const winners = pickWinners(giveaway.participants, giveaway.winnersCount);
    giveaway.winners = winners;

    // Save
    giveaways[index] = giveaway;
    db.write('giveaway', giveaways);

    // Fetch Channel and Message to update
    try {
        const channel = await client.channels.fetch(giveaway.channelId);
        if (channel) {
            const message = await channel.messages.fetch(giveaway.messageId);
            if (message) {
                // Update Embed
                const embed = EmbedBuilder.from(message.embeds[0]);
                embed.setColor('#95a5a6'); // Grey
                embed.setFooter({ text: 'Giveaway Ended' });

                const winnerString = winners.length > 0 ? winners.map(w => `<@${w}>`).join(', ') : 'No valid entries.';

                // Add a field for winners or edit description
                embed.addFields({ name: 'Winners', value: winnerString });

                // Remove buttons or disable them
                await message.edit({ embeds: [embed], components: [] });

                // Announce winners
                await channel.send({
                    content: `🎉 **Giveaway Ended!** 🎉\nCongratulations to the winners: ${winnerString}\nPrize: **${giveaway.prize}**`,
                    reply: { messageReference: message.id }
                });
            }
        }
    } catch (err) {
        logger.error(`Failed to update ended giveaway message: ${err.message}`);
    }

    return { success: true, winners };
}

async function rerollGiveaway(client, messageId) {
    const giveaways = db.read('giveaway');
    const giveaway = giveaways.find(g => g.messageId === messageId);

    if (!giveaway) return { error: 'Giveaway not found' };
    if (giveaway.status !== 'ended') return { error: 'Giveaway is not ended yet' };

    // Create a pool of non-winners
    // Actually standard reroll just repicks from all participants excluding previous winners usually?
    // Or just clean random? Let's assume repick from all participants.

    const newWinners = pickWinners(giveaway.participants, 1); // Reroll 1 winner
    if (newWinners.length === 0) return { error: 'No valid participants to reroll' };

    const winnerId = newWinners[0];

    try {
        const channel = await client.channels.fetch(giveaway.channelId);
        if (channel) {
            await channel.send({
                content: `🎉 **New Winner Rerolled!** 🎉\nCongratulations <@${winnerId}>! You won **${giveaway.prize}**!`,
                reply: { messageReference: messageId }
            });
        }
    } catch (err) {
        logger.error(`Failed to send reroll message: ${err.message}`);
    }

    return { success: true, winner: winnerId };
}

module.exports = { endGiveaway, rerollGiveaway };
