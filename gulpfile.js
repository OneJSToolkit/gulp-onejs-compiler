'use strict';

var gulp = require('gulp');

var paths = {
  scripts: ['./*.js', '!./gulpfile.js']
};

gulp.task('test', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha({
      reporter: 'dot'
    }));
});

gulp.task('default', ['tsc']);
