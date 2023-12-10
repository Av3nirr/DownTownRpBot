const { Events, GuildMember, EmbedBuilder } = require('discord.js');

const { welcomeChannel, serverName, rulesChannel } = require('../config.json')

module.exports = {
	name: Events.GuildMemberAdd,
    /**
     * @param {GuildMember} member
     */
	async execute(member) {
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x55FF00)
            .setTitle(`👋 Bienvenue ${member.user.username} 👋`)
            .setThumbnail(member.user.avatarURL())
            .setDescription(`Bienvenue sur le serveur ${member.user.username}. Va tout de suite lire le <#${rulesChannel}> ! Bon jeu sur le serveur.`)
            .setTimestamp()
            .setFooter({ text: serverName });
		member.guild.channels.cache.get(welcomeChannel).send({ embeds: [welcomeEmbed] })
	},
};