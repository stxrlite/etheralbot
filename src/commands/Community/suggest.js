const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Make A Suggestion")
    .addStringOption(option => option
        .setName("suggestion")
        .setDescription("The suggestion")
        .setRequired(true)
    ),

    async execute (interaction, client) {

        const suggestion = interaction.options.getString("suggestion");
        const userx = interaction.user.id;

        const embed = new EmbedBuilder()
        .setTitle("NEW SUGGESTION!")
        .setColor("Blurple")
        .addFields({ name:"User: ", value:`<@${userx}>`, inline: false})
        .setDescription(`${suggestion}`)
        .setTimestamp()
        
        const xEmbed = new EmbedBuilder()
        .setTitle("You send us a suggestion!")
        .setDescription(`${suggestion}`)
        .setColor("Blurple")

        const channel = client.channels.cache.get('1121518702832132217'); // Change To The Channel ID

        channel.send({
            embeds: [embed]
        }).catch(err => {
            return;
        });

        return interaction.reply({ embeds: [xEmbed], ephemeral: true}).catch(err => {
            return;
        });

        
    }
}