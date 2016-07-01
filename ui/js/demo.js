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

$(document).ready(function() {
  // Tweet Filters
  var FILTERS = [
    { title: 'Customer sentiment', title_id: 'customer-sentiment', filters: [] },
    { title: 'Support topics',     title_id: 'support-topics',     filters: [] }
  ];

  // Add the filters to the left panel
  FILTERS.forEach(function(filterCategory) {
     $('.filters').append(_.template(filtersTemplate.innerHTML, filterCategory));
   });

   /**
    * Adds the tweet to the filter panel on the left based on the filter criteria
    * @param  {String} type    Filter type
    * @param  {String} filter  Filter value
    * @param  {Array} filters  Filter values
    * @return {String}         The filter-id
    */
  var addTweetToFilter = function(type, filter, filters) {
    var index = filters.indexOf(filter);

    // if the filter is not already, add it to the filters
    if (index === -1) {
     filters.push(filter);
     index = filters.length - 1;
     $('.filters--' + type).append(_.template(filterTemplate.innerHTML, {
       title_id: type,
       index: index,
       filter: filter
     }));
    }

    var $count = $('.' + type + '.filters--label-counter-' + index);
    $count.text(parseInt($count.text()) + 1);

    return type + '-' + index;
  }

  /**
   * Adds a message (tweet and response) to the UI
   * @param  {Object} message The message that contains the tweet and response
   * @return {undefined}
   */
  var addMessage = function(message) {
    $('.js-loading-screen').hide();

    var filters = [
      addTweetToFilter(FILTERS[0].title_id, message.sentiment, FILTERS[0].filters),
      addTweetToFilter(FILTERS[1].title_id, message.classifier.class_name, FILTERS[1].filters)
    ];

    // add tweet to the tweets container
    $('.tweets').prepend(_.template(tweetsTemplate.innerHTML, {
      message: message,
      filters : filters
   }));
  }

  // socket.io config
  var ws = ''; // web socket url
  var socket = io.connect(ws);

  ['connect', 'disconnect', 'session', 'connect_failed']
    .forEach(function(event){
      socket.on(event, function() {
        console.log('socket: ' + event);
      });
    });

  socket.on('message', addMessage);

  // CSRF protection
  $.ajaxSetup({
    headers: {
      'csrf-token': $('meta[name="ct"]').attr('content')
    }
  });
});

/**
 * Filter tweets based on the filter-id
 * @param  {DOMElement} element The DOM element
 * @return {undefined}
 */
function filterTweets(element) {
  $(element).not(':checked').prop('checked', true);
  //
  // if (!$element.prop('checked')) {
  //   $element.prop('checked', false);

  $('.tweets--row').hide();
  $('.tweets--row.' + element.id).show();
}
