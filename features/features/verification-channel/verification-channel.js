const mongo = require('@root/database/mongo');
const verificationChannelsSchema = require('@schemas/verification-channels-schema');

// { 'channelId' : 'roleId' }
let verificationCache = {};

const fetchData = async (client) => {
    console.log('FETCHING DATA - verifcation channel - cache populate');

    await mongo().then(async (mongoose) => {
        try {
            const results = await verificationChannelsSchema.find({});

            for (const result of results) {
                const { guildId, channelId, roleId } = result;
                const guild = client.guilds.cache.get(guildId);
                if (guild) {
                    const channel = guild.channels.cache.get(channelId);
                    if (channel) {
                        verificationCache[channelId] = roleId;
                        //console.log(channel);
                        // this will read all messsages and trigger appropriate liserners
                        // this is to accomdate the time when the bot is offline and stuff
                        channel.messages.fetch().then((message) => {
                            //console.log(message);
                            for (const [author, m] of message) {
                                const { guild } = m;
                                const reactionsCache = m.reactions.cache;
                                for (const [dummy, value] of reactionsCache) {
                                    value.users.fetch().then((res) => {
                                        for (const [id, val] of res) {
                                            const member = guild.members.cache.get(id);
                                            member.roles.add(roleId);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        } finally {
        }
    });
};

const populateCache = async (client) => {
    verificationCache = {};

    await fetchData(client);
    //console.log('athellam fetch panni mudichachu rasa');

    setTimeout(populateCache, 1000 * 60 * 10);
};

module.exports = (client) => {
    populateCache(client);

    client.on('messageReactionAdd', (reaction, user) => {
        const channelId = reaction.message.channel.id;
        const roleId = verificationCache[channelId];

        //console.log('im printing this: ', roleId, user);
        if (roleId) {
            const { guild } = reaction.message;

            //guild member has more p   roperties than user object. though the ids are same
            const member = guild.members.cache.get(user.id);
            member.roles.add(roleId);
        }
    });

    client.on('messageReactionRemove', (reaction, user) => {
        const channelId = reaction.message.channel.id;
        const roleId = verificationCache[channelId];

        //console.log('im printing this: ', roleId, user);
        if (roleId) {
            const { guild } = reaction.message;

            //guild member has more p   roperties than user object. though the ids are same
            const member = guild.members.cache.get(user.id);
            member.roles.remove(roleId);
        }
    });
};

module.exports.fetch = fetchData;
