// LICENSE : MIT
"use strict";
import ReftestRunner from "./reftest-runner"
var testRunner = new ReftestRunner({
    screenshotDirectory: __dirname
});
testRunner.runTest('http://0.0.0.0:8080/green.html', 'http://0.0.0.0:8080/red.html').then(function (result) {
    console.log(result);
}).catch(function (error) {

});