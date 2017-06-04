// LICENSE : MIT
"use strict";
var path = require("path");
var Promise = require("bluebird");
var ReftestEngine = require("../").Engine;
var testEngine = new ReftestEngine({
    server: {
        port: 8989
    },
    rootDir: __dirname,
    blinkDiff: {
        composeLeftToRight: true,
        composition: true
    }
});
function allPassed(resultList) {
    return resultList.every(function (result) {
        return result.passed;
    });
}

// run test with reftest.list
function reftestWithList(reftestListPath) {
    var list = testEngine.getTargetListFromFile(reftestListPath);
    return testEngine.runTests(list).then(function (resultList) {
        var formatter = testEngine.getReporter();
        var output = formatter(resultList);
        console.log(output);
        if (!allPassed(resultList)) {
            return Promise.reject(new Error("FAIL"));
        }
    });
}

function reftestPhantomJSAndChrome() {
    var listWithBrowserCapabilities = [
        {
            compareOperator: "==",
            targetA: {
                URL: "./equal/smile-canvas.html",
                capabilities: {
                    browserName: "phantomjs"
                }
            },
            targetB: {
                URL: "./equal/smile-canvas.html",
                capabilities: {
                    browserName: "chrome"
                }
            }
        },
        {
            compareOperator: "!=",
            targetA: {
                URL: "./non-equal/canvas-left.html",
                capabilities: {
                    browserName: "phantomjs"
                }
            },
            targetB: {
                URL: "./non-equal/canvas-right.html",
                capabilities: {
                    browserName: "chrome"
                }
            }
        }
    ];
    return testEngine.runTests(listWithBrowserCapabilities).then(function (resultList) {
        var formatter = testEngine.getReporter();
        var output = formatter(resultList);
        console.log(output);
        if (!allPassed(resultList)) {
            return Promise.reject(new Error("FAIL"));
        }
    });
}

var reftestListPath = path.join(__dirname, "reftest.list");
reftestWithList(reftestListPath).then(function () {
    return reftestPhantomJSAndChrome();
}).catch(function (error) {
    console.error(error.message);
    console.error(error.stack);
});
