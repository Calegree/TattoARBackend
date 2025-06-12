const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    styles: {
        type: [String],
        enum: ['modern', 'classic', 'vintage', 'minimalist', 'other'],
        default: ['other']
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { 
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    designURL: {
        type: String,
        required: true,
        trim: true
    },
});
module.exports = mongoose.model('Design', designSchema);
