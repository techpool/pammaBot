var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');

/* Config files */
require('./config/configuration.js')(app, mongoose);

/* Global variable to track reply with additional infos */
ReplyDetector = require('./config/globalReplyVariables.js');

/* Library Files for handling messages */
require('./lib/incomingMessages.js')(app);


ForcedReply = require('./lib/forcedReply.js');
ReplyHandler = require('./lib/replyHandler.js');
StoreAndRetrieve = require('./lib/storeAndRetrieveMessages.js');

/* Utility functions for commonly used functionality */
Utility = require('./lib/utilFunctions.js');

/* Models for messages */
Messages = require('./models/Messages.js')

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on :' + process.env.PORT);
});
