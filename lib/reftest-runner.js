"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ContentRunner = require("./runner/content-runner");

var _ContentRunner2 = _interopRequireWildcard(_ContentRunner);

var _Webdriver = require("selenium-webdriver");

var _Webdriver2 = _interopRequireWildcard(_Webdriver);

var _BlinkDiff = require("blink-diff");

var _BlinkDiff2 = _interopRequireWildcard(_BlinkDiff);

var _Promise = require("bluebird");

var _Promise2 = _interopRequireWildcard(_Promise);

var _path = require("path");

var _path2 = _interopRequireWildcard(_path);

var _dateFormat = require("dateformat");

var _dateFormat2 = _interopRequireWildcard(_dateFormat);

// LICENSE : MIT
"use strict";

/**
 * @constructor
 */

var ReftestRunner = (function () {
    function ReftestRunner(options) {
        _classCallCheck(this, ReftestRunner);

        this.options = options;
    }

    /**
     *
     * @param URL
     * @returns {Promise.<T>}
     * @private
     */

    ReftestRunner.prototype._runTestURL = function _runTestURL(URL) {
        var driver = new _Webdriver2["default"].Builder().withCapabilities(_Webdriver2["default"].Capabilities.phantomjs()).build();
        var contentRunner = new _ContentRunner2["default"](driver);
        var close = function close(args) {
            driver.quit();
            return args;
        };
        return contentRunner.getScreenShotAsync(URL).then(close, close);
    };

    /**
     * compare results and return the promise.
     * the promise always resolve by IReftestCompareResult.(either passed or failed)
     * @param {string[]} targets the targets are url of array.
     * @param {string[]} result the result are base64URL image of screenshots.
     * @returns {Promise} the promise will resolved {@link IReftestCompareResult} object.
     * @private
     */

    ReftestRunner.prototype._compareResult = function _compareResult(targets, result) {
        var _this = this;

        var targetA = targets[0];
        var targetB = targets[1];
        var imageA = result[0];
        var imageB = result[1];
        return new _Promise2["default"](function (resolve, reject) {
            var fileName = _dateFormat2["default"](new Date(), "yyyy_mm_dd__HH-MM-ss") + ".png";
            var outputScreenshotPath = _path2["default"].join(_this.options.screenshotDirectory, fileName);
            var diff = new _BlinkDiff2["default"]({
                imageA: new Buffer(imageA, "base64"),
                imageB: new Buffer(imageB, "base64"),
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
    };

    /**
     * Compare A and B screenshot.
     * @param {string} URL_A the target URL A
     * @param {string} URL_B the target URL B
     * @returns {Promise.<T>}
     */

    ReftestRunner.prototype.runTest = function runTest(URL_A, URL_B) {
        var _this2 = this;

        return _Promise2["default"].all([this._runTestURL(URL_A), this._runTestURL(URL_B)]).then(function (result) {
            var targets = [URL_A, URL_B];
            return _this2._compareResult(targets, result);
        })["catch"](function (error) {
            console.log(error);
            console.log(error.stack);
        });
    };

    return ReftestRunner;
})();

exports["default"] = ReftestRunner;
module.exports = exports["default"];
//# sourceMappingURL=reftest-runner.js.map