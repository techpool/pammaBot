var request = require('request');
var async = require('async');


// function to save new doc to the database

function saveNewDoc(app, userResponse) {

    // setting up the db object
    var message = new Messages({
        chatId: userResponse.chat.id,
        messageId: userResponse.message_id,
        timestamp: userResponse.date,
        chatTitle: Date.now()
    });

    //saving the new doc to db
    message.save(function (err, msgObj) {
        if (err) {
            // if error in saving send a notification to user about failure
            Utility.sendMessage(userResponse.chat.id, 'Sorry I was not able to save it. :( Please try after sometime.');
        } else {

            // requesting user to add a title to the saved message
            request
                .post(app.get('teleBotLink') + '/sendMessage')
                .form({
                    chat_id: userResponse.chat.id,
                    text: 'Please give me a title',
                    reply_to_message_id: userResponse.message_id,
                })
                .on('response', function (response) {

                    // Setting the reply detector to addtitle so as to add title to the new message
                    ReplyDetector.type = 'addtitle';
                    ReplyDetector.msgIdToUpdate = userResponse.message_id;
                    console.log('Phew! Sent successfully!');
                });
        }
    })
}

/* function to update the title of send message */

function updateTitle(app, userResponse) {
    var chatTitle = userResponse.text; //the title requested by the user

    // finding the message to update from db with Global Reply Detector variables
    Messages.findOne({
        messageId: ReplyDetector.msgIdToUpdate
    }).exec(function (err, message) {
        message.chatTitle = chatTitle;

        // saving the message with the updated title
        message.save(function (err, msgObj) {
            if (err) {
                console.log(err);

                // if error in saving send a notification to user about failure
                Utility.sendMessage(userResponse.chat.id, 'Sorry I was not able to update it. :( ');
            } else {

                // setting the reply detector back to null state
                ReplyDetector.type = null;
                ReplyDetector.msgIdToUpdate = null;

                // notifing the user about the successful updation
                Utility.sendMessage(message.chatId, 'Updated!');
            }
        })
    })
}

/* function to forward previous message from database */

function getMessage(app, userResponse) {
    var chatTitle = userResponse.text;

    Messages.find({
        chatTitle: chatTitle
    }).sort({timestamp: 1}).exec(function (err, messages) {
        if (messages.length == 0) {

            // if no messages were then notify the user with appropriate mesage
            Utility.sendMessage(userResponse.chat.id, 'No message found with that title');
        } else {

            // iterate over the retrieved list to send all messages with the same title
            async.eachSeries(messages, function (eachmessage, iteratenext) {

                // forward each message to the user (promise based: only send the next message if the previous one was successfully sent)
                Utility.forwardMessage(userResponse.chat.id, eachmessage.chatId, eachmessage.messageId).then(function () {
                    iteratenext(null);
                });
            }, function (err) {

                // notifing the user that all messages with the requested title has been sent
                Utility.sendMessage(userResponse.chat.id, 'All message sent with the requested title')
            })
        }
    })
}

/* function to send all titles */

function sendList(app, userResponse) {

    // finds the list of all titles
    Messages.find({}).sort({timestamp: 1}).exec(function (err, messages) {

        // seting up a variable to send the list in form of ordered list
        var messageCount = messages.length;

        // formatting the reply in MARKDOWN form
        var textToSend = '*List of Messages: *\n';

        // iterating over the messages and formatting them
        async.eachSeries(messages, function (eachmessage, iteratenext) {
            textToSend += messageCount + '. _' + eachmessage.chatTitle + '_\n';
            messageCount--;
            iteratenext(null);
        }, function (err) {

            // sending the formatted reply to user
            Utility.sendMessage(userResponse.chat.id, textToSend);
        })
    })
}

/* function to delete a message */

function deleteMessage(isMultiDelete, app, userResponse) {

    // checking from reply detector if it is a multidelete operation
    if (isMultiDelete == 'multidelete') {

        // retreiving the title of message to delete
        var chatTitle = ReplyDetector.chatTitle;

        // skipping that many number of posts which were selected by the user
        var messagesToSkip = Number(userResponse.text.slice(-1)) - 1;

        // finding the chat and sorting on descending oder of timestamp to maintain order
        Messages.findOne({
            chatTitle: chatTitle
        }).sort({timestamp: -1}).skip(messagesToSkip).exec(function (err, message) {
            message.remove(function (err, rmvObj) {
                if (err) {

                    // in case there was an error removing the post
                    console.log('Fucked up!:' + err);
                } else {

                    // resetting the Global Reply Detector variables
                    ReplyDetector.type = false;
                    ReplyDetector.chatTitle = null;

                    // send a notification to user about the deletion
                    Utility.sendMessage(userResponse.chat.id, 'Removed that filthy doc! Well Done!');
                }
            })
        })
    } else {

        // in case it was not a multidelete operation
        var chatTitle = userResponse.text;

        // retreiving the appropriate chat message
        Messages.find({
            chatTitle: chatTitle
        }).sort({timestamp: -1}).exec(function (err, messages) {
            if (err) {

                // in case there was an error removing the post
                Utility.sendMessage(userResponse.chat.id, 'Sorry I was not able to delete it. Please try after sometime.');
            } else {
                if (messages.length == 0) {

                    // if no messages were found with that title
                    Utility.sendMessage(userResponse.chat.id, 'No message found with that ID');
                } else if (messages.length == 1) {

                    // if only one unique doc was found with the title
                    messages[0].remove(function (err, rmvObj) {
                        if (err) {
                            console.log('Fucked up!:' + err);
                        } else {
                            Utility.sendMessage(userResponse.chat.id, 'Removed that filthy doc! Well Done!');
                        }
                    });
                } else{

                    // if multiple messages were found with the same title

                    // setting up the global variables for multidelete operation
                    ReplyDetector.type = 'multidelete';
                    ReplyDetector.chatTitle = chatTitle;

                    // sending the messages with same title to user with latest one first
                    var messageCount = 1;

                    async.eachSeries(messages, function (eachmessage, iteratenext) {
                        Utility.sendMessage(userResponse.chat.id, 'Message : ' + messageCount, eachmessage.messageId).then(function (statusCode) {
                            messageCount++;
                            iteratenext(null);
                        });
                    }, function () {

                        // sending a message to user for multidelete
                        ForcedReply.deleteMultiple(app, userResponse, messages);
                    })
                }
            }
        })
    }
}

module.exports = {
    saveNewDoc: saveNewDoc,
    updateTitle: updateTitle,
    forwardMessage: getMessage,
    sendList: sendList,
    deleteMessage: deleteMessage
}
