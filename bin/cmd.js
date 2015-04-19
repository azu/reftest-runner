#!/usr/bin/env node

var cli = require("../lib/cli/cli");
var exitCode;
cli.execute(process.argv).then(function (result) {
    if (typeof result === "string") {
        console.log(result);
        exitCode = 0;
    } else if (typeof result === "object") {
        // first exit status
        // second message
        exitCode = result[0];
        console.log(result[1]);
    }

}).catch(function (error) {
    console.error(error.message);
    console.error(error.stack);
    exitCode = 1;
});
process.on("exit", function () {
    process.exit(exitCode);
});