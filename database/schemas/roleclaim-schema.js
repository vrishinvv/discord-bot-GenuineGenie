const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const roleclaimSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    emojiRoles: reqString,
});

module.exports = mongoose.model('roleclaim-channels', roleclaimSchema);
