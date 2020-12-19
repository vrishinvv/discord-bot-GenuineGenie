const mongo = require('@root/database/mongo');
const profileSchema = require('@schemas/profile-schema');

module.exports = async (name, userId) => {
    return await new profileSchema({
        name,
        userId,
        coins: 500,
        vault_coins: 500,
        vault_size: 500,
        items: JSON.stringify({}),
        huntedCount: 0,
        fishedCount: 0,
        inventoryCount: 0,
        commands_issued: 0,
    }).save();
};
