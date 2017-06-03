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
  };

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
  };

  // socket.io config
  var ws = ''; // web socket url
  var socket = io.connect(ws);

  ['connect', 'disconnect', 'session', 'connect_failed']
    .forEach(function(event){
      socket.on(event, function() {
        console.log('socket: ' + event); // eslint-disable-line
      });
    });

  socket.on('message', addMessage);

});

/**
 * Filter tweets based on the filter-id
 * @param  {DOMElement} element The DOM element
 * @return {undefined}
 */
function filterTweets(element) { // eslint-disable-line
  $(element).not(':checked').prop('checked', true);

  $('.tweets--row').hide();
  $('.tweets--row.' + element.id).show();
}
