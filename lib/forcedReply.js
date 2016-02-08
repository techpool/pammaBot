var request = require('request');
var async = require('async');

/* Function to save new message into database */

function saveNewMessage(app, userResponse) {

    var chatId = userResponse.chat.id; // chat ID of the incoming message

    // api to send a new message with forced reply
    request
        .post(app.get('teleBotLink') + '/sendMessage')
        .form({
            chat_id: chatId,
            text: 'Please give me what you want me to store.'
        })
        .on('response', function (response) {
            ReplyDetector.type = 'newmessage'
            console.log('Phew! Sent successfully!');
        });
}


/* function to search for a specific old message */

function getMessage(app, userResponse) {
    var chatId = userResponse.chat.id; // chat ID of the incoming message

    // api to send a new message with forced reply
    request
        .post(app.get('teleBotLink') + '/sendMessage')
        .form({
            chat_id: chatId,
            text: 'Tell me the title',
            reply_markup: JSON.stringify({
                force_reply: true
            })
        })
        .on('response', function (response) {
            console.log('Phew! Sent successfully!');
        });
}

/* function to delete a specific old message */

function deleteMessage(app, userResponse) {
    var chatId = userResponse.chat.id; // chat ID of the incoming message

    // api to send a new message with forced reply
    request
        .post(app.get('teleBotLink') + '/sendMessage')
        .form({
            chat_id: chatId,
            text: 'Give me the title to delete',
            reply_markup: JSON.stringify({
                force_reply: true
            })
        })
        .on('response', function (response) {
            console.log('Phew! Sent successfully!');
        });
}

/* forced reply message to delete multiple messages */

function deleteMultiple(app, userResponse, messages) {
    var chatId = userResponse.chat.id;

    // Setting Up the custom Keyboard
    var keyboard = [];
    for (var i = 0; i < messages.length; i++) {
        var chatTitle = [];
        chatTitle.push('Message: ' + (i+1));
        keyboard.push(chatTitle);
    }

    // api to send custom keyboard with buttons as the message index.
    request
        .post(app.get('teleBotLink') + '/sendMessage')
        .form({
            chat_id: chatId,
            text: 'Which message do you want to delete?',
            reply_markup: JSON.stringify({
                keyboard: keyboard,
                one_time_keyboard: true
            })
        })
        .on('response', function (response) {
            console.log('Phew! Sent successfully!');
        });
}

module.exports = {
    saveNewMessage: saveNewMessage,
    getMessage: getMessage,
    deleteMessage: deleteMessage,
    deleteMultiple: deleteMultiple
}
