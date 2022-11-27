const { getXXX, getPaheal, getE621, editXXX, editPaheal, editE621 } = require('../Tools/tagSearch')

async function get34xxx(message, args, interaction, itags) {
    if (interaction) {
        return getXXX(undefined, interaction, itags)
    } else {
        const tags = args.slice(1)
        return getXXX(message, undefined, tags)
    }
}

async function get34paheal(message, args, interaction, itags) {
    if (interaction) {
        return getPaheal(undefined, interaction, itags)
    } else {
        const tags = args.slice(1)
        return getPaheal(message, undefined, tags)
    }
}

async function gete621(message, args, interaction, itags) {
    if (interaction) {
        return getE621(undefined, interaction, itags)
    } else {
        const tags = args.slice(1)
        return getE621(message, undefined, tags)
    }
}

const { isModuleEnabled } = require('../Tools/get-data')

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "NSFW").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })

    if (!message.channel.nsfw) return message.reply({ content: "**:warning: This channel is not NSFW.**" });

    const newMessage = await message.reply({ content: '<a:loading2:900416595782926367> ** Finding an image...**' })

    if (args[0] === "xxx") {
        await get34xxx(message, args, undefined)
        newMessage.delete({ timeout: 2000 })
    } else if (args[0] === "paheal") {
        await get34paheal(message, args, undefined)
        newMessage.delete({ timeout: 2000 })
    } else if (args[0] === "e621") {
        await gete621(message, args, undefined)
        newMessage.delete({ timeout: 2000 })
    } else {
        newMessage.edit({ content: "**:information_source: Usage: rule34 <xxx/paheal/e621> <tags>**" });
    }
}

async function InteractionMain(interaction, website, tags) {
    const result = await isModuleEnabled(undefined, interaction, "NSFW").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })

    const guild = client.guilds.cache.get(interaction.guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(interaction.channelId)
    if (!channel) return

    if (!channel.nsfw) return interaction.reply({ content: "**:warning: This channel is not NSFW.**", ephemeral: true });

    if (!interaction.replied) await interaction.reply({ content: '<a:loading2:900416595782926367> ** Finding an image...**', ephemeral: false })

    if (website === "xxx") {
        get34xxx(undefined, undefined, interaction, tags)
    } else if (website === "paheal") {
        get34paheal(undefined, undefined, interaction, tags)
    } else if (website === "e621") {
        gete621(undefined, undefined, interaction, tags)
    } else {
        interaction.editReply({ content: "**:information_source: Usage: rule34 <xxx/paheal/e621> <tags>**", ephemeral: false });
    }
}

async function buttonInteractionMain(button, website, tags, messageid) {
    const result = await isModuleEnabled(undefined, button, "NSFW").catch(err => { console.log(err) })
    if (!result === true) return button.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })

    const guild = client.guilds.cache.get(button.guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(button.channelId)
    if (!channel) return

    if (!channel.nsfw) return button.editReply({ content: "**:warning: This channel is not NSFW.**", ephemeral: true });

    await button.reply({ content: '<a:loading2:900416595782926367> ** Finding an image...**', ephemeral: false })

    if (website === "rule34.xxx") {
        editXXX(button, tags, messageid)
    } else if (website === "rule34.paheal.net") {
        editPaheal(button, tags, messageid)
    } else if (website === "e621.net") {
        editE621(button, tags, messageid)
    } else {
        button.editReply({ content: "**:information_source: Usage: rule34 <xxx/paheal/e621> <tags>**", ephemeral: false });
    }
}

module.exports = {
    name: 'rule34',
    description: 'Finds an NSFW image from multiple websites!',
    execute(message, args, interaction, tags, website, messageid) {
        if (interaction) {
            if (interaction.isButton()) {
                buttonInteractionMain(interaction, website, tags, messageid)
            } else {
                InteractionMain(interaction, website[0], tags)
            }
        } else {
            MessageMain(message, args)
        }
    }
}