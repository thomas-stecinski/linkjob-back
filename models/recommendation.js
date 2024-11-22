const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const recommendationSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4()
    },
    commentatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    cvId: {
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    statusId: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    }
}, { timestamps: true });
recommendationSchema.index({ createdAt: 1 });
recommendationSchema.index({ cvId: 1, authorId: 1 }, { unique: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
