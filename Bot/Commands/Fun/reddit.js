const Discord = require('discord.js');
const nraw = require("nraw");
const Reddit = new nraw("TENAN");

const scanMessage = require('../Tools/scan-message')
const { isModuleEnabled } = require('../Tools/get-data')

function createHelpEmbed(message, interaction) {
    const embed = new Discord.EmbedBuilder()
        .setTitle('Reddit')
        .addFields([
            { name: 'Command Tags', value: 'reddit random-search [args] = Gets a random post from all the subreddits with the given arguments.\nreddit random = Gets a random thread/post.\nreddit getpost [subreddit] [id] = Gets a post with the given id.' },
            { name: 'Configuration', value: "settings = The Bot's settings." }
        ])

    if (message) {
        message.reply({ embeds: [embed] })
    } else {
        interaction.reply({ embeds: [embed] })
    }
}

async function createEmbed(post, message, interaction) {
    let permalink = post.data.permalink;
    let memeUrl = `https://reddit.com${permalink}`;
    let memeImage = post.data.thumbnail;
    let memeTitle = post.data.title;
    let memeUpvotes = post.data.ups;
    let memeDownvotes = post.data.downs;
    let memeNumComments = post.data.num_comments;

    if (memeTitle.length > 256) return

    const embed = new Discord.EmbedBuilder()
        .setTitle(`${memeTitle}`)
        .setURL(`${memeUrl}`)
        .setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}` })

    if (memeImage) {
        if (memeImage === 'self' || memeImage === 'default' || memeImage === 'spoiler') {
            embed.setImage(post.data.url)
        } else {
            embed.setImage(memeImage)
        }
    } else {
        embed.setImage(post.data.url)
    }

    if (interaction) {
        await interaction.editReply({ content: '** **', embeds: [embed] }).catch(err => { console.log(err) });
    } else {
        await message.reply({ embeds: [embed] }).catch(err => { console.log(err) });
    }
}

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
    if (!args[0]) return createHelpEmbed(message)

    const newMessage = await message.reply({ content: '<a:loading2:900416595782926367> ** Working...**' })

    if (args[0] === "random-search") {
        if (!args[1]) return newMessage.edit({ content: ":x: **Please enter something to search.**" })

        if (!await scanMessage.scanArgs(message, args) === "CanSearchable") return message.reply("**:x: You can only search that in an NSFW channel, please try to search something else.**")

        var searchArgs = args.slice(1).join(' ')

        Reddit.search(searchArgs).exec(async function (data) {
            var post = data.data.children[Math.floor(Math.random() * data.data.children.length)];
            await createEmbed(post, message)
        })
    }
    if (args[0] === "random") {
        Reddit.random().exec(async function (data) {
            var post = data[0].data.children[0]
            await createEmbed(post, message)
        })
    }
    if (args[0] === "getpost") {
        if (!args[1]) return newMessage.edit({ content: ":x: **Please enter a subreddit.**" })
        if (!args[2]) return newMessage.edit({ content: ":x: **Please enter an id to search.**" })

        Reddit.subreddit(args[1]).post(args[2]).exec(async function (data) {
            if (!data) return newMessage.edit({ content: ":x: **Cannot find any posts with the given arguments.**" })

            var post = data[0].data.children[0]
            if (post.data.over_18 === true) {
                if (message.channel.nsfw) {
                    await createEmbed(post, message)
                    newMessage.delete()
                } else {
                    await newMessage.edit({ content: "**:x: You can only get that post in an NSFW channel, please try to get another post.**" })
                }
            } else {
                await createEmbed(post, message)
            }
        })
    }
}

async function InteractionMain(interaction, subcommandname, args) {
    const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
    if (!subcommandname) return createHelpEmbed(undefined, interaction)

    await interaction.reply({ content: '<a:loading2:900416595782926367> ** Working...**', ephemeral: false })

    if (subcommandname === "random-search") {
        if (!args[0]) return interaction.editReply({ content: ":x: **Please enter something to search.**" })

        if (!await scanMessage.scanArgs(undefined, args, interaction) === "CanSearchable") return interaction.editReply("**:x: You can only search that in an NSFW channel, please try to search something else.**")

        var searchArgs = args.join(' ')

        Reddit.search(searchArgs).exec(async function (data) {
            var post = data.data.children[Math.floor(Math.random() * data.data.children.length)];
            await createEmbed(post, undefined, interaction)
        })
    }
    if (subcommandname === "random") {
        Reddit.random().exec(async function (data) {
            var post = data[0].data.children[0]
            await createEmbed(post, undefined, interaction)
        })
    }
    if (subcommandname === "getpost") {
        if (!args[0]) return interaction.editReply({ content: ":x: **Please enter a subreddit.**" })
        if (!args[1]) return interaction.editReply({ content: ":x: **Please enter an id to search.**" })

        Reddit.subreddit(args[0]).post(args[1]).exec(async function (data) {
            if (!data) return interaction.editReply({ content: ":x: **Cannot find any posts with the given arguments.**" })

            var post = data[0].data.children[0]
            if (post.data.over_18 === true) {
                if (interaction.channel.nsfw) {
                    await createEmbed(post, undefined, interaction)
                } else {
                    interaction.editReply({ content: "**:x: You can only get that post in an NSFW channel, please try to get another post.**" })
                }
            } else {
                await createEmbed(post, undefined, interaction)
            }
        })
    }

    if (!interaction.replied) {
        interaction.deleteReply();
    }
}


module.exports = {
    name: 'reddit',
    description: 'Finds posts from reddit',
    execute(message, args, interaction) {
        if (interaction) {
            const subcommandname = interaction.options._subcommand
            InteractionMain(interaction, subcommandname, args)
        } else {
            MessageMain(message, args)
        }
    }
}