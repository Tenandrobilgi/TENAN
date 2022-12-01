////// @Tenandrobilgi

// Import Modules

const Discord = require('discord.js');
const config = require('./config.json')
const mysqlConfig = require('./mysqlconfig.json')

// Initialize the Discord Client (With Intents and Partials)

global.client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildBans],
    partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.GuildMember, Discord.Partials.User, Discord.Partials.ThreadMember]
});

// Mysql Database configuration and handling

const mysql = require('mysql2')
const fs = require('fs');

const database_config = {
    host: mysqlConfig.HOST,
    user: mysqlConfig.USER,
    password: mysqlConfig.PASSWORD,
    database: mysqlConfig.DATABASE,
    port: mysqlConfig.PORT
};

global.database;

async function handleDisconnect() {
    return new Promise(function (resolve, reject) {
        database = mysql.createConnection(database_config); 
        // Recreate the connection, since the old one cannot be reused.

        // The server is either down or restarting.
        database.connect(function (err) {                  
            if (err) {                                       
                //console.log('Error when connecting to database:', err);
                setTimeout(handleDisconnect, 2000)
                 // We introduce a delay before attempting to reconnect, to avoid a hot loop, and to allow our node script to process asynchronous requests in the meantime.
            }
        });                                     
        // If you're also serving http, display a 503 error.
        database.on('error', function (err) {
            //console.log('db error', err);

            // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout (the wait_timeout server variable configures this)
            if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
                handleDisconnect().catch(err => {         
                    console.log(err)                       
                });                                        
            } else if (err.fatal) {
                // The connection encountered a fatal error and shut down.
                handleDisconnect().catch(err => {          
                    console.log(err)
                });
            } else {
                reject(err);
            }
        });
        resolve()
    })
}

handleDisconnect().catch(err => {
    console.error("Could not connect to mySQL databse: ", err)
    client.destroy();
    process.exit();
});

// Initialize the commands

client.commands = new Discord.Collection();

const FunDir = fs.readdirSync('./Bot/Commands/Fun').filter(file => file.endsWith('.js'));
const ModDir = fs.readdirSync('./Bot/Commands/Moderation').filter(file => file.endsWith('.js'));
const NSFWDir = fs.readdirSync('./Bot/Commands/NSFW').filter(file => file.endsWith('.js'));
const OthersDir = fs.readdirSync('./Bot/Commands/Others').filter(file => file.endsWith('.js'));

const commandfile = FunDir.concat(ModDir, NSFWDir, OthersDir)

for (const file of commandfile) {
    var command
    if (FunDir.includes(file)) {
        command = require(`./Bot/Commands/Fun/${file}`);
    }
    if (ModDir.includes(file)) {
        command = require(`./Bot/Commands/Moderation/${file}`);
    }
    if (NSFWDir.includes(file)) {
        command = require(`./Bot/Commands/NSFW/${file}`);
    }
    if (OthersDir.includes(file)) {
        command = require(`./Bot/Commands/Others/${file}`);
    }
    client.commands.set(command.name, command);
}

// Start the modules when the client is logged in.

function startModules() {
    var requireDir = require('require-dir');
    var dir = requireDir('./Bot/Side_Modules')

    Object.keys(dir).forEach(async function (key) {
        var module = dir[key];

        if (!module.hasOwnProperty('start')) return

        await module.start(client)
    });
}

client.on('ready', async () => {
    startModules()
    console.log('Online!');

    client.user.setActivity(`${config.DEFAULTPREFIX}help | ANDRO Studios.`, {
        status: "online",
        game: {
            type: "PLAYING" // PLAYING, WATCHING, LISTENING, STREAMING
        }
    });
})

// Handling uncaught exceptions.

process.on('uncaughtException', err => {
    console.error('There was an uncaught error: ', err)
})

// Logging in.

client.login(config.TOKEN);

