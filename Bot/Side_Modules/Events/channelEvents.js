// Import Modules

const Discord = require('discord.js')
const { checkForMaintenance } = require('../checkForMaintenance')

// Functions to get the data from the mysql database

function getServerLogChannel(channel) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogChannelID FROM serverdatas WHERE serverId = '${channel.guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].serverLogChannelID);
            }
        })
    });
}

function getServerLogEnabled(channel) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogEnabled FROM serverdatas WHERE serverId = '${channel.guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].serverLogEnabled);
            }
        })
    })
}

// Main function

function start(client) {
    // Channel Created
    client.on("channelCreate", async channel => {
        if (channel.type === 'dm') return;
        if (!channel.guild) return;

        if (checkForMaintenance(undefined, undefined, channel.guild)) return

        var channelId = await getServerLogChannel(channel).catch(err => { console.log(err); return })
        var logEnabled = await getServerLogEnabled(channel).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle("🛠️ Channel Created")
                .addFields([
                    { name: 'Channel Name', value: `${channel.name}`, inline: true }
                ])
                .setFooter({ text: `ChannelId : ${channel.id}` })
                .setTimestamp()

            if (channel.type !== 4) { embed.addFields([{ name: 'Location: ', value: `<#${channel.id}>`, inline: true }]) }

            let logChannel = channel.guild.channels.cache.get(channelId)
            if (!logChannel) {
                let firstChannel = channel.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
                firstChannel.send(`:x:** A created channel could not be logged because a logging channel hasn't been set yet.**`)
                return
            }
            logChannel.send({ embeds: [embed] }).catch(error => {
                console.log(error)
            });
        } catch (error) {
            console.log(error)
        }
    });

    // Channel Deleted
    client.on("channelDelete", async channel => {
        if (channel.type === 'dm') return;
        if (!channel.guild) return;

        if (checkForMaintenance(undefined, undefined, channel.guild)) return

        var channelId = await getServerLogChannel(channel).catch(err => { console.log(err); return })
        var logEnabled = await getServerLogEnabled(channel).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle("🛠️ Channel Deleted")
                .addFields([
                    { name: 'Channel Name', value: `${channel.name}`, inline: true }
                ])
                .setFooter({ text: `ChannelId : ${channel.id}` })
                .setTimestamp()

            let logChannel = channel.guild.channels.cache.get(channelId)
            if (!logChannel) {
                let firstChannel = channel.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
                firstChannel.send(`:x:** A deleted channel could not be logged because a logging channel hasn't been set yet.**`)
                return
            }
            logChannel.send({ embeds: [embed] }).catch(error => {
                console.log(error)
            });
        } catch (error) {
            console.log(error)
        }
    });
}


module.exports = {
    start
}
