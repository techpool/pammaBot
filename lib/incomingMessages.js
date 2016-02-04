var request = require('request');

module.exports = function (app) {
    app.post('/182492589:AAEs8klS3o14gMjXhXL4BI5e-7vdLUimOWU', function (req, res) {
        var body = req.body;
        var message = body.message;
        var chatId = message.chat.id;
        res.sendStatus(200);

        request
            .post(app.get('teleBotLink') + '/sendMessage')
            .form({
                chat_id: chatId,
                text: 'You are Awesome!'
            })
            .response(function (response) {
                console.log(response.statusCode);
            })
        if (message.from.first_name == 'Suryadeep' ) {
            //It is Suryadeep

        } else {

        }
    })
}
