// LICENSE : MIT
"use strict";
var path = require("path");
var ReftestEngine = require("../").Engine;
var testEngine = new ReftestEngine({
    server: {
        port: 8989
    },
    rootDir: __dirname
});
function allPassed(resultList) {
    return resultList.every(function (result) {
        return result.passed;
    });
}
var reftestListPath = path.join(__dirname, "reftest.list");
var list = testEngine.getTargetListFromFile(reftestListPath);
testEngine.runTests(list).then(function (resultList) {
    var formatter = testEngine.getReporter();
    var output = formatter(resultList);
    console.log(output);
    if (!allPassed(resultList)) {
        process.exit(1);
    }
}).catch(function (error) {
    console.log(error.stack);
    process.exit(1);
});