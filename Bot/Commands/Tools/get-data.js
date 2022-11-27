// Checks if the module is enabled or not from the database for a server.

function isModuleEnabled(message, interaction, databaseTable) {
    return new Promise(function (resolve, reject) {
        var guildId;
        if (interaction) {
            guildId = interaction.guildId
        } else {
            guildId = message.channel.guild.id
        }
        if (!guildId) reject("isModuleEnabled: guildId cannot be found.")

        database.query(`SELECT serverModules FROM ServerDatas WHERE serverId = '${guildId}'`, function (err, rows) {
            if (err) {
                reject(err)
                throw err;
            } else if (rows && rows[0]) {
                const Data = JSON.parse(rows[0].serverModules)
                resolve(Data[databaseTable].enabled)
            } else {
                reject("isModuleEnabled: Couldn't get data.")
            }
        });
    });
}

// Gets the bot prefix from the database for a server.

function getBotPrefix(message, interaction) {
    return new Promise(function (resolve, reject) {
        var guildId;
        if (interaction) {
            guildId = interaction.guildId
        } else {
            guildId = message.channel.guild.id
        }
        if (!guildId) reject("getBotPrefix: guildId cannot be found.")

        database.query(`SELECT serverPrefix FROM ServerDatas WHERE serverId = '${guildId}'`, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                if (rows && rows[0]) {
                    resolve(rows[0].serverPrefix)
                } else {
                    reject("getBotPrefix: Couldn't get data.")
                }
            }
        })
    });
}

module.exports = {
    isModuleEnabled,
    getBotPrefix
}