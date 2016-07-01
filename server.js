#! /usr/bin/env node
'use strict';

require('./dot-env');

var debug = require('debug')('scc:server');

// Deployment tracking
require('cf-deployment-tracker-client').track();

var TwitterHelper = require('./util/twitter-helper');
var tweeter = new TwitterHelper(JSON.parse(process.env.TWITTER || {}));

var app = require('./app');
app.set('tweeter', tweeter);

// Website configuration
var server = require('http').Server(app);

// socket configuration for streaming tweets to clients
var io = require('socket.io')(server);
require('./socket')(io, tweeter);

var port = process.env.VCAP_APP_PORT || 3000;
server.listen(port);
debug('listening at: %d', port);
