const { Events, ButtonInteraction, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { serverName } = require('../config.json')

module.exports = {
	name: "unlock",
    /**
     * @param {ButtonInteraction} interaction
     */
	async execute(interaction) {
		if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)){
            const denyEmbed = new EmbedBuilder()
                .setTitle("Vous n'avez pas la permission !")
                .setColor(0xFF0000)
                .setDescription('Vous ne pouvez pas utiliser cette commande.')
                .setTimestamp()
                .setFooter({ text: serverName });
            return await interaction.reply({ embeds: [denyEmbed] });
        }else{
            const lockedEmbed = new EmbedBuilder()
                .setTitle("Channel réouvert")
                .setColor(0x61FF00)
                .setDescription('Ce channel à été réouvert. Vous pouvez à nouveau envoyer des messages.')
                .setTimestamp()
                .setFooter({ text: serverName });
            let channel = interaction.channel
            channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true
            });
            await interaction.reply({embeds: [lockedEmbed]})
            setTimeout(() => {
                interaction.message.delete()
                interaction.deleteReply()
            }, 5000);
        }
	},
};