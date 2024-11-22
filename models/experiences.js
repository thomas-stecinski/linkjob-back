const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const experienceSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index:true,
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
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });
experienceSchema.index({ createdAt: 1 });
experienceSchema.index({ cvId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Experience', experienceSchema);
