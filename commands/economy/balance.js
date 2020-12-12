const Discord = require('discord.js');
const getUser = require('../../helper-snips/getUser');

module.exports = {
    commands: ['bal', 'balance'],
    expectedArgs: "<user's @>",
    permissionError: '',
    maxArgs: 1,
    /* cooldown: 5,
    repeats: 3, */
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first() || message.author;
        const targetId = target.id;
        const name = target.username;
        const result = await getUser(name, targetId);
        let desc = `coins:\t **${result.coins}**`;
        desc += `\nvault:\t **${result.vault_coins}/${result.vault_size}**`;
        const embed = new Discord.MessageEmbed().setTitle(`${name}'s richness`).setDescription(desc);
        //message.channel.send(`<@${targetId}> has **${coins}** coins`);
        message.channel.send(embed);
    },
    permissions: [],
    requiredRoles: [],
};
