
const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js"); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban") 
        .setDescription(`Ban A Member`) 
        .addUserOption(option => option
                .setName("user")
                .setDescription(`The member you want to ban`)
                .setRequired(true)
        )
        .addStringOption(option => option
                .setName("reason")
                .setDescription(`Reason For Banning Member`)
                .setRequired(false)
        ),
    async execute (interaction) {

        
        const ID = interaction.member.id;
        const banUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason given!";

        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({content: "You Dont Have Permission To Ban Members", ephemeral: true});
        if (interaction.member.id === banUser) return await interaction.reply({content: "You Cant Ban Yourself!", ephemeral: true });

        
        const DM = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`:white_check_mark:  You have been banned from **${interaction.guild.name}** | Reason: ${reason}`);

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`:white_check_mark:  ${banUser.tag} has been banned | For: ${reason}`);

      
        interaction.guild.members.ban(banUser, {reason});

      
        banUser.send({ embeds: [DM] }).catch(err => {
            return;
        })

        
        await interaction.reply({ embeds: [embed] }).catch(err => {
            return;
        });
    }
};