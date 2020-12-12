const getUser = require('@utils/getUser');
const mongo = require('@root/database/mongo');

module.exports = (client) => {};

module.exports.getCoins = async (name, userId) => {
    return await mongo().then(async (mongoose) => {
        try {
            const result = await getUser(name, userId);
            return result.coins;
        } finally {
            //mongoose.connection.close();
        }
    });
};
