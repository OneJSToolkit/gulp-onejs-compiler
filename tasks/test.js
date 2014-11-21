'use strict';

module.exports = function(options) {
    var karma = options.karma;
    var gulp = options.gulp;
    var paths = options.paths;
    var rootDir = options.rootDir;

    gulp.task('test-preprocess', ['build'], function() {
        return gulp.src(paths.test.glob)
            .pipe(gulp.dest(paths.temp.test));
    });

    gulp.task('test', ['test-preprocess'], function (done) {
        karma.start({
            configFile: rootDir + '/karma.conf.js',
            singleRun: true
        }, done);
    });
}