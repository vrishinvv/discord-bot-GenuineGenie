const firstMessage = require('./first-message.js');

module.exports = (client) => {
    const channelId = '786827083618713611';

    // returns an actual emoji object, and emojiName = actual name of the emoji
    const getEmoji = (emojiName) => client.emojis.cache.find((emoji) => emoji.name === emojiName);

    // emoji_name : role_name
    const emojis = {
        javascript: 'JavaScript',
        python: 'Python',
    };

    const reactions = [];

    let emojiText = 'Choose reaction(s) to claim a role!\n\n';
    for (const key in emojis) {
        const emoji = getEmoji(key);
        reactions.push(emoji);

        const role = emojis[key];
        emojiText += `${emoji} = ${role}\n`;
    }

    //setting the init_message in a 'particular' role-claim Channel
    firstMessage(client, channelId, emojiText, reactions);

    const handleReacion = (reaction, user, add) => {
        // Just ignore the bot
        if (user.id === '786230987964809257') {
            return;
        }

        const emoji = reaction._emoji.name;
        const { guild } = reaction.message;

        const roleName = emojis[emoji];
        if (!roleName) {
            return;
        }

        const role = guild.roles.cache.find((role) => {
            return role.name === roleName;
        });
        if (!role) {
            message.reply(`There is no role "${roleName}"`);
        }

        // Member object has more information than the User object
        const member = guild.members.cache.get(user.id);

        console.log(roleName);
        // Give/remove the role
        if (add) {
            member.roles.add(role);
        } else {
            member.roles.remove(role);
        }
    };

    // We need to add a couple of event listeners now
    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReacion(reaction, user, true);
        }
    });

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReacion(reaction, user, false);
        }
    });
};
