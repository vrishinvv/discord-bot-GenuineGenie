const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const suggestionsSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
});

module.exports = mongoose.model('suggestions-schema', suggestionsSchema);
