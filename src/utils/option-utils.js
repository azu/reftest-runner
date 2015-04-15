// LICENSE : MIT
"use strict";
var assert = require("assert");
var path = require("path");
/**
 * @param {IReftestEngineTarget} target
 * @param {IReftestOption} option
 */
function resolveTargetPath(target, option) {
    assert(option != null, "Need option");
    var root = option.rootDir;
    // targetA|B is file path
    if (typeof option.server !== "undefined") {
        var absoluteA = path.resolve(root, target.targetA);
        var absoluteB = path.resolve(root, target.targetB);
        target.targetA = "http://localhost:" + option.server.port + "/" + path.relative(root, absoluteA);
        target.targetB = "http://localhost:" + option.server.port + "/" + path.relative(root, absoluteB);
        console.log(target);
        return target;
    }
}


module.exports = {
    resolveTargetPath: resolveTargetPath
};