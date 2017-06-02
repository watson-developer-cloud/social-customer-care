
var gulp = require('gulp');
var wrench = require('wrench');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */

wrench.readdirSyncRecursive('./gulp').filter(function gulpFile(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function requireGulp(file) {
  require('./gulp/' + file);
});

gulp.task('default', ['serve']);
