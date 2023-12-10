const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, CommandInteraction, PermissionsBitField } = require('discord.js');
const path = require('node:path');
const { serverName } = require("../../config.json");
const bdd = require("../../bdd.json");
const fs = require('fs')

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) console.log("Une erreur est survenue !")
  });
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Avertir un membre du serveur')
        .addUserOption(option => option
            .setName("utilisateur")
            .setDescription('Utilisateur à avertir')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('raison')
            .setDescription("Raison de l'avertissement")
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
            if(!bdd["warns"][user.id]){
                warnedTimes = 1
            }else{
                warnedTimes = bdd["warns"][user.id] + 1
            }
            
            const warnEmbed = new EmbedBuilder()
                .setTitle(`Warn`)
                .setColor(0xFFC500)
                .setDescription(`**${interaction.user.username}** vient de warn **${user.username}** pour la raison: ${raison}.`)
                .addFields(
                    {name: "Nombre de warns:", value: warnedTimes.toString(), inline:true}

                )
                .setTimestamp()
                .setFooter({ text: serverName });
                bdd["warns"][user.id] = warnedTimes
                Savebdd()
            await interaction.reply({ embeds: [warnEmbed] });
    }
    },
};
