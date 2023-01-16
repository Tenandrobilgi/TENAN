// Import Modules

const Discord = require('discord.js')
const { checkForMaintenance } = require('../checkForMaintenance')

// Functions to get the data from the mysql database

function getServerLogChannel(role) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogChannelID FROM serverdatas WHERE serverId = '${role.guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].serverLogChannelID);
            }
        })
    });
}

function getServerLogEnabled(role) {
    return new Promise(function (resolve, reject) {
        database.query(`SELECT serverLogEnabled FROM serverdatas WHERE serverId = '${role.guild.id}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(rows[0].serverLogEnabled);
            }
        })
    })
}

// Turning the changedPermissions object properties into a string

function propsAsString(obj) {
    return Object.keys(obj).map(function (k) {
        let prop = obj[k];
        let oldProp;
        let newProp;

        if (!prop.old) { oldProp = "❌" } else { oldProp = "✅" }
        if (!prop.new) { newProp = "❌" } else { newProp = "✅" }

        return `${k}: ${oldProp} -> ${newProp}`
    }).join("\n")
}

// Main function

function start(client) {
    // Role Created
    client.on("roleCreate", async role => {
        if (!role.guild) return;

        if (checkForMaintenance(undefined, undefined, role.guild)) return

        var channelId = await getServerLogChannel(role).catch(err => { console.log(err); return })
        var logEnabled = await getServerLogEnabled(role).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle("🛠️ Role Created")
                .addFields([
                    { name: 'Role Name', value: `${role.name}`, inline: true }
                ])
                .setFooter({ text: `RoleId : ${role.id}` })
                .setTimestamp()

            let logChannel = role.guild.channels.cache.get(channelId)
            if (!logChannel) {
                let firstChannel = role.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
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

    // Role Deleted
    client.on("roleDelete", async role => {
        if (!role.guild) return;

        if (checkForMaintenance(undefined, undefined, role.guild)) return

        var channelId = await getServerLogChannel(role).catch(err => { console.log(err); return })
        var logEnabled = await getServerLogEnabled(role).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle("🛠️ Role Deleted")
                .addFields([
                    { name: 'Role Name', value: `${role.name}`, inline: true }
                ])
                .setFooter({ text: `RoleId : ${role.id}` })
                .setTimestamp()

            let logChannel = role.guild.channels.cache.get(channelId)
            if (!logChannel) {
                let firstChannel = role.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
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

    // Role Updated
    client.on("roleUpdate", async (oldRole, newRole) => {
        if (!newRole.guild) return;

        if (checkForMaintenance(undefined, undefined, newRole.guild)) return

        var channelId = await getServerLogChannel(newRole).catch(err => { console.log(err); return })
        var logEnabled = await getServerLogEnabled(newRole).catch(err => { console.log(err); return })

        if (!channelId) return
        if (!logEnabled || logEnabled !== "true") return

        // Displaying the permission changes

        let oldRolePermissions = oldRole.permissions.serialize()
        let newRolePermissions = newRole.permissions.serialize()
        let permissionChanges = {}

        let oldRolePermissionsKeys = Object.keys(oldRolePermissions)
        let newRolePermissionsKeys = Object.keys(newRolePermissions)

        for (let i = 0; i < newRolePermissionsKeys.length; i++) {
            let oldPermission = oldRolePermissions[newRolePermissionsKeys[i]]
            let newPermission = newRolePermissions[oldRolePermissionsKeys[i]]

            if (oldPermission !== newPermission) {
                permissionChanges[oldRolePermissionsKeys[i]] = { old: oldPermission, new: newPermission }
            }
        }

        try {
            let embed = new Discord.EmbedBuilder()
                .setTitle("🛠️ Role Updated")
                .setFooter({ text: `RoleId : ${newRole.id}` })
                .setTimestamp()

            if (oldRole.name !== newRole.name) {
                embed.addFields([{ name: 'Role Name', value: `${oldRole.name} -> ${newRole.name}` },])
            } else {
                embed.addFields([{ name: 'Role Name', value: `${newRole.name}` },])
            }
            if (Object.keys(permissionChanges).length >= 1) {
                embed.addFields([{ name: 'Permission Changes', value: `${propsAsString(permissionChanges)}`, },])
            }
            if (oldRole.hexColor !== newRole.hexColor) {
                embed.addFields([{ name: 'Role Color', value: `${oldRole.hexColor} -> ${newRole.hexColor}` },])
            }
            if (oldRole.hoist !== newRole.hoist) {
                let oldval;
                let newval;
                if (!oldRole.hoist) { oldval = "❌" } else { oldval = "✅" }
                if (!newRole.hoist) { newval = "❌" } else { newval = "✅" }

                embed.addFields([{ name: 'Display role members seperately from online members', value: `${oldval} -> ${newval}` },])
            }
            if (oldRole.mentionable !== newRole.mentionable) {
                let oldval;
                let newval;
                if (!oldRole.mentionable) { oldval = "❌" } else { oldval = "✅" }
                if (!newRole.mentionable) { newval = "❌" } else { newval = "✅" }

                embed.addFields([{ name: 'Allow anyone to @mention this role', value: `${oldval} -> ${newval}` },])
            }

            let logChannel = newRole.guild.channels.cache.get(channelId)
            if (!logChannel) {
                let firstChannel = newRole.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
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
