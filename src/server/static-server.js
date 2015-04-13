// LICENSE : MIT
"use strict";
var staticServer = require('node-static');
var assert = require("assert");
/**
 * @param {IReftestOption} options
 * @param {Function} callback the callback should called when finish setup server.
 */
module.exports = function (options, callback) {
    assert(options && options.server && options.server.port != null, "require options.server.port");
    var fileServer = new staticServer.Server(options.rootDir);
    var server = require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response, function (err, result) {
                if (err) { // There was an error serving the file
                    sys.error("Error serving " + request.url + " - " + err.message);

                    // Respond to the client
                    response.writeHead(err.status, err.headers);
                    response.end();
                }
            });
        }).resume();
    }).listen(options.server.port);
    // finish setup callback
    callback(null, server);
};

