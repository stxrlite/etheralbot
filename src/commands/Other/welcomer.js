const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription("Set Servers Welcome Channel")
    .addChannelOption(option => option.setName('channel').setDescription('Welcome channel.').setRequired(true)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply ({ content: "You **do not** have the permission to do that!", ephemeral: true});
 
        const channel = interaction.options.getChannel('channel');
 
        const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`> Your welcome channel has \n> been set successfully!`)
        .setAuthor({ name: `⚙️ Welcome Channel Tool`})
        .setFooter({ text: `⚙️ Use /remove-welcome-channel to undo`})
        .setTimestamp()
        .setFields({ name: `• Channel was Set`, value: `> The channel ${channel} has been \n> set as your Welcome Channel.`, inline: false})
 
        await db.set(`welchannel_${interaction.guild.id}`, channel.id)
 
        await interaction.reply({ embeds: [embed] });
    }
}
