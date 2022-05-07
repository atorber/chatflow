var assert = require('assert');
var objfilter = require('../');

var o1 = {
  a: 1,
  b: -1,
  c: 0,
  d: 42
};

var ctx = {
  foo: 'bar'
};

assert.deepEqual({ a: 1, d: 42 }, objfilter(o1, function (n, k, o) {
  assert.equal(o, o1);
  assert(typeof o1[k] !== 'undefined');
  return n > 0;
}));

assert.deepEqual(o1, objfilter(o1, function (n) {
  assert.equal(this, ctx);
  return true;
}, ctx));

assert.throws(function () {
  objfilter(o1, null);
});
