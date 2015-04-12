"use strict";
var yaml = require("js-yaml");

/**
 * Takes in a JavaScript object and outputs a TAP diagnostics string
 * @param {object} diagnostic JavaScript object to be embedded as YAML into output.
 * @returns {string} diagnostics string with YAML embedded - TAP version 13 compliant
 */
function outputDiagnostics(diagnostic) {
    var prefix = "  ";
    var output = prefix + "---\n";
    output += prefix + yaml.safeDump(diagnostic).split("\n").join("\n" + prefix);
    output += "...\n";
    return output;
}

module.exports = function (results) {
    var output = "TAP version 13\n1.." + results.length + "\n";
    results.forEach(function (result/*@type {IReftestCompareResult}*/, id) {
        var title = result.targetA.URL + " vs " + result.targetB.URL;
        if (result.passed) {
            output += "ok" + " " + (id + 1) + " - " + title + "\n";
            return;
        }

        var diagnostic = {
            message: 'Found ' + result.differencePoints + ' differences.',
            diffImage: result.comparedImagePath
        };


        output += "not ok" + " " + (id + 1) + " - " + title + "\n";
        output += outputDiagnostics([diagnostic]);
    });

    return output;
};
