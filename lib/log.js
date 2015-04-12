// LICENSE : MIT
"use strict";
var debug, fs, mkdirp, path;

fs = require('fs');

path = require('path');

mkdirp = require('mkdirp');

debug = require('debug')('testium:logs');

module.exports = function(config) {
    var logDirectory, openLogFile, resolveLogFile, root;
    root = config.root, logDirectory = config.logDirectory;
    resolveLogFile = function(name) {
        return path.resolve(root, logDirectory, name + ".log");
    };
    openLogFile = function(name, flags, callback) {
        var dirname, filename;
        filename = resolveLogFile(name);
        dirname = path.dirname(filename);
        if (typeof flags === 'function') {
            callback = flags;
            flags = 'w+';
        }
        debug('Opening log', filename);
        return mkdirp(dirname, function(error) {
            if (error != null) {
                return callback(error);
            }
            return fs.open(filename, flags, function(error, fd) {
                if (error != null) {
                    return callback(error, {});
                }
                return callback(null, {
                    filename: filename,
                    fd: fd
                });
            });
        });
    };
    return {
        openLogFile: openLogFile,
        resolveLogFile: resolveLogFile
    };
};