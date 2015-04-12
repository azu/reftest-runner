// LICENSE : MIT
"use strict";
var path = require('path');
var childProcess = require('child_process');
var Promise = require("bluebird");
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var childArgs = [
    "--webdriver=9090",
    '--webdriver-loglevel=DEBUG',
    '--ssl-protocol=tlsv1'
];

var findOpenPort, initLogs, spawnPhantom, spawnServer;
spawnServer = require('./server').spawnServer;
findOpenPort = require('./port').findOpenPort;
initLogs = require('./log');

spawnPhantom = function (config, callback) {
    var logs;
    logs = initLogs(config);
    return findOpenPort(function (error, port) {
        var args, cmd, opts;
        if (error != null) {
            return callback(error);
        }
        cmd = config.phantomjs.command;
        args = ["--webdriver=" + port, '--webdriver-loglevel=DEBUG', '--ssl-protocol=tlsv1'];
        opts = {
            port: port,
            timeout: config.phantomjs.timeout
        };
        return spawnServer(logs, 'phantomjs', cmd, args, opts, function (error, phantom) {
            if (error != null) {
                return callback(error);
            }
            phantom.driverUrl = phantom.baseUrl + "/wd/hub";
            return callback(null, phantom);
        });
    });
};

var fs = require('fs');

var Utils = {

    /**
     * @name screenShotDirectory
     * @description The directory where screenshots will be created
     * @type {String}
     */
    screenShotDirectory: './',

    /**
     * @name writeScreenShot
     * @description Write a screenshot string to file.
     * @param {String} data The base64-encoded string to write to file
     * @param {String} filename The name of the file to create (do not specify directory)
     */
    writeScreenShot: function (data, filename) {
        var stream = fs.createWriteStream(this.screenShotDirectory + filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
    }
};

// wait until to <html class="">.
function reftestWaitAsync(driver, timeout) {
    return driver.wait(function () {
        var htmlClassAttr = driver.findElement(webdriver.By.tagName('html')).getAttribute("class");
        return htmlClassAttr.then(function (className) {
            return className === "";
        });
    }, timeout);
}

function getScreenShotAsync(URL) {
    var webdriver = require('selenium-webdriver');
    var driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.phantomjs()).
        build();
    driver.get(URL);
    var html = driver.findElement(webdriver.By.tagName('html'));
    return html.getAttribute("class").then(function (className) {
        var isAsyncTest = /reftest-wait/.test(className);
        if (isAsyncTest) {
            var optTimeout = 2000;
            return reftestWaitAsync(optTimeout).then(function () {
                // success = html's class is empty
                return driver.takeScreenshot();
            });
        } else {
            return driver.takeScreenshot();
        }
    });
}

spawnPhantom({
    logDirectory: __dirname + "/log",
    port: 8980,
    phantomjs: {
        command: binPath,
        timeout: 5000
    }
}, function (error, phantom) {
    if (error) {
        throw error;
    }
    var screenShot1 = getScreenShotAsync('http://0.0.0.0:8080/red.html');
    var screenShot2 = getScreenShotAsync('http://0.0.0.0:8080/green.html');
    Promise.all([screenShot1, screenShot2]).spread(function (redDataURL, greenDataURL) {
        Utils.writeScreenShot(redDataURL, "red.png");
        Utils.writeScreenShot(greenDataURL, "green.png");
        // image diff
        var BlinkDiff = require("blink-diff");
        var diff = new BlinkDiff({
            imageA: new Buffer(redDataURL, 'base64'), // Use already loaded image for first image
            imageB: new Buffer(greenDataURL, 'base64'), // Use file-path to select image
            delta: 10,
            outputMaskRed: 0,
            outputMaskBlue: 255, // Use blue for highlighting differences
            hideShift: true, // Hide anti-aliasing differences - will still determine but not showing it
            imageOutputPath: __dirname + '/diff.png'
        });

        diff.run(function (error, result) {
            if (error) {
                throw error;
            } else {
                console.log(diff.hasPassed(result.code) ? 'Passed' : 'Failed');
                console.log('Found ' + result.differences + ' differences.');
            }
        });
    }).catch(function (error) {
        console.error(error);
    })
});