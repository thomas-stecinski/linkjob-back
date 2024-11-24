const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const hobbiesSchema = new Schema({
    cvid: {
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hobby: {
        type: String,
        required: true,
    }
}, { timestamps: true });


module.exports = mongoose.model('Hobbies', hobbiesSchema);
