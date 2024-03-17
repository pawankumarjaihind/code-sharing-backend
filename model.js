const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const MessageSchema = new Schema({
    username: {
        type: String,
        default: "member"
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model using the schema
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
