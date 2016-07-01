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

var _tweetsTemplate = tweetsTemplate.innerHTML;
var _filterTemplate = filterTemplate.innerHTML;
var _filtersTemplate = filtersTemplate.innerHTML;
// var profileTemplate = personalityInsightsAccountTemplate.innerHTML;
// var profileCharacteristicsTemplate = personalityInsightsCharacteristicsTemplate.innerHTML;

$(document).ready(function() {
  var SENTIMENTS = ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied' ];
  var CLASS_NAMES = [];

  // setup sentiment filter
  $('.filters').append(_.template(_filtersTemplate, {
    title: 'Customer sentiment',
    title_id: 'customer-sentiment',
    filters: SENTIMENTS
  }));

  // setup sentiment filter
  $('.filters').append(_.template(_filtersTemplate, {
    title: 'Support topics',
    title_id: 'support-topics',
    filters: CLASS_NAMES
  }));

  // socket.io config
  var ws = ''; // web socket url
  var socket = io.connect(ws);

  socket.on('connect', function() {
    console.log('socket.onConnect()');
  });

  socket.on('disconnect', function() {
    console.log('socket.onDisconnect()');
  });

  socket.on('session', function(session) {
    console.log('socket.onSession:', session);
  });

  socket.on('connect_failed', function() {
    console.log('socket.onConnectFailed()');
  });

  socket.on('message', function(message){
    console.log('socket.onMessage()');
    addMessage(message);
  });

  /**
   * Adds a message to the UI
   * @param  {Object} message The message that contains the tweet and response
   * @return {undefined}
   */
  var addMessage = function(message) {
    $('.js-loading-screen').hide();

    // add tweet to sentiment filter
    var sentiment = message.sentiment;
    var sentimentIndex = SENTIMENTS.indexOf(sentiment);
    var $sentimentCount = $('.customer-sentiment.filters--label-counter-' + sentimentIndex);
    var count = parseInt($sentimentCount.text());
    $sentimentCount.text(count + 1);

    // add tweet to intent filter
    var className = message.classifier.class_name;
    var classNameIndex = CLASS_NAMES.indexOf(className);
    if (classNameIndex == -1) {
      CLASS_NAMES.push(className);
      classNameIndex = CLASS_NAMES.length - 1;
      $('.filters--support-topics').append(_.template(_filterTemplate, {
        title_id: 'support-topics',
        index: classNameIndex,
        filter: className
      }));
    }
    var $classNameCount = $('.support-topics.filters--label-counter-' + CLASS_NAMES.indexOf(className));
    count = parseInt($classNameCount.text());
    $classNameCount.text(count + 1);

    // add tweet to the tweets container
    $('.tweets').prepend(_.template(_tweetsTemplate, {
      message:message,
      sentiment_index: sentimentIndex,
      class_name_index: classNameIndex
     }));
  }
});

function filterTweets(element) {
  $('.tweets--row.' + element.id).toggle();
}