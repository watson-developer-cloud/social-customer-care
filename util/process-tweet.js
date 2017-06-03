var async = require('async');
var extend = require('extend');
var watson = require('watson-developer-cloud');

var classifier = watson.natural_language_classifier({ version: 'v1' });
var classifier_id = process.env.CLASSIFIER_ID || '<classifier-id>';

var naturalLanguageUnderstanding = watson.natural_language_understanding({ version: 'v1', version_date:'2016-01-23' });
var features = {sentiment: {}};
var responses = require('../training/default-responses');

/**
 * Clean the text removing symbols and numbers
 * @param  {String} text The Tweet text
 * @return {String}      Cleaned text
 */
function cleanText(text) {
  return text.replace(/\s\#/g, '')
    .replace(/\@\w\w+\s?/g, ' ')
    .replace(/[A-Za-z]+:\/\/[A-Za-z0-9]+.[A-Za-z0-9-_:%&~?/.=]+/g, '').trim();
}

/**
 * Create the tweet processors based on the Watson APIs
 * @param  {String} text The text to process
 * @return {Array}      The array of processors
 */
function createProcessors(text) {
  return [
    classifier.classify.bind(classifier, { text: text, classifier_id: classifier_id }),
    naturalLanguageUnderstanding.analyze.bind(naturalLanguageUnderstanding, { text: text, language: 'en', features: features })
  ];
}

var getSentiment = function(sentiment) {
  var score = sentiment.document.score || 0;
  if (score <= -0.5) {
    return 'Very Dissatisfied';
  } else if (score <= -0.25) {
    return 'Dissatisfied';
  } else if (score <= 0.25) {
    return 'Neutral';
  } else if (score <= 0.5) {
    return 'Satisfied';
  } else if (score <= 1) {
    return 'Very Satisfied';
  }
};

/**
 * Processes a tweet and select a response if exists
 * @param  {Object}   tweet    The tweet as it comes from the Twitter API
 * @param  {Function} callback The callback function
 * @return {undefined}
 */
module.exports = function processTweet(tweet, callback) {
  tweet.cleaned_text = cleanText(tweet.text);

  if (tweet.in_reply_to_status_id !== null ||
      tweet.retweeted_status !== undefined ||
      tweet.cleaned_text === '') {
    return callback('Tweet is a reply, retweet or empty');
  }

  // execute the processors in parallel
  async.parallel(createProcessors(tweet.cleaned_text), function(error, response) {
    if (error) {
      callback(error);
    } else {
      var intent = response[0][0].top_class;
      var classes = response[0][0].classes.map(function(e){
        return e.class_name;
      });
      var result = {
        tweet: tweet,
        classifier: extend({ classes: classes }, response[0][0].classes[0]),
        response: {
          text: responses[intent],
          name: 'Watson',
          screen_name: 'WatsonSupport'
        }
      };
      result.sentiment = getSentiment(response[1][0].sentiment);
      callback(null, result);
    }
  });
};
