const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
        type: String
    }],
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
