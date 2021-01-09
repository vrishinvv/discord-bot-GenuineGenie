const mongo = require('@root/database/mongo');
const thanksSchema = require('@schemas/thanks-schema');
const thanksChannelSchema = require('@schemas/thanks-channel-schema');

const fetchTopMembers = async (guildId, guild, channel) => {
    const role = guild.roles.cache.find((role) => role.name === 'Helping Herald');
    if (!role) {
        channel.send("please create a role 'Helping Herald' first").then((message) => {
            message.delete({ timeout: 1000 * 20 });
        });
        return;
    }

    let text = 'Gratitude is a virtue! Appreciation is another 🥺\n*Here is recognition for our **TOP** helpers:*\n';
    text += `**Top 3** users will recieve the <@&${role.id}> role\n\n`;
    const results = await thanksSchema
        .find({
            guildId,
        })
        .sort({
            received: -1,
        })
        .limit(30);

    //console.log(guild.roles.cache);
    for (let counter = 0; counter < results.length; counter++) {
        const { userId, received = 0 } = results[counter];
        const member = guild.members.cache.get(userId);
        if (!member) continue;
        text += `#${counter + 1} <@${userId}> with \`${received}\` thanks\n`;
        if (role) {
            if (counter < 3) {
                member.roles.add(role);
            } else {
                member.roles.remove(role);
            }
        }
    }

    text += `\nThis is updated every \`30\`mins...\nWe will try and reset the thanks count every month :)`;
    return text;
};

const updateLeaderBoard = async (client) => {
    const results = await thanksChannelSchema.find({});

    for (const result of results) {
        const { channelId, guildId } = result;
        const guild = client.guilds.cache.get(guildId);
        if (guild) {
            const channel = guild.channels.cache.get(channelId);
            if (channel) {
                const messages = await channel.messages.fetch();
                const firstMessage = messages.first();

                const text = await fetchTopMembers(guildId, guild, channel);

                if (firstMessage) {
                    firstMessage.edit(text);
                } else {
                    channel.send(text);
                }
            }
        }
    }

    setTimeout(() => {
        updateLeaderBoard;
    }, 30 * 60 * 1000);
};

module.exports = async (client) => {
    updateLeaderBoard(client);
    client.on('message', async (message) => {
        const { content, member, guild } = message;
        const getPrefix = require('@root/commands/command-base').getPrefix;
        const prefix = getPrefix(client, guild.id);
        if (content.toLowerCase().startsWith(prefix) || member.user.bot) return;

        const authorData = await thanksSchema.findOne({
            userId: message.author.id,
            guildId: message.guild.id,
        });

        const now = new Date();
        if (authorData && authorData.lastGave) {
            const then = new Date(authorData.lastGave);
            const diff = now.getTime() - then.getTime();

            const diffHours = Math.round(diff / (1000 * 60 * 60));
            const hours = 1;
            if (diffHours < hours) {
                //message.reply(`you have already thanked someone within the last \`${hours}hr(s)\``);
                return;
            }
        }

        const res = content.match(/th[a|e]*nks/g);
        if (res) {
            message.channel.send(`**TIP** Want to thank someone? Use \`${prefix} thank <Their@>\``).then((message) => {
                setTimeout(() => {
                    message.delete();
                }, 5 * 1000);
            });
        }
    });
};

module.exports.updateLeaderBoard = updateLeaderBoard;
