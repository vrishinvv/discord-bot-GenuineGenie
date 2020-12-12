module.exports = {
    commands: ['ping'],
    description: 'replies with pong',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        message.reply('Pong!');
    },
};
