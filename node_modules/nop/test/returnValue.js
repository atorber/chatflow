var should = require('should');

describe('nop()', function() {
  it('should return void', function() {
    var nop = require('../index')
      , returnValue
      ;

    returnValue = nop();

    should.strictEqual(returnValue, void 0);
  });
});