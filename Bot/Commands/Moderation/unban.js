const Discord = require('discord.js')

const { isModuleEnabled } = require('../Tools/get-data')

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "MODERATION").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)) return message.reply({ content: '**:x: You do not have any permissions to run this command.**' })

    var user
    if (message.mentions.users.first()) {
        user = message.mentions.users.first().id
    } else if (args[0]) {
        user = args[0]
    }

    if (!user || typeof (args[0]) === "string" && args[0].length <= 0) {
        user = await client.users.cache.find(user => user.id === args[0]);
        if (user) user = user.id; else return message.reply({ content: ':grey_question: **Cannot find the user.**' })
    }

    var reason;

    if (args[1]) {
        args.shift()
        reason = args.join(' ')
    }

    await message.guild.bans.fetch().then(bans => {
        if (bans.size == 0) return message.reply({ content: ":grey_question: **Cannot find the user.**" })

        const bUser = bans.find(b => b.user.id == user)
        if (!bUser) return message.reply(":x: **Member is not banned.**")

        message.guild.members.unban(bUser.user, reason).then(() => {
            const embed = new Discord.EmbedBuilder()
                .setTitle(bUser.user.username + "#" + bUser.user.discriminator + " has been unbanned.")
            message.reply({ embeds: [embed] })
        }).catch(err => {
            console.log(err)
            message.reply({ content: ":x: **Member could not be unbanned. Please check the bot's permissions and try again.**" })
        });
    })
}

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "MODERATION").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: '**:x: You do not have any permissions to run this command.**', ephemeral: true })

    const user = args[0]
    if (!user) return interaction.reply({ content: ':grey_question: **Cannot find the user.**', ephemeral: true })

    if (!user || typeof (args[0]) === "string" && args[0].length <= 0) {
        user = await client.users.cache.find(user => user.id === args[0]);
        if (user) user = user.id; else return interaction.reply({ content: ':grey_question: **Cannot find the user.**', ephemeral: true })
    }

    var reason;

    if (args[1]) {
        args.shift()
        reason = args.join(' ')
    }

    await interaction.guild.bans.fetch().then(bans => {
        if (bans.size == 0) return interaction.reply({ content: ":grey_question: **Cannot find the user.**", ephemeral: true })

        const bUser = bans.find(b => b.user.id == user)
        if (!bUser) return interaction.reply({ content: ":x: **Member is not banned or cannot be found.**", ephemeral: true })

        interaction.guild.members.unban(bUser.user, reason).then(() => {
            const embed = new Discord.EmbedBuilder()
                .setTitle(bUser.user.username + "#" + bUser.user.discriminator + " has been unbanned.")
            interaction.reply({ embeds: [embed] })
        }).catch(err => {
            console.log(err)
            interaction.reply({ content: ":x: **Member could not be unbanned. Please check the bot's permissions and try again.**", ephemeral: true })
        });
    })
}

module.exports = {
    name: 'unban',
    description: 'Unbans an user from the server',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    }
}