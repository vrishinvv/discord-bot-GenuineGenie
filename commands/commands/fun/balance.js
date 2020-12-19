const Discord = require('discord.js');
const getUser = require('@utils/getUser');

module.exports = {
    commands: ['balance', 'bal'],
    description: "shows yours'/user's richness value, your hot coins and your vault coins",
    expectedArgs: "<user's @>(opt)",
    permissionError: '',
    maxArgs: 1,
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first() || message.author;
        const targetId = target.id;
        const name = target.username;
        const result = await getUser(name, targetId);
        let desc = `coins:\t **${result.coins.toLocaleString()}**`;
        desc += `\nvault:\t **${result.vault_coins.toLocaleString()}/${result.vault_size.toLocaleString()}**`;
        desc += `\nTotal: **${(result.coins + result.vault_coins).toLocaleString()}**`;
        const embed = new Discord.MessageEmbed().setTitle(`${name}'s richness`).setDescription(desc);
        //message.channel.send(`<@${targetId}> has **${coins}** coins`);
        message.channel.send(embed);
    },
    permissions: [],
    requiredRoles: [],
};
