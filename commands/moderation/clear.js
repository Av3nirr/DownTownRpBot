const { SlashCommandBuilder, CommandInteraction, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { serverName } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un certain nombre de messages du channel')
        .addIntegerOption(option => option
            .setName('number')
            .setDescription('Le nombre de messages à supprimer')
            .setRequired(true)
        ),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            const denyEmbed = new EmbedBuilder()
                .setTitle("Vous n'avez pas la permission !")
                .setColor(0xFF0000)
                .setDescription('Vous ne pouvez pas utiliser cette commande.')
                .setTimestamp()
                .setFooter({ text: serverName });
            return await interaction.reply({ embeds: [denyEmbed] });
        }

        const nombreMessages = interaction.options.getInteger('number');

        if (nombreMessages <= 0 || nombreMessages > 100) {
            return interaction.reply('Veuillez spécifier un nombre de messages entre 1 et 100.');
        }

        try {
            const messages = await interaction.channel.bulkDelete(nombreMessages, true);

            const clearEmbed = new EmbedBuilder()
                .setTitle('Messages supprimés avec succès')
                .setColor(0x00FF00)
                .setDescription(`**${nombreMessages}** messages ont été supprimés par **${interaction.user.username}**.`)
                .addFields({ name: 'Messages supprimés', value: messages.size.toString(), inline:true })
                .setTimestamp()
                .setFooter({ text: serverName });

            await interaction.reply({ embeds: [clearEmbed] });
        } catch (error) {
            console.error(error);
            return interaction.reply('Une erreur est survenue lors de la suppression des messages.');
        }
    },
};
