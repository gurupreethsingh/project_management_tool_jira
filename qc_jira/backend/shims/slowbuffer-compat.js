// shims/slowbuffer-compat.js
// Safe on all Node versions. On Node 25+, define a minimal SlowBuffer alias.
// On Node 20/22, it does nothing.
try {
  if (typeof global.SlowBuffer === "undefined") {
    const { Buffer } = require("buffer");
    global.SlowBuffer = Buffer; // enough for libs probing SlowBuffer.prototype.equal
  }
} catch (e) {
  // Never crash the app over a shim
}
