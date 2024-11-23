const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');


const cvSchema = new Schema({
    id: {
        type: String,
        unique: true,
        default: () => uuidv4()
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
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
    statusuuid: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);
