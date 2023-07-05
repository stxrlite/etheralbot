const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const testSchema = require('../../Schemas.js/test');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('database')
    .setDescription('Checks Database Status'),
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
                console.log(data) // THIS CONSOLE LOGS THE DATA FROM THE DATABASE
                const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle("Database")
                .setDescription(`***The Database Is Online***`)
    
                await interaction.reply({ content: '', embeds: [embed], ephemeral: true}) 
            }
        })
    }
}

