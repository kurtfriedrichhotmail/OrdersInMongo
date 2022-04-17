const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CDSchema = new Schema({
    StoreID: {
        type: String,
        required: true
    },
    SalesPersonID: {
        type: String,
        required: true
    },
    CdID: {
        type: String,
        required: true
    },
    PricePaid: {
        type: Number,
        required: true
    },
    Date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("CDs", CDSchema);