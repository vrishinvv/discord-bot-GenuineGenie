const mongo = require('@root/database/mongo');
const profileSchema = require('@schemas/profile-schema');
const addUser = require('./addUser');

module.exports = async (name, userId) => {
    //console.log(`getting user ${name}`);
    return (
        (await profileSchema.findOne({
            userId,
        })) || (await addUser(name, userId))
    );
};
