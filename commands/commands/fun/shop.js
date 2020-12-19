const { MessageEmbed } = require('discord.js');
const getUser = require('@utils/getUser');
const { items } = require('@root/replies/shop');

module.exports = {
    commands: ['shop'],
    description: 'displays the in-game shop from which users can buy items',
    permissionError: '',
    callback: async (message, arguments, text, client) => {
        let desc = ``;
        for (const [emoji, name, info, cost] of items) {
            desc += `${emoji} \`${name}\` - **${cost.toLocaleString()}** 🪙\n${info}\n\n`;
        }
        const embed = new MessageEmbed().setAuthor(`Shop items`).setDescription(desc).setColor('RANDOM');
        message.channel.send(embed);
    },
    permissions: [],
    requiredRoles: [],
};
