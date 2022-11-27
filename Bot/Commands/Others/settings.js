const Discord = require('discord.js')
const config = require('./../../../config.json')

function sendHelpMessage(message, interaction) {
    const embed = new Discord.EmbedBuilder()
        .setTitle('Bot Configuration')
        .addFields([
            { name: 'Settings', value: `**settings prefix <newprefix>** = Change the bot's prefix.\n**settings configure <module> <true/false>** = Enable or disable a module.\n**settings customresponse <true/false>** = Enable or disable custom response.\n**settings log configure <true/false>** = Enable or disable bot logging.\n**settings log channel <channel/channelId>** = Set the log channel.` }
        ])

    if (interaction) {
        interaction.editReply({ content: '** **', embeds: [embed] })
    } else {
        message.reply({ embeds: [embed] })
    }
}

async function getChannelFromMention(message, guild) {
    if (message) {
        if (message.startsWith('<#') && message.endsWith('>')) {
            message = message.slice(2, -1);

            const channel = await guild.channels.cache.get(message)
            if (!channel) return false

            return channel.id
        }
    }
}

async function changeSettings(message, interaction, setting, args) {
    if (!args || args[0] === undefined) return sendHelpMessage(message, interaction)

    if (setting === "prefix") {
        if (args[0].length > 2) {
            if (interaction) {
                return interaction.editReply({ content: `:x: **The prefix cannot be longer than 2 characters.**` })
            } else {
                return message.reply(`:x: **The prefix cannot be longer than 2 characters.**`)
            }
        }

        var guildId;

        if (interaction) {
            guildId = interaction.member.guild.id
        } else {
            guildId = message.guild.id
        }

        database.query(`UPDATE serverDatas SET serverPrefix = '${args[0]}' WHERE ServerId = '${guildId}'`, err => {
            if (err) {
                console.log(err);
            } else if (interaction) {
                interaction.editReply(`:white_check_mark: **Successfully updated the prefix. The new Prefix is : '${args[0]}' **`)
            } else {
                message.reply(`:white_check_mark: **Successfully updated the prefix. The new Prefix is : '${args[0]}' **`)
            }
        })
    }

    if (setting == "configure") {
        if (!args[0]) return sendHelpMessage(message, interaction)
        if (args[1] === undefined) return sendHelpMessage(message, interaction) // Slash command may return false

        const Modules = [
            "NSFW",
            "FUN",
            "MODERATION"
        ]

        var allowed = false
        for (let i = 0; i < Modules.length; ++i) {
            if (args[0].toUpperCase() === Modules[i]) {
                allowed = true
            }
        }

        if (allowed === false) {
            if (interaction) {
                return interaction.editReply({ content: ':x: **Please enter a valid module name.**' })
            } else {
                return message.reply({ content: ':x: **Please enter a valid module name.**' })
            }
        }

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

        if (args[1] === "true" || args[1] === true) {
            if (ModuleData[args[0].toUpperCase()]) {
                ModuleData[args[0].toUpperCase()].enabled = true
            } else return

            function sendData() {
                return new Promise(function (resolve, reject) {
                    var guildId;

                    if (interaction) {
                        guildId = interaction.member.guild.id
                    } else {
                        guildId = message.guild.id
                    }

                    database.query(`UPDATE ServerDatas SET serverModules = '${JSON.stringify(ModuleData)}' WHERE ServerId = '${guildId}'`, err => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(`:white_check_mark: **Successfully enabled the module.**`)
                        }
                    })
                })
            }

            sendData().then(result => {
                if (interaction) {
                    interaction.editReply({ content: result })
                } else {
                    message.reply({ content: result })
                }
            }).catch(error => {
                console.log(error)
                if (interaction) {
                    interaction.editReply({ content: ":warning: **An error occured while enabling the module. Please try again later.**" })
                } else {
                    message.reply({ content: ":warning: **An error occured while enabling the module. Please try again later.**" })
                }
            })
        }
        if (args[1] === "false" || args[1] === false) {
            if (ModuleData[args[0].toUpperCase()]) {
                ModuleData[args[0].toUpperCase()].enabled = false
            } else return

            function sendData() {
                return new Promise(function (resolve, reject) {
                    var guildId;

                    if (interaction) {
                        guildId = interaction.member.guild.id
                    } else {
                        guildId = message.guild.id
                    }

                    database.query(`UPDATE ServerDatas SET serverModules = '${JSON.stringify(ModuleData)}' WHERE ServerId = '${guildId}'`, err => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(`:white_check_mark: **Successfully disabled the module.**`)
                        }
                    })
                })
            }

            sendData().then(result => {
                if (interaction) {
                    interaction.editReply({ content: result })
                } else {
                    message.reply({ content: result })
                }
            }).catch(error => {
                console.log(error)
                if (interaction) {
                    interaction.editReply({ content: ":warning: **An error occured while disabling the module. Please try again later.**" })
                } else {
                    message.reply({ content: ":warning: **An error occured while disabling the module. Please try again later.**" })
                }
            })
        }
    }

    if (setting === "customresponse") {
        if (args[0] === "true" || args[0] === true) {
            function sendData() {
                return new Promise(function (resolve, reject) {
                    var guildId;

                    if (interaction) {
                        guildId = interaction.member.guild.id
                    } else {
                        guildId = message.guild.id
                    }

                    database.query(`UPDATE ServerDatas SET customResponse = 'true' WHERE ServerId = '${guildId}'`, err => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(`:white_check_mark: **Successfully enabled custom response.**`)
                        }
                    })
                })
            }

            sendData().then(result => {
                if (interaction) {
                    interaction.editReply({ content: result })
                } else {
                    message.reply({ content: result })
                }
            }).catch(error => {
                console.log(error)
                if (interaction) {
                    interaction.editReply({ content: ":warning: **An error occured while enabling the setting. Please try again later.**" })
                } else {
                    message.reply({ content: ":warning: **An error occured while enabling the setting. Please try again later.**" })
                }
            })
        }
        if (args[0] === "false" || args[0] === false) {
            async function sendData() {
                return new Promise(function (resolve, reject) {
                    var guildId;

                    if (interaction) {
                        guildId = interaction.member.guild.id
                    } else {
                        guildId = message.guild.id
                    }

                    database.query(`UPDATE ServerDatas SET customResponse = 'false' WHERE ServerId = '${guildId}'`, err => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(`:white_check_mark: **Successfully disabled custom response.**`)
                        }
                    })
                })
            }

            sendData().then(result => {
                if (interaction) {
                    interaction.editReply({ content: result })
                } else {
                    message.reply({ content: result })
                }
            }).catch(error => {
                console.log(error)
                if (interaction) {
                    interaction.editReply({ content: ":warning: **An error occured while disabling the setting. Please try again later.**" })
                } else {
                    message.reply({ content: ":warning: **An error occured while disabling the setting. Please try again later.**" })
                }
            })
        }
    }

    if (setting === "log") {
        if (!args[0]) return sendHelpMessage(message, interaction)
        if (args[1] === undefined) return sendHelpMessage(message, interaction)

        if (args[0] === "configure") {
            if (args[1] === "true" || args[1] === true) {
                function sendData() {
                    return new Promise(function (resolve, reject) {
                        var guildId;

                        if (interaction) {
                            guildId = interaction.member.guild.id
                        } else {
                            guildId = message.guild.id
                        }

                        database.query(`UPDATE ServerDatas SET serverLogEnabled = 'true' WHERE ServerId = '${guildId}'`, err => {
                            if (err) {
                                console.log(err);
                                reject(err)
                            } else {
                                resolve(`:white_check_mark: **Successfully enabled logging.**`)
                            }
                        })
                    })
                }

                sendData().then(result => {
                    if (interaction) {
                        interaction.editReply({ content: result })
                    } else {
                        message.reply({ content: result })
                    }
                }).catch(error => {
                    console.log(error)
                    if (interaction) {
                        interaction.editReply({ content: ":warning: **An error occured while enabling the setting. Please try again later.**" })
                    } else {
                        message.reply({ content: ":warning: **An error occured while enabling the setting. Please try again later.**" })
                    }
                })
            }
            if (args[1] === "false" || args[1] === false) {
                function sendData() {
                    var guildId;

                    if (interaction) {
                        guildId = interaction.member.guild.id
                    } else {
                        guildId = message.guild.id
                    }

                    return new Promise(function (resolve, reject) {
                        database.query(`UPDATE ServerDatas SET serverLogEnabled = 'false' WHERE ServerId = '${guildId}'`, err => {
                            if (err) {
                                console.log(err);
                                reject(err)
                            } else {
                                resolve(`:white_check_mark: **Successfully disabled logging.**`)
                            }
                        })
                    })
                }

                sendData().then(result => {
                    if (interaction) {
                        interaction.editReply({ content: result })
                    } else {
                        message.reply({ content: result })
                    }
                }).catch(error => {
                    console.log(error)
                    if (interaction) {
                        interaction.editReply({ content: ":warning: **An error occured while disabling the setting. Please try again later.**" })
                    } else {
                        message.reply({ content: ":warning: **An error occured while disabling the setting. Please try again later.**" })
                    }
                })
            }
        }
        if (args[0] === "channel") {
            var logchannel;
            var guild;

            if (interaction) {
                guild = interaction.member.guild
            } else {
                guild = message.guild
            }

            // If a channel is mentioned, set the logchannel to that channel's id.
            await Promise.all(args.map(async argument => {
                const result = await getChannelFromMention(argument, guild)
                if (result) {
                    logchannel = result
                }
            }));

            // If a channel isn't mentioned, try to find the channel with the given id.
            if (!logchannel) {
                if (args[1] && interaction) {
                    if (interaction.member.guild.channels.cache.get(args[1])) {
                        logchannel = interaction.member.guild.channels.cache.get(args[1]).id
                    }
                } else if (args[1]) {
                    if (message.guild.channels.cache.get(args[1])) {
                        logchannel = message.guild.channels.cache.get(args[1]).id
                    }
                }
            }

            // If still can't find the channel, return an error message.
            if (!logchannel) {
                if (interaction) {
                    return interaction.editReply({ content: ':grey_question: **Could not find the channel in the server.**' })
                } else {
                    return message.reply({ content: ':grey_question: **Could not find the channel in the server.**' })
                }
            }

            function sendData() {
                return new Promise(function (resolve, reject) {
                    database.query(`UPDATE ServerDatas SET serverLogChannelID = '${logchannel}' WHERE ServerId = '${guild.id}'`, err => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(`:white_check_mark: **Successfully set the log channel.**`)
                        }
                    })
                })
            }

            sendData().then(result => {
                if (interaction) {
                    interaction.editReply({ content: result })
                } else {
                    message.reply({ content: result })
                }
            }).catch(error => {
                console.log(error)
                if (interaction) {
                    interaction.editReply({ content: ":warning: **An error occured while configuring the log channel. Please try again later.**" })
                } else {
                    message.reply({ content: ":warning: **An error occured while configuring the log channel. Please try again later.**" })
                }
            })
        }
    }
}

async function MessageMain(message, args) {
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !message.author.id === config.PROTECTEDUSERID) return message.reply({ content: ":x: **You do not have any permissions to run this command.**" })

    const settingName = args.shift()

    changeSettings(message, undefined, settingName, args)
}

async function InteractionMain(interaction, args) {
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !interaction.member.user.id === config.PROTECTEDUSERID) return interaction.reply({ content: ":x: **You do not have any permissions to run this command.**", ephemeral: true })

    await interaction.deferReply()

    var settingName;
    if (interaction.options._group) {
        settingName = interaction.options._group
        args.unshift(interaction.options._subcommand)
    } else {
        settingName = interaction.options._subcommand
    }

    changeSettings(undefined, interaction, settingName, args)
}


module.exports = {
    name: 'settings',
    description: 'Configuring bot settings for each server.',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    }
}