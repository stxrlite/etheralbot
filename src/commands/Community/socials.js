const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('socials')
    .setDescription('Shows The Servers Socials'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle("Click Me")
        .setURL("https://discord.gg/2GrWjDZRQN") // Change To Whatever You'd Like
        .setDescription("***Space Software Solutions***") // Change To Whatever You'd Like

        await interaction.reply({ embeds: [embed]})

    }
}