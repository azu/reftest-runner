// LICENSE : MIT
"use strict";
import ReftestRunner from "./reftest-runner"
import ReftestEngine from "./reftest-engine"
var testEngine = new ReftestEngine({
    server: {
        port: 8989
    },
    rootDir: process.cwd(),// rootDir for file sesrver
    screenshotDir: process.cwd() + "/"
});
var parse = require("reftest-list-parser").parse;
var fs = require("fs");
var path = require("path");
var filePath = __dirname + "/../test/reftest.list";
var data = fs.readFileSync(filePath, "utf-8");
var list = parse(data);
var baseDir = path.dirname(filePath);
testEngine.runTests(list).then(function (resultList) {
    var formatter = testEngine.getReporter();
    var output = formatter(resultList);
    console.log(output);
}).catch((error)=> {
    console.log(error.stack);
});