var request = require('request');
var async = require('async');

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

/* function to update the title of send message */

function updateTitle(app, userResponse) {
    var chatTitle = userResponse.text; //the title requested by the user

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

/* function to forward previous message from database */
function forwardMessage(app, userResponse) {
    var chatTitle = userResponse.text;

    Messages.find({
        chatTitle: chatTitle
    }).sort({timestamp: 1}).exec(function (err, messages) {
        if (messages.length == 0) {
            Outgoing.sendMessage(userResponse.chat.id, 'No message found with that title');
        } else {
            async.eachSeries(messages, function (eachmessage, iteratenext) {
                Outgoing.forwardMessage(userResponse.chat.id, eachmessage.chatId, eachmessage.messageId);
                iteratenext(null);
            }, function (err) {
                Outgoing.sendMessage(userResponse.chat.id, 'All message sent with the requested title')
            })
        }
    })
}

module.exports = {
    saveNewDoc: saveNewDoc,
    updateTitle: updateTitle,
    forwardMessage: forwardMessage
}
