var request = require('request');
var Q = require('q');
/* function to send a message to a chat */

function sendMessage(chatId, message, replyToMessageId) {
    var deferred = Q.defer();
    request
        .post('https://api.telegram.org/bot182492589:AAEs8klS3o14gMjXhXL4BI5e-7vdLUimOWU/sendMessage')
        .form({
            chat_id: chatId,
            text: message,
            reply_to_message_id: replyToMessageId,
            parse_mode: 'Markdown'
        })
        .on('response', function (response) {
            console.log(response.stausCode);
            console.log('Phew! Sent Successfully!');
            deferred.resolve(response.stausCode);
        });
    return deferred.promise;
}

/* function to forward message to a chat from a specific chat */

function forwardMessage(toChatId, fromChatId, messageId) {
    var deferred = Q.defer();
    request
        .post('https://api.telegram.org/bot182492589:AAEs8klS3o14gMjXhXL4BI5e-7vdLUimOWU/forwardMessage')
        .form({
            chat_id: toChatId,
            from_chat_id: fromChatId,
            message_id: messageId
        })
        .on('response', function (response) {
            console.log(response.stausCode);
            console.log('Phew! Sent Successfully!');
            deferred.resolve(response.stausCode);
        });
    return deferred.promise;
}

module.exports = {
    sendMessage: sendMessage,
    forwardMessage: forwardMessage
}
