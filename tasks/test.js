'use strict';

module.exports = function(options) {
    var _ = require('lodash');

    var karma = options.karma;
    var gulp = options.gulp;
    var paths = options.paths;
    var rootDir = options.rootDir;

    var karmaOptions = options.karmaOptions;

    gulp.task('test-preprocess', ['build'], function() {
        return gulp.src(paths.test.glob)
            .pipe(gulp.dest(paths.temp.test));
    });

    gulp.task('test', ['test-preprocess'], function (done) {
        karma.start(_.merge({
            configFile: rootDir + '/karma.conf.js',
            singleRun: true
        }, karmaOptions), done);
    });
}
