// LICENSE : MIT
"use strict";
/**
 * default option values of reftest-runner
 * @type {IReftestOption}
 */
var defaultOptions = {
    rootDir: process.cwd(),
    screenshotDir: process.cwd() + "/logs/",
    "server": {
        "script": require("../server/static-server"),
        "port": 8991
    }
};
module.exports = defaultOptions;