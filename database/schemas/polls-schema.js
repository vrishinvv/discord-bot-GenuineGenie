const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const pollsSchema = mongoose.Schema({
    channelId: reqString,
});

module.exports = mongoose.model('polls-channels', pollsSchema);
