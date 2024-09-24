const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    message: { type: String, required: true },
    timestamp: { type: String, default: Date.now },
    delivered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);