// LICENSE : MIT
"use strict";
/*
    reftest-runner treat a single test.
    passing targetSet, then return result.
 */
import ContentRunner from "./runner/content-runner"
import webdriver from "selenium-webdriver"
import BlinkDiff from "blink-diff"
import Promise from "bluebird"
import path from "path"
import dateFormat from 'dateformat'
import pathUtil from "./utils/path-utils.js"
import mkdirp from "mkdirp"
import ObjectAssign from "object-assign"
import deepmerge from "deepmerge"
import defaultOptions from "./options/default-options"
var debug = require("debug")("reftest-runner:runner");
/**
 * @constructor
 */
export default class ReftestRunner {
    /**
     *
     * @param {IReftestOption} options
     */
    constructor(options) {
        this.options = deepmerge(defaultOptions, options);
        // static
        this.constructor.testCount = 0;
    }

    /**
     * build webdriver with capabilities option and return webdriver object.
     * @param {webdriver.Capabilities} capabilities
     * https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
     * @returns {!webdriver.WebDriver}
     * @private
     */
    _openDriver(capabilities) {
        return new webdriver.Builder()
            .withCapabilities(capabilities)
            .build();
    }

    _closeDriver(driver) {
        driver.quit();
    }

    /**
     * run selenium-webdriver with capabilities options to URL and return promise object.
     * @param URL
     * @param {webdriver.Capabilities} capabilities? the capabilities object is defined by selenium-webdriver.
     * https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
     * @returns {Promise.<T>}
     * @private
     */
    _runTestURL(URL, capabilities) {
        var runningCapabilities = {
            browserName: this.options.browser
        };
        if (typeof capabilities === "object") {
            runningCapabilities = capabilities
        }
        var driver = this._openDriver(runningCapabilities);
        var contentRunner = new ContentRunner(driver);
        var close = (result)=> {
            if (result instanceof Error) {
                return Promise.reject(result);
            }
            this._closeDriver(driver);
            return result;
        };
        return contentRunner.getScreenShotAsync(URL)
            .then(close, close);
    }

    /**
     * compare results and return the promise.
     * the promise always resolve by IReftestCompareResult.(either passed or failed)
     * @param {{targetA:IReftestURLResult,targetB:IReftestURLResult}} targetSet the targets are url of array.
     * @returns {Promise} the promise will resolved {@link IReftestCompareResult} object.
     * @private
     */
    _compareResult(targetSet) {
        var imageA = targetSet.targetA.screenshotBase64;
        var imageB = targetSet.targetB.screenshotBase64;
        return new Promise((resolve, reject) => {
            var prefix = dateFormat(new Date(), "yyyy_mm_dd__HH-MM-ss");
            var suffix = ++this.constructor.testCount;
            var vsTitle = pathUtil.basename(targetSet.targetA.URL) + "-vs-" + pathUtil.basename(targetSet.targetB.URL);
            var fileName = prefix + "-" + vsTitle + suffix + ".png";
            var outputScreenshotPath = path.join(this.options.screenshotDir, fileName);
            // if exist screenshotDir, then create directory.
            mkdirp.sync(this.options.screenshotDir);
            // shallow option merge
            // priority: user defined options < program options
            var blinkDiffOptions = ObjectAssign({}, this.options.blinkDiff, {
                imageA: new Buffer(imageA, 'base64'),
                imageB: new Buffer(imageB, 'base64'),
                imageOutputPath: outputScreenshotPath
            });
            debug("blink-diff options: %o", blinkDiffOptions);
            var diff = new BlinkDiff(blinkDiffOptions);
            diff.run(function (error, result) {
                /**
                 * @type {IReftestCompareResult}
                 */
                var reftestCompareResult = {
                    passed: diff.hasPassed(result.code),
                    differencePoints: result.differences,
                    comparedImagePath: diff.hasPassed(result.code) ? null : outputScreenshotPath,
                    targetA: targetSet.targetA,
                    targetB: targetSet.targetB
                };
                resolve(reftestCompareResult);
            });
        });
    }

    /**
     * Compare the result of A and B and return promise.
     * @param {string} URL_A the target URL A
     * @param {string} URL_B the target URL B
     * @returns {Promise.<T>}
     */
    runTest(URL_A, URL_B) {
        return Promise.all([this._runTestURL(URL_A), this._runTestURL(URL_B)]).then((result) => {
            return this._compareResult({
                targetA: {
                    URL: URL_A,
                    screenshotBase64: result[0]
                },
                targetB: {
                    URL: URL_B,
                    screenshotBase64: result[1]
                }
            });
        });
    }

    /**
     * Compare the result of A and B and return promise.
     * @param {IReftestForRunningTarget} targetA
     * @param {IReftestForRunningTarget} targetB
     * @returns {Promise.<T>}
     */
    runTestWithTargets(targetA, targetB) {
        var resultA = this._runTestURL(targetA.URL, targetA.capabilities);
        var resultB = this._runTestURL(targetB.URL, targetB.capabilities);
        return Promise.all([resultA, resultB]).then((result) => {
            return this._compareResult({
                targetA: {
                    URL: targetA.URL,
                    screenshotBase64: result[0]
                },
                targetB: {
                    URL: targetB.URL,
                    screenshotBase64: result[1]
                }
            });
        });
    }
}