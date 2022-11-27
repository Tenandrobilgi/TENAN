const Discord = require('discord.js');

const { isModuleEnabled } = require('../Tools/get-data')

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
    if (!args[0]) return message.reply({ content: ':grey_question: **Please enter a name or mention a user.**' })

    var randomnumber = Math.floor(Math.random() * 100);
    const embed = new Discord.EmbedBuilder()
        .addFields([{ name: "**Simp Rate**", value: `${message.author.username} is a ${randomnumber}% simp for ${args[0]}!` }])

    message.reply({ embeds: [embed] })
}

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
    if (!args[0]) return interaction.reply({ content: ':grey_question: **Please enter a name or mention a user.**', ephemeral: true })

    var randomnumber = Math.floor(Math.random() * 100);
    const embed = new Discord.EmbedBuilder()
        .addFields([{ name: "**Simp Rate**", value: `${interaction.user.username} is a ${randomnumber}% simp for <@${args[0]}>!` }])

    interaction.reply({ embeds: [embed] })
}

module.exports = {
    name: 'simp-rate',
    description: 'Show your friends how much of a simp you are!',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    }
}
