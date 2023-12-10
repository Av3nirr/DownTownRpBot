const { Events, GuildMember, EmbedBuilder } = require('discord.js');

const { welcomeChannel, serverName } = require('../config.json')

module.exports = {
	name: Events.GuildMemberRemove,
    /**
     * @param {GuildMember} member
     */
	async execute(member) {
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x55FF00)
            .setTitle(`👋 Au-revoir ${member.user.username} 👋`)
            .setThumbnail(member.user.avatarURL())
            .setDescription(`A bientôt sur le serveur ${member.user.username}. On espère tous te revoir un jour !`)
            .setTimestamp()
            .setFooter({ text: serverName });
		member.guild.channels.cache.get(welcomeChannel).send({ embeds: [welcomeEmbed] })
	},
};