const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const modlogsSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
});

module.exports = mongoose.model('modlogs-schema', modlogsSchema);
