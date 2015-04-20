// LICENSE : MIT
"use strict";
var Promise = require("bluebird");
var options = require("./cli-options");
var ReftestEngine = require("../").Engine;
var path = require("path");
var debug = require("debug")("reftest-runner:cli");

/**
 * translate cli option to IReftestOption.
 * @param cliOptions
 * @returns {IReftestOption}
 */
function translateOptions(cliOptions) {
    return {
        browser: cliOptions.browser
    }
}

function allPassed(resultList) {
    return resultList.every(function (result) {
        return result.passed;
    });
}

function printResult(engine, resultList) {
    var formatter = engine.getReporter();
    return formatter(resultList);
}
/**
 * Encapsulates all CLI behavior for eslint. Makes it easier to test as well as
 * for other Node.js programs to effectively run the CLI.
 */
var cli = {

    /**
     *
     * @param args
     * @returns {"bluebird"|any}
     */
    execute: function (args) {
        return new Promise(function (resolve, reject) {
            var currentOptions;
            currentOptions = options.parse(args);
            if (currentOptions.version) { // version from package.json
                return resolve("v" + require("../../package.json").version);
            } else if (currentOptions.help) {
                return resolve(options.generateHelp());
            }
            debug("CLI options %@", currentOptions);
            var engine = new ReftestEngine(translateOptions(currentOptions));
            if (currentOptions.list) {
                // prefer --list > targetA/targetB
                var reftestListPath = path.join(process.cwd(), currentOptions.list);
                var list = engine.getTargetListFromFile(reftestListPath);
                return engine.runTests(list).then(function (result) {
                    var output = printResult(engine, result);
                    resolve([allPassed(result) ? 0 : 1, output]);
                }).catch(reject);
            } else if (currentOptions.targetA && currentOptions.targetB) {
                return engine.runTests([
                    {
                        compareOperator: currentOptions.compareOperator,
                        targetA: {
                            URL: currentOptions.targetA,
                            capabilities: {
                                browserName: currentOptions.browser
                            }
                        },
                        targetB: {
                            URL: currentOptions.targetB,
                            capabilities: {
                                browserName: currentOptions.browser
                            }
                        }
                    }
                ]).then((function (result) {
                    var output = printResult(engine, result);
                    resolve([allPassed(result) ? 0 : 1, output]);
                })).catch(reject);
            } else {
                return resolve(options.generateHelp());
            }
        });
    }
};

module.exports = cli;