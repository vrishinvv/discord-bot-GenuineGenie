const mongo = require('../../mongo');
const updateXP = require('../../helper-snips/updateXP');
module.exports = (client) => {
    client.on('message', (message) => {
        const { guild, member } = message;

        updateXP(member.id, 23, message);
    });
};
