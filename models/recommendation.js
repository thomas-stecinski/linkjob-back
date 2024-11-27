const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recommendationSchema = new Schema(
    {
        commentatorid: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Référence au modèle User
            required: true,
        },
        userID: { 
            type: Schema.Types.ObjectId,
            ref: 'User', // Ajout explicite pour stocker l'ID utilisateur
            required: true,
        },
        cvid: {
            type: Schema.Types.ObjectId,
            ref: 'CV',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        statusid: {
            type: Schema.Types.ObjectId,
            ref: 'Status',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
