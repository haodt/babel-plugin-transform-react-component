const assert = require("assert");
const babel = require("@babel/core");
const config = require("../babel.config.js");
const fs = require("fs");

describe("Transform React component", function() {
  it("should return wrapped function for named function component", function() {
    const transformed = babel.transform(
      fs.readFileSync(__dirname + "/../fixtures/namedfunction.js").toString(),
      config
    );
    assert.equal(
      transformed.code,
      fs
        .readFileSync(__dirname + "/../fixtures/namedfunction.expect.js")
        .toString()
    );
  });

  it("should return wrapped function for stateless component", function() {
    const transformed = babel.transform(
      fs.readFileSync(__dirname + "/../fixtures/stateless.js").toString(),
      config
    );
    assert.equal(
      transformed.code,
      fs.readFileSync(__dirname + "/../fixtures/stateless.expect.js").toString()
    );
  });

  it("should return wrapped function for stateful component", function() {
    const transformed = babel.transform(
      fs.readFileSync(__dirname + "/../fixtures/stateful.js").toString(),
      config
    );
    assert.strictEqual(
      transformed.code,
      fs.readFileSync(__dirname + "/../fixtures/stateful.expect.js").toString()
    );
  });
});
