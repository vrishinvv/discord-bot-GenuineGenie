const mongo = require('@root/database/mongo');
const thanksSchema = require('@schemas/thanks-schema');
const thanksChannelSchema = require('@schemas/thanks-channel-schema');

const fetchTopMembers = async (guildId, guild) => {
    const role = guild.roles.cache.find((role) => role.name === 'Helping Herald');
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

    text += `\nThis is updated every \`30\`mins...`;
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

                const text = await fetchTopMembers(guildId, guild);

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
    client.on('message', (message) => {
        const { content, member, guild } = message;
        const getPrefix = require('@root/commands/command-base').getPrefix;
        const prefix = getPrefix(client, guild.id);
        if (content.toLowerCase().startsWith(prefix) || member.user.bot) return;

        const res = content.match(/thank/g);
        if (res) {
            message.channel.send(`**TIP** Want to thank someone? Use \`${prefix} thank <Their@>\``);
        }
    });
};
