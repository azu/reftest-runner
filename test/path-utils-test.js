// LICENSE : MIT
"use strict";
var pathUtils = require("../src/utils/path-utils");
var assert = require("power-assert");
describe("pathUtils", function () {
    describe("#basename", function () {
        context("when the arg is URL", function () {
            it("should return basename", function () {
                var URL = "http://example.com/test.html";
                var basename = "test.html";
                assert.equal(pathUtils.basename(URL), basename);
            });
        });
        context("when the arg is filePath", function () {
            it("should return basename", function () {
                var URL = "/usr/example/test.html";
                var basename = "test.html";
                assert.equal(pathUtils.basename(URL), basename);
            });
        });
    });
});
