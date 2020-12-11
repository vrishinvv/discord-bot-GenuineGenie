module.exports = {
    commands: ['cc', 'clear'],
    permissionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.channel.messages.fetch().then((results) => {
            message.channel.bulkDelete(results);
        });
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
};
