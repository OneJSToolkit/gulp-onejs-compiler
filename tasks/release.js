'use strict';

module.exports = function(options) {
    var size = require('gulp-size');
    var uglify = require('gulp-uglifyjs');
    var rename = require('gulp-rename');
    var tsc = require('gulp-typescript');

    var gulp = options.gulp;
    var paths = options.paths;

    /** Creates a minified version of your application */
    gulp.task('minify', ['tsc-amd'], function() {
        return gulp.src([paths.app.jsGlob])
            .pipe(uglify())
            .pipe(size({
                gzip: true
            }))
            .pipe(rename('app.min.js'))
            .pipe(gulp.dest(paths.app.min.root));
    });

    /** Copies the minified static files to your application path */
    gulp.task('copy-static-files-minified', function() {
        return gulp.src(paths.staticFiles.js)
            .pipe(uglify())
            .pipe(gulp.dest(paths.app.min.root));
    });

    /** Creates the amd distributable directory */
    gulp.task('dist-amd', ['tsc-preprocess'], function() {
        return gulp.src(paths.temp.tsGlob)
            .pipe(tsc({
                module: 'amd'
            }))
            .pipe(gulp.dest(paths.dist.amd))
    });

    /** Creates the commonjs distributable directory */
    gulp.task('dist-commonjs', ['tsc-preprocess'], function() {
        return gulp.src(paths.temp.tsGlob)
            .pipe(tsc({
                module: 'commonjs'
            }))
            .pipe(gulp.dest(paths.dist.commonjs))
    });

    /** Creates both dist flavors */
    gulp.task('dist', ['dist-commonjs', 'dist-amd']);

    /** Builds the minified version of your app */
    gulp.task('build-minify', ['minify', 'copy-static-files-minified']);
};