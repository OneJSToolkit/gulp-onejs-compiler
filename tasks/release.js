'use strict';

var size = require('gulp-size');

gulp.task('minify', ['tsc-amd'], function() {
    return gulp.src([paths.app.jsGlob])
        .pipe(uglify())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest(paths.app.min.root));
});

gulp.task('minify-dist', ['minify'], function() {
    return gulp.src([paths.app.jsGlob])
        .pipe(uglify())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest(paths.dist.amd));
});

/** Copies the minified static files to your application path */
gulp.task('copy-static-files-minified', function() {
    return gulp.src(paths.staticFiles)
        .pipe(uglify())
        .pipe(gulp.dest(paths.app.min.root));
});

/** Builds the minified version of your app */
gulp.task('build-minify', ['minify', 'copy-static-files-minified']);

/** Builds the distributable version of your app */
gulp.task('build-dist', ['minify-dist']);
