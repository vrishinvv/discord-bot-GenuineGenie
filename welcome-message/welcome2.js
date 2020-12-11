// havent been defined to work with the current command handler

const commandBase = require('../commands/command-base');
const mongo = require('../mongo');
const welcomeSchema = require('../schemas/welcome-schema');

module.exports = (client) => {
    commandBase(client, 'set-welcome', async (message) => {
        if (!member.hasPermsiion('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command');
            return;
        }

        const { member, channel, guild, content } = message;

        const cache = {}; // guildId: [channelId, text]

        cache[guild.id] = [cannel.id, text];

        await mongo().then(async (mongoose) => {
            try {
                await welcomeSchema
                    .findOneAndUpdate(
                        {
                            _id: guild.id,
                        },
                        {
                            _id: guild.id,
                            channelId: channel.id,
                            text,
                        },
                        {
                            upsert: true,
                        }
                    )
                    .save();
            } finally {
                mongoose.connection.close();
            }
        });

        const onJoin = async (member) => {
            const { guild } = member;

            let data = cache[guild.id];

            if (!data) {
                console.log('FETCHING FROM DATABASE');
                await mongo().then(async (mongoose) => {
                    try {
                        const result = await welcomeSchema.findOne({ id: guild.id });

                        cache[guild.id] = data = [result.channelId, result.text];
                    } finally {
                        mongoose.connection.close();
                    }
                });
            }

            const [channelId, text] = data;
            const channel = guild.channels.cache.get(challedID);

            text.replace('/<@>/g', `<@${member.user.tag}`);
            channel.send(text);

            /* console.log('added');
                const tag = `<@${member.id}>`;

                const tell = `Welcome ${tag} to the GG server! Please check out ${member.guild.channels.cache
                    .get(targetChannelId)
                    .toString()}`;

                const channel = member.guild.channels.cache.get(channelId);

                channel.send(tell); */
        };

        client.on('guildMemberAdd', (member) => {
            onJoin(member);
        });
    });
};
