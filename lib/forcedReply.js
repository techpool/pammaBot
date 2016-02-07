var request = require('request');

/* Function to save new message into database */

function saveNewMessage(app, userResponse) {

    var chatId = userResponse.chat.id; // chat ID of the incoming message

    // api to send a new message with forced reply
    request
        .post(app.get('teleBotLink') + '/sendMessage')
        .form({
            chat_id: chatId,
            text: 'Please give me what you want me to store.',
            reply_markup: JSON.stringify({
                force_reply: true
            })
        })
        .on('response', function (response) {
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


module.exports = {
    saveNewMessage: saveNewMessage,
    getMessage: getMessage,
}
