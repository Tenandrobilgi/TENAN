const { isModuleEnabled } = require('../Tools/get-data')

module.exports = {
    name: "flip",
    description: 'Flip a coin!',
    async execute(message, args, interaction) {
        if (interaction) {
            const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
            if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
        } else {
            const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
            if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
        }

        const result = Math.floor(Math.random() * 2)
        if (result === 0) {
            if (interaction) {
                interaction.reply("Heads!")
            } else {
                message.reply(" Heads!")
            }
        }

        if (result === 1) {
            if (interaction) {
                interaction.reply("Tails!")
            } else {
                message.reply(" Tails!")
            }
        }
    }
}