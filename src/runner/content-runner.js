// LICENSE : MIT
"use strict";
import Webdriver from "selenium-webdriver"
export default class ContentRunner {
    constructor(driver, options) {
        this.driver = driver;
    }

    reftestWaitAsync(timeout) {
        var driver = this.driver;
        return driver.wait(function () {
            var htmlClassAttr = driver.findElement(Webdriver.By.tagName('html')).getAttribute("class");
            return htmlClassAttr.then(function (className) {
                return className === "";
            });
        }, timeout);
    }

    /**
     * @returns {Promise.<?boolean>} the promise will resolved boolean
     */
    shouldRefTestWaitingAsync() {
        var html = this.driver.findElement(Webdriver.By.tagName('html'));
        return html.getAttribute("class").then((className)=> {
            // > Asynchronous Tests: class="reftest-wait"
            // http://mxr.mozilla.org/mozilla-central/source/layout/tools/reftest/README.txt
            return /reftest-wait/.test(className);
        });
    }

    getPageSource() {
        return this.driver.getPageSource();
    }

    goToURL(URL) {
        var driver = this.driver;
        driver.get(URL);
        return this;
    }

    /**
     *
     * @param {string} URL the target url.
     * @returns {Promise} the promise resolved with base64 url string of screenshot.
     */
    getScreenShotAsync(URL) {
        var driver = this.driver;
        this.goToURL(URL);
        var html = driver.findElement(Webdriver.By.tagName('html'));
        return this.shouldRefTestWaitingAsync().then((isAsyncTest)=> {
            if (isAsyncTest) {
                var optTimeout = 5000;
                return this.reftestWaitAsync(optTimeout).then(function () {
                    // success = html's class is empty
                    return driver.takeScreenshot();
                });
            }
            return driver.takeScreenshot();
        });
    }
}