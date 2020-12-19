const profileSchema = require('@schemas/profile-schema');

module.exports = async (userId, delta) => {
    return await profileSchema
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
};
