#! /usr/bin/env node
'use strict';

var debug = require('debug')('scc:server');
var fs = require('fs');

// This helps to run the application in local development environment
// by faking CloudFoundry's VCAP_SERVICES environment variable
process.env.VCAP_SERVICES = process.env.VCAP_SERVICES || fs.readFileSync('./credentials.json', 'utf-8');
require('dotenv').config({ path: './env.properties'});

if (!process.env.TWITTER_CONSUMER_KEY || process.env.TWITTER_CONSUMER_KEY.indexOf('REPLACE') === 0) {
  debug('Please update env.properties with your the credentials for your Twitter application.');
  debug('Read the README.md file for more instructions');
  return;
}

if (!process.env.CLASSIFIER_ID || process.env.CLASSIFIER_ID.indexOf('REPLACE') === 0) {
  debug('Please update env.properties with your CLASSIFIER ID after training the Natural Language Classifier service.');
  debug('Read the README.md file for more instructions');
  return;
}

var TwitterHelper = require('./util/twitter-helper');
var tweeter = new TwitterHelper([{
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}]);

var app = require('./app');
app.set('tweeter', tweeter);

// Website configuration
var server = require('http').Server(app);

// socket configuration for streaming tweets to clients
var io = require('socket.io')(server);
require('./socket')(io, tweeter);

var port = process.env.PORT || 3000;
server.listen(port);
debug('listening at: %d', port);
