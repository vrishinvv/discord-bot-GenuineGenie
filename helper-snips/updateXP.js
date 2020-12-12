const mongo = require('../mongo');
const profileSchema = require('../database/schemas/profile-schema');
const updateUser = require('./updateUser');
const addUser = require('./addUser');
const { commands } = require('../commands/invites');

module.exports = async (userId, delta, message) => {
    if (userId === '786230987964809257') {
        return;
    }

    return await mongo().then(async (mongoose) => {
        try {
            let result = await profileSchema
                .findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            xp: delta,
                            commands_issued: 1,
                        },
                    },
                    {
                        new: true,
                    }
                )
                .exec();

            if (!result) {
                await addUser(message.author.username, userId);
                return;
            }

            let { xp, level, vault_size, commands_issued } = result;
            const needed = level * 200 + commands_issued * 10;
            if (xp >= needed) {
                level = level + 1;
                xp -= needed;
                vault_size += level * (43 + commands_issued);
                result.xp = xp;
                result.level = level;
                result.vault_size = vault_size;
                console.log(result);
                await updateUser(userId, result);
                message.reply(`:confetti_ball: You are now Level **${level}**! Use bot-commands to gain more XP!`);
            }

            return result;
        } finally {
            //mongoose.connection.close();
        }
    });
};
