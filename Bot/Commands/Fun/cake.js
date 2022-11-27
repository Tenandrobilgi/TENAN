const { isModuleEnabled } = require('../Tools/get-data')

module.exports = {
    name: "cake",
    description: "cake yes",
    async execute(message, args) {
        const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
        if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })

        message.reply({ content: 'cake yes', allowedMentions: { parse: [] } })
    }
}