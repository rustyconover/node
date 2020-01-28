'use strict';

const common = require('../common');
const assert = require('assert');
const net = require('net');

const truthyValues = [true, 1, 'true', {}, []];
const falseyValues = [false, 0, ''];
const genSetNoDelay = (desiredArg) => (enable) => {
  assert.strictEqual(enable, desiredArg);
};

// setNoDelay should default to true
let socket = new net.Socket({
  handle: {
    setNoDelay: common.mustCall(genSetNoDelay(true))
  }
});
socket.setNoDelay();

socket = new net.Socket({
  handle: {
    setNoDelay: common.mustCall(genSetNoDelay(true), 1)
  }
});
truthyValues.forEach((testVal) => socket.setNoDelay(testVal));

socket = new net.Socket({
  handle: {
    setNoDelay: common.mustNotCall(genSetNoDelay(false))
  }
});
falseyValues.forEach((testVal) => socket.setNoDelay(testVal));

socket = new net.Socket({
  handle: {
    setNoDelay: common.mustCall(() => {}, 3)
  }
});
truthyValues.concat(falseyValues).concat(truthyValues)
  .forEach((testVal) => socket.setNoDelay(testVal));

// If a handler doesn't have a setNoDelay function it shouldn't be called.
// In the case below, if it is called an exception will be thrown
socket = new net.Socket({
  handle: {
    setNoDelay: null
  }
});
const returned = socket.setNoDelay(true);
assert.ok(returned instanceof net.Socket);
