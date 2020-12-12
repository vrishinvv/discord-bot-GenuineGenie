const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqNumber = {
    type: Number,
    required: true,
};

const reqBoolean = {
    type: Boolean,
    required: true,
};

const dailyRewardsSchema = mongoose.Schema(
    {
        userId: reqString,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('daily-rewards', dailyRewardsSchema);
