const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const hobbiesSchema = new Schema({
    id: {
        type: String,
        unique: true,
        index: true,
        default: () => uuidv4()
    },
    cvId: {
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hobby: {
        type: String,
        required: true,
    }
}, { timestamps: true });
hobbiesSchema.index({ createdAt: 1 });
hobbiesSchema.index({ cvId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Hobbies', hobbiesSchema);
