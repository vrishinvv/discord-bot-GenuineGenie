module.exports = {
    commands: ['cc', 'clear'],
    description: 'bulk deletes set of recent messages from channel',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.channel.messages.fetch().then((results) => {
            message.channel.bulkDelete(results);
        });
    },
    requiredRoles: ['Moderator'],
};
