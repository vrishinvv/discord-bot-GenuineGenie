const mongo = require('../mongo');
const profileSchema = require('../database/schemas/profile-schema');

module.exports = async (userId, delta) => {
    return await mongo().then(async (mongoose) => {
        try {
            let result = await profileSchema
                .findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: delta,
                        },
                    }
                )
                .exec();
            return result;
        } finally {
            //mongoose.connection.close();
        }
    });
};
