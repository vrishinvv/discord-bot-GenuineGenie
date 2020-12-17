const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const thanksSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    received: {
        type: Number,
        default: 0,
    },
    lastGave: Date,
});

module.exports = mongoose.model('thanks', thanksSchema);
