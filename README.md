# [gulp](https://github.com/gulpjs/gulp)-onejs-compiler [![Build Status](https://travis-ci.org/dzearing/gulp-onejs-compiler.png?branch=master)](https://travis-ci.org/dzearing/gulp-onejs-compiler)

> Compiler OneJS templates into javascript for project merging. See the [onejs-compiler](https://github.com/dzearing/onejs-compiler) project for more details on the template format.

## Install

NOTE: Until onejs-compiler is published to npm, you must use npm link:

```
git clone onejs-compiler
cd onejs-compiler
npm link
cd..
git clone gulp-onejs-compiler
npm i
npm link onejs-compiler
```

Once this module has been published:

Install with [npm](https://npmjs.org/package/gulp-onejs-compiler)

```
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

### options.paths
Type: 'Object'
Default:

```javascript
paths: {
    onejs: '../onejs/',
    defaultView: '../{{viewType}}/{{viewType}}'
}
```	

Specifies the default paths to use in the imports. {{viewType}} will be replaced with the
classname of the current view.

## License

MIT © [David Zearing](http://github.com/dzearing)
