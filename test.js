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


describe('unsafe intermediate paths', function () {
  ['a.__proto__.toString', 'a.constructor.prototype.toString', 'a.prototype.value'].forEach(function (path) {
    it('should reject ' + path + ' without changing prototypes', function () {
      var originalToString = Object.prototype.toString;
      var originalConstructor = Object.prototype.constructor;
      var obj = {a: {prototype: {value: 'keep'}}};
      assert.throws(function () { unset(obj, path); }, /Cannot set unsafe key/);
      assert.strictEqual(Object.prototype.toString, originalToString);
      assert.strictEqual(Object.prototype.constructor, originalConstructor);
      assert.deepStrictEqual(obj, {a: {prototype: {value: 'keep'}}});
    });
  });
});


describe('path traversal compatibility', function () {
  [['abc', 'a.0'], ['abc', ['a', '0']], ['', 'a.length'], ['abc', 'a.length']].forEach(function (example) {
    it('should leave a primitive parent unchanged for ' + JSON.stringify(example[1]), function () {
      var obj = {a: example[0]};
      assert.strictEqual(unset(obj, example[1]), true);
      assert.deepStrictEqual(obj, {a: example[0]});
    });
  });

  it('should leave a literal undefined key unchanged for an empty path array', function () {
    var obj = {undefined: 'keep'};
    assert.strictEqual(unset(obj, []), true);
    assert.deepStrictEqual(obj, {undefined: 'keep'});
  });

  ['a.0', ['a', '0']].forEach(function (path) {
    it('should still delete an index from an array parent using ' + JSON.stringify(path), function () {
      var obj = {a: ['remove', 'keep']};
      assert.strictEqual(unset(obj, path), true);
      assert.strictEqual(Object.prototype.hasOwnProperty.call(obj.a, '0'), false);
      assert.strictEqual(obj.a.length, 2);
      assert.strictEqual(obj.a[1], 'keep');
    });
  });

  ['0', 'length'].forEach(function (key) {
    it('should still delete an object property named ' + key, function () {
      var obj = {a: {0: 'remove', length: 'remove', keep: true}};
      assert.strictEqual(unset(obj, ['a', key]), true);
      assert.strictEqual(Object.prototype.hasOwnProperty.call(obj.a, key), false);
      assert.strictEqual(obj.a.keep, true);
    });
  });

  it('should still delete properties from a function parent', function () {
    var fn = function () {};
    fn.value = 'remove';
    assert.strictEqual(unset({a: fn}, 'a.value'), true);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(fn, 'value'), false);
  });

  it('should still delete an explicitly named undefined key', function () {
    var obj = {undefined: 'remove'};
    assert.strictEqual(unset(obj, ['undefined']), true);
    assert.deepStrictEqual(obj, {});
  });
});
