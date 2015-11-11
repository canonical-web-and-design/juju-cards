var assert = require('assert');
describe('Card', function() {
  it('detect single juju-card', function () {
    assert.equal(-1, [1,2,3].indexOf(5));
    assert.equal(-1, [1,2,3].indexOf(0));
  });
});
