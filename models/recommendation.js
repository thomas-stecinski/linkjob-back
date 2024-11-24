const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const recommendationSchema = new Schema({
    commentatorid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorid: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    cvid: {
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    statusid: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Recommendation', recommendationSchema);
