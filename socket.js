/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var debug = require('debug')('scc:socket');
var processTweet = require('./util/process-tweet');
var topic = process.env.TWITTER_TOPIC || '<topic>';

module.exports = function(io, twitter) {
  // existing sessions
  var sessions = {};

  twitter.stream({ track: topic, filter_level: 'low', language: 'en' }, function(stream) {
    debug('Connected to twitter.stream, topic: %s', topic);
    stream.on('data', function(tweet) {
      processTweet(tweet, function (error, processedTweet) {
        if (error) {
          debug('Ignore tweet: %s', tweet.text);
          return;
        }
        Object.keys(sessions).forEach(function(id) {
          sessions[id].socket.emit('message', processedTweet);
        });
      })
    });
    stream.on('error', function(error) {
      debug('Error connecting to twitter.stream: %s', error);
    });
  });

  // Create a session on socket connection
  io.use(function(socket, next) {
    sessions[socket.id] = { socket: socket };
    debug('Total sessions: %s sessions', Object.keys(sessions).length);
    socket.emit('session', socket.id);
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', function() {
      // send initial tweets
      socket.emit('message', 'hello!');
    });

    // Delete the session on disconnect
    socket.on('disconnect', function() {
      delete sessions[socket.id];
      debug('Disconnect: %s', socket.id);
    });
  });
};