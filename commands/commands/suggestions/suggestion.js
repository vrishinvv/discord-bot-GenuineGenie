const mongo = require('@root/database/mongo');
const suggestionsSchema = require('@schemas/suggestions-schema');
const { statusMessages, suggestionsCache } = require('@features/suggestions/suggestions');
const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['suggestion'],
    expectedArgs: '<messageID> <status> <reason>(opt)',
    description: 'updates the status of a suggestion',
    minArgs: 2,
    maxArgs: null,
    permissionError: '',
    callback: async (message, arguments, text, client) => {
        const { guild } = message;

        const messageId = arguments.shift();
        const status = arguments.shift().toUpperCase();
        const reason = arguments.join(' ');

        message.delete();

        const newStatus = statusMessages[status];

        if (!newStatus) {
            message.reply(`Unknown status "${status}", please use ${Object.keys(statusMessages)}`);
            return;
        }

        const channelId = suggestionsCache()[guild.id];
        if (!channelId) {
            message.reply(`An error ocuured! please report this!`);
            return;
        }

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            message.reply(`that suggestion channel no longer exists`);
            return;
        }

        const targetMessage = await channel.messages.fetch(messageId, false, true);
        if (!targetMessage) {
            message.reply(`that message no longer exists`);
            return;
        }

        const oldEmbed = targetMessage.embeds[0];
        const newEmbed = new MessageEmbed()
            .setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL)
            .setDescription(oldEmbed.description)
            .setColor(newStatus.color)
            .setFooter('Want to suggest something? Simply type it in this channel')
            .addFields({
                name: 'Status',
                value: `${newStatus.text}${reason ? ` Reason: ${reason}` : ''}`,
            });

        targetMessage.edit(newEmbed);
    },
    requiredRoles: ['Moderator'],
};
