const mongo = require('@root/database/mongo');
const welcomeSchema = require('@schemas/welcome-schema');
//let cache = require('@root/cache/welcome-cache.js');

module.exports = {
    commands: ['set-welcome'],
    expectedArgs: '<welcome_text>',
    description: 'creates a `welcome channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

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
                    .exec();
            } finally {
                //mongoose.connection.close();
            }
        });

        message.reply('you have set this channel to a `welcome channel`!');
    },
    permissions: ['ADMINISTRATOR'],
};

module.exports.onJoin = async (member) => {
    const { guild } = member;

    // fetch from db

    console.log('FETCHING FROM DATABASE -on Join');

    let result = await mongo().then(async (mongoose) => {
        try {
            return await welcomeSchema.findOne({ _id: guild.id });
        } finally {
            //mongoose.connection.close();
        }
    });
    if (!result) return;

    let { channelId, text } = result;
    const channel = guild.channels.cache.get(channelId);

    text = text.replace(/<@>/g, `<@${member.user.tag}>`);
    channel.send(text);
};
