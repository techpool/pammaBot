var request = require('request');

function saveNewDoc(app, userResponse) {

    var message = new Messages({
        chatId: userResponse.chat.id,
        messageId: userResponse.message_id,
        timestamp: userResponse.date,
        chatTitle: Date.now()
    });

    message.save(function (err, msgObj) {
        if (err) {

            Outgoing.sendMessage(userResponse.chat.id, 'Sorry I was not able to save it. :( Please try after sometime.');
        } else {
            request
                .post(app.get('teleBotLink') + '/sendMessage')
                .form({
                    chat_id: userResponse.chat.id,
                    text: 'Please give me a title',
                    reply_to_message_id: userResponse.message_id,
                    reply_markup: JSON.stringify({
                        force_reply: true,
                        selective: true
                    })
                })
                .on('response', function (response) {
                    console.log('Phew! Sent successfully!');
                });
        }
    })
}

function updateTitle(app, userResponse) {
    var chatTitle = userResponse.text;
    var messageId = userResponse.reply_to_message.message_id - 1;

    Messages.findOne({}).sort({timestamp: -1}).exec(function (err, message) {
        message.chatTitle = chatTitle;

        message.save(function (err, msgObj) {
            if (err) {
                console.log(err);
            } else {
                Outgoing.sendMessage(message.chatId, 'Updated!')
            }
        })
    })
}

module.exports = {
    saveNewDoc: saveNewDoc,
    updateTitle: updateTitle
}
