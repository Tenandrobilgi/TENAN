const config = require('./../../../config.json')

module.exports = {
    name: 'shutdown',
    description: 'shutdowns the bot',
    execute(message, args) {
        if (message.author.id === config.PROTECTEDUSERID) {
            message.channel.send(":warning: **Shutting down...**").then(() => {
                client.destroy()
                process.exit()
            })
        } else {
            message.reply('**:x: Only The Developer can use this command.**')
        }
    }
}
