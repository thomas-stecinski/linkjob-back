const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    roleid: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
