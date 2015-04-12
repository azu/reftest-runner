// LICENSE : MIT
"use strict";
import ContentRunner from "./runner/content-runner"
import webdriver from "selenium-webdriver"
import BlinkDiff from "blink-diff"
import Promise from "bluebird"
import path from "path"
import dateFormat from 'dateformat'
/**
 * @constructor
 */
export default class ReftestRunner {
    /**
     *
     * @param {IReftestOption} options
     */
    constructor(options) {
        this.options = options;
    }

    _openDriver() {
        var options = webdriver.Capabilities.phantomjs();
        return new webdriver.Builder()
            .withCapabilities(options)
            .build();
    }

    _closeDriver(driver) {
        driver.quit();
    }

    /**
     *
     * @param URL
     * @returns {Promise.<T>}
     * @private
     */
    _runTestURL(URL) {
        var driver = this._openDriver();
        var contentRunner = new ContentRunner(driver);
        var close = (args)=> {
            this._closeDriver(driver);
            return args;
        };
        return contentRunner.getScreenShotAsync(URL)
            .then(close, close);
    }

    /**
     * compare results and return the promise.
     * the promise always resolve by IReftestCompareResult.(either passed or failed)
     * @param {{targetA:IReftestURLResult,targetB:IReftestURLResult}} targets the targets are url of array.
     * @returns {Promise} the promise will resolved {@link IReftestCompareResult} object.
     * @private
     */
    _compareResult(targets) {
        var imageA = targets.targetA.screenshotBase64;
        var imageB = targets.targetB.screenshotBase64;
        return new Promise((resolve, reject) => {
            var fileName = dateFormat(new Date(), "yyyy_mm_dd__HH-MM-ss") + ".png";
            var outputScreenshotPath = path.join(this.options.screenshotDirectory, fileName);
            var diff = new BlinkDiff({
                imageA: new Buffer(imageA, 'base64'),
                imageB: new Buffer(imageB, 'base64'),
                delta: 10,
                outputMaskRed: 0,
                outputMaskBlue: 255, // Use blue for highlighting differences
                hideShift: true, // Hide anti-aliasing differences - will still determine but not showing it
                imageOutputPath: outputScreenshotPath
            });
            diff.run(function (error, result) {
                /**
                 * @type {IReftestCompareResult}
                 */
                var reftestCompareResult = {
                    passed: diff.hasPassed(result.code),
                    differencePoints: result.differences,
                    comparedImagePath: diff.hasPassed(result.code) ? null : outputScreenshotPath,
                    targetA: targets.targetA,
                    targetB: targets.targetB
                };
                resolve(reftestCompareResult);
            });
        });
    }

    /**
     * Compare A and B screenshot.
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
        }).catch(function (error) {
            console.log(error);
            console.log(error.stack);
        });
    }
}