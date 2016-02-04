var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');

/* Config files */
require('./config/configuration.js')(app, mongoose);

/* Library Files for handling messages */
require('./lib/incomingMessages.js')(app);

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on :' + process.env.PORT);
});
