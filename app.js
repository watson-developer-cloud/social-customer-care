var app = require('express')();
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// Configure Express
app.set('view engine', 'ejs');
require('ejs').delimiter = '$';
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

var profileByUser = {};

var watson = require('watson-developer-cloud');
var personalityInsights = watson.personality_insights({ version: 'v2' });
var processProfile = require('./util/process-personality-profile');

// render index page
app.get('/', function(req, res) {
  res.render('tweets');
});

/**
 * Returns the personality Insights from a username.
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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.code = 404;
  err.message = 'Not Found';
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  const error = {
    code: err.code || 500,
    error: err.error || err.message,
  };
  res.status(error.code).json(error);
});

module.exports = app;
