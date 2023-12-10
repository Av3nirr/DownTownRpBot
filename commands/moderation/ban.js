const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, CommandInteraction, PermissionsBitField } = require('discord.js');
const path = require('node:path');
const { serverName } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un membre du serveur')
        .addUserOption(option => option
            .setName("utilisateur")
            .setDescription('Utilisateur à bannir')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('raison')
            .setDescription("Raison du bannissement")
            .setRequired(true)
        ),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
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

            try {
                await interaction.guild.members.ban(user.id, { reason: raison });

                const banEmbed = new EmbedBuilder()
                    .setTitle(`Ban`)
                    .setColor(0xFFC500)
                    .setDescription(`**${interaction.user.username}** vient de bannir **${user.username}** pour la raison suivante: \`${raison}\``)
                    .setTimestamp()
                    .setFooter({ text: serverName });

                await interaction.reply({ embeds: [banEmbed] });
            } catch (error) {
                console.error(error);
                return interaction.reply('Une erreur est survenue lors du bannissement de l\'utilisateur.');
            }
        }
    },
};
