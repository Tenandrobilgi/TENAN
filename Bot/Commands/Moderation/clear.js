const Discord = require('discord.js')
const { isModuleEnabled } = require('../Tools/get-data')
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

// Excludes the command message from the rest of the messages that will be cleaned.
async function getFilteredMessages(message, args) {
    const messageArray = Array.from(await message.channel.messages.fetch({ limit: Number(args[0]) + 1 }))
    const filteredMessages = messageArray.filter(filteredMessage => filteredMessage[1] !== message)
    
    var filteredMArray = []

    filteredMessages.forEach(arr => {
        filteredMArray.push(arr[1])
    })

    return filteredMArray
}

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "MODERATION").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) return message.reply({ content: '**:x: You do not have any permissions to run this command.**' })
    if (!args[0] || Number(args[0]) <= 0) return message.reply({ content: ":x: **Please enter a valid amount.**" })

    const filteredMessages = await getFilteredMessages(message, args) // If you don't want the command message to be excluded, change this to: args[0]

    message.channel.bulkDelete(filteredMessages, true).then(messages => {
        message.channel.send({ content: `:broom: **Cleared ${messages.size} messages.**` }).then(async newMessage => {
            await wait(5000)
            newMessage.delete()
        })
    }).catch(err => {
        console.log(err)
        message.reply({ content: ":x: **An error occured while trying to clear the messages. Please check the bot's permissions and try again.**" })
    })
}

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "MODERATION").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: '**:x: You do not have any permissions to run this command.**', ephemeral: true })
    if (!args[0] || args[0] <= 0) return interaction.reply({ content: ":x: **Please enter a valid amount.**", ephemeral: true })

    interaction.channel.bulkDelete(args[0], true).then(messages => {
        interaction.reply({ content: `:broom: **Cleared ${messages.size} messages.**` }).then(async () => {
            await wait(5000)
            interaction.deleteReply()
        })
    }).catch(err => {
        console.log(err)
        interaction.reply({ content: ":x: **An error occured while trying to clear the messages. Please check the bot's permissions and try again.**", ephemeral: true })
    })
}

module.exports = {
    name: 'clear',
    description: 'Clears messages',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    }
}