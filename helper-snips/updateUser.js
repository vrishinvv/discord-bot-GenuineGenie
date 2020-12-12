const mongo = require('../mongo');
const profileSchema = require('../database/schemas/profile-schema');

module.exports = async (userId, diff) => {
    return await mongo().then(async (mongoose) => {
        try {
            console.log(`updating user ${name}`);
            let result = await profileSchema
                .findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $set: {
                            diff,
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
