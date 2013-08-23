/*
 * release-base package implementation
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */
'use-strict';

var fs = require('fs');
var path = require('path');

module.exports = BaseChannel;

function BaseChannel(dir) {
    var name = this.getName();
    this.debug = require('debug')('release:' + name);
    this.findRoot(dir);
}

/**
 * Returns the name of the current channel (can be overridden)
 * @return {String} Name of channel (e.g. npm)
 */
BaseChannel.prototype.getName = function () {
    return this.constructor.name.toLowerCase();
};

BaseChannel.prototype.getRoot = function () {
    return this.rootDir || this.cwd || null;
};

/**
 * Starts at the specified directory (or the current working directory) and works its way up the file structure to find the root directory.
 * @param  {string} dir
 * @return {string} rootDir
 */
BaseChannel.prototype.findRoot = function (dir) {
    dir = dir || process.cwd();

    if(this.rootDir) { //already been resolved
        return this.rootDir;
    }

    // set as current working directory so we don't have to pass as argument
    this.cwd = dir;

    if (this.isRoot()) {
        this._isPackage = true;
        this.rootDir = dir;
        return dir;
    }

    if( dir === path.resolve('/')) {
        // Cannot go any further
        this.debug('findRoot - reached root directory');
        this._isPackage = false;
        return null;
    }

    return this.findRoot(path.join(dir,'..'));
};

BaseChannel.prototype.isPackage = function () {
    return this._isPackage;
};

/**
 * Determinies whether `dir` is the root directory.
 * @param  dir
 * @return {Boolean}
 */
BaseChannel.prototype.isRoot = function () {
    return this.exists('release.json');
};

/**
 * Determines whether filepath exists
 *  Automatically joins all args
 * @return {Boolean}
 */
BaseChannel.prototype.exists = function () {
    if (arguments.length === 0) {
        throw new Error("No argument supplied to exists(), at least 1 argument required.");
    }
    var length = arguments.length;
    for( var i = 0; i < length; i++ ) {
        var filePath = path.join(this.getRoot(), arguments[i]);
        if(fs.existsSync(filePath)) {
            continue;
        } else {
            return false;
        }
    }
    return true;
};

/**
 * Loads a js|json file and returns it.
 * @return {Object} The result of the require();
 */
BaseChannel.prototype.load = function (file) {
    var filePath = path.join(this.getRoot(), file);
    return require(filePath);
};

BaseChannel.prototype.currentVersion = function () {
    return null;
};

/**
 * Sets version number in source (to be overriden by channel)
 */
BaseChannel.prototype.setVersion = function () {
    return false;
};