// LICENSE : MIT
"use strict";
var assert = require("assert");
var path = require("path");
function isRunningTarget(targetObject) {
    return typeof targetObject.targetA === "object" && typeof targetObject.targetB === "object"
}
/**
 * @param {IReftestEngineTarget} target
 * @param {IReftestOption} option
 */
function resolveTargetPath(target, option) {
    assert(option != null, "Need option");
    var root = option.rootDir;
    // targetA|B is file path
    if (typeof option.server === "undefined") {
        throw new Error("option.server is undefined");
    }
    var absoluteA;
    var absoluteB;
    if (isRunningTarget(target)) {
        absoluteA = path.resolve(root, target.targetA.URL);
        absoluteB = path.resolve(root, target.targetB.URL);
        target.targetA.URL = "http://localhost:" + option.server.port + "/" + path.relative(root, absoluteA);
        target.targetB.URL = "http://localhost:" + option.server.port + "/" + path.relative(root, absoluteB);
        return target;
    } else {
        absoluteA = path.resolve(root, target.targetA);
        absoluteB = path.resolve(root, target.targetB);
        target.targetA = "http://localhost:" + option.server.port + "/" + path.relative(root, absoluteA);
        target.targetB = "http://localhost:" + option.server.port + "/" + path.relative(root, absoluteB);
        return target;
    }
}


module.exports = {
    resolveTargetPath: resolveTargetPath,
    isRunningTarget: isRunningTarget
};