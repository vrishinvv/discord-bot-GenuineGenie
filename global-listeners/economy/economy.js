const getUser = require('../../helper-snips/getUser');
const mongo = require('../../mongo');

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
