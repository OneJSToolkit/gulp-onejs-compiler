'use strict';

var gulp = require('gulp');
var onejsCompiler = require('gulp-onejs-compiler');
var tsc = require('gulp-typescript');
var uglify = require('gulp-uglifyjs');
var del = require('del');
var less = require('gulp-less');
var cssMinify = require('gulp-minify-css');
var csstojs = require('gulp-csstojs');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');

/** 
 * The common directory structure OneJS uses
 * along with some helpful glob patterns
 */
var paths = {
    app: {
        root: 'app/',
        jsGlob: 'app/**/*.js',
        min: {
            root: 'app-min/'
        }
    },
    dist: {
        root: 'dist/',
        amd: 'dist/amd/',
        commonjs: 'dist/commonjs/'
    },
    src: {
        root: 'src/',
        htmlGlob: 'src/**/*.html',
        lessGlob: 'src/**/*.less',
        tsGlob: 'src/**/*.ts',
        glob: 'src/**/*'
    },
    staticFiles: [
        'node_modules/requirejs/require.js'
    ],
    temp: {
        root: 'temp/',
        ts: 'temp/ts/',
        test: 'temp/ts/test/',
        tsGlob: 'temp/ts/**/*.ts'
    },
    test: {
        root: 'test/',
        glob: 'test/**/*'
    }
};

/** Cleans the temporary folders */
gulp.task('clean', function(cb) {
    del([paths.temp], cb);
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
gulp.task('tsc-preprocess', ['onejs-html', 'onejs-ts', 'less-to-js']);

/** Runs the TypeScript amd compiler over your application .ts files */
gulp.task('tsc-amd', ['tsc-preprocess'], function() {
    return gulp.src(paths.temp.tsGlob)
        .pipe(tsc({
            module: 'amd'
        }))
        .pipe(gulp.dest(paths.app.root))
        .pipe(gulp.dest(paths.dist.amd));
});

/** Runs the TypeScript commonjs compiler over your application .ts files */
gulp.task('tsc-commonjs', ['tsc-preprocess'], function() {
    return gulp.src(paths.temp.tsGlob)
        .pipe(tsc({
            module: 'commonjs'
        }))
        .pipe(gulp.dest(paths.app.root))
        .pipe(gulp.dest(paths.dist.commonjs));
});

/** Copies the static files to your application path */
gulp.task('copy-static-files', function() {
    return gulp.src(paths.staticFiles)
        .pipe(gulp.dest(paths.app.root))
});

/** Watches your src folder for changes, and runs the default build task */
gulp.task('watch', function() {
    gulp.watch(paths.src.glob, ['build']);
});

/** Default dev task for building */
gulp.task('build', ['tsc-amd', 'copy-static-files']);
