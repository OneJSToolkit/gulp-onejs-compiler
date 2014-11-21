'use strict';

module.exports = function(options) {
    var size = require('gulp-size');
    var uglify = require('gulp-uglifyjs');
    var rename = require('gulp-rename');
    var tsc = require('gulp-typescript');
    var git = require('gulp-git');
    var inquirer = require('inquirer');
    var semver = require('semver');
    var prompt = require('gulp-prompt');
    var fs = require('fs');

    var gulp = options.gulp;
    var paths = options.paths;
    var rootDir = options.rootDir;

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

    gulp.task('release', ['dist'], function() {
        var questions = [
            {
                type: 'list',
                name: 'bumpType',
                message: 'What type of version bump is this?',
                choices: ['Major', 'Minor', 'Patch']
            },
            {
                type: 'input',
                name: 'message',
                message: 'What is your git tag message?',
                validate: function(input) {
                    // Do not allow empty git tag messages
                    return !(input.replace(/ /g,'') === "");
                }
            }
        ];

        return gulp.src(rootDir + '/package.json')
            .pipe(prompt.prompt(questions, function(answers) {
                var packageJson = JSON.parse(fs.readFileSync(rootDir + '/package.json', 'utf8'));
                var bowerJson = JSON.parse(fs.readFileSync(rootDir + '/bower.json', 'utf8'));
                var newVersion = semver.inc(packageJson.version, answers.bumpType.toLowerCase());

                git.tag('v' + newVersion, answers.message, function(err) {
                    if (err) { throw err; }
                });

                packageJson.version = newVersion;
                bowerJson.version = newVersion;

                fs.writeFileSync(rootDir + '/package.json', JSON.stringify(packageJson, null, 4));

                fs.writeFileSync(rootDir + '/bower.json', JSON.stringify(bowerJson, null, 4));
            }));
    });

    /** Builds the minified version of your app */
    gulp.task('build-minify', ['minify', 'copy-static-files-minified']);
};