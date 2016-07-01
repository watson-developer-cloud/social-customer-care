/* Copyright IBM Corp. 2015
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var twitter = require('twitter');
var debug = require('debug')('scc:twitter-helper')
var MAX_COUNT = 200;

/**
 * Transform Tweets to ContentItems to be used
 * @param  {Object} tweet A tweet from the Twitter API
 * @return {Object} the <code>ContentItem</code> that Personality Insights require
 */
function toContentItem(tweet) {
  return {
    id: tweet.id_str,
    userid: tweet.user.id_str,
    sourceid: 'twitter',
    language: (tweet.lang && (['es', 'en'].indexOf(tweet.lang) > -1)) ? tweet.lang : 'en',
    contenttype: 'text/plain',
    content: tweet.text.replace('[^(\\x20-\\x7F)]*', ''),
    created: Date.parse(tweet.created_at)
  };
}

/**
 * Create a TwitterHelper object
 * @param {Object} config configuration file that has the
 * app credentials.
 */
function TwitterHelper(configs) {
  this.count = 0;
  this.twit = [];
  var self = this;

  configs.forEach(function (config) {
    self.twit.push(new twitter(config));
  });
}

TwitterHelper.prototype.getInstance = function () {
  var instance = this.count % this.twit.length;
  this.count++;

  debug('instance', instance);
  return this.twit[instance];
};

/**
 * Returns true if the tweet is in English and it's not a re-tweet
 * @param {Object} The tweet
 * @return {boolean} True if tweet is not a re-tweet or not in english
 */
var englishAndNoRetweet = function (tweet) {
  return tweet.lang === 'en' && !tweet.retweeted;
};

/**
 * Get the tweets based on the given username.
 * Implemented with recursive calls that fetch up to 200 tweets in every call
 * Only returns english and original tweets (no retweets)
 * @param {String} username The twitter username
 * @param {function} The callback
 * @return {undefined}
 */
TwitterHelper.prototype.getTweets = function (username, callback) {
  debug('getTweets for:', username);

  var self = this,
    tweets = [],
    params = {
      screen_name: username,
      count: MAX_COUNT,
      exclude_replies: true,
      trim_user: true
    };

  var processTweets = function (error, _tweets) {
    if (error) {
      return callback(error);
    }
    var items = _tweets
      .filter(englishAndNoRetweet)
      .map(toContentItem);

    tweets = tweets.concat(items);
    debug(username, 'tweets.count:', tweets.length);
    if (_tweets.length > 1) {
      params.max_id = _tweets[_tweets.length - 1].id - 1;
      self.getInstance().get('statuses/user_timeline', params, processTweets);
    } else {
      callback(null, tweets);
    }
  };
  self.getInstance().get('statuses/user_timeline', params, processTweets);
};

/**
 * Connects to the Twitter Stream API
 * @param  {Object}   params   The parameters to filter tweets
 * @param  {Function} callback  The callback
 * @return {undefined}
 */
TwitterHelper.prototype.stream = function (params, callback) {
  return this.getInstance().stream('statuses/filter', params, callback);
};

module.exports = TwitterHelper;
