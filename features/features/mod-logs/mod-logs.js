const roles = ['Moderator'];

const mongo = require('@root/database/mongo');
const modlogsSchema = require('@schemas/modlogs-schema');

let modlogsCache = {};
// guildID : channelId

const delFromCache = (guildId, channelId) => {
    delete modlogsCache[guildId];
};

const addToCache = (guildId, channelId) => {
    modlogsCache[guildId] = channelId;
};

const loadCache = async () => {
    const results = await mongo().then((mongoose) => {
        try {
            return modlogsSchema.find({});
        } finally {
        }
    });

    for (const { guildId, channelId } of results) {
        modlogsCache[guildId] = channelId;
    }
    console.log('finsihed loading modlogs CACHE');
};

module.exports = async (client) => {
    loadCache();
    client.on('message', (message) => {
        const { content, member, guild } = message;
        if (member.user.bot) return;

        const hasRole = member.roles.cache.find((role) => {
            return roles.includes(role.name);
        });

        const channelId = modlogsCache[guild.id];
        if (hasRole && channelId) {
            const channel = guild.channels.cache.get(channelId);
            channel.send(`\`<${member.user.tag}>\` in <#${message.channel.id}> sent,\n${content}`);
        }
    });
};

module.exports.addToCache = addToCache;
module.exports.delFromCache = delFromCache;
module.exports.cache = () => {
    return modlogsCache;
};
