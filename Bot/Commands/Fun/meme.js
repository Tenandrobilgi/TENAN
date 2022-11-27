const Discord = require('discord.js');
const got = require('got');

const { isModuleEnabled } = require('../Tools/get-data')

async function MessageMain(message) {
    const result = await isModuleEnabled(message, undefined, "FUN").catch(err => { console.log(err) })
    if (!result === true) return message.reply({ content: "**:x: This command module is disabled for this server.**" })

    const newMessage = await message.reply({ content: '<a:loading2:900416595782926367> ** Finding a meme...**' })

    got('https://www.reddit.com/r/memes/random/.json').then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${memeTitle}`)
            .setURL(`${memeUrl}`)
            .setImage(memeImage)
            .setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}` })

        newMessage.edit({ content: "", embeds: [embed] })
    }).catch(err => {
        console.log(err)
    })
}

async function InteractionMain(interaction) {
    const result = await isModuleEnabled(undefined, interaction, "FUN").catch(err => { console.log(err) })
    if (!result === true) return interaction.reply({ content: "**:x: This command module is disabled for this server.**", ephemeral: true })

    await interaction.reply({ content: '<a:loading2:900416595782926367> ** Finding a meme...**', ephemeral: false })

    got('https://www.reddit.com/r/memes/random/.json').then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${memeTitle}`)
            .setURL(`${memeUrl}`)
            .setImage(memeImage)
            .setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}` })

        interaction.editReply({ content: "", embeds: [embed] })
    }).catch(err => {
        console.log(err)
    })
}

module.exports = {
    name: 'meme',
    description: 'Get random memes!',
    execute(message, args, interaction) {
        if (interaction) {
            InteractionMain(interaction)
        } else {
            MessageMain(message)
        }
    }
}
