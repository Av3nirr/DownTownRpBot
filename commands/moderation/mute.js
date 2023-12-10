const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, CommandInteraction, PermissionsBitField } = require('discord.js');
const path = require('node:path');
const { serverName } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute un membre du serveur')
        .addUserOption(option => option
            .setName("utilisateur")
            .setDescription('Utilisateur à mute')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('raison')
            .setDescription("Raison du mute")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('duree')
            .setDescription("Durée du mute (en minutes)")
            .setRequired(true)
        )
        ,

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            const denyEmbed = new EmbedBuilder()
                .setTitle("Vous n'avez pas la permission !")
                .setColor(0xFF0000)
                .setDescription('Tu ne peux pas utiliser cette commande.')
                .setTimestamp()
                .setFooter({ text: serverName });
            await interaction.reply({ embeds: [denyEmbed] });
        } else {
            const userOption = interaction.options.getMember('utilisateur');

            if (!userOption) {
                return interaction.reply('L\'utilisateur spécifié n\'a pas été trouvé.');
            }

            const user = userOption.user;
            const raison = interaction.options.getString('raison');
            const duree = interaction.options.getInteger('duree')

            try {
                await interaction.guild.members.cache.get(user.id).timeout(duree*1000*60, raison)
                const kickedEmbed = new EmbedBuilder()
                    .setTitle(`Kick`)
                    .setColor(0xFFC500)
                    .setDescription(`**${interaction.user.username}** vient de mute **${user.username}**.`)
                    .addFields(
                        { name: 'Durée', value: duree.toString() + " minute(s)", inline: true },
                        { name: 'Raison', value: raison, inline: true }
                    )                    
                    .setTimestamp()
                    .setFooter({ text: serverName });

                await interaction.reply({ embeds: [kickedEmbed] });
            } catch (error) {
                console.error(error);
                return interaction.reply('Une erreur est survenue lors du mute de l\'utilisateur.');
            }
        }
    },
};
