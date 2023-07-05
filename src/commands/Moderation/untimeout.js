const {SlashCommandBuilder, EmbedBuilder, Permissions, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove A Member From Timeout')
    .addUserOption( option => 
        option
        .setName("target")
        .setDescription("target")
        .setRequired(true)),

    async execute(interaction, client) {
       const timeUser = interaction.options.getUser("target");

       const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Blurple")
        .setDescription("Missing Permissions")
        .setTimestamp()

       if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true});

       if (interaction.member === timeUser) return await interaction.reply({content: "Cannot Do This", ephemeral: true});

       if (!timeUser.kickable) return await interaction.reply({ content: "You Cannot Remove This Member From Timeout", ephemeral: true});

       const embed = new EmbedBuilder()
       .setColor("Blurple")
       .setDescription(` :white_check_mark: ${timeUser} Has Been Removed From Timeout`)

       const dmEmbed = new EmbedBuilder()
       .setColor("Blurple")
       .setDescription(`You Have Been Removed From Timeout In ${interaction.guild.name}.`)

       timeUser.timeout(null);

       return await interaction.reply({ embeds: [embed]});

       timeUser.send({embeds: [dmEmbed]});
    } 
}