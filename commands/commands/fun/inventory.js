const { MessageEmbed } = require('discord.js');
const getUser = require('@utils/getUser');

module.exports = {
    commands: ['inventory'],
    description: "shows yours'/user's inventory",
    expectedArgs: "<user's @>(opt)",
    permissionError: '',
    callback: async (message, arguments, text, client) => {
        const target = message.mentions.users.first() || message.author;
        const targetId = target.id;
        const name = target.username;
        const member = message.guild.members.cache.get(targetId);

        const result = await getUser(name, targetId);
        let desc = ``;
        const items = JSON.parse(result.items);

        for (const [key, value] of Object.entries(items)) {
            desc += `${value.emoji} **x ${value.count}** - \`${key}\`\n`;
        }

        const embed = new MessageEmbed()
            .setAuthor(`${name}'s Inventory`, target.displayAvatarURL())
            .setDescription(desc)
            .setColor('RANDOM');

        message.channel.send(embed);
    },
    permissions: [],
    requiredRoles: [],
};
