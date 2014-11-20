'use strict';

var karma = require('karma').server;

gulp.task('test-preprocess', ['copy-deps'], function() {
    return gulp.src(paths.test.glob)
        .pipe(gulp.dest(paths.temp.test));
});

gulp.task('test', ['tsc-commonjs', 'copy-static-files'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});
