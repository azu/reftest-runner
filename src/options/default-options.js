// LICENSE : MIT
"use strict";
/**
 * default option values of reftest-runner
 * @type {IReftestOption}
 */
var defaultOptions = {
    "rootDir": process.cwd(),
    "screenshotDir": process.cwd() + "/logs/",
    "browser": "phantomjs",
    "server": {
        "script": require("../server/static-server"),
        "port": 8991
    },
    // https://github.com/yahoo/blink-diff#object-usage
    "blinkDiff": {
        delta: 20,
        // Use blue for highlighting differences
        outputMaskRed: 0,
        outputMaskBlue: 255
    }
};
module.exports = defaultOptions;