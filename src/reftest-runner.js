// LICENSE : MIT
"use strict";
import ContentRunner from "./runner/content-runner"
import Webdriver from "selenium-webdriver"
import BlinkDiff from "blink-diff"
import Promise from "bluebird"
import path from "path"
import dateFormat from 'dateformat'
/**
 * @constructor
 */
export default class ReftestRunner {
    constructor(options) {
        this.options = options;
    }

    /**
     *
     * @param URL
     * @returns {Promise.<T>}
     * @private
     */
    _runTestURL(URL) {
        var driver = new Webdriver.Builder().
            withCapabilities(Webdriver.Capabilities.phantomjs()).
            build();
        var contentRunner = new ContentRunner(driver);
        var close = function (args) {
            driver.quit();
            return args;
        };
        return contentRunner.getScreenShotAsync(URL).then(close, close);
    }

    /**
     * compare results and return the promise.
     * the promise always resolve by IReftestCompareResult.(either passed or failed)
     * @param {string[]} targets the targets are url of array.
     * @param {string[]} result the result are base64URL image of screenshots.
     * @returns {Promise} the promise will resolved {@link IReftestCompareResult} object.
     * @private
     */
    _compareResult(targets, result) {
        var targetA = targets[0];
        var targetB = targets[1];
        var imageA = result[0];
        var imageB = result[1];
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
                    targetA: {
                        URL: targetA,
                        screenshotBase64: imageA
                    },
                    targetB: {
                        URL: targetB,
                        screenshotBase64: imageB
                    }
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
            var targets = [URL_A, URL_B];
            return this._compareResult(targets, result);
        }).catch(function (error) {
            console.log(error);
            console.log(error.stack);
        });
    }
}