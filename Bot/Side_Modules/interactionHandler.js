// Import Modules

const { checkForMaintenance } = require('./checkForMaintenance')
const { checkForUser, autoHandleTimeout } = require('../Timeout/userTimeoutHandler')
const { InteractionType } = require('discord.js');

// Commands that are exceptional and requires additional/different arguments

const interactionCommandExceptions = [
    "sex",
    "cake",
    "randomchoose",
    "rule34"
]

function runInteractionCommandExceptions(commandName, interaction, args, subcommandnames) {
    return new Promise(function (resolve) {
        if (!commandName || !interactionCommandExceptions.includes(commandName)) resolve(false)

        if (commandName == "cake") {
            interaction.reply({
                content: 'cake yes',
                ephemeral: true
            })
        }
        if (commandName == "randomchoose") {
            client.commands.get('randomchoose').execute(undefined, [interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[1].value], interaction)
        }
        if (commandName == "rule34") {
            client.commands.get('rule34').execute(undefined, undefined, interaction, args, subcommandnames)
        }
        if (commandName == "sex") {
            var subcommandname1;
            if (interaction.options._hoistedOptions[0]) { subcommandname1 = interaction.options._hoistedOptions[0].value }

            var subcommandname2;
            if (interaction.options._hoistedOptions[1]) { subcommandname2 = interaction.options._hoistedOptions[1].value }

            client.commands.get('sex').execute(undefined, [subcommandname1, subcommandname2], interaction)
        }

        resolve(true)
    })
}

// Main function

function start(client) {
    if (!client) return console.error("client does not exist.");

    // Slash commands

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return

        if (checkForMaintenance(undefined, interaction)) return interaction.reply({ content: ":tools: **Bot currently is in maintenance mode, please try again later.**", ephemeral: true })

        var args;
        var subcommandnames;

        if (interaction.options && interaction.options._hoistedOptions) {
            args = []
            subcommandnames = []

            interaction.options._hoistedOptions.forEach(option => {
                if (typeof(option.value) === "string") {
                    args = args.concat(option.value.trim().toLowerCase().split(' '))
                } else {
                    args.push(option.value)
                }
                subcommandnames.push(option.name)
            })
        } else {
            args = undefined
        }

        client.commands.forEach(async command => {
            if (command.name == interaction.commandName) {
                if (await checkForUser(interaction.member.user)) return interaction.reply({ content: ":clock1: **Please wait for a couple seconds before running a command again.**", ephemeral: true })
                autoHandleTimeout(interaction.member.user)
                
                const isExceptional = await runInteractionCommandExceptions(command.name, interaction, args, subcommandnames)
                if (isExceptional) return

                if (interactionCommandExceptions.includes(interaction.commandName)) return

                await command.execute(undefined, args, interaction, subcommandnames)
            }
        })
    })

    // Buttons

    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return
        if (checkForMaintenance(undefined, interaction)) return

        const buttonmetadata = interaction.customId.split('-')

        if (interaction.customId === `${interaction.user.id}-${buttonmetadata[1]}-${buttonmetadata[2]}`) {
            client.commands.get('rule34').execute(undefined, undefined, interaction, buttonmetadata[2], buttonmetadata[1], interaction.message.id)
        }
    });

    // Autocomplete
    client.on('interactionCreate', interaction => {
        if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) return;
        if (checkForMaintenance(undefined, interaction)) return;

        client.commands.forEach(async command => {
            if (command.name == interaction.commandName) {
                if (!command.getAutoCompleteReturns) return

                await command.getAutoCompleteReturns(interaction)
            }
        })
    });
}

module.exports = {
    start
}