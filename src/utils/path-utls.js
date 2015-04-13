// LICENSE : MIT
"use strict";
var URL = require("url");
function getFileName(URLString) {
    // if URLString is URL
    var URLObject = URL.parse(URLString);
    var fileName = URLObject.pathname.split("/").pop();
    return fileName
}


module.exports = {
    getFileName: getFileName
};