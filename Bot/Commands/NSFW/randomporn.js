const Discord = require('discord.js')

const { isModuleEnabled } = require('../Tools/get-data')

const NSFW = require("discord-nsfw");
const nsfw = new NSFW();

async function createImageFromCategory(message, interaction, args) {
    const embed = new Discord.EmbedBuilder()

    if (args[0] === "gif") {
        const image = await nsfw.pgif();
        embed.setImage(image)
    } else if (args[0] === "hentaiass") {
        const image = await nsfw.hentaiass();
        embed.setImage(image)
    } else if (args[0] === "ass") {
        const image = await nsfw.ass();
        embed.setImage(image)
    } else if (args[0] === "pussy") {
        const image = await nsfw.pussy();
        embed.setImage(image)
    } else if (args[0] === "anal") {
        const image = await nsfw.anal();
        embed.setImage(image)
    } else if (args[0] === "boobs") {
        const image = await nsfw.boobs();
        embed.setImage(image)
    } else if (args[0] === "thigh") {
        const image = await nsfw.thigh();
        embed.setImage(image)
    } else if (args[0] === "lewd") {
        const image = await nsfw.lewd();
        embed.setImage(image)
    } else if (args[0] === "hentai") {
        const image = await nsfw.hentai();
        embed.setImage(image)
    } else if (args[0] === "boobs") {
        const image = await nsfw.boobs();
        embed.setImage(image)
    } else if (interaction) {
        return createInfoEmbed(undefined, interaction)
    } else {
        return createInfoEmbed(message)
    }

    if (interaction) {
        interaction.editReply({ content: "", embeds: [embed] })
    } else {
        message.reply({ content: "", embeds: [embed] })
    }
}

function createInfoEmbed(message, interaction) {
    const embed = new Discord.EmbedBuilder()
        .setTitle('NSFW Commands')
        .addFields([
            { name: 'Command Tags', value: `randomporn gif = Finds a random porn gif.\nrandomporn ass = Finds a random ass image.\nrandomporn pussy = Finds a random pussy image.\nrandomporn anal = Finds a random anal porn image.\nrandomporn boobs = Finds a random boobs image.\nrandomporn thigh = Finds a random thigh image.\nrandomporn lewd = Finds a random lewd image.\nrandomporn hentai = Finds a random hentai image.` },
            { name: 'Note : NSFW commands are disabled by default. You can enable NSFW by the settings command.', value: '** **' },
            { name: 'Configuration', value: `settings = The Bot's settings.` },
        ])
        .setFooter({ text: "Command Tags for randomporn" })

    if (interaction) {
        interaction.editReply({ content: "", embeds: [embed], ephemeral: true })
    } else {
        message.reply({ content: "", embeds: [embed] })
    }
}

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "NSFW")
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })

    if (!message.channel.nsfw) return message.reply({ content: "**:warning: This channel is not NSFW.**" });
    if (!args || !args[0]) return createInfoEmbed(message)

    const newMessage = await message.reply({ content: '<a:loading2:900416595782926367> ** Working...**' })

    await createImageFromCategory(message, undefined, args)
    newMessage.delete({ timeout: 2000 })
}

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "NSFW")
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })

    const guild = client.guilds.cache.get(interaction.guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(interaction.channelId)
    if (!channel) return

    if (!channel.nsfw) return interaction.reply({ content: "**:warning: This channel is not NSFW.**", ephemeral: true });

    await interaction.reply({ content: '<a:loading2:900416595782926367> ** Finding an image...**', ephemeral: false })

    if (!args || !args[0]) return createInfoEmbed(undefined, interaction)

    await createImageFromCategory(undefined, interaction, args)
}


module.exports = {
    name: "randomporn",
    description: "Finds a random porn image/gif.",
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    },
    async getAutoCompleteReturns(interaction) {
        const focusedValue = interaction.options.getFocused();
        const modules = ["gif", "ass", "pussy", "anal", "boobs", "thigh", "lewd", "hentai"]

        const filtered = modules.filter(choice => choice.startsWith(focusedValue));

        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }
}