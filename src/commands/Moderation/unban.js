const {EmbedBuilder, PermissionsBitField, Permissions, PermissionFlagsBits, SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban A User")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("userid")
        .setDescription("User ID")
        .setRequired(true)
        ),

    async execute(interaction) {
        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Blurple")
        .setDescription("Missing Permissions")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true});
        const {channel, options} = interaction;

        const userId = interaction.options.getString("userid");

        try{ 
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
            .setDescription(`${userId} Has Been Unbanned`)
            .setColor("Blurple");

            await interaction.reply({
                embeds: [embed],
            });
        } catch(err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`Please Provide A Valid User ID`)
                .setColor("Blurple")

            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}