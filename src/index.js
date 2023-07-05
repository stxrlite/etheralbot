const { Client, channel, GatewayIntentBits, TextInputBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextInputStyle, ActionRowBuilder, ModalBuilder, EmbedBuilder, guildMemberAdd, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]});
const { Events } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const process = require('node:process')

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection At:', promise, 'reason', reason);    
})

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

// Auto Role System //
client.on(Events.GuildMemberAdd, async member => {
 
    const role = '1091823921600409676'; // Place Role ID Here (For Now You Can Only Do 1, It'll Be Released In v2)
    const giveRole = await member.guild.roles.cache.get(role);
 
    member.roles.add(giveRole);
})

// Welcome Message //
 
client.on(Events.GuildMemberAdd, async (member) => {
 
    const channelID = await db.get(`welchannel_${member.guild.id}`)
    const channelwelcome = member.guild.channels.cache.get(channelID)
 
    const embedwelcome = new EmbedBuilder()
     .setColor("Blurple")
     .setTitle('A New Has Has Arrived!')
     .setDescription( `> ***Welcome ${member} to the Sevrer!***`)
     .setFooter({ text: `👋 Get cozy and enjoy :)`})
     .setTimestamp()
     .setAuthor({ name: `👋 Welcome to the Server!`})
 
    if (channelID == null) return;
 
    const embedwelcomedm = new EmbedBuilder()
     .setColor("Blurple")
     .setTitle('Welcome Message')
     .setDescription( `> ***Welcome To ${member.guild.name}!***`)
     .setFooter({ text: `👋 Get cozy and enjoy :)`})
     .setTimestamp()
     .setAuthor({ name: `👋 Welcome to the Server!`})
 
    if (channelID == null) return;
 
    channelwelcome.send({ embeds: [embedwelcome]})
    member.send({ embeds: [embedwelcomedm]})
})

// Ticket System //

const ticketSchema = require("./Schemas.js/ticketSchema");
client.on(Events.InteractionCreate, async interaction => {

 
    if (interaction.isButton()) return;
    if (interaction.isChatInputCommand()) return;
 
    const modal = new ModalBuilder()
        .setTitle("Provide us with more information.")
        .setCustomId("modal")
 
    const email = new TextInputBuilder()
        .setCustomId("email")
        .setRequired(true)
        .setLabel("Provide us with your email.")
        .setPlaceholder("You must enter a valid email")
        .setStyle(TextInputStyle.Short)
 
    const username = new TextInputBuilder()
        .setCustomId("username")
        .setRequired(true)
        .setLabel("Provide us with your username please.")
        .setPlaceholder("Username")
        .setStyle(TextInputStyle.Short)
 
    const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setRequired(true)
        .setLabel("The reason for this ticket?")
        .setPlaceholder("Give us a reason for opening this ticket")
        .setStyle(TextInputStyle.Short)
 
    const firstActionRow = new ActionRowBuilder().addComponents(email)
    const secondActionRow = new ActionRowBuilder().addComponents(username)
    const thirdActionRow = new ActionRowBuilder().addComponents(reason)
 
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
 
    let choices;
    if (interaction.isSelectMenu()) {
 
        choices = interaction.values;
 
        const result = choices.join("");
 
        ticketSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
 
            const filter = { Guild: interaction.guild.id };
            const update = { Ticket: result };
 
            ticketSchema.updateOne(filter, update, {
                new: true
            }).then(value => {
                console.log(value)
            })
        })
    }
 
    if (!interaction.isModalSubmit()) {
        interaction.showModal(modal)
    }
})
 
client.on(Events.InteractionCreate, async interaction => {
 
    if (interaction.isModalSubmit()) {
 
        if (interaction.customId == "modal") {
 
            ticketSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
 
                const emailInput = interaction.fields.getTextInputValue("email")
                const usernameInput = interaction.fields.getTextInputValue("username")
                const reasonInput = interaction.fields.getTextInputValue("reason")
 
                const posChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username}`);
                if (posChannel) return await interaction.reply({ content: `You already have a ticket open - ${posChannel}`, ephemeral: true });
 
                const category = data.Channel;
 
                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`${interaction.user.username}'s Ticket`)
                    .setDescription("Welcome to your ticket! Please wait while the staff team review the details.")
                    .addFields({ name: `Email`, value: `${emailInput}` })
                    .addFields({ name: `Username`, value: `${usernameInput}` })
                    .addFields({ name: `Reason`, value: `${reasonInput}` })
                    .addFields({ name: `Type`, value: `${data.Ticket}` })
                    .setFooter({ text: `${interaction.guild.name}'s tickets.` })
 
                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticket")
                            .setLabel("🗑️ Close Ticket")
                            .setStyle(ButtonStyle.Danger)
                    )
 
                    let channel = await interaction.guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: `${category}`
    
                })

                channel.permissionOverwrites.create(interaction.user.id, { ViewChannel: true });
 
                let msg = await channel.send({ embeds: [embed], components: [button] });
                await interaction.reply({ content: `Your ticket is now open ${channel}.`, ephemeral: true });
 
                const collector = msg.createMessageComponentCollector()
 
                collector.on("collect", async i => {
                    await channel.delete();
 
                    const dmEmbed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle("Ticket Closed")
                        .setDescription("*Thanks for contacting us! If you need anything else feel free to open up another ticket!*")
                        .setTimestamp()
 
                    await interaction.emember.send({ embeds: [dmEmbed] }).catch(err => {
                        return;
                    })
                })
            })
        }
    }
})

// AFK System //
 
const afkSchema = require('./Schemas.js/afkschema');
 
client.on(Events.MessageCreate, async (message) => {
 
    if (message.author.bot) return;
 
    const afkcheck = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (afkcheck) {
        const nick = afkcheck.Nickname;
 
        await afkSchema.deleteMany({
            Guild: message.guild.id,
            User: message.author.id
        })
 
        await message.member.setNickname(`${nick}`).catch(Err => {
            return;
        })
 
        const m1 = await message.reply({ content: `Hey, you are **back**!`, ephemeral: true})
        setTimeout(() => {
            m1.delete();
        }, 4000)
    } else {
 
        const members = message.mentions.users.first();
        if (!members) return;
        const afkData = await afkSchema.findOne({ Guild: message.guild.id, User: members.id })
 
        if (!afkData) return;
 
        const member = message.guild.members.cache.get(members.id);
        const msg = afkData.Message;
 
        if (message.content.includes(members)) {
            const m = await message.reply({ content: `${member.user.tag} is currently AFK, let's keep it down.. \n> **Reason**: ${msg}`, ephemeral: true});
            setTimeout(() => {
                m.delete();
                message.delete();
            }, 4000)
        }
    }
})

