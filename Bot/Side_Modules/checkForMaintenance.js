const config = require('../../config.json')

function checkForMaintenance(message, interaction, guild, user) {
    if (interaction && config.MAINTENANCEMODE && interaction.member.user.id !== config.PROTECTEDUSERID) {
        return true
    } else if (message && config.MAINTENANCEMODE && message.author.id !== config.PROTECTEDUSERID) {
        return true
    } else if (guild && config.MAINTENANCEMODE && guild.id !== config.PROTECTEDGUILDID) {
        return true
    } else if (user && config.MAINTENANCEMODE && user.id !== config.PROTECTEDUSERID) {
        return true
    }

    return false
}

module.exports = {
    checkForMaintenance
}