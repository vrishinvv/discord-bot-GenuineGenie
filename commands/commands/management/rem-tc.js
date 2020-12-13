module.exports = {
    commands: ['rem-tc', 'del-tc'],
    expectedArgs: '<tc_name>',
    description: 'deletes a text channel the command is run in',
    permissionError: '',
    callback: (message, arguments, text) => {
        message.channel.delete();
    },
};
