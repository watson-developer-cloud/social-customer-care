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

var async = require('async');
var extend = require('extend');
var watson = require('watson-developer-cloud');

var toneAnalyzer = watson.tone_analyzer({ version:'v3', version_date: '2016-05-19' });

var classifier = watson.natural_language_classifier({ version: 'v1' });
var classifier_id = process.env.CLASSIFIER_ID || '<classifier-id>';

var alchemyLanguage = watson.alchemy_language({
  version: 'v1',
  api_key: process.env.ALCHEMY_API_KEY || '<api-key>'
});
var features = ['concepts', 'entities', 'keywords', 'taxonomy',
                'doc-emotion', 'relations', 'doc-sentiment', 'typed-rels'].join(',');

var responses = require('../data/default-responses');

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
    alchemyLanguage.combined.bind(alchemyLanguage, { text: text, extract: features }),
    toneAnalyzer.tone.bind(toneAnalyzer, { text: text })
  ];
}

var getSentiment = function(sentiment) {
  var score = sentiment.score || 0;
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
  tweet.cleaned_text = cleanText(tweet.text)

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
        alchemy_language: response[1],
        tone_analyzer: response[2][0],
        classifier: extend({ classes: classes }, response[0][0].classes[0]),
        response: {
          text: responses[intent],
          name: 'Watson',
          screen_name: 'WatsonSupport'
        }
      };
      result.sentiment = getSentiment(result.alchemy_language.docSentiment);
      callback(null, result);
    }
  });
}
