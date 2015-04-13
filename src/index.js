// LICENSE : MIT
"use strict";
import ReftestRunner from "./reftest-runner"
import ReftestEngine from "./reftest-engine"
var testEngine = new ReftestEngine({
    server: {
        port: 8989
    },
    rootDir: __dirname + "/../",// rootDir for file sesrver
    screenshotDir: process.cwd() + "/"
});
var reftestListPath = __dirname + "/../test/reftest.list";
var list = testEngine.getTargetListFromFile(reftestListPath);
testEngine.runTests(list).then(function (resultList) {
    var formatter = testEngine.getReporter();
    var output = formatter(resultList);
    console.log(output);
}).catch((error)=> {
    console.log(error.stack);
});