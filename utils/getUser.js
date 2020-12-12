const mongo = require('@root/database/mongo');
const profileSchema = require('@schemas/profile-schema');
const addUser = require('./addUser');

module.exports = async (name, userId) => {
    return await mongo().then(async (mongoose) => {
        try {
            console.log(`getting user ${name}`);
            let result =
                (await profileSchema.findOne({
                    userId,
                })) || (await addUser(name, userId));
            return result;
        } finally {
            //mongoose.connection.close();
        }
    });
};
