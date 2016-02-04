var bodyParser = require('body-parser');
module.exports = function (app, mongoose) {

    app.set('teleBotLink', 'https://api.telegram.org/botxxxxxxxxx')

    //Database connection string
    app.set('db', 'mongodb://xxxxxxxx:xxxxxxxx/mongocloud');

    //Using midleware to parse the body properly
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Connection to database
    mongoose.connect(app.get('db'));
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback(){
        console.log('db connected');
    });
}
