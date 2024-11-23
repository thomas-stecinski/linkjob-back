const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const educationSchema = new Schema({
    cvid: {
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true,
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    statusid: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    institution: {
        type: String,
        required: true,
    },
    startdate: {
        type: Date,
        required: false,
    },
    enddate: {
        type: Date,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Correction de l'index
educationSchema.index({ cvid: 1, userid: 1 }, { unique: true });

module.exports = mongoose.model('Education', educationSchema);
