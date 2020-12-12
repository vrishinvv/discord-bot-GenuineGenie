module.exports = {
    commands: ['ping'],
    description: 'replies with pong',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text, client) => {
        message.reply(`Calculating ping...`).then((res) => {
            const ping = res.createdTimestamp - message.createdTimestamp;
            res.edit(`Pong!\nBOT Latency: **${ping}**\nAPI Latency: **${client.ws.ping}**`);
        });
    },
};
