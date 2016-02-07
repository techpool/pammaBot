var request = require('request');

/* function to send a message to a chat */

function sendMessage(chatId, message) {
    request
        .post('https://api.telegram.org/bot182492589:AAEs8klS3o14gMjXhXL4BI5e-7vdLUimOWU/sendMessage')
        .form({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        })
        .on('response', function (response) {
            console.log(response.body);
            console.log('Phew! Sent Successfully!');
        });
}

/* function to forward message to a chat from a specific chat */

function forwardMessage(toChatId, fromChatId, messageId) {
    request
        .post('https://api.telegram.org/bot182492589:AAEs8klS3o14gMjXhXL4BI5e-7vdLUimOWU/forwardMessage')
        .form({
            chat_id: toChatId,
            from_chat_id: fromChatId,
            message_id: messageId
        })
        .on('response', function (response) {
            console.log(response.body);
            console.log('Phew! Sent Successfully!');
        });
}

module.exports = {
    sendMessage: sendMessage,
    forwardMessage: forwardMessage
}
