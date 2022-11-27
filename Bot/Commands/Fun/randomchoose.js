const { isModuleEnabled } = require('../Tools/get-data')

module.exports = {
    name: 'randomchoose',
    description: 'Randomly selects an item from the given items',
    async execute(message, args, interaction) {
        if (interaction) {
            const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
            if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
        } else {
            const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
            if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
        }

        if (!args[0] && message) return message.reply(":information_source: ** Usage: randomchoose [item1] [item2]**")
        if (!args[1] && message) return message.reply(":information_source: ** Usage: randomchoose [item1] [item2]**")

        const randomelements = [args[0], args[1]]
        const randomelement = randomelements[Math.floor(Math.random() * randomelements.length)]

        if (interaction) {
            interaction.reply(randomelement)
        } else {
            message.reply(randomelement)
        }
    }
}