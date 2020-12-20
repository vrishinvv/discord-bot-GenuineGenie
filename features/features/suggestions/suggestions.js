const mongo = require('@root/database/mongo');

const suggestionsSchema = require('@schemas/suggestions-schema');
const { MessageEmbed } = require('discord.js');

let suggestionsCache = {};

const statusMessages = {
    WAITING: {
        text: '📊 Waiting for community feedback, please vote!',
        color: 0xffea00,
    },
    ACCEPTED: {
        text: '✅ Accepted Idea! Expect this soon.',
        color: 0x34eb5b,
    },
    DENIED: {
        text: '❌ Thank you for the idea. But we are not able to pursue with this currently!',
        color: 0xc20808,
    },
};

const fetchSuggestionsChannels = async (guildId) => {
    let query = {};

    if (guildId) {
        query.guildId = guildId;
    }

    const results = await mongo().then((mongoose) => {
        try {
            return suggestionsSchema.find(query);
        } finally {
        }
    });

    for (const { guildId, channelId } of results) {
        suggestionsCache[guildId] = channelId;
    }
    console.log('finsihed loading suggestions CACHE');
};

module.exports = (client) => {
    fetchSuggestionsChannels();

    client.on('message', (message) => {
        const { guild, channel, content, member } = message;
        const cachedChannelId = suggestionsCache[guild.id];
        if (cachedChannelId && cachedChannelId === channel.id && !member.user.bot) {
            const status = statusMessages.WAITING;

            const embed = new MessageEmbed()
                .setColor(status.color)
                .setDescription(content)
                .setAuthor(member.displayName, member.user.displayAvatarURL())
                .addFields({ name: 'Status', value: status.text })
                .setFooter('Want to suggest something? Simply type it in this channel');

            channel.send(embed).then((message) => {
                message.react('👍').then(() => {
                    message.react('👎');
                });
            });

            message.delete();
        }
    });
};

module.exports.fetchSuggestionsChannels = fetchSuggestionsChannels;
module.exports.statusMessages = statusMessages;
module.exports.suggestionsCache = () => {
    return suggestionsCache;
};
