const { Client } = require("trace.moe");
const traceClient = new Client();

const { isModuleEnabled } = require('../Tools/get-data')

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
    if (!args[0]) return message.reply(":grey_question: **Please enter an image url to search.**")

    const newMessage = await message.reply({ content: '<a:loading2:900416595782926367> ** Working...**' })

    const searchResults = await traceClient.getSimilarFromURL(args[0]);
    if (!searchResults || !searchResults.result) return newMessage.edit({ content: ':x: **Could not find any animes with the given image url.**' })

    newMessage.edit({ content: `Anime: ` + searchResults.result[0].filename.replace(".mp4", "") + "\nEpisode: " + searchResults.result[0].episode })
}

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
    if (!args[0]) return interaction.reply({ content: ":grey_question: **Please enter an image url to search.**", ephemeral: true })

    await interaction.reply({ content: '<a:loading2:900416595782926367> ** Working...**' })

    const searchResults = await traceClient.getSimilarFromURL(args[0]);
    if (!searchResults || !searchResults.result) return interaction.editReply({ content: ':x: **Could not find any animes with the given image url.**' })

    interaction.editReply({ content: `Anime: ` + searchResults.result[0].filename.replace(".mp4", "") + "\nEpisode: " + searchResults.result[0].episode })
}

module.exports = {
    name: 'anime-source',
    description: 'Finds if an image is from an anime!',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    }
}