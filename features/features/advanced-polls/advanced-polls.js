const { onMessage } = require('@commands/management/set-polls');
module.exports = (client) => {
    client.on('message', (message) => {
        onMessage(message);
    });
};
