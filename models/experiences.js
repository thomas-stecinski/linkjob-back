const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const experienceSchema = new Schema({
    id: {
        type: String,
        unique: true,
        index:true,
        default: () => uuidv4()
    },
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
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        required: false
    },
    enddate: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });
experienceSchema.index({ createdAt: 1 });
experienceSchema.index({ cvId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Experience', experienceSchema);
