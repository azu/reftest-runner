// LICENSE : MIT
"use strict";
var ContentRunner = require("../src/runner/content-runner");
var assert = require("power-assert");
var helper = require("./helper");
describe("ContentRunner", function () {
    var driver;
    describe("#shouldRefTestWaitingAsync", function () {
        beforeEach(function () {
            driver = helper.openDriver();
        });
        afterEach(function () {
            helper.closeDriver();
        });
        it("judged target be async", function () {
            var contentRunner = new ContentRunner(driver);
            var filePath = __dirname + "/html/reftest-async.html";
            contentRunner.goToURL(filePath);
            return contentRunner.shouldRefTestWaitingAsync().then(function (isAsync) {
                assert(isAsync);
            });
        });
        it("judged target be sync", function () {
            var contentRunner = new ContentRunner(driver);
            var filePath = __dirname + "/html/reftest-sync.html";
            contentRunner.goToURL(filePath);
            return contentRunner.shouldRefTestWaitingAsync().then(function (isAsync) {
                assert(!isAsync);
            });
        });
    });
    describe("#reftestWaitAsync", function () {
        beforeEach(function () {
            driver = helper.openDriver();
        });
        afterEach(function () {
            helper.closeDriver();
        });
        it("should wait until remove 'reftest-wait'", function () {
            var contentRunner = new ContentRunner(driver);
            var filePath = __dirname + "/html/reftest-async-resolved.html";
            contentRunner.goToURL(filePath);
            return contentRunner.reftestWaitAsync(2000).then(function () {
                assert(true);
            });
        });
    });
    describe("#getScreenShotAsync", function () {
        beforeEach(function () {
            driver = helper.openDriver();
        });
        afterEach(function () {
            helper.closeDriver();
        });
        it("should return promise filled with dataURL", function () {
            driver = helper.openDriver();
            var contentRunner = new ContentRunner(driver);
            var filePath = __dirname + "/html/reftest-sync.html";
            return contentRunner.getScreenShotAsync(filePath).then(function (result) {
                assert(typeof result === "string");
            });
        });
    });
});
