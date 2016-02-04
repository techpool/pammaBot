var express = require('express');
var app = erpress();
var http = require('http').Server(app);
var mongoose = require('mongoose');

/* Config files */
require('./config/configuration.js')(app, mongoose);

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on :' + process.env.PORT);
});
