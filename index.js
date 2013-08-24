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
  this.findRoot(dir);
  this.pre = 'release:' + this.getName(); // This is prepended to error messages.
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
  return this._isRoot();
};

BaseChannel.prototype._isRoot = function () {
  return this.exists('release.json');
};

/**
 * Determines whether filename exists
 *  Automatically joins all args
 * @return {Boolean}
 */
BaseChannel.prototype.exists = function () {
  if (arguments.length === 0) {
    throw new Error("No argument supplied to exists(), at least 1 argument required.");
  }
  var length = arguments.length;
  for( var i = 0; i < length; i++ ) {
    var filename = path.join(this.getRoot(), arguments[i]);
    if(fs.existsSync(filename)) {
      continue;
    } else {
      return false;
    }
  }
  return true;
};

/**
 * Loads a json file and returns it.
 * @return {Object} The result of the require();
 */
BaseChannel.prototype.readJSON = function (file) {
  var filename = path.join(this.getRoot(), file);
  var data = fs.readFileSync(filename, {encoding:'utf8'});
  return JSON.parse(data);
};

BaseChannel.prototype.writeJSON = function (file, data) {
  var filename = path.join(this.getRoot(), file);
  data = JSON.stringify(data, null, 2) + "\n";
  return fs.writeFileSync(filename, data);
};

BaseChannel.prototype.getVersion = function () {
  if(this._getVersion) {
    return this._getVersion.call(this, arguments);
  }
};

/**
 * Sets version number in source (should not be overridden)
 */
BaseChannel.prototype.setVersion = function (version) {
  try {
    var currentVersion = this.getVersion('none');
    if(currentVersion !== version) {
      this.debug('Changing version from %s to %s', currentVersion, version);
      if(this._setVersion) {
        this._setVersion.call(this, arguments);
      }
      this.versionChanged = true;
    } else {
      this.debug('Version unchanged (%s)', version);
      this.versionChanged = false;
    }
  } catch (er) {
    this.error(er);
    this.error('Failed to set version number');
    return false;
  }
};

BaseChannel.prototype.checkConflict = function () {
  if(!this._checkConflict){
    return false;
  }
  if(this._checkConflict.apply(this, arguments) {
    
  }
};

BaseChannel.prototype.exit = process.exit.bind(null, -1);

/**
 * Default error and debug bindings (overriden by release.js)
 */
BaseChannel.prototype.error = BaseChannel.prototype.debug = console.error;
