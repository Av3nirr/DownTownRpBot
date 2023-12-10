const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { serverName, lockBypass } = require("../../config.json");


module.exports = {
    data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Bloque le channel !'),
    /**
     * @param {CommandInteraction} interaction
     */
	async execute(interaction) {
		if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)){
            const denyEmbed = new EmbedBuilder()
                .setTitle("Vous n'avez pas la permission !")
                .setColor(0xFF0000)
                .setDescription('Vous ne pouvez pas utiliser cette commande.')
                .setTimestamp()
                .setFooter({ text: serverName });
            return await interaction.reply({ embeds: [denyEmbed] });
        }else{
            let channel = interaction.channel
            channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
                ViewChannel: true,
                SendMessages: false,
                ReadMessageHistory: true,
                AttachFiles: false
            });
            const lockedEmbed = new EmbedBuilder()
                .setTitle("Channel fermé")
                .setColor(0xFF0000)
                .setDescription('Ce channel à été fermé. Vous ne pouvez plus envoyer de messages.')
                .setTimestamp()
                .setFooter({ text: serverName });
            const unlock = new ButtonBuilder()
                .setCustomId('unlock')
                .setLabel('Debloquer')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Danger);

		    const row = new ActionRowBuilder()
			    .addComponents(unlock);
            interaction.reply({embeds: [lockedEmbed], components: [row]})
        }
	},
};