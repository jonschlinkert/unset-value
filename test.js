/*!
 * unset <https://github.com/jonschlinkert/unset>
 *
 * Copyright (c) 2015 .
 * Licensed under the MIT license.
 */

'use strict';

/* deps: mocha */
var assert = require('assert');
var should = require('should');
var unset = require('./');

describe('unset', function () {
  it('should update the given object when a property is deleted:', function () {
    var obj = {a: 'b'};
    unset(obj, 'a');
    obj.should.eql({});
  });

  it('should return true when a property is deleted:', function () {
    unset({a: 'b'}, 'a').should.eql(true);
  });

  it('should return true when the given property does not exist:', function () {
    unset({a: 'b'}, 'z').should.eql(true);
  });

  it('should delete nested values:', function () {
    var one = {a: {b: {c: 'd'}}};
    unset(one, 'a.b');
    one.should.eql({a: {}});

    var two = {a: {b: {c: 'd'}}};
    unset(two, 'a.b.c');
    two.should.eql({a: {b: {}}});

    var three = {a: {b: {c: 'd', e: 'f'}}};
    unset(three, 'a.b.c');
    three.should.eql({a: {b: {e: 'f'}}});
  });

  it('should delete...:', function () {
    var three = {'a.b': 'c', d: 'e'};
    unset(three, 'a.b');
    three.should.eql({d: 'e'});
  });

  it('should delete nested escaped values:', function () {
    var one = {a: {'b.c': 'd'}};
    unset(one, 'a.b\\.c');
    one.should.eql({a: {}});

    var two = {'a.b.c': 'd'};
    unset(two, 'a\\.b\\.c');
    two.should.eql({});

    var three = {'a.b': 'c', d: 'e'};
    unset(three, 'a\\.b');
    three.should.eql({d: 'e'});
  });

  it('should throw an error when invalid args are passed:', function () {
    (function () {
      unset();
    }).should.throw('expected an object.');
  });
});

describe('input path as array paths', function () {
  it('should update the given object when a property is deleted:', function () {
    var obj = {a: 'b'};
    unset(obj, ['a']);
    obj.should.eql({});
  });

  it('should return true when a property is deleted:', function () {
    unset({a: 'b'}, ['a']).should.eql(true);
  });

  it('should return true when the given property does not exist:', function () {
    unset({a: 'b'}, ['z']).should.eql(true);
  });

  it('should delete nested values:', function () {
    var one = {a: {b: {c: 'd'}}};
    unset(one, ['a', 'b']);
    one.should.eql({a: {}});

    var two = {a: {b: {c: 'd'}}};
    unset(two, ['a', 'b', 'c']);
    two.should.eql({a: {b: {}}});

    var three = {a: {b: {c: 'd', e: 'f'}}};
    unset(three, ['a', 'b', 'c']);
    three.should.eql({a: {b: {e: 'f'}}});
  });

  it('should delete...:', function () {
    var three = {'a.b': 'c', d: 'e'};
    unset(three, ['a.b']);
    three.should.eql({d: 'e'});
  });

  it('should delete nested escaped values:', function () {
    var one = {a: {'b.c': 'd'}};
    unset(one, ['a', 'b.c']);
    one.should.eql({a: {}});

    var two = {'a.b.c': 'd'};
    unset(two, ['a.b.c']);
    two.should.eql({});

    var three = {'a.b': 'c', d: 'e'};
    unset(three, ['a.b']);
    three.should.eql({d: 'e'});
  });

  it('should throw an error when invalid args are passed:', function () {
    (function () {
      unset();
    }).should.throw('expected an object.');
  });

  it('should not allow unsetting unsafe values', () => {
    assert.throws(() => unset({}, '__proto__.toString'));
    assert.throws(() => unset(()=>{}, 'prototype'));
    assert.throws(() => unset(()=>{}, 'contructor'));
  });

});
