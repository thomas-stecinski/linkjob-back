const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');


const cvSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4()
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    education: [{
        type: Schema.Types.ObjectId,
        ref: 'Education'
    }],
    experiences: [{
        type: Schema.Types.ObjectId,
        ref: 'Experience'
    }],
    hobbies: [{
        type: Schema.Types.ObjectId,
        ref: 'Hobbies'
    }],
    statusUuid: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);
