const mongo = require('@root/database/mongo');
const pollsSchema = require('@schemas/polls-schema');

let pollsCache = {};
// guildId: channelId

const onMessage = async (message) => {
    if (message.member.user.bot) return;
    const { guild, content, channel } = message;
    message.reactions.removeAll();

    const curchannelId = pollsCache[guild.id];

    if (curchannelId !== channel.id) {
        return;
    }

    const eachLine = content.split('\n');

    for (const line of eachLine) {
        if (line.includes('=')) {
            const split = line.split('=');
            let emoji = split[0].trim();
            emoji = emoji.replace(/^[a-zA-Z0-9\(\)\,\.\[\]\: ]*/, '');

            try {
                message.react(emoji).catch((err) => {
                    console.log(err);
                });
            } catch {
                message.reply("you probably forgot that ' = ' has to have an emoji on the left!").then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 10 * 1000);
                    return;
                });
            }
        }
    }
};

const addToCache = (guildId, channelId) => {
    pollsCache[guildId] = channelId;
};

const delFromCache = (guildId, channelId) => {
    delete pollsCache[guildId];
};

const loadCache = async () => {
    const results = await mongo().then((mongoose) => {
        try {
            return pollsSchema.find({});
        } finally {
        }
    });

    for (const { guildId, channelId } of results) {
        pollsCache[guildId] = channelId;
    }
    console.log('finsihed loading polls CACHE');
};

module.exports = (client) => {
    loadCache();
    client.on('message', (message) => {
        onMessage(message);
    });
    client.on('messageUpdate', (oldMessage, newMessage) => {
        onMessage(newMessage);
    });
};

module.exports.addToCache = addToCache;
module.exports.delFromCache = delFromCache;

module.exports.cache = () => {
    return pollsCache;
};
