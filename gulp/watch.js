/**
* Watches all the files for changes
**/

var gulp = require('gulp');

var tasks = [
  'styles',
  'scripts',
  'icon-fonts'
];

var watches = tasks.map(function(element) {
  return element + ':watch';
});

gulp.task('compile', tasks);
gulp.task('watch', watches);
