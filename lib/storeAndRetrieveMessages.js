function saveNewDoc(userResponse) {
    var message = new Messages({
        chatId: userResponse.chat.id,
        messageId: userResponse.message_id,
        timestamp: userResponse.date
    });

    message.save(function (err, msgObj) {
        if (err) {
            Outgoing.sendMessage(userResponse.chat.id, 'Sorry I was not able to save it. :( Please try after sometime.');
        } else {
            Outgoing.sendMessage(userResponse.chat.id, 'Yeah! I love you!');
        }
    })
}

module.exports = {
    saveNewDoc: saveNewDoc
}
