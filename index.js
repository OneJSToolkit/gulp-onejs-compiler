'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var typeScriptGenerator = require('onejs-compiler').TypeScriptGenerator;
var typeScriptViewModelGenerator = require('onejs-compiler').TypeScriptViewModelGenerator;
var extend = require('extend');

module.exports = function(userOptions) {
    var options = extend(true, {
        typeScriptViewFileFormat: '{{templateName}}.ts',
        typeScriptViewModelFileFormat: '',
        paths: {
            onejs: '../onejs/',
            defaultView: '../{{viewType}}/{{viewType}}'
        }
    }, userOptions);

    function getFileName(nameMatch, templateName) {
        return nameMatch.replace('{{templateName}}', templateName);
    }

    function generate(generatorType, templateContent, fileNameFormat, file) {
        var generator = new generatorType();
        var outputFile = file.clone();

        try {
            outputFile.contents = new Buffer(generator.generate(templateContent, options));
            outputFile.path = file.path.replace(path.basename(file.path), getFileName(fileNameFormat, generator.template.name));

        } catch (e) {
            throw new gutil.PluginError({
                plugin: 'gulp-onejs-compiler',
                message: 'Error parsing template: ' + file.path + '\n' + e
            });
        }

        return outputFile;
    }

    var stream = through.obj(function(file, enc, callback) {
        if (file.isNull() || !file.contents || path.extname(file.path).toLowerCase() !== '.html') {
            this.push(file);
            callback();
            return;
        }

        var fileContent = file.contents.toString('utf8');
        var outputFile;

        // Build typescript view class.
        if (options.typeScriptViewFileFormat) {
            this.push(generate(typeScriptGenerator, fileContent, options.typeScriptViewFileFormat, file));
        }

        // Build typescript view model interface.
        if (options.typeScriptViewModelFileFormat) {
            this.push(generate(typeScriptViewModelGenerator, fileContent, options.typeScriptViewModelFileFormat, file));
        }

        callback();
    });

    return stream;
};