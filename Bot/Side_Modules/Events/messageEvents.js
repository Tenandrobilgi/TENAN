// Import Modules

const Discord = require('discord.js')
const config = require('./../../../config.json')
const { checkForMaintenance } = require('../checkForMaintenance')
const { checkForUser, autoHandleTimeout } = require('./../../Timeout/userTimeoutHandler')
const { getBotPrefix } = require('./../../Commands/Tools/get-data')

// Functions to get the data from the mysql database

function getServerLogChannel(message) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogChannelID FROM serverdatas WHERE serverId = '${message.channel.guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].serverLogChannelID);
            }
        })
    });
}

function getServerLogEnabled(message) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogEnabled FROM serverdatas WHERE serverId = '${message.channel.guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].serverLogEnabled);
            }
        })
    })
}

function getCustomReplyEnabled(message) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT customResponse FROM serverdatas WHERE serverId = '${message.channel.guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].customResponse)
            }
        })
    });
}

// Main function

async function start(client) {
    // Message Created
    client.on('messageCreate', async message => {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.channel.guild) return;
    
        var prefix = await getBotPrefix(message).catch(err => { console.log(err) })
    
        if (!prefix) {
            if (typeof (config.DEFAULTPREFIX) === "string" && config.DEFAULTPREFIX.length <= 2) {
                prefix = config.DEFAULTPREFIX
            } else {
                console.error("Could not assign the default prefix because the value is either not a string or the string length is more than 2.")
                return
            }
        }
    
        var args;
        var mentioned = false

        if (!message.content.startsWith(prefix)) {
            if (message.mentions.members.first() && message.mentions.members.first().user.id === client.user.id) {
                mentioned = true
            } else return
        }
    
        if (mentioned === false) {
            args = message.content.slice(prefix.length).trim().toLowerCase().split(' ');
        } else {
            const splitmsg = `<@${client.user.id}>`
            args = message.content.slice(splitmsg.length + 1).trim().toLowerCase().split(' ');
        }
    
        const commandName = args.shift().toLowerCase();
    
        if (checkForMaintenance(message)) return message.reply({ content: ":tools: **Bot currently is in maintenance mode, please try again later.**" })
        // Do not move this since the bot checks if someone actually ran a command above.
    
        client.commands.forEach(async command => {
            if (command.name == commandName) {
                if (await checkForUser(message.author)) return message.reply({ content: ":clock1: **Please wait for a couple seconds before running a command again.**" })
                autoHandleTimeout(message.author)
                command.execute(message, args)
            }
        })
    })

    // Message Deleted
    client.on("messageDelete", async message => {
        if (!message || message.channel.type === 'dm') return;
        if (!message.channel || !message.channel.guild) return;
        if (!message.content) return;

        if (checkForMaintenance(message)) return

        var channelId = await getServerLogChannel(message).catch(err => { console.log(err); return })
        var logEnabled = await getServerLogEnabled(message).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle("⛔ Message Deleted")
                .addFields([
                    { name: 'Message sent by', value: `${message.author.tag}`, inline: true },
                    { name: 'Deleted in', value: `${message.channel}`, inline: true },
                    { name: 'Deleted Message', value: `${message}`, inline: true }
                ])
                .setFooter({ text: `UserId : ${message.author.id} | MessageId : ${message.id}` })
                .setTimestamp()

            let logChannel = message.guild.channels.cache.get(channelId)
            if (!logChannel) {
                message.channel.send(`:x:** A deleted message could not be logged because a logging channel hasn't been set yet.**`)
                return
            }
            logChannel.send({ embeds: [embed] }).catch(error => {
                console.log(error)
            });
        } catch (error) {
            console.log(error)
        }
    })

    // Message Edited
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if (!newMessage || newMessage.channel.type === 'dm') return;
        if (!newMessage.channel || !newMessage.channel.guild) return;
        if (!newMessage.content) return;
        if (oldMessage.content === newMessage.content) return

        if (checkForMaintenance(newMessage)) return

        const channelId = await getServerLogChannel(newMessage).catch(err => { console.log(err); return })
        const logEnabled = await getServerLogEnabled(newMessage).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle("📝 Message Edited")
                .addFields([
                    { name: 'Message sent by', value: `${newMessage.author.tag}`, inline: true },
                    { name: 'Edited in', value: `${newMessage.channel}`, inline: true },
                    { name: 'Old Message', value: `${oldMessage.content}`, inline: false },
                    { name: 'New Message', value: `${newMessage.content}`, inline: true },
                ])
                .setFooter({ text: `UserId : ${newMessage.author.id} | MessageId : ${newMessage.id}` })
                .setTimestamp()

            let logChannel = newMessage.guild.channels.cache.get(channelId)
            if (!logChannel) {
                newMessage.channel.send(`:x:** An edited message could not be logged because a logging channel hasn't been set yet.**`)
                return
            }
            logChannel.send({ embeds: [embed] }).catch(error => {
                console.log(error)
            });
        } catch (error) {
            console.log(error)
        }
    })

    // Message custom reply
    const Replies = [
        { triggers: ['hi', 'hello'], response: 'hello' },
        { triggers: ['sussy balls'], response: 'omg so true bestie :flushed:' },
        { triggers: ['shut up'], response: 'no you' },
        { triggers: ['nft'], response: 'haha right click save go brrr' },
        { triggers: ['femboy'], response: 'OwO femboi??~' },
        { triggers: ['did I ask', "didn't ask"], response: 'but I did' },
        { triggers: ['deez nuts'], response: 'how about you lick my balls clean' },
    ]

    client.on('messageCreate', async message => {
        if (checkForMaintenance(message)) return
        if (message.author.id === client.user.id) return;

        const replyEnabled = await getCustomReplyEnabled(message).catch(err => { console.log(err); return })
        if (!replyEnabled || replyEnabled !== "true") return

        const foundReply = Replies.find(r => r.triggers.find(m => m === message.content))
        if (!foundReply) return

        message.reply({ content: foundReply.response, allowedMentions: { parse: [] } })
    })
}

module.exports = {
    start
}
