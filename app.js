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

var app = require('express')();
var profileByUser = {};

var watson = require('watson-developer-cloud');
var personalityInsights = watson.personality_insights({ version: 'v2' });
var processProfile = require('./util/process-personality-profile');

// Bootstrap application settings
require('./config/express')(app);

// render index page
app.get('/', function(req, res) {
  res.render('tweets');
});

/**
 * Returns the personality Insights from a username
 * @param  {String} '/api/profile' The path
 * @param  {function} The route callback
 * @return {undefined}
 */
app.get('/api/profile', function(req, res, next) {
  if (!req.query.username) {
    return next('Missing required query parameter: "username"');
  }

  var profile = profileByUser[req.query.username];
  if (profile) {
    return res.json(profile);
  }
  req.app.get('tweeter').getTweets(req.query.username, function (error, tweets) {
    if (error) {
      return next(next);
    }
    personalityInsights.profile({ contentItems:tweets }, function (perror, profile) {
      if (error) {
        return next(perror);
      }
      var processedProfile = processProfile(profile);
      profileByUser[req.query.username] = processedProfile;
      res.json(processedProfile);
    });
  })
});

app.get('/tweets', function(req, res) {
  res.render('tweets');
});

require('./config/error-handler')(app);

module.exports = app;
