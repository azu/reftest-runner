// LICENSE : MIT
"use strict";
import ReftestRunner from "./reftest-runner"
import ReftestEngine from "./reftest-engine"
var testRunner = new ReftestRunner({
    screenshotDir: process.cwd() + "/ss"
});
//testRunner.runTest('http://0.0.0.0:8080/green.html', 'http://0.0.0.0:8080/red.html').then(function (result) {
//    console.log(result);
//}).catch(function (error) {
//
//});
var testEngine = new ReftestEngine({
    screenshotDir: process.cwd() + "/"
});
var parse = require("reftest-list-parser").parse;
var fs = require("fs");
var path = require("path");
var filePath = __dirname + "/../test/reftest.list";
var data = fs.readFileSync(filePath, "utf-8");
var list = parse(data);
var baseDir = path.dirname(filePath);
testEngine.runTests(list.map(function (item) {
    item.targetA = path.resolve(baseDir, item.targetA);
    item.targetB = path.resolve(baseDir, item.targetB);
    return item;
})).then(function (resultList) {
    var formatter = testEngine.getReporter();
    var output = formatter(resultList);
    console.log(output);
});