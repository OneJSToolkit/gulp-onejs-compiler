'use strict';

module.exports = function(gulp, paths) {
    var karma = require('karma').server;

    gulp.task('test-preprocess', ['copy-deps'], function() {
        return gulp.src(paths.test.glob)
            .pipe(gulp.dest(paths.temp.test));
    });

    gulp.task('test', ['tsc-commonjs'], function (done) {
        karma.start({
            configFile: paths.test.karmaConf,
            singleRun: true
        }, done);
    });
}