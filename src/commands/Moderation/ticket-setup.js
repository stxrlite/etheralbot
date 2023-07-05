const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require("discord.js");
const ticketSchema = require("../../Schemas.js/ticketSchema");
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-setup")
        .setDescription("Sets Up The Ticket System")
        .addChannelOption(option => option.setName("channel").setDescription("The channel you want to set the ticket system up in").addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addChannelOption(option => option.setName("category").setDescription("The category you want to send the tickets in").addChannelTypes(ChannelType.GuildCategory).setRequired(true)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You must be an admin to set up tickets!", ephermeral: true })
 
        const channel = interaction.options.getChannel("channel")
        const category = interaction.options.getChannel("category")
 
        ticketSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
 
            if (!data) {
                ticketSchema.create({
                    Guild: interaction.guild.id,
                    Channel: category.id,
                    Ticket: "first"
                })
            } else {
                await interaction.reply({ content: "You already have a ticket system set up. You can run /ticket-disable to remove it and restart." })
                return;
            }
        })
 
        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Support Ticket")
            .setDescription("***Select A Topic To Open A Ticket***")
            .setFooter({ text: `${interaction.guild.name} tickets!` })
 
        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("select")
                    .setMaxValues(1)
                    .setPlaceholder("Select A Topic")
                    .addOptions(
                        {
                            label: "🛠️ General Support",
                            value: "Subject: General Support"
                        },
                        {
                            label: "🛠️ Moderation Support",
                            value: "Subject: Moderation Support"
                        },
                        {
                            label: "🛠️ Server Support",
                            value: "Subject: Server Support"
                        },
                        {
                            label: "🛠️ Other",
                            value: "Subject: Other"
                        },
                    )
            )
 
        await channel.send({ embeds: [embed], components: [menu] });
        await interaction.reply({ content: `Your ticket system has been set up in ${channel}` })
    }
}
