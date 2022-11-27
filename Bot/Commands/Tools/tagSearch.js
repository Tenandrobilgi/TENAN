// Import Modules

const Discord = require('discord.js')
const Booru = require('booru');

const bannedTags = ["loli", "floppa", "to_love-ru_darkness", "to_love-ru", "shit", "poop", "fart", "scat"]

////// Internal Functions

function errorMessage(interaction, message, errorType) {
    if (interaction) {
        if (errorType === "Blacklisted") return interaction.editReply({ content: ':x: **This tag is blacklisted, please try to search another tag or try again.**' })
        if (errorType === "NoPostFound") return interaction.editReply({ content: "**:grey_question: Cannot find an image with the tag.**", ephemeral: false });
        if (errorType === "Error") return interaction.editReply({ content: "**:warning: An error occured, please try again.**", ephemeral: false })
        if (errorType === "BooruError") return interaction.editReply({ content: "**:warning: There was an error with the package. Please contact the Developer.**", ephemeral: false })
    } else if (message) {
        if (errorType === "Blacklisted") return message.reply({ content: ':x: **This tag is blacklisted, please try to search another tag or try again.**' })
        if (errorType === "NoPostFound") return message.reply({ content: "**:grey_question: Cannot find an image with the tag.**" });
        if (errorType === "Error") return message.reply({ content: "**:warning: An error occured, please try again.**" })
        if (errorType === "BooruError") return message.reply({ content: "**:warning: There was an error with the package. Please contact the Developer.**" })
    } else {
        return false
    }
}

function returnPostLink(website, id) {
    if (!website || !id) return false

    if (website == "rule34.xxx") {
        return `https://rule34.xxx/index.php?page=post&s=view&id=${id}`
    } else if (website == "rule34.paheal.net") {
        return `https://rule34.paheal.net/post/view/${id}`
    } else if (website == "e621.net") {
        return `https://e621.net/posts/${id}`
    }

    return false
}

/// Post creation and editing

// Edits a post message 
function editPostWithVideo(post, interaction, messageId, website, tags, responseMessage) {
    const guild = client.guilds.cache.get(interaction.guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(interaction.channelId)
    if (!channel) return

    var content = '**Video URL:**'
    if (responseMessage && typeof (responseMessage) == "string") content = responseMessage

    client.channels.cache.get(channel.id).messages.fetch(messageId).then(async message => {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Link)
                    .setLabel('Post Page')
                    .setURL(returnPostLink(website, post.id)),

                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji("🔁")
                    .setCustomId(`${interaction.user.id}-${website}-${tags}`)
            );

        message.edit({ content: `${content}\n${post.fileUrl}`, embeds: [], components: [row] })
        interaction.deleteReply()
        return
    }).catch(error => { console.log(error) })
}

// Edits a post embed 
function editPost(post, interaction, messageId, website, tags, responseMessage) {
    var content = '** **'
    if (responseMessage && typeof (responseMessage) == "string") content = responseMessage

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel('Post Page')
                .setURL(returnPostLink(website, post.id)),

            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji("🔁")
                .setCustomId(`${interaction.user.id}-${website}-${tags}`)
        );

    const guild = client.guilds.cache.get(interaction.guildId)
    if (!guild) return

    const channel = guild.channels.cache.get(interaction.channelId)
    if (!channel) return

    client.channels.cache.get(channel.id).messages.fetch(messageId).then(async message => {
        const embed = new Discord.EmbedBuilder()
            .setImage(post.fileUrl)
            .setFooter({ text: website })

        await message.edit({ content: content, embeds: [embed], components: [row] })

        interaction.deleteReply()
    }).catch(error => { console.log(error) })
}

// Sends a message with the post URL (Since discord does not support videos in embeds)
function createPostWithVideo(post, message, interaction, website, tags, buttonsEnabled, responseMessage) {
    if (tags.includes("-")) {
        tags = tags.replace("-", "§")
    }

    var content = '**Video URL:**'
    if (responseMessage && typeof (responseMessage) == "string") content = responseMessage

    if (buttonsEnabled == undefined || buttonsEnabled) {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Link)
                    .setLabel('Post Page')
                    .setURL(returnPostLink(website, post.id)),

                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji("🔁")
                    .setCustomId(`${interaction.user.id}-${website}-${tags}`)
            );

        if (interaction) {
            interaction.editReply({ content: `${content}\n${post.fileUrl}`, embeds: [], components: [row] })
        } else {
            message.reply({ content: `${content}\n${post.fileUrl}\n**Tags:**\n${result[1]}`, embeds: [], components: [row] })
        }
    } else {
        if (interaction) {
            interaction.editReply({ content: `${content}\n${post.fileUrl}`, embeds: [] })
        } else {
            message.reply({ content: `${content}\n${post.fileUrl}\n**Tags:**\n${result[1]}`, embeds: [] })
        }
    }
    return
}

