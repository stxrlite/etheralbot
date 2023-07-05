const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('removechannel')
    .setDescription("Deletes Welcome Message"),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply ({ content: "You **do not** have the permission to do that!", ephemeral: true});
 
        const channel = interaction.options.getChannel('channel');
 
        const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`> Your welcome channel has \n> been removed successfully!`)
        .setAuthor({ name: `⚙️ Welcome Channel Tool`})
        .setFooter({ text: `⚙️ Use /set-welcome-channel to set your channel`})
        .setTimestamp()
        .setFields({ name: `• Your Channel was Removed`, value: `> The channel you have previously set \n> as your welcome channel will no longer \n> receive updates.`, inline: false})
 
        await db.delete(`welchannel_${interaction.guild.id}`)
 
        await interaction.reply({ embeds: [embed] });
    }
}
