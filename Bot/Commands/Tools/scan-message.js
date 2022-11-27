// Import Modules

var DetectLanguage = require('detectlanguage');
var detectlanguage = new DetectLanguage('f3838950d747794d388f3870ab37c873');

// Keywords to detect

const nsfwwords = [
    "hentai",
    "porn",
    "rule34",
    "sex",
    "loli",
    "lolicon",
    "pussy",
    "dick",
    "vagina",
    "penis",
    "shota",
    "shotacon",
    "cock",
    "anus",
    "ass",
    "fuck",
    "blowjob",
    "boob",
    "tits",
    "rack",
    "cum",
    "yiff",
    "genetalia",
    "boobie",
    "boobs",
    "dildo",
    "futa",
    "hot_babe",
    "babe",
    "xvideos",
    "pornhub",
    "xnn",
    "xxx",
    "x-videos"
]

// Gets the language from the given args

async function getLanguage(args) {
    return new Promise(async function (resolve, reject) {
        const result = await detectlanguage.detect(args).catch(err => { console.log(err) })
        if (result[0][0].language !== "en") return resolve("CannotSearchable")

        return resolve("CanSearchable")
    })
}

// Scans the arguments that are given for the keywords

async function scanArgs(message, args, interaction) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < nsfwwords.length; ++i) {
            for (let a = 0; a < args.length; ++a) {
                if (args[a].includes(nsfwwords[i])) {
                    var channel;

                    if (interaction) {
                        const guild = client.guilds.cache.get(interaction.guildId)
                        if (!guild) { resolve("CannotSearchable"); return }

                        channel = guild.channels.cache.get(interaction.channelId)
                    } else {
                        channel = message.channel
                    }

                    if (!channel) { resolve("CannotSearchable"); return }

                    if (channel.nsfw) {
                        resolve("CanSearchable")
                        return;
                    } else {
                        resolve("CannotSearchable")
                        return;
                    }
                }
            }
        }
        resolve("CanSearchable")
        return;
    });
}

// Scans the message for the keywords

async function scanMessage(message, interaction) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < nsfwwords.length; ++i) {
            if (message) {
                const filteredmessage = message.content.replace(/\s+/g, '').toLowerCase();
                if (filteredmessage.includes(nsfwwords[i])) {
                    if (message.channel.nsfw) {
                        resolve("CanSearchable")
                        return;
                    } else {
                        resolve("CannotSearchable")
                        return;
                    }
                }
            } else {
                if (interaction) {
                    const guild = client.guilds.cache.get(interaction.guildId)
                    if (!guild) { resolve("CannotSearchable"); return }

                    const channel = guild.channels.cache.get(interaction.channelId)
                    if (!channel) { resolve("CannotSearchable"); return }

                    let filteredmessage = interaction.options._hoistedOptions[0].value.replace(/\s+/g, '').toLowerCase();
                    if (filteredmessage.includes(nsfwwords[i])) {
                        if (channel.nsfw) {
                            resolve("CanSearchable")
                            return;
                        } else {
                            resolve("CannotSearchable")
                            return;
                        }
                    }
                }
            }

        }
        resolve("CanSearchable")
        return;
    });
}

module.exports = {
    scanMessage,
    scanArgs,
    getLanguage
}