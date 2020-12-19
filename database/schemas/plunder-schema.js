const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const plunderSchema = mongoose.Schema(
    {
        userId: reqString,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('plunder-schema', plunderSchema);
