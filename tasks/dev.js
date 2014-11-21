'use strict';

module.exports = function(options) {
    var onejsCompiler = require('gulp-onejs-compiler').compiler;
    var tsc = require('gulp-typescript');
    var uglify = require('gulp-uglifyjs');
    var del = require('del');
    var less = require('gulp-less');
    var cssMinify = require('gulp-minify-css');
    var csstojs = require('gulp-csstojs');
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer-core');

    var gulp = options.gulp;
    var paths = options.paths;

    /** Removes all built files, keeping only source */
    gulp.task('nuke', function(cb) {
        del([paths.temp.root, paths.app.root, paths.app.min.root, paths.dist.root], cb);
    });

    /** Cleans the temporary folders */
    gulp.task('clean', function(cb) {
        del([paths.temp.root], cb);
    });

    /** Copies static (non-OneJS) js files to app path */
    gulp.task('copy-static-js-files', function() {
        return gulp.src(paths.staticFiles.js)
            .pipe(gulp.dest(paths.app.root));
    });

    /** Copies .d.ts files from OneJS to temp path to compile against */
    gulp.task('copy-onejs-dts-files', function() {
        return gulp.src(paths.onejsFiles.dts)
            .pipe(gulp.dest(paths.temp.ts + 'onejs/'));
    });

    /** Cupies static OneJS js files to app path */
    gulp.task('copy-onejs-js-files', function() {
        return gulp.src(paths.onejsFiles.js)
            .pipe(gulp.dest(paths.app.root + 'onejs/'));
    });

    /** Runs LESS compiler, auto-prefixer, and uglify, then creates js modules and outputs to temp folder */
    gulp.task('less-to-js', function() {
        return gulp.src(paths.src.lessGlob)
            .pipe(less())
            .pipe(postcss([autoprefixer()]))
            .pipe(cssMinify())
            .pipe(csstojs({
                typeScript: true
            }))
            .pipe(gulp.dest(paths.temp.ts))
    });

    /** Compiles OneJS html templates */
    gulp.task('onejs-html', function() {
        return gulp.src(paths.src.htmlGlob)
            .pipe(onejsCompiler())
            .pipe(gulp.dest(paths.temp.ts));
    });

    /** Copies OneJS TypeScript files to temp directory for futher compilation */
    gulp.task('onejs-ts', function() {
        return gulp.src(paths.src.tsGlob)
            .pipe(gulp.dest(paths.temp.ts));
    })

    /** Runs the basic pre-processing steps before compilation */
    gulp.task('tsc-preprocess', ['onejs-html', 'onejs-ts', 'less-to-js', 'copy-onejs-dts-files']);

    /** Runs the TypeScript amd compiler over your application .ts files */
    gulp.task('tsc-amd', ['tsc-preprocess'], function() {
        return gulp.src(paths.temp.tsGlob)
            .pipe(tsc({
                module: 'amd'
            }))
            .pipe(gulp.dest(paths.app.root))
            //.pipe(gulp.dest(paths.dist.amd));
    });

    /** Runs the TypeScript commonjs compiler over your application .ts files */
    gulp.task('tsc-commonjs', ['tsc-preprocess'], function() {
        return gulp.src(paths.temp.tsGlob)
            .pipe(tsc({
                module: 'commonjs'
            }))
            .pipe(gulp.dest(paths.app.root))
            //.pipe(gulp.dest(paths.dist.commonjs));
    });

    /** Watches your src folder for changes, and runs the default build task */
    gulp.task('watch', function() {
        gulp.watch(paths.src.glob, ['build']);
    });

    /** Default dev task for building */
    gulp.task('build', ['tsc-amd', 'copy-static-js-files', 'copy-onejs-js-files']);
};