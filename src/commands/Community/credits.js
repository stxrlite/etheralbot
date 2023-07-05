const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const testSchema = require('../../Schemas.js/test');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Checks The Bots Credits'),
    async execute (interaction) {

        testSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                testSchema.create ({
                    GuildID: interaction.guild.id,
                    UserID: interaction.user.id
                })
            }

            if (data) {
                const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle("Made By - The VistaCloud Team")
                .setDescription(`***Purchase For Your Own Community -*** https://vistacloud.org`)
    
                await interaction.reply({ content: '', embeds: [embed], ephemeral: true}) 
            }
        })
    }
}