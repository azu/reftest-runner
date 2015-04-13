// LICENSE : MIT
"use strict";
var staticServer = require('node-static');
/**
 * @param {IReftestOption} options
 * @param {Function} callback the callback should called when finish setup server.
 */
module.exports = function (options, callback) {
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
    }).listen(8083);
    // finish setup callback
    callback(null, server);
};

