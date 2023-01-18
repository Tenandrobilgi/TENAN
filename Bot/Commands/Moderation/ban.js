const Discord = require('discord.js')

const { isModuleEnabled } = require('../Tools/get-data')
const config = require('./../../../config.json')

async function MessageMain(message, args) {
    const result = await isModuleEnabled(message, undefined, "MODERATION").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)) return message.reply({ content: '**:x: You do not have any permissions to run this command.**' })

    var member
    if (message.mentions.users.first()) {
        member = message.guild.members.cache.get(message.mentions.users.first().id)
    } else if (args[0]) {
        member = message.guild.members.cache.get(args[0])
    }

    if (!member) member = await client.users.cache.find(user => user.id === args[0])
    if (!member) message.reply({ content: ':grey_question: **Cannot find the member.**' })

    if (member.user.id === config.PROTECTEDUSERID) { return message.reply({ content: '**:x: You cannot ban that member.**' }) }
    if (message.author.id !== config.PROTECTEDUSERID && message.member.roles.highest.position < member.roles.highest.position) return message.reply({ content: '**:x: You cannot ban that member.**' })

    var reason;
    var embedReason;

    if (args[1]) {
        args.shift()
        reason = args.join(' ')
        embedReason = `You were banned from ${message.guild.name} for: ${reason}`
    } else {
        embedReason = `You were banned from ${message.guild.name}.`
    }

    const pmEmbed = new Discord.EmbedBuilder()
        .setTitle(embedReason)

    await member.send({ embeds: [pmEmbed] }).catch(err => {
        console.log(err)
    })

    member.ban({ reason: reason }).then(() => {
        const embed = new Discord.EmbedBuilder()
            .setTitle(member.user.username + "#" + member.user.discriminator + " has been banned.")
        message.reply({ embeds: [embed] })
    }).catch(err => {
        console.log(err)
        message.reply({ content: ":x: **Member could not be banned. Please check the bot's permissions and try again.**" })
    })
}

async function InteractionMain(interaction, args) {
    const result = await isModuleEnabled(undefined, interaction, "MODERATION").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: '**:x: You do not have any permissions to run this command.**', ephemeral: true })

    const member = interaction.guild.members.cache.get(args[0])
    if (!member) return interaction.reply({ content: ':grey_question: **Cannot find the member.**', ephemeral: true })

    if (member.user.id === config.PROTECTEDUSERID) { return interaction.reply({ content: '**:x: You cannot ban that member.**', ephemeral: true }) }
    if (interaction.member.user.id !== config.PROTECTEDUSERID && interaction.member.roles.highest.position < member.roles.highest.position) return interaction.reply({ content: '**:x: You cannot ban that member.**', ephemeral: true })

    await interaction.deferReply()

    var reason;
    var embedReason;
    var deleteMessagesDuration;

    const deleteMessagesSeconds = {
        "Previous Hour": 3600,
        "Previous 3 Hours": 10800,
        "Previous 6 Hours": 21600,
        "Previous 12 Hours": 43200,
        "Previous 24 Hours": 86400,
        "Previous 3 Days": 259200,
        "Previous 7 Days": 604800
    }

    const options = interaction.options._hoistedOptions

    for (let i = 0; i < options.length; i++) {
        let name = options[i]["name"]
        let value = options[i]["value"]

        if (name == "reason") {
            reason = value
            if (reason) {
                embedReason = `You were banned from ${interaction.guild.name} for: ${reason}`
            } else {
                embedReason = `You were banned from ${interaction.guild.name}.`
            }
        }
        if (name == "delete_messages") {
            let dmsKeys = Object.keys(deleteMessagesSeconds)
            for (let i = 0; i < dmsKeys.length; i++) {
                if (value === dmsKeys[i]) {
                    deleteMessagesDuration = deleteMessagesSeconds[value]
                }
            }
        }
    }

    const pmEmbed = new Discord.EmbedBuilder()
        .setTitle(embedReason)

    await member.send({ embeds: [pmEmbed] }).catch(err => {
        //console.log(err)
    })

    member.ban({ deleteMessageSeconds: deleteMessagesDuration, reason: reason }).then(() => {
        const embed = new Discord.EmbedBuilder()
            .setTitle(member.user.username + "#" + member.user.discriminator + " has been banned.")
        interaction.editReply({ embeds: [embed] })
    }).catch(err => {
        console.log(err)
        interaction.editReply({ content: ":x: **Member could not be banned. Please check the bot's permissions and try again.**" })
    })
}

module.exports = {
    name: 'ban',
    description: 'Bans an user from the server',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction, args)
        } else {
            MessageMain(message, args)
        }
    },
    async getAutoCompleteReturns(interaction) {
        const focusedValue = interaction.options.getFocused();
        const options = ["Previous Hour", "Previous 3 Hours", "Previous 6 Hours", "Previous 12 Hours", "Previous 24 Hours", "Previous 3 Days", "Previous 7 Days"]

        const filtered = options.filter(choice => choice.startsWith(focusedValue));

        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }
}
