const mongo = require('@root/database/mongo');
const profileSchema = require('@schemas/profile-schema');

module.exports = async (name, userId) => {
    return await mongo().then(async (mongoose) => {
        try {
            console.log(`adding new user ${name}`);
            return await new profileSchema({
                name,
                userId,
                coins: 500,
                vault_coins: 500,
                vault_size: 500,
                hunting_bow: false,
                fishing_rod: false,
                commands_issued: 0,
            }).save();
        } finally {
            //mongoose.connection.close();
        }
    });
};
