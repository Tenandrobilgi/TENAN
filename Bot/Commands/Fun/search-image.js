const gis = require('g-i-s')

const scanMessage = require('../Tools/scan-message')
const { isModuleEnabled } = require('../Tools/get-data')

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })

    if (!args) return interaction.reply({ content: "**:x: Please enter at least one tag.**", ephemeral: true });
    if (!args[0]) return interaction.reply({ content: "**:x: Please enter at least one tag.**", ephemeral: true });

    const scanResult = await scanMessage.scanArgs(undefined, args, interaction)
    if (scanResult !== "CanSearchable") return interaction.reply({ content: "**:x: You can only search that in an NSFW channel, please try to search something else.**", ephemeral: true })

    await interaction.reply({ content: '<a:loading2:900416595782926367> ** Finding results...**' })

    gis(args.toString(), function (error, results) {
        if (error) {
            console.log(error);
        } else {
            const randomobj = results[Math.floor(Math.random() * results.length)];
            interaction.editReply({ content: '** **', files: [`${randomobj.url}`] })
        }
    });
}

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })

    if (!args) return message.reply({ content: "**:x: Please enter at least one tag.**" });
    if (!args[0]) return message.reply({ content: "**:x: Please enter at least one tag.**" });

    const scanResult = await scanMessage.scanArgs(message, args, undefined)
    if (scanResult !== "CanSearchable") return message.reply({ content: "**:x: You can only search that in an NSFW channel, please try to search something else.**" })

    const newMessage = await message.reply({ content: '<a:loading2:900416595782926367> ** Finding results...**' })

    gis(args.toString(), function (error, results) {
        if (error) {
            console.log(error);
        } else {
            const randomobj = results[Math.floor(Math.random() * results.length)];
            newMessage.edit({ content: '** **', files: [`${randomobj.url}`] })
        }
    });
}

module.exports = {
    name: 'search-image',
    description: 'Search for an image',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    }
}
