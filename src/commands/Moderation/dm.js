const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const cooldown = new Set()
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send A Message Using To A Member Using The Bot')
    .addUserOption(option => option.setName('target').setDescription('The User To DM').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('The Message To Send').setRequired(true)),
    async execute(interaction, message, client) {
        const cT = 20 
        if (cooldown.has(interaction.author)) {
            interaction.reply({ content: `You are on a DM cooldown! Try again in ${cT} seconds`, ephemeral: true})
        } else {
            const dmUser = interaction.options.getUser('target');
            const dmMember = await interaction.guild.members.fetch(dmUser.id);
            const channel = interaction.channel;
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: 'Cannot Use Command', ephemeral: true})
            if (!dmMember) return await interaction.reply({ content: 'The user mentioned is no longer within the server.', ephemeral: true})
 
            let reason = interaction.options.getString('message');
            if (!reason) return await interaction.reply('You must type a message to send to this user!')
 
            await dmMember.send(`***You've Got Mail From:*** __${interaction.guild.name}__ : ${reason}`).catch(err => {
                return interaction.reply({ content: 'Cannot Send Message To This User', ephemeral: true})
            })
 
            const embed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`Sent **${dmUser.tag}** "${reason}"`)
 
            await interaction.reply({ embeds: [embed] })
 
            cooldown.add(interaction.author);
            setTimeout(() => {
                cooldown.delete(interaction.author)
            }, cT * 1000)  
        }
 
    },
}