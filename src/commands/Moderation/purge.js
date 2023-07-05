const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Clear Chat Messages')
        .addIntegerOption(option => option.setName('amount').setDescription('Number Of Messages To Delete From 1-99').setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 99) {
            return interaction.reply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
        }
        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'An error occurred while trying to prune messages in this channel!', ephemeral: true });
        });
        return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Successfully pruned **${amount}** messages.`).setColor('Green')], ephemeral: true });
    }
}
