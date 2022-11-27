const dadjokes = require('dadjokes-wrapper');
const dj = new dadjokes();

const { isModuleEnabled } = require('../Tools/get-data')

async function InteractionMain(interaction) {
    const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })

    dj.randomJoke().then(result => {
        interaction.reply(result)
    }).catch(err => {
        console.log(err)
        interaction.reply({ content: ':x: **Looks like the dad is too tired to tell you some jokes :pensive:, please try again later.**', ephemeral: true })
    })
}

async function MessageMain(message) {
    const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })

    dj.randomJoke().then(result => {
        message.reply(result)
    }).catch(err => {
        console.log(err)
        message.reply({ content: ':x: **Looks like the dad is too tired to tell you some jokes :pensive:, please try again later.**' })
    })
}

module.exports = {
    name: 'dadjoke',
    description: "Some good ol' dad jokes!",
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction)
        } else {
            MessageMain(message)
        }
    }
}