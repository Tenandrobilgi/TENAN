// Import Modules

const Discord = require('discord.js')
const { checkForMaintenance } = require('../checkForMaintenance')
const config = require('../../../config.json')

// Functions to get the data from the mysql database

function getServerLogChannel(guild) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogChannelID FROM ServerDatas WHERE serverId = '${guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].serverLogChannelID);
            }
        })
    });
}

function getServerLogEnabled(guild) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogEnabled FROM ServerDatas WHERE serverId = '${guild.id}'`, function (err, rows) {
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
    // Adding the server to the database.
    client.on("guildCreate", guild => {
        var ModuleData = {
            NSFW: {
                Name: "nsfw",
                enabled: false
            },
            FUN: {
                Name: "fun",
                enabled: true
            },
            MODERATION: {
                Name: "moderation",
                enabled: true
            }
        }
        console.log(`Joined the server: ${guild.name}. Saving to database....`)
        database.query(`INSERT INTO ServerDatas (serverId, serverPrefix, serverModules, serverLogChannelID, serverLogEnabled, customResponse) VALUES ('${guild.id}', '${config.DEFAULTPREFIX}', '${JSON.stringify(ModuleData)}', '0', 'false', 'true')`, err => {
            if (err) console.log(err);
            console.log('Server successfully added to database.')
        })
    })

    // Deleting the server from the database.
    client.on("guildDelete", guild => {
        console.log(`Exiting guild "${guild.name}". Removing from database..`)
        database.query(`DELETE FROM ServerDatas WHERE serverId = '${guild.id}';`, err => {
            if (err) console.log(err);
            console.log('Server successfully removed from the database.')
        })
    })

    // Member banned
    client.on("guildBanAdd", async member => {
        if (!member.guild) return

        const guild = member.guild

        if (checkForMaintenance(undefined, undefined, guild)) return

        const channelId = await getServerLogChannel(guild).catch(err => { console.log(err); return })
        const logEnabled = await getServerLogEnabled(guild).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: Discord.AuditLogEvent.MemberBanAdd,
            });
            const banLog = fetchedLogs.entries.first();
            const { executor, target } = banLog;
            var moderator;

            if (!banLog) {
                moderator = "Could not fetch."
            }

            if (target.id === member.user.id) {
                moderator = `${executor.username}#${executor.discriminator}`
            } else {
                moderator = "Could not fetch."
            }

            let embed = new Discord.EmbedBuilder()
                .setTitle("🛑 Member Banned")
                .addFields([
                    { name: 'Username:', value: `${member.user.username}#${member.user.discriminator}`, inline: true },
                    { name: 'Banned by:', value: `${moderator}`, inline: true },
                ])
                .setFooter({ text: `UserId : ${member.user.id} | GuildId : ${guild.id} | Guild Name : ${guild.name}` })
                .setTimestamp()

            let logChannel = guild.channels.cache.get(channelId)
            if (!logChannel) {
                let firstChannel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
                firstChannel.send(`:x:** A banned user could not be logged because a logging channel hasn't been set yet.**`)
                return
            }
            logChannel.send({ embeds: [embed] }).catch(error => {
                console.log(error)
            });
        } catch (error) {
            console.log(error)
        }
    })

    // Member unbanned
    client.on("guildBanRemove", async member => {
        if (!member.guild) return

        const guild = member.guild

        if (checkForMaintenance(undefined, undefined, guild)) return

        const channelId = await getServerLogChannel(guild).catch(err => { console.log(err); return })
        const logEnabled = await getServerLogEnabled(guild).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: Discord.AuditLogEvent.MemberBanRemove,
            });

            const unbanLog = fetchedLogs.entries.first();
            const { executor, target } = unbanLog;
            var moderator;

            if (!unbanLog) {
                moderator = "Could not fetch."
            }

            if (target.id === member.user.id) {
                moderator = `${executor.username}#${executor.discriminator}`
            } else {
                moderator = "Could not fetch."
            }

            let embed = new Discord.EmbedBuilder()
                .setTitle("✅ Member Unbanned")
                .addFields([
                    { name: 'Username:', value: `${member.user.username}#${member.user.discriminator}`, inline: true },
                    { name: 'Unbanned by:', value: `${moderator}`, inline: true },
                ])
                .setFooter({ text: `UserId : ${member.user.id} | GuildId : ${guild.id} | Guild Name : ${guild.name}` })
                .setTimestamp()

            let logChannel = guild.channels.cache.get(channelId)
            if (!logChannel) {
                let firstChannel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
                firstChannel.send(`:x:** An unbanned user could not be logged because a logging channel hasn't been set yet.**`)
                return
            }
            logChannel.send({ embeds: [embed] }).catch(error => {
                console.log(error)
            });
        } catch (error) {
            console.log(error)
        }
    })
}


module.exports = {
    start
}