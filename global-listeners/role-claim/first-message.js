const addReactions = (message, reactions) => {
    message.react(reactions[0]);
    reactions.shift();
    if (reactions.length > 0) {
        addReactions(message, reactions);
        setTimeout(() => {}, 750);
    }
};

// Puts content into a Text Channel
module.exports = async (client, id, text, reactions = []) => {
    const channel = await client.channels.fetch(id);

    channel.messages.fetch().then((messages) => {
        if (messages.size === 0) {
            // Send a new Message
            channel.send(text).then((message) => {
                addReactions(message, reactions);
            });
        } else {
            // Edit the existing message
            for (const message of messages) {
                // console.log(message); - see contents in terminal
                message[1].edit(text);
                addReactions(message[1], reactions);
            }
        }
    });
};
