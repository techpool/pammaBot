var mongoose = require('mongoose');

var message = mongoose.Schema({
    chatId: {
        type: Number,
        required: true
    },
    messageId: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('messages', message);
