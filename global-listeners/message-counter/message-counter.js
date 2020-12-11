const { requiredRoles } = require('../../commands/add');

const mongo = require('../../mongo');

const messageCountSchema = require('../../database/schemas/message-count-schema');

module.exports = (client) => {
    console.log('Listening to messages gloabally');
    client.on('message', async (message) => {
        const { author } = message;
        const { id } = author;

        await mongo().then(async (mongoose) => {
            try {
                await messageCountSchema
                    .findOneAndUpdate(
                        {
                            _id: id,
                        },
                        {
                            $inc: {
                                messageCount: 1,
                            },
                        },
                        {
                            upsert: true,
                            useFindAndModify: false,
                        }
                    )
                    .exec();
            } finally {
                //mongoose.connection.close();
            }
        });
    });
};