// Creates an embed for a post and then sends it
async function createPost(post, message, interaction, website, tags, buttonsEnabled, responseMessage) {
    var userId
    if (interaction) {
        userId = interaction.user.id
    } else {
        userId = message.author.id
    }
    if (!userId) return false

    var content = ''
    if (responseMessage && typeof (responseMessage) == "string") content = responseMessage

    tags = tags.join(" ")

    if (tags.includes("-")) {
        tags = tags.replace(/-/g, '§')
    }

    const embed = new Discord.EmbedBuilder()
        .setImage(post.fileUrl)
        .setFooter({ text: website })

    if (buttonsEnabled == undefined || buttonsEnabled) {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Link)
                    .setLabel('Post Page')
                    .setURL(returnPostLink(website, post.id)),

                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji("🔁")
                    .setCustomId(`${userId}-${website}-${tags}`)
            );

        if (interaction) {
            interaction.editReply({ content: content, embeds: [embed], components: [row] });
        } else {
            message.channel.send({ content: content, embeds: [embed], components: [row] });
        }
    } else {
        if (interaction) {
            interaction.editReply({ content: content, embeds: [embed] });
        } else {
            message.channel.send({ content: content, embeds: [embed] });
        }
    }
}

// Returns an array of posts without creating a message. (No restrictions)
function rawSearch(tags, website) {
    if (!website || !tags) return false

    Booru.search(website, tags, { limit: 1, random: true }).then(posts => {
        if (!posts || posts.length == 0) return "NoPostsFound"
        return posts
    })
}

// Finds a random post from the tags and website and builds them into a message.
function getRandomPost(message, interaction, tags, website, buttonsEnabled, responseMessage) {
    if (!website || !tags) return false

    var bannedTag = false

    for (let i in tags) {
        for (let a in bannedTags) {
            if (tags[i].toLowerCase() === bannedTags[a]) {
                bannedTag = true
            }
        }
    }

    if (interaction) {
        if (bannedTag) return errorMessage(interaction, undefined, "Blacklisted")
    } else {
        if (bannedTag) return errorMessage(undefined, message, "Blacklisted")
    }

    console.log([...tags])

    Booru.search(website, [...tags], { limit: 1, random: true })
        .then(posts => {
            if (!posts || posts.length == 0) {
                if (interaction) {
                    return errorMessage(interaction, undefined, "NoPostFound")
                } else {
                    return errorMessage(undefined, message, "NoPostFound")
                }
            }

            for (let post of posts) {
                if (post.fileUrl.includes("mp4")) {
                    createPostWithVideo(post, message, interaction, website, tags, buttonsEnabled, responseMessage)
                    continue
                }
                createPost(post, message, interaction, website, tags, buttonsEnabled, responseMessage)
            }
        })
        .catch(err => {
            if (err instanceof Booru.BooruError) {
                console.error(err)
                if (interaction) {
                    errorMessage(interaction, undefined, "Error")
                } else {
                    errorMessage(undefined, message, "Error")
                }

            } else {
                console.error(err)
                if (interaction) {
                    errorMessage(interaction, undefined, "BooruError")
                } else {
                    errorMessage(undefined, message, "BooruError")
                }
            }
        })
}

// Edits a message from an interaction with the given message id.
async function editMessageFromInteraction(interaction, tags, messageId, website, responseMessage) {
    if (!interaction || !website) return false

    const tagsArray = tags.split(" ")
    const tempTagsArray = tags.split(" ")

    const fTag = tempTagsArray.filter(tag => tag.includes("§"))
    if (fTag) {
        fTag.forEach(tag => {
            const arrayIndex = tempTagsArray.indexOf(tag)

            tempTagsArray[arrayIndex] = tag.replace("§", "-")
        })
    }

    Booru.search(website, [...tempTagsArray], { limit: 1, random: true }).then(async posts => {
        if (!posts || posts.length == 0) {
            await errorMessage(interaction, undefined, "NoPostFound")
            setTimeout(() => interaction.deleteReply(), 2000)
        }

        for (let post of posts) {
            if (post.fileUrl.includes("mp4")) {
                editPostWithVideo(post, interaction, messageId, website, tagsArray.join(" "))
                continue
            }

            editPost(post, interaction, messageId, website, tagsArray.join(" "), responseMessage)
        }
    })
}

////// External Methods

function getXXX(message, interaction, tags, buttonsEnabled, responseMessage) {
    return getRandomPost(message, interaction, tags, "rule34.xxx", buttonsEnabled, responseMessage)
}

function getPaheal(message, interaction, tags, buttonsEnabled, responseMessage) {
    return getRandomPost(message, interaction, tags, "rule34.paheal.net", buttonsEnabled, responseMessage)
}

function getE621(message, interaction, tags, buttonsEnabled, responseMessage) {
    return getRandomPost(message, interaction, tags, "e621.net", buttonsEnabled, responseMessage)
}

function editXXX(interaction, tags, messageId, responseMessage) {
    return editMessageFromInteraction(interaction, tags, messageId, "rule34.xxx", responseMessage)
}

function editPaheal(interaction, tags, messageId, responseMessage) {
    return editMessageFromInteraction(interaction, tags, messageId, "rule34.paheal.net", responseMessage)
}

function editE621(interaction, tags, messageId, responseMessage) {
    return editMessageFromInteraction(interaction, tags, messageId, "e621.net", responseMessage)
}

function getBannedTags() {
    return bannedTags
}

module.exports = {
    getXXX,
    getPaheal,
    getE621,
    editXXX,
    editPaheal,
    editE621,
    rawSearch,
    getBannedTags
}