const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Sets The Bots Status')
    .addStringOption(option => option.setName('status').setDescription('The status you want as the bots presence').setMaxLength(128).setRequired(true))
    .addStringOption(option => option.setName('type').setDescription('The type of status you want the bot to have').addChoices( { name: 'Watching', value: `${4}` }, { name: 'Playing', value: `${1}` }, { name: 'Listening', value: `${3}` }, { name: 'Competing', value: `${6}` }, { name: 'Streaming', value: `${2}` }).setRequired(true)),
    async execute (interaction, client) {

        const { options } = interaction;
        const status = options.getString('status');
        const type = options.getString('type');

        if (interaction.user.id != "345544931013558273") return await interaction.reply({ content: `No Permissions`, ephemeral: true}); // Put Your User ID Here
        else {

            client.user.setActivity({
                name: status,
                type: type-1,
                url: `https://discord.gg/dNyFCgPqHN`
            })

            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`:white_check_mark:  The bot now has the status \`${status}\`, with the type ${type-1}`)

            await interaction.reply({ embeds: [embed], ephemeral: true });

        }
    }
}