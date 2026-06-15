const { EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * Creates a success embed
     * @param {string} title 
     * @param {string} description 
     */
    success: (title, description) => {
        return new EmbedBuilder()
            .setColor('#2ecc71') // Green
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: 'Giveaway Bot' })
            .setTimestamp();
    },

    /**
     * Creates an error embed
     * @param {string} title 
     * @param {string} description 
     */
    error: (title, description) => {
        return new EmbedBuilder()
            .setColor('#e74c3c') // Red
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: 'Error' })
            .setTimestamp();
    },

    /**
     * Creates the main giveaway embed
     * @param {object} giveawayData 
     */
    giveaway: (giveawayData) => {
        const { prize, endsAt, winnersCount, hostedBy, participants, requirements, status } = giveawayData;

        const embed = new EmbedBuilder()
            .setColor(status === 'ended' ? '#95a5a6' : '#9b59b6') // Grey if ended, Purple if active
            .setTitle(`🎉 **${prize}**`)
            .setDescription(
                `Ends: <t:${Math.floor(endsAt / 1000)}:R>\n` +
                `Hosted by: <@${hostedBy}>\n` +
                `Winners: **${winnersCount}**\n` +
                `Entries: **${participants.length}**`
            )
            .setFooter({ text: status === 'ended' ? 'Giveaway Ended' : 'Ends at' })
            .setTimestamp(endsAt);

        // Add Requirements Field if any exist
        let reqString = "";
        if (requirements) {
            if (requirements.role) reqString += `• Required Role: <@&${requirements.role}>\n`;
            if (requirements.age) reqString += `• Account Age: ${requirements.age} days\n`;
            if (requirements.voiceVal) reqString += `• Voice Channel: Required\n`;
        }

        if (reqString) {
            embed.addFields({ name: 'Requirements', value: reqString });
        }

        return embed;
    }
};
