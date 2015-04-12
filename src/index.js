// LICENSE : MIT
"use strict";
import ReftestRunner from "./reftest-runner"
import ReftestEngine from "./reftest-engine"
var testRunner = new ReftestRunner({
    screenshotDirectory: process.cwd() + "/ss"
});
//testRunner.runTest('http://0.0.0.0:8080/green.html', 'http://0.0.0.0:8080/red.html').then(function (result) {
//    console.log(result);
//}).catch(function (error) {
//
//});
var testEngine = new ReftestEngine({
    screenshotDirectory: process.cwd() + "/"
});
testEngine.runTests([
    {
        targetA: 'http://0.0.0.0:8080/green.html',
        targetB: 'http://0.0.0.0:8080/red.html',
        compareOperator: "=="
    }
]).then(function (resultList) {
    var formatter = testEngine.getReporter();
    var output = formatter(resultList);
    console.log(output);
});