module.exports = function (app) {
    app.post('/182492589:AAEs8klS3o14gMjXhXL4BI5e-7vdLUimOWU', function (req, res) {
        var body = JSON.parse(req.body);
        var message = body.message;
        console.log(message.from.first_name);
        if (message.from.first_name == 'Suryadeep' ) {
            //It is Suryadeep

        } else {

        }
    })
}
