# [gulp](https://github.com/gulpjs/gulp)-onejs-compiler [![Build Status](https://travis-ci.org/dzearing/gulp-onejs-compiler.png?branch=master)](https://travis-ci.org/dzearing/gulp-onejs-compiler)

> Compiler OneJS templates into javascript for project merging.

## Install

Install with [npm](https://npmjs.org/package/gulp-onejs-compiler)

```bash
$ npm install --save-dev gulp-onejs-compiler
```

## Usage

```js
var gulp = require('gulp'),
    compiler = require('gulp-onejs-compiler');

gulp.task('default', function() {
    return gulp.src('src/*.html')
        .pipe(compiler())
        .pipe(gulp.dest('dist'));
});
```

## API

### compiler(options)

#### options.typeScriptViewFileFormat
Type: `String`
Default: `{{templateName}}.ts`

The format for view file's filename. Leaving this blank suppresses generation.

#### options.typeScriptViewModelFileFormat
Type: `String`
Default: `I{{templateName}}Model.ts`

The format for view model interface file's filename. Leaving this blank suppresses generation.

## License

MIT © [David Zearing](http://github.com/dzearing)
