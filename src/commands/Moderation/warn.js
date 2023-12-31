const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const warningSchema = require('../../Schemas.js/warnsSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns A Member')
    .addUserOption(option => option
        .setName('target')
        .setDescription('Who do you want to warn?')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("reason of the warn")
        .setRequired(true)),

    async execute (interaction) {
        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Blurple")
        .setDescription("Missing Permissions: Kick Members")
        .setTimestamp()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ embeds: [errEmbed], ephemeral: true});

        const { options, guildId, user } = interaction;

        const target = options.getUser('target');
        const reason = options.getString("reason");
        
        

        const userTag = `${target.username}#${target.discriminator}`;

        warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: target.tag}, async (err, data) => {

            if (err) throw err;

            if (!data) {
                data = new warningSchema({
                    GuildID: guildId,
                    UserID: target.id,
                    UserTag: userTag,
                    Content: [
                        {
                            ExecuterId: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason
                        }
                    ],
                }); 
            } else {
                const warnContent = {
                    ExecuterId: user.id,
                    ExecuterTag: user.tag,
                    Reason: reason
                }
                data.Content.push(warnContent);
            }
            data.save()
        });

        const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`:white_check_mark: You have been warned in ${interaction.guild.name} | For: ${reason}`)

        const embed2 = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(` :white_check_mark: ${target.tag} has been warned | For: ${reason} `)

        target.send({ embeds: [embed] }).catch(err => {
            return;
        })

        interaction.reply({ embeds: [embed2] })
    }
}