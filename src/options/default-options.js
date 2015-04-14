// LICENSE : MIT
"use strict";
/**
 * @type {IReftestOption}
 */
var defaultOptions = {
    rootDir: process.cwd(),
    screenshotDir: process.cwd() + "/logs/",
    "server": {
        "port": 8991
    }
};
module.exports = defaultOptions;