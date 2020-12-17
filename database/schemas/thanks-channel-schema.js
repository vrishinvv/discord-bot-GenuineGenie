const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const thanksSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
});

module.exports = mongoose.model('thanks-channel-schema', thanksSchema);
