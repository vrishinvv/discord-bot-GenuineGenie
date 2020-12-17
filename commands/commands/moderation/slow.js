module.exports = {
    commands: ['slow'],
    expectedArgs: '<duration> -or- "off"',
    description: 'you will be able to send a message once every x secs, when this mode is enabled',
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments, text) => {
        const { channel } = message;
        let duration = arguments[0].toLowerCase();
        if (duration === 'off') {
            message.reply(`you have turned off \`slow mode\` for this channel`);
            duration = 0;
        }

        if (isNaN(duration)) {
            message.reply('Please enter a valid duration or the word "off"');
            return;
        }

        channel.setRateLimitPerUser(duration);
        if (duration !== 0) {
            message.reply(`the \`slow mode\` has been set for this channel at **${duration}**s`);
        }
    },

    requiredRoles: 'Moderator',
};
