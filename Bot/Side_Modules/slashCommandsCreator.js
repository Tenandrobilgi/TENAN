// A simple slash commands creator module.

const Discord = require('discord.js')
const config = require('../../config.json')

async function start(client) {
    if (!client) return console.error("client does not exist.");
    if (!config.PUBLISHCOMMANDS) return

    client.application?.commands.set([])

    let commands = client.application?.commands

    await commands?.create({
        name: 'help',
        description: 'Shows all the commands and the modules.',
        type: Discord.ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'module',
                description: 'Command modules.',
                required: false,
                type: Discord.ApplicationCommandOptionType.String,
                autocomplete: true
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'dadjoke',
        description: "Some good ol' dad jokes!",
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'meme',
        description: "Get random memes!",
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'flip',
        description: "Flip a coin!",
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'randomchoose',
        description: "Randomly selects an item from the given items",
        options: [
            {
                name: 'item-1',
                description: 'The first item.',
                required: true,
                type: Discord.ApplicationCommandOptionType.String

            },
            {
                name: 'item-2',
                description: 'The second item.',
                required: true,
                type: Discord.ApplicationCommandOptionType.String
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'rule34',
        description: "Finds an NSFW image from multiple websites!",
        options: [
            {
                name: 'website',
                description: 'The website you want to search from.',
                required: false,
                type: Discord.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'xxx',
                        description: 'rule34.xxx',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.String,
                    },
                    {
                        name: 'paheal',
                        description: 'rule34.paheal.net',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.String,
                    },
                    {
                        name: 'e621',
                        description: 'e621.net',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.String,
                    },
                ],
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'sex',
        description: "Have sex with someone!",
        options: [
            {
                name: 'action',
                description: 'The action you want to do on the target.',
                required: false,
                type: Discord.ApplicationCommandOptionType.String,
                autocomplete: true
            },
            {
                name: 'target',
                description: 'The target.',
                required: false,
                type: Discord.ApplicationCommandOptionType.User
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'randomporn',
        description: 'Finds a random porn image/gif.',
        type: Discord.ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'tags',
                description: 'The tags you want to search.',
                required: true,
                type: Discord.ApplicationCommandOptionType.String,
                autocomplete: true
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'settings',
        description: "Configure bot settings.",
        options: [
            {
                name: 'prefix',
                description: "Change the bot's prefix.",
                required: false,
                type: Discord.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'value',
                        description: 'New Prefix',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.String,
                    },
                ]
            },
            {
                name: 'configure',
                description: 'Configure a module.',
                required: false,
                type: Discord.ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'fun',
                        description: 'Some fun commands that you can use!',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'enabled',
                                description: '[true/false]',
                                required: true,
                                type: Discord.ApplicationCommandOptionType.Boolean,
                            },
                        ]
                    },
                    {
                        name: 'moderation',
                        description: 'Commands that you can use to moderate your server!',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'enabled',
                                description: '[true/false]',
                                required: true,
                                type: Discord.ApplicationCommandOptionType.Boolean,
                            },
                        ]
                    },
                    {
                        name: 'nsfw',
                        description: 'NSFW commands.',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'enabled',
                                description: '[true/false]',
                                required: true,
                                type: Discord.ApplicationCommandOptionType.Boolean,
                            },
                        ]
                    }
                ],
            },
            {
                name: 'customresponse',
                description: "Enable or disable custom response.",
                required: false,
                type: Discord.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'enabled',
                        description: '[true/false]',
                        required: true,
                        type: Discord.ApplicationCommandOptionType.Boolean,
                    },
                ]
            },
            {
                name: 'log',
                description: 'Configure logging.',
                required: false,
                type: Discord.ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'configure',
                        description: 'Enable or disable bot logging.',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'enabled',
                                description: '[true/false]',
                                required: true,
                                type: Discord.ApplicationCommandOptionType.Boolean
                            },
                        ]
                    },
                    {
                        name: 'channel',
                        description: 'Set the log channel.',
                        required: false,
                        type: Discord.ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'channel',
                                description: '[channel]',
                                required: true,
                                type: Discord.ApplicationCommandOptionType.Channel
                            },
                        ]
                    }
                ],
            }
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'search-image',
        description: 'Search for an image',
        options: [
            {
                name: 'tags',
                description: 'The tags you want to search.',
                required: true,
                type: Discord.ApplicationCommandOptionType.String
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'reddit',
        description: "Finds posts from reddit",
        options: [
            {
                name: 'random-search',
                description: 'Gets a random post from all the subreddits with the given arguments.',
                type: Discord.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'args',
                        description: '[args]',
                        required: true,
                        type: Discord.ApplicationCommandOptionType.String
                    },
                ]
            },
            {
                name: 'random',
                description: 'Gets a random thread/post.',
                type: Discord.ApplicationCommandOptionType.Subcommand
            },
            {
                name: 'getpost',
                description: ' Gets a post with the given id.',
                type: Discord.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'subreddit',
                        description: 'Subreddit name.',
                        required: true,
                        type: Discord.ApplicationCommandOptionType.String
                    },
                    {
                        name: 'id',
                        description: 'The post id.',
                        required: true,
                        type: Discord.ApplicationCommandOptionType.String
                    },
                ]
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'simp-rate',
        description: 'Show your friends how much of a simp you are!',
        options: [
            {
                name: 'target',
                description: 'The target',
                required: true,
                type: Discord.ApplicationCommandOptionType.User
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'anime-source',
        description: 'Finds if an image is from an anime!',
        options: [
            {
                name: 'image',
                description: 'The Image URL',
                required: true,
                type: Discord.ApplicationCommandOptionType.String
            },
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'ban',
        description: 'Bans an user from the server',
        options: [
            {
                name: 'user',
                description: 'The user you want to ban from the server.',
                required: true,
                type: Discord.ApplicationCommandOptionType.User
            },
            {
                name: 'reason',
                description: 'The reason.',
                required: false,
                type: Discord.ApplicationCommandOptionType.String
            }
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'unban',
        description: 'Unbans an user from the server',
        options: [
            {
                name: 'user',
                description: 'The user you want to unban from the server.',
                required: true,
                type: Discord.ApplicationCommandOptionType.String
            }
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'kick',
        description: 'Kicks an user from the server',
        options: [
            {
                name: 'user',
                description: 'The user you want to kick from the server.',
                required: true,
                type: Discord.ApplicationCommandOptionType.User
            },
            {
                name: 'reason',
                description: 'The reason.',
                required: false,
                type: Discord.ApplicationCommandOptionType.String
            }
        ],
    }).catch(error => {
        console.log(error)
    })

    await commands?.create({
        name: 'clear',
        description: 'Clears messages',
        options: [
            {
                name: 'amount',
                description: 'The amount of messages you want to delete.',
                required: true,
                type: Discord.ApplicationCommandOptionType.Number
            }
        ],
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    start
}