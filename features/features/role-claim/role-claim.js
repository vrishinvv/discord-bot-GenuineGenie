const mongo = require('@root/database/mongo');
const roleclaimSchema = require('@schemas/roleclaim-schema');

let roleclaimCache = {};
// guildId: [channelid, assigns]

const addToCache = (guildId, channelId, emojiRoles) => {
    roleclaimCache[guildId] = [channelId, emojiRoles];
};

const delFromCache = (guildId, channelId) => {
    delete roleclaimCache[guildId];
};

const loadCache = async () => {
    const results = await mongo().then(async (mongoose) => {
        try {
            return await roleclaimSchema.find({});
        } finally {
        }
    });

    for (const { guildId, channelId, emojiRoles } of results) {
        roleclaimCache[guildId] = [channelId, JSON.parse(emojiRoles)];
    }
    console.log('finsihed loading role claim CACHE');
};

const onMessage = async (message, old) => {
    const customEmoji = (emojiName) => {
        emojiName = emojiName.split(':')[1];
        return guild.emojis.cache.find((emoji) => emoji.name === emojiName);
    };

    if (message.member.user.bot) return;
    const { guild, content, channel } = message;
    //message.reactions.removeAll();

    if (!roleclaimCache[guild.id]) return;
    const [channelId, emojiRoles] = roleclaimCache[guild.id];

    if (channelId !== channel.id) {
        return;
    }
    if (!emojiRoles) return;

    //console.log(emojiRoles);
    const eachLine = content.split('\n');
    for (const line of eachLine) {
        if (line.includes('=')) {
            const split = line.split('=');
            let emoji = split[0].trim();
            const orig = emoji;
            emoji = emoji.replace(/^[a-zA-Z0-9\(\)\,\.\[\] ]*/, '');
            //console.log('inside', emoji);
            if (customEmoji(emoji)) emoji = customEmoji(emoji).name;

            if (!emojiRoles[emoji]) {
                message
                    .reply(`${emoji} is not registered\n**TIP** use commmand \`roleassign\` to register role`)
                    .then((message) => {
                        message.delete({
                            timeout: 7 * 1000,
                        });
                    });
                continue;
            }

            try {
                message.react(orig).catch((err) => {
                    console.log(err);
                });
            } catch {
                message.reply('Incorrect Syntax!\n`<emoji> = <role_name>` is strictly binding').then((message) => {
                    message.delete({
                        timeout: 10 * 1000,
                    });
                    return;
                });
            }
        }
    }
};

const displaySampleMessage = (channel, client) => {
    const getEmoji = (emojiName) => client.emojis.cache.find((emoji) => emoji.name === emojiName);
    const emojis = {
        '🅰️': '',
        '🅱️': '',
        '🅾️': '',
        '🆎': '',
    };

    let emojiText = 'Choose reaction(s) to claim a role!\n\n';
    for (const key in emojis) {
        const emoji = getEmoji(key);
        const role = `<some_valid_role_name>`;
        emojiText += `${key} = ${role}\n`;
    }

    emojiText +=
        '\nThis is a sample message to help you set up your `role claim channel`.\n*you can copy-paste this template if you want!*\n\n**This Message will auto delete in `60`s**';
    //setting the init_message in a 'particular' role-claim Channel
    channel.send(emojiText).then((message) => {
        setTimeout(() => {
            message.delete();
        }, 60 * 1000);
    });
};

const handleReacion = (reaction, user, add) => {
    // Just ignore the bot
    if (user.id === '786230987964809257') {
        return;
    }

    if (!roleclaimCache[reaction.message.guild.id]) return;
    const [channelId, emojiRoles] = roleclaimCache[reaction.message.guild.id];

    if (channelId !== reaction.message.channel.id) {
        return;
    }

    //console.log(reaction._emoji);
    const emoji = reaction._emoji.name;
    const { guild } = reaction.message;

    const roleName = emojiRoles[emoji];
    if (!roleName) {
        return;
    }

    const role = guild.roles.cache.find((role) => {
        return role.name === roleName;
    });
    if (!role) {
        reaction.message.reply(`There is no role \`${roleName}\``);
        return;
    }

    // Member object has more information than the User object
    const member = guild.members.cache.get(user.id);

    // Give/remove the role
    if (add) {
        member.roles.add(role);
    } else {
        member.roles.remove(role);
    }
};

module.exports = async (client) => {
    await loadCache();
    for (const [guildId, [channelId, emojiRoles]] of Object.entries(roleclaimCache)) {
        // returns an actual emoji object, and emojiName = actual name of the emoji
        const guild = client.guilds.cache.get(guildId);
        const channel = guild.channels.cache.get(channelId);
        await channel.messages.fetch();
    }

    // We need to add a couple of event listeners now
    client.on('messageReactionAdd', (reaction, user) => {
        handleReacion(reaction, user, true);
    });

    client.on('messageReactionRemove', (reaction, user) => {
        handleReacion(reaction, user, false);
    });

    client.on('messageUpdate', (oldMessage, newMessage) => {
        onMessage(newMessage, oldMessage);
    });

    client.on('message', (message) => {
        onMessage(message);
    });
};

module.exports.addToCache = addToCache;
module.exports.delFromCache = delFromCache;
module.exports.roleclaimCache = () => {
    return roleclaimCache;
};

module.exports.displaySampleMessage = displaySampleMessage;
