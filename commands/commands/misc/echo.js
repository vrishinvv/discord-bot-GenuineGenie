const dissapearingMessage = require('@utils/temp-message');
module.exports = {
    commands: ['echo'],
    expectedArgs: '<duration>(o) <message>',
    description: 'echoes amessage for a set duration. forever by default',
    callback: (message, arguments, text) => {
        const { channel } = message;
        if (isNaN(arguments[0])) {
            dissapearingMessage(channel, text);
            return;
        }
        const duration = +arguments[0];
        arguments.shift();
        text = arguments.join(' ');
        dissapearingMessage(channel, text, duration);
    },
    permissions: [],
    requiredRoles: [],
};
