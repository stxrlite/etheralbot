const {SlashCommandBuilder, PermissionsBitField, Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout A Member")
    .addUserOption(option =>
        option
        .setName("target")
        .setDescription("target")
        .setRequired(true))
    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("Reason For The Timeout")),

    async execute(interaction, client) {
        const tmember = interaction.options.getMember('target');

        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Blurple")
        .setDescription("Missing Permissions")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true});

        if (interaction.member === tmember) return await interaction.reply({ content: "You Cannot Time Yourself Out", ephemeral: true});

        const reason = interaction.options.getString("reason") || "NO REASON";

        tmember.timeout(6000_000, reason).catch(err => {
            return;
        });

        const embed = new EmbedBuilder()
        .setDescription(` :white_check_mark: ${tmember} Has Been Timed Out | Reason: ${reason}`)
        .setColor("Blurple")

        const dmEmbed = new EmbedBuilder()
        .setTitle("You Have Been Timed Out")
        .setDescription(`You Have Been Timed Out In ${interaction.guild.name} | Reason: ${reason}`)

        tmember.send({ embeds: [dmEmbed]}).catch(err => {
            return;
        });

        return await interaction.reply({ embeds: [embed], ephemeral: true}).catch(err => {
            return;
        });

        
    }
}
