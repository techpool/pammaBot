var request = require('request');

module.exports = function (app) {
    app.post('/' + app.get('botToken'), function (req, res) {
        var body = req.body;
        var message = body.message;

        console.log(body);
        if (message.text == '/new') {
            ForcedReply.saveNewMessage(app, message);
        } else if (message.text == '/get') {
            ForcedReply.getMessage(app, message);
        } else if (message.text == '/list') {
            StoreAndRetrieve.sendList(app, message);
        } else if (message.text == '/last5') {
            Outgoing.sendMessage(app, message, 5);
        } else if (message.text == '/delete') {
            Outgoing.deleteMessage(app, message);
        } else if (message.reply_to_message){
            ReplyHandler.handleReply(app, message);
        }

        res.sendStatus(200);

        // request
        //     .post(app.get('teleBotLink') + '/sendMessage')
        //     .form({
        //         chat_id: chatId,
        //         text: 'You are Awesome!'
        //     })
        //     .on('response', function (response) {
        //         console.log(response.statusCode);
        //     });
    })
}
