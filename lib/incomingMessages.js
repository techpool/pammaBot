var request = require('request');

module.exports = function (app) {
    app.post('/' + app.get('botToken'), function (req, res) {
        var body = req.body;
        var message = body.message;
        var chatId = message.chat.id;
        res.sendStatus(200);

        if (message.text == '/new') {
            request
                .post(app.get('teleBotLink') + '/sendMessage')
                .form({
                    chat_id: chatId,
                    text: 'Please give me what you want me to store.',
                    reply_markup: {
                        force_reply: true,
                        selective: true
                    }
                })
                .on('response', function (response) {
                    console.log(body);
                });
        }

        console.log(body);

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
