module.exports = {
    commands: ['create-tc'],
    expectedArgs: '<tc_name>',
    description: 'creates a text channel',
    minArgs: 1,
    maxArgs: null,
    callback: (message, arguments, text) => {
        message.guild.channels
            .create(text, {
                type: 'text',
            })
            .then((channel) => {
                console.log(`${message.author.id} created a new text channel: '${text}'`);

                // Add a channel to a particular category
                // channel.setParent('<categoryID>')
            });
    },
};
