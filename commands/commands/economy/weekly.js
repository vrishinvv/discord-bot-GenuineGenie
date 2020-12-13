const mongo = require('@root/database/mongo');
const weeklyRewardsSchema = require('@schemas/weekly-rewards-schema');
const updateCoins = require('@utils/updateCoins');
const updateXP = require('@utils/updateXP');

// Array of member IDs who have claimed their weekly rewards in the last 24hrs
// Resets every 20 mins
let claimedCache = [];
const clearCache = () => {
    claimedCache = [];
    setTimeout(clearCache, 20 * 1000 * 60);
};
clearCache();

module.exports = {
    commands: ['weekly'],
    description: 'get some fantastic weekly rewards',
    expectedArgs: "<user's @>",
    /* cooldown: 5,
    repeats: 3, */
    callback: async (message, arguments, text) => {
        const { guild, member } = message;
        const { id } = member;

        if (claimedCache.includes(id)) {
            console.log('returning from cache');
            message.reply(`you have already claimed your **weekly** rewards!`);
            return;
        }

        console.log('Fetching from Mongo');

        const obj = {
            userId: id,
        };

        await mongo().then(async (mongoose) => {
            try {
                const results = await weeklyRewardsSchema.findOne(obj);
                if (results) {
                    const then = new Date(results.updatedAt).getTime();
                    const now = new Date().getTime();

                    const diffTime = Math.abs(now - then);
                    const diffWeekly = diffTime / (1000 * 60 * 60 * 7);

                    if (diffWeekly <= 1) {
                        claimedCache.push(id);
                        message.reply(`you have already claimed your **weekly** rewards!`);
                        return;
                    }
                }

                await weeklyRewardsSchema.findOneAndUpdate(obj, obj, { new: true, upsert: true });

                claimedCache.push(id);

                const coins = Math.floor(Math.random() * 1000) + 2000;
                await updateCoins(message.author.id, coins);

                const XP = Math.floor(Math.random() * 70) + 70;
                await updateXP(message.author.id, XP, message);

                message.reply(
                    `AMAZE! a blessing? a miracle? **${coins}** coins and \`${XP}\`XP got instantly trasnferred to you`
                );
            } finally {
            }
        });
    },
    permissions: [],
    requiredRoles: [],
};
