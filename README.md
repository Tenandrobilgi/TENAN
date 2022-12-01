<h1 align="center">
  <br>
  <img src="./.github/images/TENAN.png" height="150" alt="TENAN">
  <br>TENAN<br>
</h1>

An easy to use multi-purpose discord bot.

## Requirements

1. A Discord Bot Application **[(Guide)](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
<br> 1.1 Enable 'Message Content Intent', 'Presence Intent', and 'Server Members Intent' from 'Privileged Gateway Intents' on [Discord Developer Portal](https://discord.com/developers/applications/). </br>
2. Node.js v16 or higher
3. A MySQL database. 

## 🚀 Getting Started

- Open the terminal and run the commands below:

```sh
git clone https://github.com/Tenandrobilgi/TENAN.git
cd TENAN
npm install
```

- After the installation, run `npm run start` to start the bot.

## ⚙️ Bot Configuration

**`config.json`:**

```json
{
    "TOKEN": "",
    "MAINTENANCEMODE": false,
    "PROTECTEDUSERID": "",
    "PROTECTEDGUILDID": "",
    "PUBLISHCOMMANDS": false,
    "DEFAULTPREFIX": ".", 
    "TIMEOUTWAITAMOUNT": 3 
}

```

<br>`"TOKEN"`: Your bot's token.
<br>`"MAINTENANCEMODE"`: Configures bot's maintenance mode, where only the user with the `"PROTECTEDUSERID"` will be able to run the commands.
<br>`"PROTECTEDUSERID"`: The user that can bypass maintenance mode and certain commands.
<br>`"PROTECTEDGUILDID"`: The guild that can bypass maintenance mode.
<br>`"PUBLISHCOMMANDS"`: Whether or not the bot's slash commands will be published each time the bot logins in.
<br>`"DEFAULTPREFIX"`: Bot's default prefix.
<br>`"TIMEOUTWAITAMOUNT"`: The amount of time that users have to wait to run a command again.</br>

## 📊 MySQL Database Configuration

**`mysqlconfig.json`:**

```json
{
    "HOST": "",
    "USER": "",
    "PASSWORD": "",
    "DATABASE": "",
    "PORT": ""
}
```

Fill out the values above with your database information. [(Examples and more info).](https://www.npmjs.com/package/mysql)

Before running the bot, connect to your database either using an app or your terminal/client and run the command below:

```CREATE TABLE `[YOURDATABASENAME]`.`serverdatas` ( `serverId` VARCHAR(20), `serverPrefix` VARCHAR(2), `serverModules` TEXT(500), `serverLogChannelID` VARCHAR(20), `serverLogEnabled` VARCHAR(8), `customResponse` VARCHAR(8) );```

## 📝 Commands
> The default prefix is: "."

- Fun Commands
> .anime-source, .cake, .dadjoke, .flip, .meme, .randomchoose, .reddit, .search-image, .simp-rate
- Moderation Commands
> .clear, .kick, .ban, .unban
- NSFW Commands
> .rule34, .sex, .randomporn

## ⚙️📝 Command and Other Bot Configurations

Using the `.settings` command, you can configure the command modules and various other aspects of the bot for a server:

<br>`.settings prefix <newprefix>` = Change the bot's prefix.
<br>`.settings configure <module> <true/false>` = Enable or disable a command module.
<br>`.settings customresponse <true/false>` = Enable or disable the custom response.
<br>`.settings log configure <true/false>` = Enable or disable the bot logging.
<br>`.settings log channel <channel/channelId>` = Set the log channel.

## 🤝 Contributing

You can [fork](https://github.com/Tenandrobilgi/TENAN/fork) the repository, create a feature branch and submit a pull request if you'd like to.
