const Discord = require('discord.js')

const { getXXX, getPaheal, getE621 } = require('../Tools/tagSearch')
const { isModuleEnabled } = require('../Tools/get-data')

/// For reason formatting

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

/* Tags: 
    { name: "", tags: [], response: "", ignore: [] } 

    name: the name of the action.
    tags: the tags that will be searched. (max is 3)
    response: the message that will be shown to the user. ({0}: the user that executed the command, {1}: the target)
    ignore: the websites that will be ignored when searching tags. (note: paheal sucks ass)
*/

const validTags = [
    { name: "suck", tags: ["suck", "animated"], response: "{0} sucked {1}'s cock~", ignore: ["rule34.paheal.net"] },
    { name: "fuck", tags: ["sex", "animated"], response: "{0} fucked {1}~", ignore: ["rule34.paheal.net"] },
    { name: "kiss", tags: ["kissing", "animated"], response: "{0} kissed {1}!", ignore: ["rule34.paheal.net"] },
    { name: "finger", tags: ["fingering", "animated"], response: "{0} fingered {1}~", ignore: ["rule34.paheal.net"] }, // kid named finger
    { name: "lick", tags: ["licking", "ass", "animated"], response: "{0} licked {1}'s ass~", ignore: ["rule34.paheal.net"] },
    { name: "cum", tags: ["cum_on_face", "animated"], response: "{0} came on {1}'s face!", ignore: ["rule34.paheal.net"] },
    { name: "spank", tags: ["spanking", "ass", "animated"], response: "{0} spanked {1}'s ass!", ignore: ["rule34.paheal.net"] },
    { name: "tease", tags: ["teasing", "animated"], response: "{0} is teasing {1}~", ignore: ["rule34.paheal.net"] },
    { name: "hardcore", tags: ["hardcore", "animated"], response: "{0} had hardcore sex with {1}~", ignore: ["rule34.paheal.net"] },
    { name: "impregnate", tags: ["impregnation", "animated"], response: "{0} impregnated {1}~ <3", ignore: ["rule34.paheal.net"] },
]

async function get34xxx(message, interaction, tags, responseMessage) {
    if (interaction) {
        return getXXX(undefined, interaction, tags, false, responseMessage)
    } else {
        return getXXX(message, undefined, tags, false, responseMessage)
    }
}

async function get34paheal(message, interaction, tags, responseMessage) {
    if (interaction) {
        return getPaheal(undefined, interaction, tags, false, responseMessage)
    } else {
        return getPaheal(message, undefined, tags, false, responseMessage)
    }
}

async function gete621(message, interaction, tags, responseMessage) {
    if (interaction) {
        return getE621(undefined, interaction, tags, false, responseMessage)
    } else {
        return getE621(message, undefined, tags, false, responseMessage)
    }
}

function createInfoEmbed(message, interaction) {
    const embed = new Discord.EmbedBuilder()
        .setTitle('NSFW Commands')
        .addFields([
            { name: 'Command Tags', value: `sex suck <user/name> = Suck someone.\nsex fuck <user/name> = Fuck someone.\nsex kiss <user/name> = Kiss someone.\nsex finger <user/name> = Finger someone.\nsex lick <user/name> = Lick someone.\nsex cum <user/name> = Cum on someone.\nsex spank <user/name> = Spank someone.\nsex tease <user/name> = Tease someone.\nsex hardcore <user/name> = Have hardcore sex with someone.\nsex impregnate <user/name> = Impregnate someone.` },
            { name: 'Note : NSFW commands are disabled by default. You can enable NSFW by the settings command.', value: '** **' },
            { name: 'Configuration', value: `settings = The Bot's settings.` },
        ])
        .setFooter({ text: "Command Tags for sex" })

    if (interaction) {
        interaction.reply({ content: "", embeds: [embed], ephemeral: true })
    } else {
        message.reply({ content: "", embeds: [embed] })
    }
}

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "NSFW").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })

    const guild = client.guilds.cache.get(interaction.guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(interaction.channelId)
    if (!channel) return

    if (!channel.nsfw) return interaction.reply({ content: "**:warning: This channel is not NSFW.**", ephemeral: true });

    if (!args) return createInfoEmbed(undefined, interaction)
    if (!args[0]) return createInfoEmbed(undefined, interaction)
    if (!args[1]) return interaction.reply({ content: ':grey_question: ** Please enter a user/name.**', ephemeral: true })

    await interaction.reply({ content: '<a:loading2:900416595782926367> ** Working...**', ephemeral: false })

    const action = validTags.find(t => t.name === args[0])
    if (!action) return createInfoEmbed(undefined, interaction)

    const responseMessage = String.format(action.response, interaction.member.user.username, `<@${args[1]}>`)

    async function getRandomWebsite() {
        const randomNum = Math.floor(Math.random() * 3)

        if (randomNum == 0 && !action.ignore.includes("rule34.xxx")) {
            await get34xxx(undefined, interaction, [...action.tags], responseMessage)
        } else if (randomNum == 1 && !action.ignore.includes("rule34.paheal.net")) {
            await get34paheal(undefined, interaction, [...action.tags], responseMessage)
        } else if (randomNum == 2 && !action.ignore.includes("e621.net")) {
            await gete621(undefined, interaction, [...action.tags], responseMessage)
        } else {
            getRandomWebsite()
        }
    }
    getRandomWebsite()
}

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "NSFW").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })

    if (!message.channel.nsfw) return message.reply({ content: "**:warning: This channel is not NSFW.**" });

    if (!args) return createInfoEmbed(message)
    if (!args[0]) return createInfoEmbed(message)
    if (!args[1]) return message.reply(':grey_question: ** Please enter a user/name.**')

    const newMessage = await message.reply({ content: '<a:loading2:900416595782926367> ** Working...**' })

    const action = validTags.find(t => t.name === args[0])
    if (!action) return createInfoEmbed(message)

    const responseMessage = String.format(action.response, message.author, args[1])

    async function getRandomWebsite() {
        const randomNum = Math.floor(Math.random() * 3)

        if (randomNum == 0 && !action.ignore.includes("rule34.xxx")) {
            await get34xxx(message, undefined, [...action.tags], responseMessage)
            newMessage.delete({ timeout: 2000 })
        } else if (randomNum == 1 && !action.ignore.includes("rule34.paheal.net")) {
            await get34paheal(message, undefined, [...action.tags], responseMessage)
            newMessage.delete({ timeout: 2000 })
        } else if (randomNum == 2 && !action.ignore.includes("e621.net")) {
            await gete621(message, undefined, [...action.tags], responseMessage)
            newMessage.delete({ timeout: 2000 })
        } else {
            getRandomWebsite()
        }
    }
    getRandomWebsite()
}


module.exports = {
    name: 'sex',
    description: 'Have sex with someone!',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    },
    async getAutoCompleteReturns(interaction) {
        const focusedValue = interaction.options.getFocused();
        const filtered = validTags.filter(choice => choice.name.startsWith(focusedValue));

        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.name })),
        );
    }
}