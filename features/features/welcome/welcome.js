const mongo = require('@root/database/mongo');
const welcomeSchema = require('@schemas/welcome-schema');

let welcomeCache = {};
// guildID : [channelId, text]
const onJoin = async (member) => {
    const { guild } = member;

    // fetch from db
    if (!welcomeCache[guild.id]) return;

    let [channelId, text] = welcomeCache[guild.id];
    if (!channelId) {
        return;
    }

    const channel = guild.channels.cache.get(channelId);
    text = text.replace(/<@>/g, `<@${member.user.id}>`);
    channel.send(text);
};

const delFromCache = (guildId, channelId, text) => {
    delete welcomeCache[guildId];
};

const addToCache = (guildId, channelId, text) => {
    welcomeCache[guildId] = [channelId, text];
};

const loadCache = async () => {
    const results = await mongo().then((mongoose) => {
        try {
            return welcomeSchema.find({});
        } finally {
        }
    });

    for (const { guildId, channelId, text } of results) {
        welcomeCache[guildId] = [channelId, text];
    }
    console.log('finsihed loading welcome CACHE');
};

module.exports = async (client) => {
    await loadCache();
    // set up event listner for channel
    client.on('guildMemberAdd', (member) => {
        onJoin(member);
    });
};

module.exports.addToCache = addToCache;
module.exports.delFromCache = delFromCache;
module.exports.cache = () => {
    return welcomeCache;
};
