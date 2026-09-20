/*!
 * unset-value <https://github.com/jonschlinkert/unset-value>
 *
 * Copyright (c) 2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isObject = require('isobject');

const isUnsafeKey = key => {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
};

const validateKey = key => {
  if (isUnsafeKey(key)) {
    throw new Error(`Cannot set unsafe key: "${key}"`);
  }
};

/**
 * Split a property path into segments, honouring `\.` escapes.
 * Same rules as the previous delete path.
 */

function splitPath(prop) {
  var segs = Array.isArray(prop) ? prop.slice() : prop.split('.');
  var last = segs.pop();
  while (segs.length && segs[segs.length - 1].slice(-1) === '\\') {
    last = segs.pop().slice(0, -1) + '.' + last;
  }
  return { segs: segs, last: last };
}

/**
 * True when `prop` exists as an own property along the path,
 * including "empty" values ([], "", undefined) that `has-value` rejects.
 */

function hasOwnPath(obj, prop) {
  var parts = splitPath(prop);
  var cur = obj;
  var i = 0;
  var key;

  for (; i < parts.segs.length; i++) {
    key = parts.segs[i];
    validateKey(key);
    if (!isObject(cur) || !Object.prototype.hasOwnProperty.call(cur, key)) {
      return false;
    }
    cur = cur[key];
  }

  key = parts.last;
  validateKey(key);
  return isObject(cur) && Object.prototype.hasOwnProperty.call(cur, key);
}

module.exports = function unset(obj, prop) {
  if (!isObject(obj)) {
    throw new TypeError('expected an object.');
  }

  var isArray = Array.isArray(prop);

  if (!isArray && Object.prototype.hasOwnProperty.call(obj, prop)) {
    delete obj[prop];
    return true;
  }

  if (hasOwnPath(obj, prop)) {
    var parts = splitPath(prop);
    var segs = parts.segs;
    var last = parts.last;
    while (segs.length) {
      prop = segs.shift();
      validateKey(prop);
      obj = obj[prop];
    }
    return (delete obj[last]);
  }
  return true;
};
