const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify Yourself'),

    async execute (interaction) {
        const GuildID =  interaction.guild.id;
        const VerChannel =  interaction.channel.id;
        const verRole = "1091823921600409676"; // Change Role ID Here

        const verifiedEmbed = new EmbedBuilder()
        .setTitle("You have already been verified!")
        .setColor("Blurple")

        const errEmbed = new EmbedBuilder()
        .setTitle("Verification failed!")
        .setDescription("You can use this command only in https://discord.gg/yourlink !") // Put Your Discord Invite Here
        .setURL("https://discord.gg/westcoastrp1") // Put Your Discord Invite Here
        .setColor("Blurple")

        const successEmbed = new EmbedBuilder()
        .setTitle("Verification successfull!")
        .setDescription("You  have been verified successfull! Have fun!")
        .addFields({ name: "Rules:", value: "<#1091823922284077157>"}) // Put Rule Channel ID In Between <#PLACEHERE>
        .setColor("Blurple")


        const wrongChannel =  new EmbedBuilder()
        .setTitle("WRONG CHANNEL!")
        .setDescription("Please use <#1091823922284077157> to verify!") // Set Verify Channel ID Here
        .setColor("Blurple")
 
        if (GuildID != '1091823921566851143') { // Put Your Guild ID Here
          return interaction.reply({
            embeds: [errEmbed],
            ephemeral: true
          }).catch(err => {
            return;
        });
        };

        if (VerChannel != "1091823922284077157") { // Pur Verify Channel ID Here
            return interaction.reply({
                embeds: [wrongChannel],
                ephemeral: true
            }).catch(err => {
                return;
            });
        };

        if (interaction.member.roles.cache.has(verRole)) {
            return interaction.reply({
                embeds: [verifiedEmbed],
                ephemeral: true
            }).catch(err => {
                return;
            });
        };

        await interaction.member.roles.add(verRole).catch(err => {
            return;
        });;

        return interaction.reply({
            embeds: [successEmbed],
            ephemeral: true
        }).catch(err => {
            return;
        });

    }
}