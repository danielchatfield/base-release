'use strict';

var BaseChannel = require('../index.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['BaseChannel'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'is func': function(test) {
    test.expect(1);
    // tests here
    test.ok(typeof BaseChannel === 'function', 'Module is not object, it is' + typeof BaseChannel);
    test.done();
  }
};
