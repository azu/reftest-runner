// LICENSE : MIT
"use strict";
var optionator = require("optionator");
module.exports = optionator({
    prepend: "reftest-runner [options]",
    concatRepeatedArrays: true,
    mergeRepeatedObjects: true,
    options: [
        {
            heading: "Options"
        }, {
            option: "help",
            alias: "h",
            type: "Boolean",
            description: "Show help"
        }, {
            option: "list",
            alias: "l",
            type: "path::String",
            description: "Use reftest list from this file"
        }, {
            option: "targetA",
            type: "path::String",
            description: "Use a specific test html file"
        }, {
            option: "targetB",
            type: "path::String",
            description: "Use a specific test html file"
        }, {
            option: "version",
            alias: "v",
            type: "Boolean",
            description: "Outputs the version number"
        }, {
            option: "browser",
            alias: "b",
            type: "String",
            default: "phantomjs",
            description: "Specify Browser"
        }, {
            option: "compareOperator",
            type: "String",
            default: "==",
            description: "Specify compareOperator. == OR !="
        }
    ]
});