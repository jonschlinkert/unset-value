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


describe('nested empty values', function () {
  [[], {}, '', undefined, null, false, 0, 'value'].forEach(function (value) {
    ['a.b', ['a', 'b']].forEach(function (path) {
      it('should delete ' + String(value) + ' using ' + JSON.stringify(path), function () {
        var obj = {a: {b: value, keep: true}};
        assert.strictEqual(unset(obj, path), true);
        assert.deepStrictEqual(obj, {a: {keep: true}});
      });
    });
  });

  [null, undefined, false, 0, 'text'].forEach(function (value) {
    it('should leave a non-object intermediate value unchanged', function () {
      var obj = {a: value};
      assert.strictEqual(unset(obj, 'a.b.c'), true);
      assert.deepStrictEqual(obj, {a: value});
    });
  });

  it('should not create missing intermediate properties', function () {
    var obj = {};
    assert.strictEqual(unset(obj, 'a.b.c'), true);
    assert.deepStrictEqual(obj, {});
  });
});
