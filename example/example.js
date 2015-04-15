// LICENSE : MIT
"use strict";
var path = require("path");
var ReftestEngine = require("../lib/reftest-engine");
var testEngine = new ReftestEngine({
    server: {
        port: 8989
    },
    rootDir: __dirname
});
var reftestListPath = path.join(__dirname, "reftest.list");
var list = testEngine.getTargetListFromFile(reftestListPath);
testEngine.runTests(list).then(function (resultList) {
    var formatter = testEngine.getReporter();
    var output = formatter(resultList);
    console.log(output);
}).catch(function (error) {
    console.log(error.stack);
});