module.exports = {
    commands: ['set-vc'],
    expectedArgs: '<vc_name>',
    description: 'creates a voice channel',
    minArgs: 1,
    maxArgs: null,
    callback: (message, arguments, text) => {
        message.guild.channels
            .create(text, {
                type: 'voice',
            })
            .then((channel) => {
                console.log(`${message.author.id} created a new voice channel: '${text}'`);
                // channel.setUserLimit(10);
            });
    },
};
