const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const statusSchema = new Schema({
    id: {
        type: String,
        unique: true,
        default: () => uuidv4()
    },
    label: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Status', statusSchema);
