const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const educationSchema = new Schema({
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
    statusId: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    institution: {
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
educationSchema.index({ createdAt: 1 });
educationSchema.index({ cvId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Education', educationSchema);
