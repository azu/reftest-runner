// LICENSE : MIT
"use strict";
var Webdriver = require("selenium-webdriver");
var driver;
function openDriver() {
    if (driver) {
        return driver;
    }
    driver = new Webdriver.Builder().
        withCapabilities(Webdriver.Capabilities.phantomjs()).
        build();
    return driver;
}
function closeDriver() {
    driver.quit();
    driver = null;
}
module.exports = {
    openDriver: openDriver,
    closeDriver: closeDriver
};