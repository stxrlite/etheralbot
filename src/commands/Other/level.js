const { SlashCommandBuilder, EmbedBuilder, Events, PermissionsBitField, Client, Partials, GatewayIntentBits } = require('discord.js');
const levelSchema = require("../../Schemas.js/levelSchema");
const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});


client.on(Events.MessageCreate, async (message, client) => {
 
    const { guild, author } = message;
 
    if (!guild || author.bot) return;
 
    levelSchema.findOne({ Guild: guild.id, User: author.id }, async (err, data) => {
 
        if (err) throw err;
 
        if (!data) {
            levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0
            })
        }
    })
 
    const channel = message.channel;
 
    const give = 1;
 
    const data = await levelSchema.findOne({ Guild: guild.id, User: author.id}).catch(err => {return;})
    if (!data) return;
 
    const requiredXP = data.Level * data.Level * 20 + 20;
 
    if (data.XP + give >= requiredXP) {
 
        data.XP += give 
        data.Level += 1
        await data.save()
 
        if (!channel) return;
 
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`Congrats ${author}, you have reached ${data.Level} level! <a:Giveaways:1052611718519459850>`)
            ]
        })
 
    } else {
        data.XP += give
        data.save()
    }
 
 
})
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('xp-leaderboard')
    .setDescription('This gets a servers xp leaderboard'),
    async execute(interaction) {
 
        const { guild, client } = interaction;
 
        let text = "";
 
        const embed1 = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`<:redcheck:1015276845077364848>  No one is on the leaderboard yet...`)
 
        const Data = await levelSchema.find({ Guild: guild.id})
            .sort({ 
                XP: -1,
                Level: -1
            })
            .limit(10)
 
            if (!Data) return await interaction.reply({ embeds: [embed1]})
 
            await interaction.deferReply()
 
            for(let counter = 0; counter < Data.length; ++counter) {
                let { User, XP, Level } = Data[counter]
 
                    const value = await client.users.fetch(User) || "Unknown Member"
 
                    const member = value.tag;
 
                    text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`
 
                    const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
                        .setDescription(`\`\`\`${text}\`\`\``)
                        .setTimestamp()
                        .setFooter({ text: `XP Leaderboard` })
 
                   interaction.editReply({ embeds: [embed] })
 
            } 
 
    }
}
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Gets a members level/rank')
    .addUserOption(option => option.setName('user').setDescription(`The member you want to check the rank of`).setRequired(false)),
    async execute(interaction, client) {
 
        const { options, user, guild } = interaction;
 
        const Member = options.getMember('user') || user;
 
        const member = guild.members.cache.get(Member.id);
 
        const Data = await levelSchema.findOne({ Guild: guild.id, User: member.id});
 
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`<:redcheck:1015276845077364848>  ${member} has not gained any XP yet`)
        if (!Data) return await interaction.reply({ embeds: [embed] })
 
        await interaction.deferReply();
 
        const Required = Data.Level * Data.Level * 20 + 20;
 
        const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ forceStatic: true }))
            .setBackground("IMAGE", "https://media.discordapp.net/attachments/978035586168418334/1055177852577910855/Sunset.jpg?width=645&height=484")
            .setCurrentXP(Data.XP)
            .setRequiredXP(Required)
            .setRank(1, "Rank", false)
            .setLevel(Data.Level, "Level")
            .setProgressBar("BLUE", "COLOR")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
 
        const Card = await rank.build();
 
        const attachment = new AttachmentBuilder(Card, { name: "rank.png"})
 
        const embed2 = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${member.user.username}'s Rank Card`)
        .setImage("attachment://rank.png")
 
        await interaction.editReply({ embeds: [embed2], files: [attachment] })
 
 
 
 
    }
}
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('xp-reset')
    .setDescription('Resets ALL of the server members xp & levels'),
    async execute(interaction, client) {
 
                const perm = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`<:redcheck:1015276845077364848>  You don't have permission to reset xp levels in this server`)
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })
 
                const { guildId } = interaction;
 
                const embed = new EmbedBuilder()
 
                levelSchema.deleteMany({ Guild: guildId}, async (err, data) => {
 
                    embed.setColor("Blue")
                    .setDescription(`<:orangecheck:1015276791889408070>  The xp system in your server has been reset`)
 
                    return interaction.reply({ embeds: [embed] });
                })
    }
}
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('xpuser-reset')
    .setDescription('Resets a server members XP & rank')
    .addUserOption(option => option.setName("user").setDescription(`The user you want to reset the xp of`).setRequired(true)),
    async execute(interaction, client) {
 
                const perm = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`<:redcheck:1015276845077364848>  You don't have permission to reset xp levels in this server`)
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })
 
                const { guildId } = interaction;
 
                const target = interaction.options.getUser('user')
 
                const embed = new EmbedBuilder()
 
                levelSchema.deleteMany({ Guild: guildId, User: target.id}, async (err, data) => {
 
                    embed.setColor("Blue")
                    .setDescription(`<:orangecheck:1015276791889408070>  ${target.tag}'s xp has been reset!`)
 
                    return interaction.reply({ embeds: [embed] });
                })
    }
}
