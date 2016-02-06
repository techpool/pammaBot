var request = require('request');

function sendMessage(chatId, message) {
    request
        .post('https://api.telegram.org/botxxxxxxxxxxxxxxxx/sendMessage')
        .form({
            chat_id: chatId,
            text: message
        })
        .on('response', function (response) {
            console.log(response.body);
            console.log('Phew! Sent Successfully!');
        });
}


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

/* Function to handle reply */

function handleReply(app, userResponse) {
    switch (userResponse.reply_to_message.text) {
        case 'Please give me what you want me to store.':
            StoreAndRetrieve.saveNewDoc(app, userResponse);
            break;
        case 'Please give me a title':
            StoreAndRetrieve.updateTitle(app, userResponse);
            break;
        default:
            console.log('I don"t understand her.');

    }
}

module.exports = {
    sendMessage: sendMessage,
    saveNewMessage: saveNewMessage,
    handleReply: handleReply
}
