/* eslint no-console: "off" */

var debug = require('debug')('scc:gulp');

// error catching to prevent gulp from crashing
module.exports = function(error) {
  // details of the error in console
  debug(error);
  this.emit('end');
};
