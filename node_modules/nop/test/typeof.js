var should = require('should');

describe('typeof(nop)', function() {
  it('should be a function', function() {
    var nop = require('../index')
      , type
      ;

    type = typeof(nop);
    type.should.equal('function');
  });
});
