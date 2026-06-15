const { SlashCommandBuilder } = require('discord.js');
const createCmd = require('./create');
const endCmd = require('./end');
const rerollCmd = require('./reroll');
const listCmd = require('./list');
const infoCmd = require('./info');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Manage server giveaways')
        .addSubcommand(sc =>
            sc.setName('create')
                .setDescription('Create a new giveaway'))
        .addSubcommand(sc =>
            sc.setName('end')
                .setDescription('End a giveaway immediately')
                .addStringOption(opt => opt.setName('message_id').setDescription('The message ID of the giveaway').setRequired(true)))
        .addSubcommand(sc =>
            sc.setName('reroll')
                .setDescription('Reroll a giveaway winner')
                .addStringOption(opt => opt.setName('message_id').setDescription('The message ID of the giveaway').setRequired(true)))
        .addSubcommand(sc =>
            sc.setName('list')
                .setDescription('List all active giveaways'))
        .addSubcommand(sc =>
            sc.setName('info')
                .setDescription('Get info about a specific giveaway')
                .addStringOption(opt => opt.setName('message_id').setDescription('The message ID of the giveaway').setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'create':
                await createCmd(interaction);
                break;
            case 'end':
                await endCmd(interaction);
                break;
            case 'reroll':
                await rerollCmd(interaction);
                break;
            case 'list':
                await listCmd(interaction);
                break;
            case 'info':
                await infoCmd(interaction);
                break;
        }
    }
};
