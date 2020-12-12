const mongo = require('../mongo');
const profileSchema = require('../database/schemas/profile-schema');

module.exports = async (userId, diff) => {
    return await mongo().then(async (mongoose) => {
        try {
            console.log(`updating user with:::::::: `, diff);
            let result = await profileSchema
                .findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $set: {
                            name: diff.name,
                            userId: diff.userId,
                            coins: diff.coins,
                            vault_coins: diff.vault_coins,
                            vault_size: diff.vault_size,
                            hunting_bow: diff.hunting_bow,
                            fishing_rod: diff.fishing_rod,
                            commands_issued: diff.commands_issued,
                            xp: diff.xp,
                            level: diff.level,
                        },
                    },
                    {
                        new: true,
                    }
                )
                .exec();
            return result;
        } finally {
            //mongoose.connection.close();
        }
    });
};
