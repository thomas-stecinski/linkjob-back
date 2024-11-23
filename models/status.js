const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    label: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Status', statusSchema);
