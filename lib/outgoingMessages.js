var request = require('request');

function sendMessage(chatId, message) {
    console.log(chatId);
    request
        .post('https://api.telegram.org/bot182492589:AAEs8klS3o14gMjXhXL4BI5e-7vdLUimOWU/sendMessage')
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
            StoreAndRetrieve.saveNewDoc(userResponse);
            break;
        default:
            console.log('nothing as of now');

    }
}

module.exports = {
    sendMessage: sendMessage,
    saveNewMessage: saveNewMessage,
    handleReply: handleReply
}
