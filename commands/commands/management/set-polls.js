const mongo = require('@root/database/mongo');
const pollsSchema = require('@schemas/polls-schema');

//let { cache } = require('@root/cache/polls-cache.js');

module.exports = {
    commands: ['set-polls'],
    description: 'creates a `polls channel`',
    callback: async (message, arguments, text, client) => {
        const { member, channel, guild, content } = message;

        await mongo().then(async (mongoose) => {
            try {
                await pollsSchema
                    .findOneAndUpdate(
                        {
                            channelId: channel.id,
                        },
                        {
                            channelId: channel.id,
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

        message.reply('you have set this channel to a `polls channel`!');
    },
    permissions: ['ADMINISTRATOR'],
};

module.exports.onMessage = async (message) => {
    const { guild, content, channel } = message;

    // temporarily disabled
    return;

    //console.log('FETCHING FROM DATABASE - on Message');
    let result = await mongo().then(async (mongoose) => {
        try {
            return await pollsSchema.findOne({ channelId: channel.id });
        } finally {
            //mongoose.connection.close();
        }
    });
    if (!result) return;

    const eachLine = content.split('\n');

    for (const line of eachLine) {
        if (line.includes('=')) {
            const split = line.split('=');
            const emoji = split[0].trim();
            message.react(emoji);
        }
    }
};
