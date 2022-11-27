const Discord = require('discord.js')

function createInfoEmbed(message, interaction, args) {
    const embed = new Discord.EmbedBuilder()
        .setTitle("TENAN")
        .setThumbnail('https://media.discordapp.net/attachments/823602868241563708/854359465168338994/ezgif-1-9baeb9e689d8.png')

    function defaultPage() {
        embed.addFields([
            { name: 'Command Modules', value: 'help fun = Some fun commands that you can use!\nhelp moderation = Commands that you can use to moderate your server!\nhelp nsfw = NSFW commands.' },
            { name: 'Configuration', value: "settings = Change the bot's settings." }
        ])
    }

    if (!args || !args[0]) {
        defaultPage()
    } else if (args[0] === "fun") {
        embed.addFields([
            { name: 'Fun Commands', value: `cake = cake yes\ndadjoke = Some good ol' dad jokes!\nmeme = Get random memes!\nsearch-image <name> = Search for an image\nrandomchoose <item1> <item2> = Randomly selects an item from the given items\nflip = Flip a coin!\nsimp-rate = Show your friends how much of a simp you are!\nreddit = Finds posts from reddit\nanime-source = Find if an image is from an anime!` },
            { name: 'Configuration', value: "settings = Change the bot's settings." }
        ])
    } else if (args[0] === "moderation") {
        embed.addFields([
            { name: 'Moderation Commands', value: `clear <amount> = Clears messages\nkick <user/userId> <reason> = Kicks an user from the server\nban <user/userId> <reason> = Bans an user from the server\nunban <user/userId> = Unbans an user from the server` },
            { name: 'Configuration', value: "settings = Change the bot's settings." }
        ])
    } else if (args[0] === "nsfw") {
        embed.addFields([
            { name: 'Note : NSFW commands are disabled by default. You can enable NSFW with the settings command.', value: '** **' },
            { name: 'NSFW Commands', value: `rule34 <xxx/paheal/e621> <tags> = Finds an NSFW image from multiple websites!\nsex <args> = Have sex with someone!\nrandomporn <args> = Finds a random porn image/gif.` },
            { name: 'Configuration', value: "settings = Change the bot's settings." }
        ])
    } else {
        defaultPage()
    }

    if (interaction) {
        interaction.reply({ embeds: [embed] })
    } else {
        message.reply({ embeds: [embed] })
    }
}

module.exports = {
    name: 'help',
    description: 'Shows all the commands and the modules.',
    execute(message, args, interaction) {
        if (interaction) {
            createInfoEmbed(undefined, interaction, args)
        } else {
            createInfoEmbed(message, undefined, args)
        }
    },
    async getAutoCompleteReturns(interaction) {
        const focusedValue = interaction.options.getFocused();
        const modules = ["fun", "moderation", "nsfw"]

        const filtered = modules.filter(choice => choice.startsWith(focusedValue));

        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }
}