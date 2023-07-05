const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('trollwarn')
    .setDescription('Troll Warns A User')
    .addUserOption(option => option
        .setName('target')
        .setDescription('Target To Troll Warn')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("trollreason")
        .setRequired(true)),

    async execute (interaction) {
        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Blurple")
        .setDescription("Missing Permissions: Kick Members")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "Du kannst diesen Befehl nicht ausführen!", ephemeral: true});

        const { options, guildId, user } = interaction;

        const target = options.getUser('target');
        const reason = options.getString("reason");

        
        const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`:white_check_mark: You Have Been Troll Warned In ${interaction.guild.name} | For: ${reason}`)

        const embed2 = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(` :white_check_mark: ${target.tag} Was Troll Warned | For: ${reason} `)

        target.send({ embeds: [embed] }).catch(err => {
            return;
        })

        interaction.reply({ embeds: [embed2], ephemeral: true })
    }
}